const validate = (compiledSchema) => {
  return (req, res, next) => {
    // compiledSchema is already a compiled validator function
    const validationResult = compiledSchema(req.body);

    if (validationResult !== true) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationResult
      });
    }

    next();
  };
};

module.exports = validate;


