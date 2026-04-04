const crypto = require("crypto");
const ExternalApiCache = require("../models/externalApiModel");
const Checkpoint = require("../models/checkpointModel");

const memoryCache = new Map();
const PROVIDER_NAME = "OPENROUTESERVICE";
const DEFAULT_PROVIDER_URL = "https://api.openrouteservice.org";
const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_CACHE_TTL_SECONDS = 120;
const CHECKPOINT_RADIUS_KM = 0.35;

function getProviderBaseUrl() {
  return process.env.ROUTING_PROVIDER_URL || DEFAULT_PROVIDER_URL;
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildCacheKey(payload) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
}

async function getCachedResponse(hash) {
  const mem = memoryCache.get(hash);
  if (mem && mem.expiresAt > Date.now()) return mem.data;

  try {
    const db = await ExternalApiCache.findOne({
      where: { provider_name: PROVIDER_NAME, request_hash: hash }
    });

    if (!db) return null;
    if (new Date(db.expires_at).getTime() <= Date.now()) return null;

    memoryCache.set(hash, {
      data: db.response_data,
      expiresAt: new Date(db.expires_at).getTime()
    });

    return db.response_data;
  } catch {
    return null;
  }
}

async function setCachedResponse(hash, data, ttl) {
  const expiresAt = Date.now() + ttl * 1000;

  memoryCache.set(hash, { data, expiresAt });

  try {
    const existing = await ExternalApiCache.findOne({
      where: { provider_name: PROVIDER_NAME, request_hash: hash }
    });

    if (existing) {
      await existing.update({
        response_data: data,
        expires_at: new Date(expiresAt)
      });
      return;
    }

    await ExternalApiCache.create({
      provider_name: PROVIDER_NAME,
      request_hash: hash,
      response_data: data,
      expires_at: new Date(expiresAt),
      created_at: new Date()
    });
  } catch {}
}

async function getCheckpointMapByIds(ids) {
  if (!ids?.length) return new Map();

  const cps = await Checkpoint.findAll({ where: { id: ids } });

  return cps.reduce((map, cp) => {
    map.set(cp.id, {
      latitude: cp.latitude,
      longitude: cp.longitude,
      name: cp.name
    });
    return map;
  }, new Map());
}

function routeViolatesAreas(coords, areas) {
  return areas.flatMap((area, i) => {
    const hit = coords.some(([lng, lat]) =>
      haversineDistanceKm(lat, lng, area.center.lat, area.center.lng) <= area.radiusKm
    );
    return hit ? [{ index: i, ...area }] : [];
  });
}

function routeViolatesCheckpoints(coords, map, ids) {
  return ids.flatMap(id => {
    const cp = map.get(id);
    if (!cp) return [];

    const hit = coords.some(([lng, lat]) =>
      haversineDistanceKm(lat, lng, cp.latitude, cp.longitude) <= CHECKPOINT_RADIUS_KM
    );

    return hit ? [{ id, name: cp.name }] : [];
  });
}

function normalizeProviderRouteResponse(data) {
  const f = data?.features?.[0];
  if (!f?.geometry?.coordinates) return null;

  return {
    distance: f.properties?.summary?.distance,
    duration: f.properties?.summary?.duration,
    geometry: f.geometry
  };
}

function buildProviderRequest(from, to) {
  let url = `${getProviderBaseUrl()}/v2/directions/driving-car/geojson`;

  if (process.env.ORS_API_KEY) {
    url += `?api_key=${encodeURIComponent(process.env.ORS_API_KEY)}`;
  }

  return {
    url,
    body: JSON.stringify({
      coordinates: [[from.lng, from.lat], [to.lng, to.lat]]
    })
  };
}

async function fetchRouteFromProvider(from, to, timeoutMs) {
  const req = buildProviderRequest(from, to);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    console.log("[Routing] Fetching route...");

    const res = await fetch(req.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: req.body,
      signal: controller.signal
    });

    if (res.status === 429) {
      return { errorType: "RATE_LIMIT", retryAfter: res.headers.get("retry-after") };
    }

    if (!res.ok) {
      return { errorType: "PROVIDER_ERROR", status: res.status };
    }

    return { data: await res.json() };

  } catch (e) {
    if (e.name === "AbortError") return { errorType: "TIMEOUT" };
    return { errorType: "NETWORK_ERROR", message: e.message };

  } finally {
    clearTimeout(timeout);
  }
}

async function estimateRoute({ from, to, constraints }) {
  // validation
  if (!from || from.lat === undefined || from.lng === undefined) {
    return { error: { errorType: "INVALID_INPUT", message: "Invalid from" } };
  }

  if (!to || to.lat === undefined || to.lng === undefined) {
    return { error: { errorType: "INVALID_INPUT", message: "Invalid to" } };
  }

  const timeout = Number(process.env.ROUTING_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);
  const ttl = Number(process.env.ROUTING_CACHE_TTL_SECONDS || DEFAULT_CACHE_TTL_SECONDS);

  const hash = buildCacheKey({ from, to, constraints });

  const cached = await getCachedResponse(hash);
  if (cached) {
    return { ...cached, metadata: { ...cached.metadata, source: "cache" } };
  }

  const provider = await fetchRouteFromProvider(from, to, timeout);
  if (provider.errorType) return { error: provider };

  const route = normalizeProviderRouteResponse(provider.data);
  if (!route) return { error: { errorType: "NO_ROUTE" } };

  const ids = constraints?.avoidCheckpointIds || [];
  const areas = constraints?.avoidAreas || [];

  const map = await getCheckpointMapByIds(ids);
  const violatedCP = routeViolatesCheckpoints(route.geometry.coordinates, map, ids);
  const violatedAreas = routeViolatesAreas(route.geometry.coordinates, areas);

  const payload = {
    estimatedDistanceMeters: route.distance,
    estimatedDurationSeconds: route.duration,
    routeGeometry: route.geometry,
    metadata: {
      provider: PROVIDER_NAME,
      source: "provider",
      requestedAt: new Date().toISOString(),
      violations: {
        checkpoints: violatedCP,
        areas: violatedAreas
      }
    }
  };

  await setCachedResponse(hash, payload, ttl);

  if (violatedCP.length || violatedAreas.length) {
    return {
      error: {
        errorType: "CONSTRAINT_VIOLATION",
        details: payload.metadata.violations
      },
      payload
    };
  }

  return payload;
}

module.exports = { estimateRoute };
