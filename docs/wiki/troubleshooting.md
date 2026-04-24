# Troubleshooting

## Common problems

- Database connection errors usually mean one of the `DB_*` variables is wrong or PostgreSQL is not running.
- `401` responses usually mean the request is missing `Authorization: Bearer <token>`.
- Port conflicts happen when another process already uses the configured `PORT`.
- Telegram webhook problems usually come from missing or incorrect bot token configuration.
- k6 failures often mean the backend is down, the port is wrong, or the test data is not seeded.

## First checks

1. Confirm the server starts cleanly.
2. Confirm the database connection succeeds.
3. Confirm `.env` is consistent with Docker and local settings.
4. Check Swagger or `/api/v1/health` before testing deeper flows.
