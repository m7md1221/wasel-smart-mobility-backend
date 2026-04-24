## Wasel Smart Mobility Backend

API-centric backend platform for smart mobility: checkpoints, road incidents, crowdsourced reports, route estimation, and regional alerts. Built with Express + PostgreSQL, with Swagger documentation and JWT authentication.

## Requirements

- Node.js 20+
- PostgreSQL 15+

## Quick Start (Local)

1) Install dependencies:

```bash
npm install
```

2) Configure environment variables:

- Copy the example env file:

```bash
copy .env.example .env
```

- Update values in `.env` to match your environment (DB + JWT + service keys).

3) Prepare the database:

- This project uses Sequelize models but does not include migrations in this repository.
- Tables must already exist in PostgreSQL (see table names in `src/models/*.js`).

4) Start the server:

```bash
npm run dev
```

By default, the server runs at `http://localhost:4000` and the API base path is `/api/v1`.

## Run with Docker

This repository includes `Dockerfile` and `docker-compose.yml` to run the app with PostgreSQL.

```bash
docker compose up --build
```

Note: the current Docker setup exposes port `3000` while the default `.env` uses `PORT=4000`.
To make them match:

- Either set `PORT=3000` in `.env`
- Or update `docker-compose.yml` to map port 4000.

## Scripts

From `package.json`:

- `npm run dev` — start with file watching (nodemon)
- `npm run start` — same as dev (nodemon)
- `npm run lint` — run eslint on `src/**/*.js`
- `npm run format` — run prettier on `src/**/*.js`

## Swagger Documentation

- Swagger UI: `GET /api-docs`
- Generated JSON output: `GET /swagger-output.json`

To regenerate swagger-output.json (optional):

```bash
node swagger.js
```

## Authentication & Authorization

### JWT Authentication

Most protected endpoints expect the following header:

```text
Authorization: Bearer <token>
```

Auth verification is handled by middleware: `src/middlewares/auth.js`.

### Roles

Roles are defined in `src/constants/roles.js`:

- `ADMIN`
- `MODERATOR`
- `CITIZEN`

Role checks are implemented in `src/middlewares/rolesAuthorize.js` using `authorizeRole(...roles)`.

## API Overview (Summary)

Base path: `/api/v1`

### Health

- `GET /health` — API health check

### Users

- `POST /users/signup` — register a user
- `POST /users/login` — login (note: route exists but needs wiring to `userController.login`)
- `GET /users/myprofile` — (Auth)
- `PUT /users/:id` — (Auth + ADMIN/CITIZEN)
- `GET /users` — (Auth + ADMIN/MODERATOR)
- `GET /users/:id` — (Auth + ADMIN/MODERATOR)
- `POST /users` — (Auth + ADMIN)
- `DELETE /users/:id` — (Auth + ADMIN)
- `POST /users/deactivate/:id` — (Auth + ADMIN)
- `POST /users/activate/:id` — (Auth + ADMIN)

### Route Estimation

- `POST /routes/estimate` — (Auth) estimate best route between two locations (supports constraints to avoid checkpoints/areas)

### Reports

- `GET /reports` — Public
- `GET /reports/stats` — Public
- `GET /reports/:id` — Public
- `GET /reports/:id/audit` — Public
- `GET /reports/:id/comments` — Public
- `POST /reports` — (Auth) submit a report
- `POST /reports/:id/vote` — (Auth)
- `POST /reports/:id/comments` — (Auth)
- `DELETE /reports/:id/comments/:commentId` — (Auth)
- Moderation:
  - `GET /reports/moderation/queue` — (Auth + ADMIN/MODERATOR)
  - `GET /reports/moderation/stats` — (Auth + ADMIN/MODERATOR)
  - `GET /reports/moderation/logs` — (Auth + ADMIN/MODERATOR)
  - `GET /reports/moderation/duplicates` — (Auth + ADMIN/MODERATOR)
  - `POST /reports/:id/moderate` — (Auth + ADMIN/MODERATOR)
  - `DELETE /reports/:id` — (Auth + ADMIN/MODERATOR)

### Checkpoints

- `GET /checkpoints` — Public
- `GET /checkpoints/:id` — Public
- `GET /checkpoints/:id/history` — Public
- `POST /checkpoints` — (Auth + ADMIN/MODERATOR)
- `PUT /checkpoints/:id/status` — (Auth + ADMIN/MODERATOR)

### Incidents

- `GET /incidents` — Public
- `GET /incidents/:id` — Public
- `POST /incidents` — (Auth)
- `PUT /incidents/:id/status` — (Auth + ADMIN/MODERATOR)

### Alerts

- `GET /alerts` — (Auth + ADMIN/MODERATOR)

### Alert Subscriptions

- `POST /alertSubscriptions/subscribe` — (Auth + CITIZEN)
- `DELETE /alertSubscriptions/unsubscribeAll/:userId` — (Auth + CITIZEN)
- `DELETE /alertSubscriptions/unsubscribe/category` — (Auth + CITIZEN/ADMIN/MODERATOR)
- `DELETE /alertSubscriptions/unsubscribe/location` — (Auth + CITIZEN/ADMIN/MODERATOR)
- `PUT /alertSubscriptions/update/category` — (Auth + CITIZEN)
- `PUT /alertSubscriptions/update/location` — (Auth + CITIZEN)
- `GET /alertSubscriptions/showSubscriptions/:userId` — (Auth + ADMIN/MODERATOR/CITIZEN)

### Telegram Bot

- `POST /telegram/webhook` — receive Telegram webhook updates

## Project Structure

Key locations:

- `src/server.js` — creates the HTTP server + checks DB connection
- `src/app.js` — Express app setup, router mounting, Swagger UI
- `src/routes/v1/index.js` — aggregates routers under `/api/v1`
- `src/controllers/` — controllers (HTTP layer)
- `src/services/` — business logic & integrations (Routing, Moderation, Notifications)
- `src/models/` — Sequelize models
- `src/validators/` — fastest-validator schemas
- `src/middlewares/` — auth/authorization/validation

## Security Notes

- Do not commit `.env` (it is in `.gitignore`).
- Use `.env.example` as a starting point.
- If secrets are leaked (JWT/ORS/Telegram/Email), rotate them immediately.

## Troubleshooting

- `EADDRINUSE` (port already in use): change `PORT` in `.env` or stop the other process.
- DB connection errors: verify `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME` and ensure PostgreSQL is running.
- `401 Missing authorization header`: send `Authorization: Bearer <token>` for protected routes.






