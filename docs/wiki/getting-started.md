# Getting Started

## Prerequisites

- Node.js 20 or newer.
- PostgreSQL 15 or newer.
- A filled `.env` file based on `.env.example`.

## Local setup

1. Install dependencies.

```bash
npm install
```

2. Create your environment file.

```bash
copy .env.example .env
```

3. Update the values in `.env` for your local machine, database, JWT secret, and external service keys.

4. Make sure the required tables exist in PostgreSQL.

This repository uses Sequelize models, but it does not include migrations. The database schema must already exist before the app starts successfully.

5. Start the server.

```bash
npm run dev
```

## Docker

The repository includes Docker support for local development and deployment experiments.

```bash
docker compose up --build
```

If you use Docker, make sure the app port in `.env` matches the port mapping in `docker-compose.yml`.

## Useful scripts

- `npm run dev` - start the server with nodemon.
- `npm run start` - start the server with nodemon.
- `npm run lint` - run ESLint with auto-fix.
- `npm run format` - format JavaScript files.
- `npm run k6:read` - run the read-heavy load test.
- `npm run k6:write` - run the write-heavy load test.
- `npm run k6:mixed` - run the mixed load test.
- `npm run k6:spike` - run the spike load test.
- `npm run k6:soak` - run the soak test.
- `npm run k6:all` - run all load tests sequentially.
