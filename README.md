# 🚦 Wasel Smart Mobility Backend

API-centric backend platform for smart mobility: checkpoints, road incidents, crowdsourced reports, route estimation, and regional alerts. Built with Express + PostgreSQL, with Swagger documentation and JWT authentication.

### Note

This README is designed as a practical developer guide for setup, architecture, and API usage.

## 📖 Project Wiki

A structured wiki for this project is available under [docs/wiki/README.md](docs/wiki/README.md). It covers setup, architecture, API usage, GraphQL, performance testing, deployment, and troubleshooting.

## 📚 Table of Contents

- [Project Wiki](#project-wiki)
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Requirements](#requirements)
- [Quick Start (Local)](#quick-start-local)
- [Environment Variables](#environment-variables)
- [Run with Docker](#run-with-docker)
- [Scripts](#scripts)
- [Swagger Documentation](#swagger-documentation)
- [GraphQL API](#graphql-api)
- [Authentication and Authorization](#authentication-and-authorization)
- [API Endpoints](#api-endpoints)
- [API Usage Examples](#api-usage-examples)
- [Folder Structure](#folder-structure)
- [Deployment](#deployment)
- [Screenshots and Demo](#screenshots-and-demo)
- [Developers](#developers)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🌍 Project Overview

Wasel Smart Mobility Backend powers a mobility-focused ecosystem for:

- Road checkpoint status and history.
- Incident reporting and status moderation.
- Crowdsourced reports with voting, comments, and moderation workflows.
- Route estimation with constraints (for example: avoid checkpoints/areas).
- Regional alert subscriptions and optional Telegram/email integrations.

## ✨ Features

- JWT-protected APIs with role-based access control.
- Public and protected endpoints for mobility data.
- Report lifecycle support: create, vote, comment, moderate, and audit.
- Checkpoint and incident management workflows.
- Route estimation service with provider integration.
- Swagger/OpenAPI documentation generation.
- Containerized local run support with Docker Compose.

## 🆕 Recent Updates

- Added GraphQL support for authentication and API data access.
- Added Telegram bot/webhook integration for notification workflows.
- Added alert subscription management for category and location preferences.
- Added performance testing scenarios under `k6/` for read, write, mixed, soak, and spike workloads.

## 🛠️ Tech Stack

### Backend

- Node.js 20+
- Express.js
- PostgreSQL 15+
- Sequelize ORM
- JWT Authentication
- fastest-validator

### Integrations and Tooling

- OpenRouteService (ORS)
- Telegram Bot API
- Nodemailer
- Swagger UI + swagger-autogen
- ESLint + Prettier
- Nodemon
- Docker + Docker Compose

## 🧱 Architecture Overview

The codebase follows a layered structure:

- Routes layer: endpoint definitions and middleware composition.
- Controllers layer: HTTP request/response handling.
- Services layer: business logic and external integrations.
- Models layer: Sequelize data models and persistence mapping.
- Middleware layer: auth, role authorization, and validation.

Request flow:

1. Request enters Express app.
2. Route-level middleware validates auth/role/input.
3. Controller delegates business logic to services.
4. Services interact with models and external APIs.
5. Standardized JSON response is returned.

## ✅ Requirements

- Node.js 20+
- PostgreSQL 15+

## 🚀 Quick Start (Local)

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
copy .env.example .env
```

Then update values in `.env` to match your environment (DB, JWT, and service keys).

3. Prepare the database:

- This project uses Sequelize models but does not include migrations in this repository.
- Tables must already exist in PostgreSQL (see table names in `src/models/*.js`).

4. Start the server:

```bash
npm run dev
```

By default, the server runs at `http://localhost:4000` and the API base path is `/api/v1`.

## 🔐 Environment Variables

Copy from `.env.example` and adjust values for your environment.

| Variable | Description | Example |
| --- | --- | --- |
| `PORT` | Application port | `4000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | `postgres` |
| `DB_NAME` | PostgreSQL database name | `wasel_palestine` |
| `JWT_SECRET` | JWT signing secret | `CHANGE_ME_TO_A_LONG_RANDOM_STRING` |
| `ROUTING_PROVIDER_URL` | Routing provider base URL | `https://api.openrouteservice.org` |
| `ROUTING_TIMEOUT_MS` | Routing request timeout in ms | `5000` |
| `ROUTING_CACHE_TTL_SECONDS` | Route cache TTL in seconds | `120` |
| `ORS_API_KEY` | OpenRouteService API key | `CHANGE_ME` |
| `EMAIL` | Email account for notifications (optional) | `example@gmail.com` |
| `PASSWORD` | App password / SMTP password (optional) | `app-password-or-smtp-password` |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token (optional) | `CHANGE_ME` |

## 🐳 Run with Docker

This repository includes `Dockerfile` and `docker-compose.yml` to run the app with PostgreSQL.

```bash
docker compose up --build
```

Important port note:

- Current Docker setup exposes `3000:3000`.
- Default `.env` uses `PORT=4000`.

To make them match, either:

- Set `PORT=3000` in `.env`.
- Or update `docker-compose.yml` to map port `4000`.

## 📜 Scripts

From `package.json`:

- `npm run dev` - start with file watching (nodemon)
- `npm run start` - same as dev (nodemon)
- `npm run lint` - run eslint on `src/**/*.js`
- `npm run format` - run prettier on `src/**/*.js`

## 📘 Swagger Documentation

- Swagger UI: `GET /api-docs`
- Generated JSON output: `GET /swagger-output.json`

Regenerate `swagger-output.json` (optional):

```bash
node swagger.js
```

## 📡 GraphQL API

GraphQL support is available under `src/graphql/` and includes schema definitions, resolvers, and auth helpers.

The main entry points are:

- `src/graphql/index.js`
- `src/graphql/typeDefs.js`
- `src/graphql/resolvers.js`
- `src/graphql/auth.js`

## 🔑 Authentication and Authorization

### JWT Authentication

Most protected endpoints expect:

```text
Authorization: Bearer <token>
```

Auth verification middleware: `src/middlewares/auth.js`.

### Roles

Roles defined in `src/constants/roles.js`:

- `ADMIN`
- `MODERATOR`
- `CITIZEN`

Role checks are implemented in `src/middlewares/rolesAuthorize.js` using `authorizeRole(...roles)`.

## 🧭 API Endpoints

Base path: `/api/v1`

### Health

- `GET /health` - API health check

### Users

- `POST /users/signup` - register a user
- `POST /users/login` - login (route exists but needs wiring to `userController.login`)
- `GET /users/myprofile` - (Auth)
- `PUT /users/:id` - (Auth + ADMIN/CITIZEN)
- `GET /users` - (Auth + ADMIN/MODERATOR)
- `GET /users/:id` - (Auth + ADMIN/MODERATOR)
- `POST /users` - (Auth + ADMIN)
- `DELETE /users/:id` - (Auth + ADMIN)
- `POST /users/deactivate/:id` - (Auth + ADMIN)
- `POST /users/activate/:id` - (Auth + ADMIN)

### Route Estimation

- `POST /routes/estimate` - (Auth) estimate best route between two locations and support avoid constraints

### Reports

- `GET /reports` - Public
- `GET /reports/stats` - Public
- `GET /reports/:id` - Public
- `GET /reports/:id/audit` - Public
- `GET /reports/:id/comments` - Public
- `POST /reports` - (Auth) submit a report
- `POST /reports/:id/vote` - (Auth)
- `POST /reports/:id/comments` - (Auth)
- `DELETE /reports/:id/comments/:commentId` - (Auth)
- `GET /reports/moderation/queue` - (Auth + ADMIN/MODERATOR)
- `GET /reports/moderation/stats` - (Auth + ADMIN/MODERATOR)
- `GET /reports/moderation/logs` - (Auth + ADMIN/MODERATOR)
- `GET /reports/moderation/duplicates` - (Auth + ADMIN/MODERATOR)
- `POST /reports/:id/moderate` - (Auth + ADMIN/MODERATOR)
- `DELETE /reports/:id` - (Auth + ADMIN/MODERATOR)

### Checkpoints

- `GET /checkpoints` - Public
- `GET /checkpoints/:id` - Public
- `GET /checkpoints/:id/history` - Public
- `POST /checkpoints` - (Auth + ADMIN/MODERATOR)
- `PUT /checkpoints/:id/status` - (Auth + ADMIN/MODERATOR)

### Incidents

- `GET /incidents` - Public
- `GET /incidents/:id` - Public
- `POST /incidents` - (Auth)
- `PUT /incidents/:id/status` - (Auth + ADMIN/MODERATOR)

### Alerts

- `GET /alerts` - (Auth + ADMIN/MODERATOR)

### Alert Subscriptions

- `POST /alertSubscriptions/subscribe` - (Auth + CITIZEN)
- `DELETE /alertSubscriptions/unsubscribeAll/:userId` - (Auth + CITIZEN)
- `DELETE /alertSubscriptions/unsubscribe/category` - (Auth + CITIZEN/ADMIN/MODERATOR)
- `DELETE /alertSubscriptions/unsubscribe/location` - (Auth + CITIZEN/ADMIN/MODERATOR)
- `PUT /alertSubscriptions/update/category` - (Auth + CITIZEN)
- `PUT /alertSubscriptions/update/location` - (Auth + CITIZEN)
- `GET /alertSubscriptions/showSubscriptions/:userId` - (Auth + ADMIN/MODERATOR/CITIZEN)

### Telegram Bot

- `POST /telegram/webhook` - receive Telegram webhook updates

## 🧪 API Usage Examples

Get health status:

```bash
curl -X GET http://localhost:4000/api/v1/health
```

Create a report (authenticated):

```bash
curl -X POST http://localhost:4000/api/v1/reports \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "checkpoint",
    "description": "Heavy congestion near city entrance",
    "latitude": 31.5,
    "longitude": 34.47
  }'
```

Estimate route (authenticated):

```bash
curl -X POST http://localhost:4000/api/v1/routes/estimate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {"lat": 31.5, "lng": 34.47},
    "destination": {"lat": 31.51, "lng": 34.49},
    "avoid": {"checkpoints": true}
  }'
```

## 🗂️ Folder Structure

```text
.
|-- Dockerfile
|-- docker-compose.yml
|-- src
|   |-- app.js
|   |-- server.js
|   |-- config
|   |-- constants
|   |-- controllers
|   |-- middlewares
|   |-- models
|   |-- routes
|   |   `-- v1
|   |-- services
|   |-- validators
|   `-- utils
|-- swagger.js
`-- swagger-output.json
```

Key locations:

- `src/server.js` - creates the HTTP server and checks DB connection
- `src/app.js` - Express app setup, router mounting, Swagger UI
- `src/routes/v1/index.js` - aggregates routers under `/api/v1`
- `src/controllers/` - controllers (HTTP layer)
- `src/services/` - business logic and integrations (routing, moderation, notifications)
- `src/models/` - Sequelize models
- `src/validators/` - fastest-validator schemas
- `src/middlewares/` - auth/authorization/validation

## 🌐 Deployment

### Option 1: Docker Compose (recommended for local/staging)

```bash
docker compose up --build -d
```

Then check logs:

```bash
docker compose logs -f app
```

## 🖼️ Screenshots and Demo

- API docs screenshot placeholder: `docs/images/swagger-ui.png`
- Postman collection run screenshot placeholder: `docs/images/postman-run.png`
- Demo video placeholder: `https://your-demo-link-here`

If you add screenshots, keep dimensions and naming consistent for a clean repository presentation.


## 🛡️ Security Notes

- Do not commit `.env` (it is in `.gitignore`).
- Use `.env.example` as a starting point.
- If secrets are leaked (JWT/ORS/Telegram/Email), rotate them immediately.

## 🧯 Troubleshooting

- `EADDRINUSE` (port already in use): change `PORT` in `.env` or stop the other process.
- DB connection errors: verify `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME` and ensure PostgreSQL is running.
- `401 Missing authorization header`: send `Authorization: Bearer <token>` for protected routes.

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes with clear messages.
4. Run lint/format checks before opening a pull request.
5. Open a PR with a concise description and test notes.



## 👥 Developers

- mohammad dawabsheh - [LinkedIn](https://www.linkedin.com/in/mohammad-dawabsheh-193050308/)
- deema daraghmeh - [LinkedIn](https://www.linkedin.com/in/deema-daraghmeh)
- ameen salah aldeen - [LinkedIn](https://www.linkedin.com/in/ameen-salahat)
- Marah Sirhed - [LinkedIn](https://www.linkedin.com/in/marah-sirhed)




