const jwt = require("jsonwebtoken");

function checkAuth(req, res, next) {
  try {
    // Check if authorization header exists
    const authHeader = req.headers.authorization;

    console.log("🔍 DEBUG - Auth Header:", authHeader ? "EXISTS ✅" : "MISSING ❌");
    console.log("🔍 DEBUG - All Headers:", JSON.stringify(req.headers));

    if (!authHeader) {
      console.log("❌ Missing Authorization header");
      return res.status(401).json({
        message: "User not authenticated",
        error: "Authorization header is missing. Use: Authorization: Bearer <token>"
      });
    }

    // Check Bearer format (case-insensitive)
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      console.log("❌ Invalid Authorization format - must start with 'Bearer '");
      return res.status(401).json({
        message: "User not authenticated",
        error: "Invalid Authorization header format. Use: Bearer <token>"
      });
    }

    // Extract token (handle case-insensitivity and extra spaces)
    const token = authHeader.slice(7).trim();

    console.log("🔍 DEBUG - Token extracted:", token ? "YES ✅" : "NO ❌");
    console.log("🔍 DEBUG - Token length:", token.length);

    if (!token || token.length === 0) {
      console.log("❌ Token is empty");
      return res.status(401).json({
        message: "User not authenticated",
        error: "Token is empty"
      });
    }

    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET not configured in environment variables");
      return res.status(500).json({
        message: "Server configuration error",
        error: "JWT_SECRET not configured"
      });
    }

    console.log("🔍 DEBUG - Verifying token with JWT_SECRET...");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified successfully");
    console.log("🔍 DEBUG - Decoded token:", decodedToken);

    // Ensure user object has both userId and id for compatibility
    req.user = {
      ...decodedToken,
      id: decodedToken.id || decodedToken.userId
    };

    console.log("🔍 DEBUG - req.user set to:", req.user);
    next();
  } catch (e) {
    console.error("❌ Auth Error:", e.name, e.message);

    // Handle different JWT errors
    if (e.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "User not authenticated",
        error: "Token has expired"
      });
    }

    if (e.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "User not authenticated",
        error: "Invalid token format"
      });
    }

    return res.status(401).json({
      message: "User not authenticated",
      error: e.message
    });
  }
}

module.exports = { checkAuth }; 

