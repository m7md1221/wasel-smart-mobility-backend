<<<<<<< HEAD
const jwt = require("jsonwebtoken");

function checkAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Missing authorization header",
        error: "No token provided"
      });
    }

    const parts = authHeader.split(" ");

=======
const jwt = require("jsonwebtoken"); 

function checkAuth(req, res, next){
  try{
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        message: "Missing authorization header",
        error: "No token provided"
      });
    }

    const parts = authHeader.split(" ");
>>>>>>> 9c0a8c0 (Feature 3: Route Estimation improvements - Add better API key handling, input validation, logging, and error messages)
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message: "Invalid authorization header format",
        error: "Expected format: Bearer <token>"
      });
    }

    const token = parts[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
<<<<<<< HEAD

    req.user = decodedToken;
    next();

  } catch (e) {
=======
    req.user = decodedToken;
    next();
  } catch(e){
>>>>>>> 9c0a8c0 (Feature 3: Route Estimation improvements - Add better API key handling, input validation, logging, and error messages)
    return res.status(401).json({
      message: "Invalid or expired token",
      error: e.message
    });
  }
}

<<<<<<< HEAD
function checkAdmin(req, res, next) {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Forbidden"
    });
  }
  next();
}
=======
module.exports = { checkAuth }; 
>>>>>>> 9c0a8c0 (Feature 3: Route Estimation improvements - Add better API key handling, input validation, logging, and error messages)

module.exports = { checkAuth, checkAdmin };