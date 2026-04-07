const Validator = require('fastest-validator');
const v = new Validator();

const createSubscriptionSchema = {
$$strict: "remove",

  category: { type: "string", optional: true, empty: false },
  latitude: { type: "number", optional: true },
  longitude: { type: "number", optional: true },
  radius_km: { type: "number", optional: true, positive: true },

  _check: {
    type: "boolean",
    optional: true,

    custom: (value, errors, schema, name, parent) => {

      const hasCategory = !!parent.category;

      const hasLocation =
        parent.latitude !== undefined &&
        parent.longitude !== undefined &&
        parent.radius_km !== undefined;

      // ❌ both provided
      if (hasCategory && hasLocation) {
        return [{
          type: "forbidden",
          field: "category",
          message: "Can't choose both category and location subscription at once"
        }];
      }

      // ❌ none provided
      if (hasCategory === undefined && hasLocation ===undefined) {
        return [{
          type: "required",
          field: "category",
          message: "Provide either category or location"
        }];
      }

      return value; // ✅ valid
    }
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
