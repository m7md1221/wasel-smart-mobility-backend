const crypto = require("crypto");
const { Op } = require("sequelize");
const ExternalApiCache = require("../models/externalApiModel");
const Checkpoint = require("../models/checkpointModel");
const Incident = require("../models/incidentsModel");

const memoryCache = new Map();
const PROVIDER_NAME = "OPENROUTESERVICE";
const DEFAULT_PROVIDER_URL = "https://api.openrouteservice.org";
const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_CACHE_TTL_SECONDS = 120;
const CHECKPOINT_RADIUS_KM = 0.35;
const INCIDENT_DEFAULT_RADIUS_KM = 0.5;

// Map incident severity to an avoidance radius (km). Falls back to the default.
const INCIDENT_SEVERITY_RADIUS_KM = {
  low: 0.3,
  medium: 0.5,
  high: 1.0,
  critical: 1.5
};

async function getActiveIncidentAreas() {
  try {
    const incidents = await Incident.findAll({
      where: {
        status: { [Op.in]: ["open", "verified"] },
        latitude: { [Op.ne]: null },
        longitude: { [Op.ne]: null }
      }
    });

    return incidents.map((incident) => {
      const severityKey = (incident.severity || "").toLowerCase();
      const radiusKm =
        INCIDENT_SEVERITY_RADIUS_KM[severityKey] || INCIDENT_DEFAULT_RADIUS_KM;

      return {
        center: {
          lat: incident.latitude,
          lng: incident.longitude
        },
        radiusKm,
        source: "incident",
        incidentId: incident.id,
        category: incident.category || null,
        severity: incident.severity || null,
        title: incident.title || null
      };
    });
  } catch (_error) {
    return [];
  }
}

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

// Approximate a geographic circle as a closed polygon ring in GeoJSON [lng, lat] order.
function circleToPolygonRing(centerLat, centerLng, radiusKm, vertices = 32) {
  const kmPerDegLat = 111.32;
  const kmPerDegLng = 111.32 * Math.cos(toRadians(centerLat)) || 1e-6;

  const ring = [];
  for (let i = 0; i < vertices; i++) {
    const angle = (i / vertices) * 2 * Math.PI;
    const dLat = (radiusKm / kmPerDegLat) * Math.sin(angle);
    const dLng = (radiusKm / kmPerDegLng) * Math.cos(angle);
    ring.push([centerLng + dLng, centerLat + dLat]);
  }
  ring.push(ring[0]);
  return ring;
}

function buildAvoidPolygonsGeoJson(avoidAreas) {
  if (!avoidAreas || avoidAreas.length === 0) {
    return null;
  }

  const coordinates = avoidAreas.map((area) =>
    [circleToPolygonRing(area.center.lat, area.center.lng, area.radiusKm)]
  );

  return {
    type: "MultiPolygon",
    coordinates
  };
}

function buildCacheKey(payload) {
  const canonicalPayload = {
    provider: PROVIDER_NAME,
    from: payload.from,
    to: payload.to,
    constraints: {
      avoidCheckpointIds: [...(payload.constraints?.avoidCheckpointIds || [])].sort((a, b) => a - b),
      avoidAreas: payload.constraints?.avoidAreas || []
    },
    incidentIds: payload.incidentIds || []
  };

  return crypto.createHash("sha256").update(JSON.stringify(canonicalPayload)).digest("hex");
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

function routeViolatesAreas(routeCoordinates, avoidAreas) {
  const violatedAreas = [];

  for (const [index, area] of avoidAreas.entries()) {
    const intersects = routeCoordinates.some(([lng, lat]) => {
      return haversineDistanceKm(lat, lng, area.center.lat, area.center.lng) <= area.radiusKm;
    });

    if (intersects) {
      violatedAreas.push({
        index,
        radiusKm,
        center: area.center,
        source: area.source || "user",
        incidentId: area.incidentId || null,
        category: area.category || null,
        severity: area.severity || null,
        title: area.title || null
      });
    }
  }

  return violatedAreas;
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

function buildProviderRequest(from, to, avoidAreas) {
  const providerBaseUrl = getProviderBaseUrl();
  let endpoint = `${providerBaseUrl}/v2/directions/driving-car/geojson`;

  // Add API key as query param if available (OpenRouteService standard method)
  if (process.env.ORS_API_KEY) {
    url += `?api_key=${encodeURIComponent(process.env.ORS_API_KEY)}`;
  }

  const body = {
    coordinates: [
      [from.lng, from.lat],
      [to.lng, to.lat]
    ]
  };

  const avoidPolygons = buildAvoidPolygonsGeoJson(avoidAreas);
  if (avoidPolygons) {
    body.options = { avoid_polygons: avoidPolygons };
  }

  return {
    endpoint,
    method: "POST",
    body: JSON.stringify(body)
  };
}

async function fetchRouteFromProvider(from, to, timeoutMs, avoidAreas) {
  const requestConfig = buildProviderRequest(from, to, avoidAreas);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const headers = {
    "Content-Type": "application/json",
    "User-Agent": "Wasel-Smart-Mobility/1.0"
  };

  try {
    console.log(`[Routing] Fetching route from provider...`);
    const response = await fetch(requestConfig.endpoint, {
      method: requestConfig.method,
      headers,
      body: requestConfig.body,
      signal: controller.signal
    });

    if (response.status === 429) {
      const retryAfter = response.headers.get("retry-after");
      console.warn(`[Routing] Rate limit hit. Retry after: ${retryAfter}s`);
      return {
        errorType: "RATE_LIMIT",
        retryAfter,
        message: "Routing provider rate limited. Please retry after " + (retryAfter || "30") + " seconds."
      };
    }

    if (!response.ok) {
      let errorDetails = "";
      try {
        const errorData = await response.json();
        errorDetails = JSON.stringify(errorData);
      } catch (_) {
        errorDetails = await response.text().catch(() => "No details available");
      }
      
      console.error(`[Routing] Provider error ${response.status}: ${errorDetails}`);
      return {
        errorType: "PROVIDER_ERROR",
        status: response.status,
        message: `Routing provider returned status ${response.status}`,
        details: errorDetails
      };
    }

    const data = await response.json();
    console.log(`[Routing] Route fetched successfully. Distance: ${data?.features?.[0]?.properties?.summary?.distance}m`);
    return { data };
  } catch (error) {
    if (error.name === "AbortError") {
      console.error(`[Routing] Request timeout after ${timeoutMs}ms`);
      return { 
        errorType: "TIMEOUT",
        message: `Routing provider request timeout after ${timeoutMs}ms`
      };
    }

    console.error(`[Routing] Network error:`, error.message);
    return {
      errorType: "NETWORK_ERROR",
      message: error.message
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function estimateRoute({ from, to, constraints }) {
  // Validate input
  if (!from || !from.lat || from.lng === undefined) {
    return {
      error: {
        errorType: "INVALID_INPUT",
        message: "Invalid 'from' coordinates. Expected {lat: number, lng: number}"
      }
    };
  }
  
  if (!to || !to.lat || to.lng === undefined) {
    return {
      error: {
        errorType: "INVALID_INPUT",
        message: "Invalid 'to' coordinates. Expected {lat: number, lng: number}"
      }
    };
  }

  const timeoutMs = Number(process.env.ROUTING_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);
  const ttl = Number(process.env.ROUTING_CACHE_TTL_SECONDS || DEFAULT_CACHE_TTL_SECONDS);

  // Resolve all avoidance regions up-front so the provider plans around them.
  const avoidCheckpointIds = constraints?.avoidCheckpointIds || [];
  const userAvoidAreas = (constraints?.avoidAreas || []).map((area) => ({
    ...area,
    source: "user"
  }));

  const incidentAvoidAreas = await getActiveIncidentAreas();
  const checkpointsById = await getCheckpointMapByIds(avoidCheckpointIds);
  const checkpointAvoidAreas = [...checkpointsById.entries()].map(([id, cp]) => ({
    center: { lat: cp.latitude, lng: cp.longitude },
    radiusKm: CHECKPOINT_RADIUS_KM,
    source: "checkpoint",
    checkpointId: id,
    name: cp.name || null
  }));

  const allAvoidAreas = [...userAvoidAreas, ...incidentAvoidAreas, ...checkpointAvoidAreas];

  const requestPayload = {
    from,
    to,
    constraints,
    incidentIds: incidentAvoidAreas.map((a) => a.incidentId).sort((a, b) => a - b)
  };
  const requestHash = buildCacheKey(requestPayload);

  try {
    const cached = await getCachedResponse(requestHash);
    if (cached) {
      console.log(`[Routing] Cache hit for route`);
      const cachedPayload = {
        ...cached,
        metadata: {
          ...cached.metadata,
          source: "cache"
        }
      };

      const cachedViolations = cached.metadata?.violations || {};
      const hasCachedViolations =
        (cachedViolations.checkpoints || []).length > 0 ||
        (cachedViolations.areas || []).length > 0;

      if (hasCachedViolations) {
        console.info(`[Routing] Cached route violates constraints.`);
        return {
          error: {
            errorType: "CONSTRAINT_VIOLATION",
            message: "Route violates selected constraints",
            details: cachedViolations
          },
          payload: cachedPayload
        };
      }

      return cachedPayload;
    }
  } catch (cacheError) {
    console.warn(`[Routing] Cache retrieval error (continuing):`, cacheError.message);
  }

  const providerResult = await fetchRouteFromProvider(from, to, timeoutMs, allAvoidAreas);

  if (providerResult.errorType) {
    return {
      error: providerResult
    };
  }

  const route = normalizeProviderRouteResponse(providerResult.data);
  if (!route) {
    console.warn(`[Routing] No valid route in provider response`);
    return {
      error: {
        errorType: "NO_ROUTE",
        message: "No route found for the given coordinates"
      }
    };
  }

  const routeCoordinates = route.geometry.coordinates;

  try {
    const violatedCheckpoints = routeViolatesCheckpoints(routeCoordinates, checkpointsById, avoidCheckpointIds);
    const violatedAreas = routeViolatesAreas(routeCoordinates, [...userAvoidAreas, ...incidentAvoidAreas]);

    const violatesConstraints = violatedCheckpoints.length > 0 || violatedAreas.length > 0;

    const payload = {
      estimatedDistanceMeters: route.distance || null,
      estimatedDurationSeconds: route.duration || null,
      routeGeometry: route.geometry,
      metadata: {
        provider: PROVIDER_NAME,
        source: "provider",
        requestedAt: new Date().toISOString(),
        factors: [
          "traffic-model-from-provider",
          "checkpoint-and-area-constraint-check",
          "active-incident-avoidance"
        ],
        constraintsApplied: {
          avoidCheckpointIds,
          avoidAreas: userAvoidAreas,
          activeIncidentsConsidered: incidentAvoidAreas.length
        },
        violations: {
          checkpoints: violatedCheckpoints,
          areas: violatedAreas
        }
      }
    };

    try {
      await setCachedResponse(requestHash, payload, cacheTtlSeconds);
    } catch (cacheError) {
      console.warn(`[Routing] Failed to cache response (continuing):`, cacheError.message);
    }

    if (violatesConstraints) {
      console.info(`[Routing] Route violates constraints. Violations: ${JSON.stringify(payload.metadata.violations)}`);
      return {
        error: {
          errorType: "CONSTRAINT_VIOLATION",
          message: "Route violates selected constraints",
          details: payload.metadata.violations
        },
        payload
      };
    }

    console.info(`[Routing] Route successfully estimated: ${route.distance}m, ${route.duration}s`);
    return payload;
  } catch (error) {
    console.error(`[Routing] Error during constraint checking:`, error.message);
    return {
      error: {
        errorType: "CONSTRAINT_CHECK_ERROR",
        message: "Error while checking route constraints",
        details: error.message
      }
    };
  }
}

module.exports = { estimateRoute };
