import http from 'k6/http';
import { check, sleep } from 'k6';
import {
  BASE_URL,
  login,
  authHeaders,
  randomIncident,
  randomListQuery,
  fetchCheckpointIds,
  sharedThresholds,
} from '../lib/config.js';
import { writeSummary } from '../lib/summary.js';

// Soak: sustained moderate load to surface leaks, connection-pool exhaustion,
// and slow degradation that short tests miss. Default 20 minutes; override
// with SOAK_DURATION env var (e.g. SOAK_DURATION=2h).
const DURATION = __ENV.SOAK_DURATION || '20m';

export const options = {
  scenarios: {
    soak: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m',     target: 30 },
        { duration: DURATION, target: 30 },
        { duration: '30s',    target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: sharedThresholds,
};

export function setup() {
  return { token: login(), checkpointIds: fetchCheckpointIds() };
}

export default function (data) {
  if (Math.random() < 0.85) {
    const res = http.get(`${BASE_URL}/incidents?${randomListQuery()}`, {
      tags: { name: 'incidents_list' },
    });
    check(res, { 'list 200': (r) => r.status === 200 });
  } else {
    const res = http.post(
      `${BASE_URL}/incidents`,
      JSON.stringify(randomIncident(data.checkpointIds)),
      { headers: authHeaders(data.token), tags: { name: 'incidents_create' } }
    );
    check(res, { 'create 201': (r) => r.status === 201 });
  }
  sleep(1);
}

export const handleSummary = writeSummary('soak');
