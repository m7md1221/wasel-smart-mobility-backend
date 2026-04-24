# GraphQL API

GraphQL is mounted at `/graphql` using `graphql-http`.

## What it provides

- Read-only access to core backend data.
- JWT-aware request context.
- Role checks that mirror the REST authorization rules.
- Clean error formatting without exposing stack traces to clients.

## Main files

- `src/graphql/index.js`
- `src/graphql/typeDefs.js`
- `src/graphql/resolvers.js`
- `src/graphql/auth.js`

## Authentication model

- If a request includes `Authorization: Bearer <token>`, the token is decoded into the GraphQL context.
- Resolvers that need login call `requireAuth(context)`.
- Resolvers that need a specific role call `requireRole(user, [...roles])`.
- Public resolvers continue to work without a token.

## Available query groups

- Health check.
- User profile and user listing.
- Reports, report statistics, comments, audit trail, moderation queue, and duplicate lookup.
- Checkpoints and checkpoint history.
- Incidents.
- Alerts.

## Important note

At the moment the GraphQL layer is read-only. There are no mutations in the schema yet.
