function validateCreateIncident(data) {
  const errors = [];

  const allowedCategories = ["closure", "delay", "accident", "weather_hazard", "other"];
  const allowedSeverities = ["low", "medium", "high", "critical"];

  if (!data.title) errors.push("title is required");
  if (!data.category) errors.push("category is required");
  if (!data.severity) errors.push("severity is required");
  if (!data.description) errors.push("description is required");
  if (!data.latitude) errors.push("latitude is required");
  if (!data.longitude) errors.push("longitude is required");
  if (!data.checkpoint_id) errors.push("checkpoint_id is required");

  if (data.category && !allowedCategories.includes(data.category)) {
    errors.push(`category must be one of: ${allowedCategories.join(", ")}`);
  }

  if (data.severity && !allowedSeverities.includes(data.severity)) {
    errors.push(`severity must be one of: ${allowedSeverities.join(", ")}`);
  }

  return errors;
}

module.exports = { validateCreateIncident };




