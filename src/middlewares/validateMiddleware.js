 const { v } = require("../validators/userValidator");

const validate = (schema) => {
  return (req, res, next) => {
    const validationResponse = v.validate(req.body, schema);

    if (validationResponse !== true) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationResponse
      });
    }

    next();
  };
};

module.exports = validate;


