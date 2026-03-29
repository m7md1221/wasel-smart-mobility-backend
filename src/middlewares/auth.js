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
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message: "Invalid authorization header format",
        error: "Expected format: Bearer <token>"
      });
    }

    const token = parts[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch(e){
    return res.status(401).json({
      message: "Invalid or expired token",
      error: e.message
    });
  }
}

module.exports = { checkAuth }; 

