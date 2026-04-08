const Validator = require('fastest-validator');
const incidents = require('../constants/incidents');
const v = new Validator();

const ALLOWED_CATEGORIES = [
  incidents.CLOSURE,
  incidents.DELAY,
  incidents.ACCIDENT,
  incidents.WEATHER_HAZARD
];

const createSubscriptionSchema = {
  $$strict: "remove",

  category: {
    type: "string",
    optional: false,
    empty: false,
    custom: (value, errors, schema, name, parent) => {
      const normalized = String(value).trim().toUpperCase();

      if (!ALLOWED_CATEGORIES.includes(normalized)) {
        errors.push({
          type: "enumValue",
          field: "category",
          actual: value,
          expected: ALLOWED_CATEGORIES,
          message: `Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}`
        });
      }

      parent.category = normalized;
      return normalized;
    }
  },

  latitude: {
    type: "number",
    optional: false
  },

  longitude: {
    type: "number",
    optional: false
  },

  radius_km: {
    type: "number",
    optional: false,
    positive: true
  },

  $$custom(obj, errors) {
    const hasCategory =
      typeof obj.category === "string" && obj.category.trim() !== "";

    const hasLocation =
      obj.latitude !== undefined &&
      obj.longitude !== undefined &&
      obj.radius_km !== undefined;

    if (!hasCategory || !hasLocation) {
      errors.push({
        type: "required",
        field: "category",
        message: "Subscription requires both category and location fields"
      });
    }

    return obj;
  }
};

const updateCategorySubscriptionSchema = {
  $$strict: true,

  subscriptionId: { type: "number", positive: true },
  newCategory: { type: "string", empty: false }
};

const updateLocationSubscriptionSchema = {
  $$strict: true,

  subscriptionId: { type: "number", positive: true },

  newLatitude: { type: "number" },
  newLongitude: { type: "number" },
  newRadius: { type: "number", positive: true }
};
module.exports = {
  v,
  createSubscriptionSchema,
  updateCategorySubscriptionSchema,
  updateLocationSubscriptionSchema
};
