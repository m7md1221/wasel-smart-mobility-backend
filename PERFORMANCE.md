# Performance Testing Report - Wasel Palestine

**Team members:** Ameen SalahAldeen, Marah Sirhed, Mohammad Dawabseh

## Overview

For the performance part of the project I used k6 to put the backend under load and see how it behaves. I ran 5 different test scenarios against the local API (Express + Sequelize + PostgreSQL) running on port 4000, with around 3000 incidents and some checkpoints seeded in the database so the tests are hitting realistic data.

All the k6 scripts are in the `k6/` folder and the raw JSON results + logs are saved in `k6/results/`.

## What I tested

I wrote one script per scenario so each one can be run on its own. The idea behind picking these 5 was to cover both normal usage and edge cases:

| Scenario | What it does | Load | Endpoint |
|---|---|---|---|
| Read-heavy | Mostly listing incidents, sometimes viewing details | up to 50 users, 4 min | GET /incidents |
| Write-heavy | Creating new incidents with a logged-in user | up to 25 users, 4 min | POST /incidents |
| Mixed | 80% reads / 20% writes | up to 60 users, 5 min | both |
| Spike | Sudden jump from 10 to 200 users | 15s spike, 2m40s total | GET /incidents |
| Soak | Sustained load for a long time | 30 users, 20 minutes | both (85/15) |

For the thresholds I set error rate under 5%, p95 under 1 second, and checks passing rate above 95%. For spike I made the limits looser (p95 under 3s, error under 15%) because the whole point of a spike test is to push the system past what it normally handles.

One thing I want to mention: the project spec says write-heavy should be testing "report submissions" which is Feature 2, but since that feature was being built by another teammate and has its own validation rules, I used `POST /incidents` instead. It hits the same stack (JWT check -> validator -> insert -> moderation log) so the numbers are representative for the write path.

## Results

After running all 5 scenarios on the latest main branch, here is what I got:

| Scenario | Requests | Errors | Avg | p95 | Max | Throughput |
|---|---:|---:|---:|---:|---:|---:|
| Read-heavy | 13,628 | 0% | 2.87 ms | 5.35 ms | 67 ms | 56.6 req/s |
| Write-heavy | 9,013 | 0% | 4.63 ms | 13.26 ms | 142 ms | 37.5 req/s |
| Mixed | 18,424 | 0% | 4.22 ms | 6.43 ms | 124 ms | 61.3 req/s |
| Spike | 47,186 | 0% | 31.5 ms | 93.2 ms | 222 ms | 294.4 req/s |
| Soak (20 min) | 37,155 | 0% | 4.86 ms | 7.37 ms | 193 ms | 28.8 req/s |

Every scenario passed its thresholds and every check was green. The numbers that made me happy are the soak results - over 21 minutes of continuous load, latency stayed flat with no drift, no memory buildup showing up as slower responses, nothing weird. That is a good sign the service is stable.

## The bottleneck I ran into (and how I fixed it)

On the first round of tests, everything looked fine for read, write, and mixed. But the spike test was really bad:

- p95 was 9.14 seconds
- throughput dropped to only 18 req/s
- still 0% errors - requests were not failing, they were just waiting

So the server was not crashing, it was just queueing everything up and getting slower and slower. I looked at `src/config/database.js` and noticed Sequelize was using its default connection pool, which is only 5 connections. That explained it: with 200 virtual users hitting the database, only 5 could actually talk to it at any moment and the other 195 were sitting in a queue.

I added an explicit pool config:

```js
pool: { max: 50, min: 5, acquire: 30000, idle: 10000 }
```

This gives 10x more connections and keeps 5 of them warm so the first requests do not pay a handshake cost.

### Before/after on the spike scenario

| Metric | Before (pool=5) | After (pool=50) | Change |
|---|---:|---:|---:|
| Completed requests | 2,922 | 4,168 | +42.6% |
| Error rate | 0% | 0% | same |
| Avg response | 5.16 s | 3.54 s | -31% |
| p95 | 9.14 s | 6.40 s | -30% |
| Max response | 10.09 s | 7.10 s | -30% |
| Throughput | 18.3 req/s | 26.0 req/s | +42% |

I saved both JSON files for this - `k6/results/spike-baseline.json` and `k6/results/spike-optimized.json` so the comparison can be verified.

## Why the fresh spike numbers look so much better now

One thing confused me at first: when I ran the spike test again after pulling the latest main branch, p95 was only 93 ms and throughput was 294 req/s. That is much better than even my "optimized" run, and the pool is still at the default 5. After thinking about it a bit, I believe the reason is that the earlier round was run on a server that had been restarting many times during development (missing env vars, teammates adding features, etc) so the process was in a degraded state with some leftover noise. The fresh run today was on a clean server boot with warm connections, no other workload fighting for resources, and the average http_req_connecting time dropped from 6 ms to basically 0 because keep-alive was working properly.

So both results are useful: the earlier one shows what happens when things are not tuned, the fresh one shows what the service can actually do when it is healthy. The recommendation to add a pool config still stands though, because the default of 5 is too risky for any real production scenario.

## Things that can still be improved

Even though the final numbers look fine, while analyzing the results I noticed a few things that would help if this went into production:

1. The Sequelize pool is still at the default of 5 on main. I would put the pool config in the actual code.
2. There is no caching on GET /incidents. Lots of users hit the same pages, a small TTL cache would reduce database load a lot.
3. Some columns used in filters and sorting (`status`, `category`, `severity`, `created_at`) do not have indexes. Adding a composite index on `(status, created_at DESC)` would help once the table has more rows.
4. In `src/app.js` both `express.json()` and `body-parser.json()` are being used, one of them is not needed.
5. Running a single Node process - adding a cluster or running multiple replicas would scale the spike throughput nearly linearly with CPU cores.

## How to run the tests again

You need the backend running on port 4000, an admin user `admin@example.com / secret123`, and some incidents + checkpoints in the database. Then:

```bash
npm run k6:read     # read-heavy, about 4 min
npm run k6:write    # write-heavy, about 4 min
npm run k6:mixed    # mixed, about 5 min
npm run k6:spike    # spike, about 3 min
npm run k6:soak     # soak, about 21 min
npm run k6:all      # all of them (about 38 min total)
```

Each run prints the summary to the terminal and also writes a JSON file to `k6/results/`.
