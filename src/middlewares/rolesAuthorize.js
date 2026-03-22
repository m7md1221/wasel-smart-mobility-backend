const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("User found in request:", req.user);
    // check if user exists and  has a role
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({
        
        message: "Unauthorized: No user data or role found"
      });
    }

    // Check if the role is allowed
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Forbidden: You do not have the required permissions"
      });
    }

    next();
  };
};

module.exports = { authorizeRole };