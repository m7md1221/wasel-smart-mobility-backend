import http from 'k6/http';
import { check, sleep } from 'k6';
import {
  BASE_URL,
  login,
  authHeaders,
  randomIncident,
  fetchCheckpointIds,
  sharedThresholds,
} from '../lib/config.js';
import { writeSummary } from '../lib/summary.js';

export const options = {
  scenarios: {
    write_heavy: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m',  target: 25 },
        { duration: '2m',  target: 25 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: {
    ...sharedThresholds,
    http_req_duration: ['p(95)<1500', 'avg<700'],
  },
};

export function setup() {
  return { token: login(), checkpointIds: fetchCheckpointIds() };
}

export default function (data) {
  const res = http.post(
    `${BASE_URL}/incidents`,
    JSON.stringify(randomIncident(data.checkpointIds)),
    { headers: authHeaders(data.token), tags: { name: 'incidents_create' } }
  );
  check(res, {
    'create 201': (r) => r.status === 201,
    'create returns id': (r) => !!r.json('data.id'),
  });
  sleep(0.5);
}

export const handleSummary = writeSummary('write-heavy');
