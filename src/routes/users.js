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
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["name", "email", "password"],
            properties: {
              name: {
                type: "string",
                example: "John Doe"
              },
              email: {
                type: "string",
                example: "john@example.com"
              },
              password: {
                type: "string",
                example: "password123"
              },
              role: {
                type: "string",
                example: "CITIZEN"
              }
            }
          }
        }
      }
} */

  /* #swagger.responses[201] = {
      description: 'User created successfully',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User created successfully"
              },
              user: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "example@email.com" },
                  role: { type: "string", example: "CITIZEN" },
                  confidence_score: { type: "integer", example: 50 },
                  is_active: { type: "boolean", example: true },
                  is_authorized: { type: "boolean", example: false }
                }
              }
            }
          }
        }
      }
} */

/* #swagger.responses[400] = {
      description: 'User already exists',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User with this email already exists"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[500] = {
      description: 'Server error',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Error creating user"
              }
            }
          }
        }
      }
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
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "password"],
            properties: {
              email: {
                type: "string",
                example: "john@example.com"
              },
              password: {
                type: "string",
                example: "password123"
              }
            }
          }
        }
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
      description: 'Invalid credentials',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Invalid email or password"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[403] = {
      description: 'Account is inactive',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Account is inactive"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[500] = {
      description: 'Server error',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Error during authentication"
              }
            }
          }
        }
      }
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
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "profile found succesfully"
              },
              user: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "john@example.com" },
                  role: { type: "string", example: "CITIZEN" },
                  confidence_score: { type: "integer", example: 50 },
                  is_active: { type: "boolean", example: true },
                  is_authorized: { type: "boolean", example: false }
                }
              }
            }
          }
        }
      }
} */

/* #swagger.responses[404] = {
      description: 'User not found',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User not found"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[500] = {
      description: 'Server error',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Error fetching profile"
              }
            }
          }
        }
      }
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
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                example: "Updated Name"
              },
              email: {
                type: "string",
                example: "updated@email.com"
              }
            }
          }
        }
      }
} */

   /* #swagger.responses[200] = {
      description: 'User updated successfully',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User updated successfully"
              },
              user: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  name: { type: "string", example: "Updated Name" },
                  email: { type: "string", example: "updated@email.com" },
                  role: { type: "string", example: "CITIZEN" },
                  confidence_score: { type: "integer", example: 50 },
                  is_active: { type: "boolean", example: true },
                  is_authorized: { type: "boolean", example: false }
                }
              }
            }
          }
        }
      }
} */

/* #swagger.responses[404] = {
      description: 'User not found',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User not found"
              }
            }
          }
        }
      }
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
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["name", "email", "password"],
            properties: {
              name: {
                type: "string",
                example: "Admin Created User"
              },
              email: {
                type: "string",
                example: "user@email.com"
              },
              password: {
                type: "string",
                example: "password123"
              },
              role: {
                type: "string",
                example: "CITIZEN"
              },
              confidence_score: {
                type: "integer",
                example: 50
              },
              is_active: {
                type: "boolean",
                example: true
              },
              is_authorized: {
                type: "boolean",
                example: false
              }
            }
          }
        }
      }
} */
/* #swagger.responses[201] = {
      description: 'User created successfully',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User created successfully"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[400] = {
      description: 'User with this email already exists',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User with this email already exists"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[500] = {
      description: 'Error creating user',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Error creating user"
              }
            }
          }
        }
      }
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
      description: 'User deleted successfully',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User deleted successfully"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[400] = {
      description: 'Invalid user ID',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Invalid user ID"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[404] = {
      description: 'User not found',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User not found"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[500] = {
      description: 'Error deleting user',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Error deleting user"
              }
            }
          }
        }
      }
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
      description: 'Invalid user ID or user is already deactivated',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Invalid user ID"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[404] = {
      description: 'User not found',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User not found"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[500] = {
      description: 'Error deactivating user',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Error deactivating user"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[200] = {
      description: 'User deactivated successfully',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User deactivated successfully"
              }
            }
          }
        }
      }
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
      description: 'Invalid user ID or user is already active',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Invalid user ID"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[404] = {
      description: 'User not found',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User not found"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[500] = {
      description: 'Error activating user',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Error activating user"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[200] = {
      description: 'User activated successfully',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User activated successfully"
              }
            }
          }
        }
      }
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
    // #swagger.description = 'Admin and moderator retrieve user's info by ID'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          type: 'integer'
    } */
    /* #swagger.responses[200] = {
          description: 'User found successfully',
          content: {
            "application/json": {
              schema: { 
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "john@example.com" },
                  role: { type: "string", example: "CITIZEN" },
                  confidence_score: { type: "integer", example: 50 },   
                  is_active: { type: "boolean", example: true },
                  is_authorized: { type: "boolean", example: false }
                } 
              }
            }
          }
    } */

    /* #swagger.responses[404] = {
          description: 'User not found',
          content: {
            "application/json": {
              schema: { 
                type: "object",
                properties: {
                  message: { type: "string", example: "User not found" },
                }
              }
            }
          }
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
    // #swagger.description = 'Admin and moderator retrieve all users' info'
    // #swagger.security = [{ BearerAuth: [] }]

  /* #swagger.responses[200] = {
      description: 'List of users',
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                name: { type: "string", example: "John Doe" },
                email: { type: "string", example: "john@example.com" },
                role: { type: "string", example: "CITIZEN" },
                confidence_score: { type: "integer", example: 50 },
                is_active: { type: "boolean", example: true },
                is_authorized: { type: "boolean", example: false }
              }
            }
          }
        }
      }
} */

/* #swagger.responses[404] = {
      description: 'Users not found',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "No users found"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[500] = {
      description: 'Error fetching users',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Error fetching users"
              }
            }
          }
        }
      }
} */

    return usersController.showAllUsers(req, res, next);
  }
);
 module.exports = router;


 















