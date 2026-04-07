const Validator = require("fastest-validator");
const v = new Validator();

const validate = (schema) => {
  return (req, res, next) => {
     if (!req.body) req.body = {};
     req.body._check = true; 
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


