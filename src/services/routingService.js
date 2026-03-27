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
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function buildCacheKey(payload) {
  const canonicalPayload = {
    provider: PROVIDER_NAME,
    from: payload.from,
    to: payload.to,
    constraints: {
      avoidCheckpointIds: [...(payload.constraints?.avoidCheckpointIds || [])].sort((a, b) => a - b),
      avoidAreas: payload.constraints?.avoidAreas || []
    }
  };

  return crypto.createHash("sha256").update(JSON.stringify(canonicalPayload)).digest("hex");
}

async function getCachedResponse(requestHash) {
  const inMemoryEntry = memoryCache.get(requestHash);
  if (inMemoryEntry && inMemoryEntry.expiresAt > Date.now()) {
    return inMemoryEntry.data;
  }

  try {
    const dbEntry = await ExternalApiCache.findOne({
      where: {
        provider_name: PROVIDER_NAME,
        request_hash: requestHash
      }
    });

    if (!dbEntry) return null;
    if (new Date(dbEntry.expires_at).getTime() <= Date.now()) return null;

    memoryCache.set(requestHash, {
      data: dbEntry.response_data,
      expiresAt: new Date(dbEntry.expires_at).getTime()
    });

    return dbEntry.response_data;
  } catch {
    return null;
  }
}

async function setCachedResponse(requestHash, data, ttlSeconds) {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  memoryCache.set(requestHash, { data, expiresAt });

  try {
    const expiresAtDate = new Date(expiresAt);
    const existing = await ExternalApiCache.findOne({
      where: { provider_name: PROVIDER_NAME, request_hash: requestHash }
    });

    if (existing) {
      await existing.update({ response_data: data, expires_at: expiresAtDate });
      return;
    }

    await ExternalApiCache.create({
      provider_name: PROVIDER_NAME,
      request_hash: requestHash,
      response_data: data,
      expires_at: expiresAtDate,
      created_at: new Date()
    });
  } catch {}
}

async function getCheckpointMapByIds(checkpointIds) {
  if (!checkpointIds?.length) return new Map();

  const checkpoints = await Checkpoint.findAll({ where: { id: checkpointIds } });

  return checkpoints.reduce((acc, checkpoint) => {
    acc.set(checkpoint.id, {
      latitude: checkpoint.latitude,
      longitude: checkpoint.longitude,
      name: checkpoint.name
    });
    return acc;
  }, new Map());
}

function routeViolatesAreas(routeCoordinates, avoidAreas) {
  return avoidAreas.flatMap((area, index) => {
    const intersects = routeCoordinates.some(([lng, lat]) =>
      haversineDistanceKm(lat, lng, area.center.lat, area.center.lng) <= area.radiusKm
    );

    return intersects ? [{ index, radiusKm: area.radiusKm, center: area.center }] : [];
  });
}

function routeViolatesCheckpoints(routeCoordinates, checkpointsById, checkpointIds) {
  return checkpointIds.flatMap(id => {
    const cp = checkpointsById.get(id);
    if (!cp) return [];

    const intersects = routeCoordinates.some(([lng, lat]) =>
      haversineDistanceKm(lat, lng, cp.latitude, cp.longitude) <= CHECKPOINT_RADIUS_KM
    );

    return intersects ? [{ id, name: cp.name || null }] : [];
  });
}

function normalizeProviderRouteResponse(providerData) {
  const feature = providerData?.features?.[0];
  if (!feature?.geometry?.coordinates) return null;

  return {
    distance: feature.properties?.summary?.distance,
    duration: feature.properties?.summary?.duration,
    geometry: feature.geometry
  };
}

function buildProviderRequest(from, to) {
  const base = getProviderBaseUrl();
  let endpoint = `${base}/v2/directions/driving-car/geojson`;

  if (process.env.ORS_API_KEY) {
    endpoint += `?api_key=${encodeURIComponent(process.env.ORS_API_KEY)}`;
  }

  return {
    endpoint,
    method: "POST",
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
    const res = await fetch(req.endpoint, {
      method: req.method,
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
  if (!from || from.lat === undefined || from.lng === undefined) {
    return { error: { errorType: "INVALID_INPUT", message: "Invalid 'from'" } };
  }

  if (!to || to.lat === undefined || to.lng === undefined) {
    return { error: { errorType: "INVALID_INPUT", message: "Invalid 'to'" } };
  }

  const timeoutMs = Number(process.env.ROUTING_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);
  const ttl = Number(process.env.ROUTING_CACHE_TTL_SECONDS || DEFAULT_CACHE_TTL_SECONDS);

  const hash = buildCacheKey({ from, to, constraints });

  const cached = await getCachedResponse(hash);
  if (cached) {
    return { ...cached, metadata: { ...cached.metadata, source: "cache" } };
  }

  const provider = await fetchRouteFromProvider(from, to, timeoutMs);
  if (provider.errorType) return { error: provider };

  const route = normalizeProviderRouteResponse(provider.data);
  if (!route) return { error: { errorType: "NO_ROUTE" } };

  const checkpoints = await getCheckpointMapByIds(constraints?.avoidCheckpointIds || []);
  const violatedCheckpoints = routeViolatesCheckpoints(route.geometry.coordinates, checkpoints, constraints?.avoidCheckpointIds || []);
  const violatedAreas = routeViolatesAreas(route.geometry.coordinates, constraints?.avoidAreas || []);

  const payload = {
    estimatedDistanceMeters: route.distance,
    estimatedDurationSeconds: route.duration,
    routeGeometry: route.geometry,
    metadata: {
      provider: PROVIDER_NAME,
      source: "provider",
      requestedAt: new Date().toISOString(),
      violations: { checkpoints: violatedCheckpoints, areas: violatedAreas }
    }
  };

  await setCachedResponse(hash, payload, ttl);

  if (violatedCheckpoints.length || violatedAreas.length) {
    return {
      error: { errorType: "CONSTRAINT_VIOLATION", details: payload.metadata.violations },
      payload
    };
  }

  return payload;
}

module.exports = { estimateRoute };