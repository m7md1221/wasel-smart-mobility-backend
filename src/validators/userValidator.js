const Validator = require('fastest-validator');
const roles = require('../constants/roles');

const v = new Validator();

//user creation 
const createUserSchema = {
  name: { type: "string", min: 3, max: 30, empty: false, trim: true },
  email: { type: "email", empty: false, normalize: true },
  password: { type: "string", min: 6, empty: false },
  role: {
    type: "string",
    optional: true,
    enum: [ roles.CITIZEN, roles.MODERATOR,roles.ADMIN],
    uppercase: true 
  },

  confidence_score: {
    type: "number",
    optional: true,
    min: 0,
    max: 100,
    default: 0
  },

  is_active: {
    type: "boolean",
    optional: true,
    default: true
  },

  is_authorized: {
    type: "boolean",
    optional: true,
    default: false
  }
};

// user update
const updateUserSchema = {
  name: { type: "string", min: 3, max: 30, optional: true, trim: true },
  email: { type: "email", optional: true, normalize: true },
  password: { type: "string", min: 6, optional: true },
  role: {
    type: "string",
    optional: true,
    enum: [ roles.CITIZEN, roles.MODERATOR, roles.ADMIN ],
    uppercase: true
  },
  confidence_score: { type: "number", optional: true, min: 0, max: 100 },
  is_active: { type: "boolean", optional: true },
  is_authorized: { type: "boolean", optional: true }
};

module.exports = {
  v,
  createUserSchema,
  updateUserSchema
};