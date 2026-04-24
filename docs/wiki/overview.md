# Project Overview

Wasel Smart Mobility Backend is an API-focused service for mobility and road-awareness workflows. It supports checkpoint data, road incidents, crowd-submitted reports, route estimation, alert subscriptions, and Telegram-based notifications.

## Main capabilities

- Checkpoint management and status history.
- Incident creation and moderation.
- Public report browsing with voting, comments, audit trail, and moderation.
- Route estimation with constraints such as avoiding checkpoints.
- Alert subscriptions by category and location.
- Telegram webhook intake for bot-driven workflows.
- Swagger documentation plus a GraphQL layer for read-only access.

## Runtime shape

- HTTP entry point: `src/server.js`.
- Express app composition: `src/app.js`.
- REST router aggregator: `src/routes/v1/index.js`.
- GraphQL entry point: `src/graphql/index.js`.
- Database connection: `src/config/database.js`.

## Core design idea

The project follows a layered backend structure:

- Routes define the public HTTP surface.
- Controllers translate HTTP requests into application actions.
- Services contain the business logic and external integrations.
- Models represent the Sequelize persistence layer.
- Middleware handles auth, authorization, and validation.
