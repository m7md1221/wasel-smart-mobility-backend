const Validator = require('fastest-validator');
const incidents = require('../constants/incidents');
const v = new Validator();

const ALLOWED_CATEGORIES = [
  incidents.CLOSURE,
  incidents.DELAY,
  incidents.ACCIDENT,
  incidents.WEATHER_HAZARD
];

const createAlertSchema = {
  $$strict: "remove",

  incident_id: {
    type: "number",
    positive: true,
    integer: true,
    optional: false
  },

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

  message: {
    type: "string",
    optional: false,
    empty: false,
    min: 3,
    max: 500
  },

  latitude: {
    type: "number",
    optional: false,
    min: -90,
    max: 90
  },

  longitude: {
    type: "number",
    optional: false,
    min: -180,
    max: 180
  },

  $$custom(obj, errors) {
    const hasIncidentId = obj.incident_id !== undefined && obj.incident_id !== null;
    const hasCategory =
      typeof obj.category === "string" && obj.category.trim() !== "";
    const hasMessage =
      typeof obj.message === "string" && obj.message.trim() !== "";
    const hasLatitude = obj.latitude !== undefined && obj.latitude !== null;
    const hasLongitude = obj.longitude !== undefined && obj.longitude !== null;

    if (!hasIncidentId || !hasCategory || !hasMessage || !hasLatitude || !hasLongitude) {
      errors.push({
        type: "required",
        field: "alert",
        message: "Alert requires incident_id, category, message, latitude, and longitude"
      });
    }

    return obj;
  }
};

module.exports = {
  v,
  createAlertSchema
};