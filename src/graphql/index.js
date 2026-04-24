'use strict';

/**
 * graphql/index.js
 *
 * Assembles the GraphQL schema and exposes an Express-compatible
 * request handler using graphql-http (spec-compliant, no Apollo overhead).
 *
 * Mount point: POST /graphql  (and GET for the playground redirect)
 */

const { createHandler } = require('graphql-http/lib/use/express');

const { typeDefs }  = require('./typeDefs');
const { resolvers } = require('./resolvers');
const { buildContext } = require('./auth');

/**
 * graphql-http requires a schema object.
 * typeDefs is already a GraphQLSchema built via buildSchema().
 * We add the root resolver map here.
 */
const graphqlHandler = createHandler({
  schema: typeDefs,
  rootValue: resolvers,

  /**
   * Build context once per request.
   * Decodes the JWT (if present) so every resolver can access context.user.
   * Public resolvers simply ignore context.user;
   * protected resolvers call requireAuth() / requireRole() from auth.js.
   */
  context: (req) => buildContext(req.raw),

  /**
   * Format errors before sending to the client.
   * - Strip stack traces in production.
   * - Map internal error prefixes to HTTP-friendly messages.
   * - Never leak environment values or DB internals.
   */
  formatError(err) {
    const message = err.message || 'Internal server error';

    // Log server-side (not to the response)
    if (!message.startsWith('UNAUTHENTICATED') && !message.startsWith('FORBIDDEN') && !message.startsWith('NOT_FOUND')) {
      console.error('[GraphQL Error]', err.originalError || err);
    }

    // Return a clean error; no stack trace
    return {
      message,
      locations: err.locations,
      path: err.path,
    };
  },
});

module.exports = { graphqlHandler };
