'use strict';

/**
 * graphql/auth.js
 *
 * Re-uses the same JWT verification logic that the REST middleware uses
 * (`src/middlewares/auth.js`) so there is a single source of truth.
 *
 * Usage inside resolvers:
 *   const user = requireAuth(context);          // throws if not authenticated
 *   requireRole(user, ['ADMIN', 'MODERATOR']);  // throws if role not allowed
 */

const jwt = require('jsonwebtoken');

/**
 * Verify the Authorization header that was forwarded into the GraphQL context
 * and return the decoded JWT payload.
 *
 * Throws a plain Error (which graphql-http will surface as a GraphQL error)
 * rather than calling res.status(), keeping resolvers framework-agnostic.
 */
function verifyToken(authHeader) {
  if (!authHeader) {
    throw new Error('UNAUTHENTICATED: Missing authorization header');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new Error('UNAUTHENTICATED: Expected format: Bearer <token>');
  }

  const token = parts[1];

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    throw new Error(`UNAUTHENTICATED: ${e.message}`);
  }
}

/**
 * Build the GraphQL context object from the incoming HTTP request.
 * Called once per request by the graphql-http handler.
 *
 * Returns { user } where user is the decoded JWT payload,
 * or { user: null } when no / invalid token is provided (public queries work
 * without auth — individual resolvers call requireAuth() when needed).
 */
function buildContext(req) {
  const authHeader = req.headers && req.headers.authorization;

  if (!authHeader) {
    return { user: null };
  }

  try {
    const user = verifyToken(authHeader);
    return { user };
  } catch (_) {
    // Invalid token — pass null; resolvers that need auth will throw.
    return { user: null };
  }
}

/**
 * Assert that a valid authenticated user exists in context.
 * Call at the top of any resolver that requires login.
 */
function requireAuth(context) {
  if (!context.user) {
    throw new Error('UNAUTHENTICATED: You must be logged in to perform this action');
  }
  return context.user;
}

/**
 * Assert that the authenticated user has at least one of the allowed roles.
 * Call after requireAuth().
 *
 * @param {object} user        - Decoded JWT payload (has .role property)
 * @param {string[]} allowed   - e.g. ['ADMIN', 'MODERATOR']
 */
function requireRole(user, allowed) {
  if (!allowed.includes(user.role)) {
    throw new Error(`FORBIDDEN: Requires one of roles: ${allowed.join(', ')}`);
  }
}

module.exports = { buildContext, requireAuth, requireRole };
