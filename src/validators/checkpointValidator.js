function validateCreateCheckpoint(data) {
  const errors = [];

  if (!data.name) errors.push("name is required");
  if (!data.latitude) errors.push("latitude is required");
  if (!data.longitude) errors.push("longitude is required");
  if(!data.city) errors.push("city is required");
  return errors;
}

module.exports = { validateCreateCheckpoint };