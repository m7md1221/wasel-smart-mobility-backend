# Architecture

## Request flow

1. `src/server.js` loads environment variables, creates the HTTP server, and starts listening.
2. `src/app.js` mounts middleware, REST routes, Swagger UI, the GraphQL handler, and the 404 fallback.
3. `src/routes/v1/index.js` aggregates the versioned REST routes.
4. Controllers call services and models.
5. Services execute the business logic and database queries.
6. Responses are returned as JSON.

## Layer map

- `src/routes/` - route definitions.
- `src/controllers/` - HTTP request handlers.
- `src/services/` - business logic and integrations.
- `src/models/` - Sequelize models.
- `src/middlewares/` - auth, role checks, and validation.
- `src/validators/` - request schemas.
- `src/graphql/` - GraphQL schema, resolvers, and auth helpers.
- `src/config/` - database and runtime configuration.

## Authentication flow

- REST endpoints use `src/middlewares/auth.js` for JWT verification.
- Role checks use `src/middlewares/rolesAuthorize.js`.
- GraphQL uses the same JWT concept through `src/graphql/auth.js`.
- Public endpoints remain available without a token.

## Data access

- PostgreSQL is accessed through Sequelize.
- `src/config/database.js` defines the connection.
- The codebase uses model-based queries and some raw SQL where joins are easier to express directly.
