# Configuration

The project reads its runtime configuration from environment variables.

## Core variables

| Variable | Purpose |
| --- | --- |
| `PORT` | HTTP port used by the server |
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_NAME` | PostgreSQL database name |
| `JWT_SECRET` | JWT signing secret |
| `ROUTING_PROVIDER_URL` | Routing service base URL |
| `ROUTING_TIMEOUT_MS` | Routing request timeout |
| `ROUTING_CACHE_TTL_SECONDS` | Route cache TTL |
| `ORS_API_KEY` | OpenRouteService API key |
| `EMAIL` | SMTP email account for notifications |
| `PASSWORD` | SMTP/app password |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token |

## Notes

- Start from `.env.example` and do not commit real secrets.
- Telegram, email, and routing values may be optional depending on which integrations you use locally.
- If the port in your environment differs from the Docker mapping, update one side so they match.
