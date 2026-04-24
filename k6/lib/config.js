import http from 'k6/http';
import { check, fail } from 'k6';

export const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000/api/v1';

export const CREDENTIALS = {
  email: __ENV.K6_EMAIL || 'admin@example.com',
  password: __ENV.K6_PASSWORD || 'secret123',
};

export const sharedThresholds = {
  http_req_failed: ['rate<0.05'],
  http_req_duration: ['p(95)<1000', 'avg<500'],
  checks: ['rate>0.95'],
};

export function login() {
  const res = http.post(
    `${BASE_URL}/users/login`,
    JSON.stringify(CREDENTIALS),
    { headers: { 'Content-Type': 'application/json' }, tags: { name: 'login' } }
  );
  const ok = check(res, { 'login 200': (r) => r.status === 200 });
  if (!ok) fail(`login failed: ${res.status} ${res.body}`);
  return res.json('token');
}

export function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

const CATEGORIES = ['closure', 'delay', 'accident', 'weather_hazard', 'other'];
const SEVERITIES = ['low', 'medium', 'high', 'critical'];

export function randomIncident(checkpointIds) {
  const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const sev = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
  const cpId = checkpointIds && checkpointIds.length
    ? checkpointIds[Math.floor(Math.random() * checkpointIds.length)]
    : 1;
  return {
    title: `k6-${cat}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    category: cat,
    severity: sev,
    description: 'load-test generated incident',
    latitude: 31.9 + Math.random() * 0.5,
    longitude: 35.1 + Math.random() * 0.5,
    checkpoint_id: cpId,
  };
}

export function fetchCheckpointIds() {
  const res = http.get(`${BASE_URL}/checkpoints?limit=50`, { tags: { name: 'setup_checkpoints' } });
  if (res.status !== 200) return [];
  const body = res.json();
  const list = Array.isArray(body) ? body : body.data || body.checkpoints || [];
  return list.map((c) => c.id).filter(Boolean);
}

function qs(pairs) {
  return pairs
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}

export function randomListQuery() {
  const pairs = [
    ['page', 1 + Math.floor(Math.random() * 3)],
    ['limit', [10, 20, 50][Math.floor(Math.random() * 3)]],
  ];
  if (Math.random() < 0.4) {
    pairs.push(['category', CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]]);
  }
  if (Math.random() < 0.3) {
    pairs.push(['severity', SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)]]);
  }
  return qs(pairs);
}
