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

    if (!dbEntry) {
      return null;
    }

    if (new Date(dbEntry.expires_at).getTime() <= Date.now()) {
      return null;
    }

    memoryCache.set(requestHash, {
      data: dbEntry.response_data,
      expiresAt: new Date(dbEntry.expires_at).getTime()
    });

    return dbEntry.response_data;
  } catch (_error) {
    return null;
  }
}

async function setCachedResponse(requestHash, data, ttlSeconds) {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  memoryCache.set(requestHash, { data, expiresAt });

  try {
    const expiresAtDate = new Date(expiresAt);
    const existing = await ExternalApiCache.findOne({
      where: {
        provider_name: PROVIDER_NAME,
        request_hash: requestHash
      }
    });

    if (existing) {
      await existing.update({
        response_data: data,
        expires_at: expiresAtDate
      });
      return;
    }

    await ExternalApiCache.create({
      provider_name: PROVIDER_NAME,
      request_hash: requestHash,
      response_data: data,
      expires_at: expiresAtDate,
      created_at: new Date()
    });
  } catch (_error) {
    // Ignore database cache errors and continue with in-memory cache.
  }
}

async function getCheckpointMapByIds(checkpointIds) {
  if (!checkpointIds || checkpointIds.length === 0) {
    return new Map();
  }

  const checkpoints = await Checkpoint.findAll({
    where: { id: checkpointIds }
  });

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
  const violatedAreas = [];

  for (const [index, area] of avoidAreas.entries()) {
    const radiusKm = area.radiusKm;
    const areaLat = area.center.lat;
    const areaLng = area.center.lng;

    const intersects = routeCoordinates.some(([lng, lat]) => {
      const distance = haversineDistanceKm(lat, lng, areaLat, areaLng);
      return distance <= radiusKm;
    });

    if (intersects) {
      violatedAreas.push({
        index,
        radiusKm,
        center: area.center
      });
    }
  }

  return violatedAreas;
}

function routeViolatesCheckpoints(routeCoordinates, checkpointsById, checkpointIds) {
  const violatedCheckpoints = [];

  for (const checkpointId of checkpointIds) {
    const checkpoint = checkpointsById.get(checkpointId);

    if (!checkpoint) {
      continue;
    }

    const intersects = routeCoordinates.some(([lng, lat]) => {
      const distance = haversineDistanceKm(lat, lng, checkpoint.latitude, checkpoint.longitude);
      return distance <= CHECKPOINT_RADIUS_KM;
    });

    if (intersects) {
      violatedCheckpoints.push({
        id: checkpointId,
        name: checkpoint.name || null
      });
    }
  }

  return violatedCheckpoints;
}

function normalizeProviderRouteResponse(providerData) {
  const feature = providerData?.features?.[0];
  if (!feature || !feature.geometry || !Array.isArray(feature.geometry.coordinates)) {
    return null;
  }

  return {
    distance: feature.properties?.summary?.distance,
    duration: feature.properties?.summary?.duration,
    geometry: feature.geometry
  };
}

function buildProviderRequest(from, to) {
  const providerBaseUrl = getProviderBaseUrl();
  return {
    endpoint: `${providerBaseUrl}/v2/directions/driving-car/geojson`,
    method: "POST",
    body: JSON.stringify({
      coordinates: [
        [from.lng, from.lat],
        [to.lng, to.lat]
      ]
    })
  };
}

async function fetchRouteFromProvider(from, to, timeoutMs) {
  const requestConfig = buildProviderRequest(from, to);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const headers = {
    "Content-Type": "application/json"
  };

  if (process.env.ORS_API_KEY) {
    headers.Authorization = process.env.ORS_API_KEY;
  }

  try {
    const response = await fetch(requestConfig.endpoint, {
      method: requestConfig.method,
      headers,
      body: requestConfig.body,
      signal: controller.signal
    });

    if (response.status === 429) {
      const retryAfter = response.headers.get("retry-after");
      return {
        errorType: "RATE_LIMIT",
        retryAfter
      };
    }

    if (!response.ok) {
      return {
        errorType: "PROVIDER_ERROR",
        status: response.status
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    if (error.name === "AbortError") {
      return { errorType: "TIMEOUT" };
    }

    return {
      errorType: "NETWORK_ERROR",
      message: error.message
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function estimateRoute({ from, to, constraints }) {
  const timeoutMs = Number(process.env.ROUTING_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);
  const cacheTtlSeconds = Number(process.env.ROUTING_CACHE_TTL_SECONDS || DEFAULT_CACHE_TTL_SECONDS);

  const requestPayload = { from, to, constraints };
  const requestHash = buildCacheKey(requestPayload);

  const cached = await getCachedResponse(requestHash);
  if (cached) {
    return {
      ...cached,
      metadata: {
        ...cached.metadata,
        source: "cache"
      }
    };
  }

  const providerResult = await fetchRouteFromProvider(from, to, timeoutMs);

  if (providerResult.errorType) {
    return {
      error: providerResult
    };
  }

  const route = normalizeProviderRouteResponse(providerResult.data);
  if (!route) {
    return {
      error: {
        errorType: "NO_ROUTE"
      }
    };
  }

  const routeCoordinates = route.geometry.coordinates;
  const avoidCheckpointIds = constraints?.avoidCheckpointIds || [];
  const avoidAreas = constraints?.avoidAreas || [];

  const checkpointsById = await getCheckpointMapByIds(avoidCheckpointIds);
  const violatedCheckpoints = routeViolatesCheckpoints(routeCoordinates, checkpointsById, avoidCheckpointIds);
  const violatedAreas = routeViolatesAreas(routeCoordinates, avoidAreas);

  const violatesConstraints = violatedCheckpoints.length > 0 || violatedAreas.length > 0;

  const payload = {
    estimatedDistanceMeters: route.distance || null,
    estimatedDurationSeconds: route.duration || null,
    routeGeometry: route.geometry,
    metadata: {
      provider: PROVIDER_NAME,
      source: "provider",
      requestedAt: new Date().toISOString(),
      factors: ["traffic-model-from-provider", "checkpoint-and-area-constraint-check"],
      constraintsApplied: {
        avoidCheckpointIds,
        avoidAreas
      },
      violations: {
        checkpoints: violatedCheckpoints,
        areas: violatedAreas
      }
    }
  };

  await setCachedResponse(requestHash, payload, cacheTtlSeconds);

  if (violatesConstraints) {
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

module.exports = {
  estimateRoute
};
