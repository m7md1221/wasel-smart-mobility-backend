const express = require('express');
const usersController = require("../controllers/userController");
const validate = require("../middlewares/validateMiddleware");
const { createUserSchema, updateUserSchema } = require("../validators/userValidator");
const authentication = require("../middlewares/auth"); 
const authorization = require("../middlewares/rolesAuthorize");
const router = express.Router();
//public routes(no authentication or autherization)
router.post("/signup", validate(createUserSchema), (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Register a new user'
  return usersController.signup(req, res, next);
});
router.post("/login",(req,res,next)=>{
 // #swagger.tags = ['Users']
 // #swagger.summary = 'Login a user'
 return usersController.login(req,res,next); 
});

// authenticated users
router.get("/myprofile", authentication.checkAuth, (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'The authenticated user can view their profile'
  // #swagger.security = [{ BearerAuth: [] }]
  return usersController.myProfile(req, res, next);
});

// protected routes (authentication and authorization) 
router.put(
  "/:id",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN", "CITIZEN"),
  validate(updateUserSchema),
  (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Update user information (Admin can update any user, Citizen can update their own information)'
    // #swagger.security = [{ BearerAuth: [] }]
    return usersController.updateUser(req, res, next);
  }
);
// admin only routes

//user creation 
router.post(
  "/",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN"),
  validate(createUserSchema),
  (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Admin creates a new user'
    // #swagger.security = [{ BearerAuth: [] }]
    return usersController.addUser(req, res, next);
  }
);

//user deletion 
router.delete(
  "/:id",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN"),
  (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Admin deletes a user'
    // #swagger.security = [{ BearerAuth: [] }]
    return usersController.deleteUser(req, res, next);
  }
);

//user deactivation
router.post(
  "/deactivate/:id",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN"),
  (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Admin deactivates a user'
    // #swagger.security = [{ BearerAuth: [] }]
    return usersController.deactivateUser(req, res, next);
  }
);

//user activation
router.post(
  "/activate/:id",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN"),
  (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Admin activates a user'
    // #swagger.security = [{ BearerAuth: [] }]
    return usersController.activateUser(req, res, next);
  }
);

// admin and moderator
//view user information
router.get(
  "/:id",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN", "MODERATOR"),
  (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Admin or moderator views a specific user'
    // #swagger.security = [{ BearerAuth: [] }]
    return usersController.showUserInfo(req, res, next);
  }
);
//view all users information
router.get(
  "/",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN", "MODERATOR"),
  (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Admin or moderator views all users'
    // #swagger.security = [{ BearerAuth: [] }]
    return usersController.showAllUsers(req, res, next);
  }
);
 module.exports = router;


 















