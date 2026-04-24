import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, sharedThresholds, randomListQuery } from '../lib/config.js';
import { writeSummary } from '../lib/summary.js';

export const options = {
  scenarios: {
    spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '15s', target: 200 }, // sudden surge
        { duration: '1m',  target: 200 },
        { duration: '15s', target: 10 },  // drop back
        { duration: '30s', target: 10 },
        { duration: '10s', target: 0 },
      ],
      gracefulRampDown: '5s',
    },
  },
  // Spike tolerates more degradation; we still want the server to stay alive.
  thresholds: {
    http_req_failed: ['rate<0.15'],
    http_req_duration: ['p(95)<3000'],
    checks: ['rate>0.85'],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/incidents?${randomListQuery()}`, {
    tags: { name: 'incidents_list' },
  });
  check(res, { 'list 200': (r) => r.status === 200 });
  sleep(0.3);
}

export const handleSummary = writeSummary('spike');
