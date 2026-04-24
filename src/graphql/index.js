'use strict';
const { createHandler } = require('graphql-http/lib/use/express');

const { typeDefs }  = require('./typeDefs');
const { resolvers } = require('./resolvers');
const { buildContext } = require('./auth');
const graphqlHandler = createHandler({
  schema: typeDefs,
  rootValue: resolvers,
  context: (req) => buildContext(req.raw),
  formatError(err) {
    const message = err.message || 'Internal server error';

    // Log server-side
    if (!message.startsWith('UNAUTHENTICATED') && !message.startsWith('FORBIDDEN') && !message.startsWith('NOT_FOUND')) {
      console.error('[GraphQL Error]', err.originalError || err);
    }
    // Return a clean error
    return {
      message,
      locations: err.locations,
      path: err.path,
    };
  },
});

module.exports = { graphqlHandler };
