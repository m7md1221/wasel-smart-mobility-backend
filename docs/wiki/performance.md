# Performance Testing

The repository includes k6 scenarios for load and stress testing under `k6/scenarios/`.

## Scenarios

- `read-heavy.js` - mostly reads.
- `write-heavy.js` - mostly writes.
- `mixed.js` - blended read/write traffic.
- `spike.js` - sudden traffic jump.
- `soak.js` - prolonged sustained traffic.

## Commands

- `npm run k6:read`
- `npm run k6:write`
- `npm run k6:mixed`
- `npm run k6:spike`
- `npm run k6:soak`
- `npm run k6:all`

## Results storage

Raw result files are stored under `k6/results/` so you can compare multiple runs over time.

## Practical notes

- Run the backend against seeded data before load testing.
- Make sure the API port used by k6 matches the running server.
- If a scenario fails, check whether the database, JWT token, or seeded records are missing.
