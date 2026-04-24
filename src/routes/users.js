const express = require('express');
const usersController = require("../controllers/userController");
const validate = require("../middlewares/validateMiddleware");
const { createUserSchema, updateUserSchema } = require("../validators/userValidator");
const authentication = require("../middlewares/auth"); 
const authorization = require("../middlewares/rolesAuthorize");
const router = express.Router();
//punlic routes
// signup
router.post("/signup", validate(createUserSchema), (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Register a new user'
  // #swagger.description = 'Creates a new user account with name, email, password, and role.'

  /* #swagger.requestBody = {
        required: true,
        schema: {
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
          role: "CITIZEN"
        }
  } */

  /* #swagger.responses[201] = {
        description: 'User created successfully'
  } */

  /* #swagger.responses[400] = {
        description: 'User already exists'
  } */

  /* #swagger.responses[500] = {
        description: 'Server error'
  } */

  return usersController.signup(req, res, next);
});
// login
router.post("/login", (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Login a user'
  // #swagger.description = 'logins user in the system by entering email and password, and returns JWT token'

  /* #swagger.requestBody = {
        required: true,
        schema: {
          email: "john@example.com",
          password: "password123"
        }
  } */

  /* #swagger.responses[200] = {
        description: 'Authentication successful',
        schema: {
          message: "Authentication successful",
          token: "JWT_TOKEN",
          user: {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "CITIZEN"
          }
        }
  } */

  /* #swagger.responses[401] = {
        description: 'Invalid parameters'
  } */

  /* #swagger.responses[403] = {
        description: 'Account is inactive'
  } */

  /* #swagger.responses[500] = {
        description: 'Server error'
  } */

  return usersController.login(req, res, next);
});

//authenticated routes
//get my profile
router.get("/myprofile", authentication.checkAuth, (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Get my profile'
  // #swagger.description = 'Returns the profile of the authenticated user'
  // #swagger.security = [{ BearerAuth: [] }]

  /* #swagger.responses[200] = {
        description: 'Profile found successfully',
  } */

  /* #swagger.responses[404] = {
        description: 'user not found'
}*/        
        /* #swagger.responses[500] = {
        description: 'Server error'
    } */

  return usersController.myProfile(req, res, next);
});

//protected routes
//update user
router.put(
  "/:id",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN", "CITIZEN"),
  validate(updateUserSchema),
  (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Update user'
    // #swagger.description = 'Admin can update any user, Citizen can update their own data'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          type: 'integer',
          description: 'User ID'
    } */

    /* #swagger.requestBody = {
          required: true,
          schema: {
            name: "Updated Name",
            email: "updated@email.com"
          }
    } */

    /* #swagger.responses[200] = {
          description: 'User updated successfully'
    } */

    /* #swagger.responses[404] = {
          description: 'User not found'
    } */

    return usersController.updateUser(req, res, next);
  }
);

//admin only
//create user
router.post(
  "/",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN"),
  validate(createUserSchema),
  (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Admin creates a user'
    // #swagger.description = 'Admin creates new user by entering user's name,email,password,role,confidence score,activation status and authorization status'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.requestBody = {
          required: true,
          schema: {
            name: "Admin Created User",
            email: "user@email.com",
            password: "password123",
            role: "CITIZEN",
            confidence_score: 50,
            is_active: true,
            is_authorized: false
          }
    } */

    /* #swagger.responses[201] = {
          description: 'User created successfully'
    } */
    /* #swagger.responses[400] = {
          description: 'User with this email already exists'
    } */
   /* #swagger.responses[500] = {
          description: 'Error creating user'
    } */


    return usersController.addUser(req, res, next);
  }
);
//delete user
router.delete(
  "/:id",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN"),
  (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Delete user'
    // #swagger.description = 'Admin deletes a user permanently'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          type: 'integer'
    } */

    /* #swagger.responses[200] = {
          description: 'User deleted successfully'
    } */
    /* #swagger.responses[400] = {
          description: 'Invalid user ID'
    } */
   /* #swagger.responses[404] = {
          description: 'User not found'
    } */
   /* #swagger.responses[500] = {
          description: 'Error deleteing user'
    } */
    return usersController.deleteUser(req, res, next);
  }
);
//deactivate user
router.post(
  "/deactivate/:id",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN"),
  (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Deactivate user'
    //#swagger.description = 'Admin deactivates the user , the user can't use any feature in the system.An admin can deactivate citizens,moderators, and admins'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          type: 'integer'
    } */
   /* #swagger.responses[400] = {
          description: 'Invalid user ID'
    } */
   /* #swagger.responses[404] = {
          description: 'User not found'
    } */
   /* #swagger.responses[400] = {
          description: 'User is already deactivated'
    } */
   /* #swagger.responses[500] = {
          description: 'Error deactivating user'
    } */
   /* #swagger.responses[200] = {
          description: 'User deactivated successfully'
    } */
   return usersController.deactivateUser(req, res, next);
  }
);
//activate user
router.post(
  "/activate/:id",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN"),
  (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Activate user'
    //#swagger.description= ' Admin activates any user in the system ,an admin can activate citizens,moderators, and admins'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          type: 'integer'
    } */
      /* #swagger.responses[400] = {
          description: 'Invalid user ID'
    } */
   /* #swagger.responses[404] = {
          description: 'User not found'
    } */
   /* #swagger.responses[400] = {
          description: 'User is already activated'
    } */
   /* #swagger.responses[500] = {
          description: 'Error activating user'
    } */
   /* #swagger.responses[200] = {
          description: 'User activated successfully'
    } */
    return usersController.activateUser(req, res, next);
  }
);
//admin and moderator
//get user by id
router.get(
  "/:id",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN", "MODERATOR"),
  (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Get user by ID'
    //swagger.description = ' Admin and moderator retrieve user's info by ID'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          type: 'integer'
    } */

    return usersController.showUserInfo(req, res, next);
  }
);


// get all users
router.get(
  "/",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN", "MODERATOR"),
  (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Get all users'
    //swagger.description = ' Admin and moderator retrieve all users' info'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.responses[200] = {
          description: 'List of users'
    } */
    /* #swagger.responses[404] = {
          description: 'users not found'
    } */
    /* #swagger.responses[500] = {
          description: 'Error fetching users'
    } */

    return usersController.showAllUsers(req, res, next);
  }
);
 module.exports = router;


 















