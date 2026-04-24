# Wasel Smart Mobility Backend Wiki

This wiki is the project handbook for developers working on the Wasel Smart Mobility Backend.

It is organized into short pages so you can jump directly to the topic you need:

- [Project Overview](overview.md)
- [Getting Started](getting-started.md)
- [Architecture](architecture.md)
- [Configuration](configuration.md)
- [REST API Reference](api-reference.md)
- [GraphQL API](graphql.md)
- [Performance Testing](performance.md)
- [Deployment](deployment.md)
- [Troubleshooting](troubleshooting.md)
- [Contributors](contributors.md)

## What this wiki covers

- What the backend does and which problem it solves.
- How to set up the project locally or with Docker.
- How the code is organized across routes, controllers, services, models, and middleware.
- Which REST and GraphQL entry points are available.
- How to run the k6 load tests and understand the performance setup.
- What to check when something fails during startup or runtime.

## Quick facts

- Runtime: Node.js + Express.
- Database: PostgreSQL through Sequelize.
- API styles: REST under `/api/v1` and GraphQL under `/graphql`.
- Docs: Swagger UI at `/api-docs` and generated JSON at `/swagger-output.json`.
- Performance tooling: k6 scenarios under `k6/scenarios/`.
