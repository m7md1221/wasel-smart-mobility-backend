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

export const options = {
  scenarios: {
    mixed: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 30 },
        { duration: '2m',  target: 60 },
        { duration: '2m',  target: 60 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: sharedThresholds,
};

export function setup() {
  return { token: login(), checkpointIds: fetchCheckpointIds() };
}

// 80% reads, 20% writes
export default function (data) {
  if (Math.random() < 0.8) {
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
  sleep(Math.random() * 1.5);
}

export const handleSummary = writeSummary('mixed');
