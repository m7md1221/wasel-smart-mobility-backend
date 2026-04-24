import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, sharedThresholds, randomListQuery } from '../lib/config.js';
import { writeSummary } from '../lib/summary.js';

export const options = {
  scenarios: {
    read_heavy: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 20 },
        { duration: '1m',  target: 50 },
        { duration: '2m',  target: 50 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: sharedThresholds,
};

export default function () {
  const listRes = http.get(`${BASE_URL}/incidents?${randomListQuery()}`, {
    tags: { name: 'incidents_list' },
  });
  check(listRes, {
    'list 200': (r) => r.status === 200,
    'list has data array': (r) => Array.isArray(r.json('data')),
  });

  const ids = (listRes.json('data') || []).map((i) => i.id);
  if (ids.length && Math.random() < 0.5) {
    const id = ids[Math.floor(Math.random() * ids.length)];
    const detail = http.get(`${BASE_URL}/incidents/${id}`, {
      tags: { name: 'incidents_detail' },
    });
    check(detail, { 'detail 200': (r) => r.status === 200 });
  }

  sleep(1);
}

export const handleSummary = writeSummary('read-heavy');
