import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

export function writeSummary(name) {
  return (data) => ({
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
    [`k6/results/${name}.json`]: JSON.stringify(data, null, 2),
  });
}
