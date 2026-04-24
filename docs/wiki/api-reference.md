# REST API Reference

The REST API is mounted under `/api/v1`.

## Infrastructure endpoints

- `GET /test` - simple app health sanity check.
- `GET /api-docs` - Swagger UI.
- `GET /swagger-output.json` - generated OpenAPI JSON.
- `GET /api/v1/health` - versioned health check.

## Users

- `POST /api/v1/users/signup` - register a user.
- `POST /api/v1/users/login` - login a user.
- `GET /api/v1/users/myprofile` - authenticated profile lookup.
- `PUT /api/v1/users/:id` - update a user.
- `GET /api/v1/users` - list users for admin/moderator.
- `GET /api/v1/users/:id` - get a specific user for admin/moderator.
- `POST /api/v1/users` - admin creates a user.
- `DELETE /api/v1/users/:id` - admin deletes a user.
- `POST /api/v1/users/deactivate/:id` - admin deactivates a user.
- `POST /api/v1/users/activate/:id` - admin activates a user.

## Routes

- `POST /api/v1/routes/estimate` - authenticated route estimation with validation.

## Reports

- `GET /api/v1/reports`
- `GET /api/v1/reports/stats`
- `GET /api/v1/reports/:id`
- `GET /api/v1/reports/:id/audit`
- `GET /api/v1/reports/:id/comments`
- `POST /api/v1/reports`
- `POST /api/v1/reports/:id/vote`
- `POST /api/v1/reports/:id/comments`
- `DELETE /api/v1/reports/:id/comments/:commentId`
- `GET /api/v1/reports/moderation/queue`
- `GET /api/v1/reports/moderation/stats`
- `GET /api/v1/reports/moderation/logs`
- `GET /api/v1/reports/moderation/duplicates`
- `POST /api/v1/reports/:id/moderate`
- `DELETE /api/v1/reports/:id`

## Checkpoints

- `GET /api/v1/checkpoints`
- `GET /api/v1/checkpoints/:id`
- `GET /api/v1/checkpoints/:id/history`
- `POST /api/v1/checkpoints`
- `PUT /api/v1/checkpoints/:id/status`

## Incidents

- `GET /api/v1/incidents`
- `GET /api/v1/incidents/:id`
- `POST /api/v1/incidents`
- `PUT /api/v1/incidents/:id/status`

## Alerts and subscriptions

- `GET /api/v1/alerts`
- `POST /api/v1/alertSubscriptions/subscribe`
- `DELETE /api/v1/alertSubscriptions/unsubscribeAll/:userId`
- `DELETE /api/v1/alertSubscriptions/unsubscribe/category`
- `DELETE /api/v1/alertSubscriptions/unsubscribe/location`
- `PUT /api/v1/alertSubscriptions/update/category`
- `PUT /api/v1/alertSubscriptions/update/location`
- `GET /api/v1/alertSubscriptions/showSubscriptions/:userId`

## Telegram

- `POST /api/v1/telegram/webhook` - Telegram webhook receiver.

## Response conventions

- Public endpoints are available without authentication.
- Protected endpoints expect `Authorization: Bearer <token>`.
- Most list endpoints return pagination metadata.
- Swagger examples mirror the REST routes and should be used as the canonical request reference.
