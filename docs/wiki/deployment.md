# Deployment

## Docker-based workflow

The repository includes a `Dockerfile` and `docker-compose.yml` for containerized runs.

```bash
docker compose up --build
```

## Typical deployment checklist

- Confirm the environment variables are set.
- Make sure PostgreSQL is reachable from the app container or host.
- Verify the exposed port matches your runtime configuration.
- Check that `swagger-output.json` is present if you want Swagger UI to work in the deployed environment.

## Operational endpoints

- `/api/v1/health` for health checks.
- `/api-docs` for Swagger UI.
- `/graphql` for GraphQL queries.
