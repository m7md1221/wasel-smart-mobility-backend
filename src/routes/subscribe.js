const express = require('express');
const subController = require("../controllers/subscriptionController");
const validate = require("../middlewares/validateMiddleware");
const { createSubscriptionSchema, updateCategorySubscriptionSchema, updateLocationSubscriptionSchema } = require("../validators/subscriptionValidator");
const authentication = require("../middlewares/auth"); 
const authorization = require("../middlewares/rolesAuthorize");
const router = express.Router();

//all are prtoceted (authentication and autherization)
router.use(authentication.checkAuth);


// create user subscription
router.post(
  "/subscribe",
  authorization.authorizeRole("CITIZEN"),
  validate(createSubscriptionSchema),
  (req, res, next) => {
    // #swagger.tags = ['Alert Subscriptions']
    // #swagger.summary = 'Create a new alert subscription'
    // #swagger.description = 'Authenticated Citizen creates a new alert subscription using category and geographic details.'
    // #swagger.security = [{ BearerAuth: [] }]

/* #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["category", "latitude", "longitude", "radius_km"],
            properties: {
              category: { type: "string", example: "CLOSURE" },
              latitude: { type: "number", example: 31.9522 },
              longitude: { type: "number", example: 35.2332 },
              radius_km: { type: "number", example: 5 }
            }
          }
        }
      }
} */

/* #swagger.responses[201] = {
      description: 'Subscription created successfully',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Subscription created successfully"
              },
              data: {
                type: "object",
                properties: {
                  subscriptionId: { type: "integer", example: 1 },
                  userId: { type: "integer", example: 3 },
                  category: { type: "string", example: "CLOSURE" },
                  latitude: { type: "number", example: 31.9522 },
                  longitude: { type: "number", example: 35.2332 },
                  radius_km: { type: "number", example: 5 },
                  createdAt: {
                    type: "string",
                    example: "2026-04-25T10:00:00.000Z"
                  }
                }
              }
            }
          }
        }
      }
} */

/* #swagger.responses[400] = {
      description: 'Invalid subscription data or subscription already exists',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Subscription already exists for this user"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[401] = {
      description: 'Missing or invalid token',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Invalid authorization header format"
              },
              error: {
                type: "string",
                example: "Expected format: Bearer <token>"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[403] = {
      description: 'Forbidden - only citizens can create subscriptions',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Forbidden: You do not have the required permissions"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[500] = {
      description: 'Server error while creating subscription',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Error creating subscription for this user"
              }
            }
          }
        }
      }
} */

    return subController.createSubscription(req, res, next);
  }
);


//delete all user subscriptions 
 router.delete("/unsubscribeAll/:userId",authorization.authorizeRole("CITIZEN"),(req, res, next) => {
  // #swagger.tags = ['Alert Subscriptions']
    // #swagger.summary = 'Delete all alert subscriptions'
    // #swagger.description = 'Deletes all alert subscriptions for a specific user.'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.parameters['userId'] = {
          in: 'path',
          required: true,
          type: 'integer',
          description: 'User ID whose subscriptions will be deleted'
    } */

/* #swagger.responses[200] = {
      description: 'All subscriptions deleted successfully',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "All subscriptions deleted successfully"
              },
              deletedCount: {
                type: "integer",
                example: 3
              }
            }
          }
        }
      }
} */

/* #swagger.responses[404] = {
      description: 'No subscriptions found for this user',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "No subscriptions found for this user"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[401] = {
      description: 'Missing or invalid token',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Invalid authorization header format"
              },
              error: {
                type: "string",
                example: "Expected format: Bearer <token>"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[403] = {
      description: 'Forbidden - only citizens can delete subscriptions',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Forbidden: You do not have the required permissions"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[500] = {
      description: 'Server error while deleting subscription',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "server error message"
              }
            }
          }
        }
      }
} */
    return subController.deleteSubscription(req, res, next);
  });

// delete user category subscription 
 router.delete("/unsubscribe/category",authorization.authorizeRole("CITIZEN","ADMIN","MODERATOR"),(req, res, next) => {
     // #swagger.tags = ['Alert Subscriptions']
    // #swagger.summary = 'Delete category subscription'
    // #swagger.description = 'Deletes a specific alert subscription based on user ID and category.'
    // #swagger.security = [{ BearerAuth: [] }]

/* #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["userId", "category"],
            properties: {
              userId: { type: "integer", example: 3 },
              category: { type: "string", example: "CLOSURE" }
            }
          }
        }
      }
} */
   /* #swagger.responses[200] = {
      description: 'Category subscription deleted successfully',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "subscription deleted successfully"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[404] = {
      description: 'Subscription not found',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Subscription not found"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[401] = {
      description: 'Missing or invalid token',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Invalid authorization header format"
              },
              error: {
                type: "string",
                example: "Expected format: Bearer <token>"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[403] = {
      description: 'Forbidden',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Forbidden: You do not have the required permissions"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[500] = {
      description: 'Server error while deleting subscription',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "server error message"
              }
            }
          }
        }
      }
} */
    return subController.deleteCategorySubscription(req, res, next);
  });

// delete user location subscription
 router.delete("/unsubscribe/location",authorization.authorizeRole("CITIZEN","ADMIN","MODERATOR"),(req, res, next) => {
// #swagger.tags = ['Alert Subscriptions']
    // #swagger.summary = 'Delete location subscription'
    // #swagger.description = 'Deletes a specific alert subscription based on user ID, latitude, longitude, and radius.'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["userId", "latitude", "longitude", "radius_km"],
                properties: {
                  userId: { type: "integer", example: 3 },
                  latitude: { type: "number", example: 31.9522 },
                  longitude: { type: "number", example: 35.2332 },
                  radius_km: { type: "number", example: 5 }
                }
              }
            }
          }
    } */

   /* #swagger.responses[200] = {
      description: 'Location subscription deleted successfully',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "subscription deleted successfully"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[404] = {
      description: 'Subscription not found',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Subscription not found"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[401] = {
      description: 'Missing or invalid token',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Invalid authorization header format"
              },
              error: {
                type: "string",
                example: "Expected format: Bearer <token>"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[403] = {
      description: 'Forbidden',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Forbidden: You do not have the required permissions"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[500] = {
      description: 'Server error while deleting subscription',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "server error message"
              }
            }
          }
        }
      }
} */
    return subController.deleteLocationSubscription(req, res, next);
  });

// update user category subscription
 router.put("/update/category",authorization.authorizeRole("CITIZEN"),validate(updateCategorySubscriptionSchema),(req, res, next) => {
 // #swagger.tags = ['Alert Subscriptions']
    // #swagger.summary = 'Update category subscription'
    // #swagger.description = 'Updates the category of a specific subscription for the authenticated citizen.'
    // #swagger.security = [{ BearerAuth: [] }]

   /* #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["subscriptionId", "newCategory"],
            properties: {
              subscriptionId: { type: "integer", example: 1 },
              newCategory: { type: "string", example: "DELAY" }
            }
          }
        }
      }
} */
/* #swagger.responses[200] = {
      description: 'Category subscription updated successfully',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Category subscription updated"
              },
              subscription: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  user_id: { type: "integer", example: 3 },
                  category: { type: "string", example: "DELAY" },
                  latitude: { type: "number", example: 31.9522 },
                  longitude: { type: "number", example: 35.2332 },
                  radius_km: { type: "number", example: 5 }
                }
              }
            }
          }
        }
      }
} */

/* #swagger.responses[400] = {
      description: 'Invalid update request',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User is already subscribed to this category"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[404] = {
      description: 'Subscription not found',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Subscription not found"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[401] = {
      description: 'Missing or invalid token',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Invalid authorization header format"
              },
              error: {
                type: "string",
                example: "Expected format: Bearer <token>"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[403] = {
      description: 'Forbidden',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Forbidden: You do not have the required permissions"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[500] = {
      description: 'Server error while updating subscription',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "server error message"
              }
            }
          }
        }
      }
} */
     return
  subController.updateCategorySubscription(req,res,next)});

// update user location subscription
 router.put("/update/location",authorization.authorizeRole("CITIZEN"),validate(updateLocationSubscriptionSchema),(req, res, next) => {
 // #swagger.tags = ['Alert Subscriptions']
    // #swagger.summary = 'Update location subscription'
    // #swagger.description = 'Updates the geographic details of a specific subscription for the authenticated citizen.'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["subscriptionId", "newLatitude", "newLongitude", "newRadius"],
                properties: {
                  subscriptionId: { type: "integer", example: 1 },
                  newLatitude: { type: "number", example: 31.9522 },
                  newLongitude: { type: "number", example: 35.2332 },
                  newRadius: { type: "number", example: 10 }
                }
              }
            }
          }
    } */

/* #swagger.responses[200] = {
      description: 'Location subscription updated successfully',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Location subscription updated"
              },
              subscription: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  user_id: { type: "integer", example: 3 },
                  category: { type: "string", example: "CLOSURE" },
                  latitude: { type: "number", example: 31.9522 },
                  longitude: { type: "number", example: 35.2332 },
                  radius_km: { type: "number", example: 10 }
                }
              }
            }
          }
        }
      }
} */

/* #swagger.responses[400] = {
      description: 'Invalid update request',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User is already subscribed to this location"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[404] = {
      description: 'Subscription not found',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Subscription not found"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[401] = {
      description: 'Missing or invalid token',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Invalid authorization header format"
              },
              error: {
                type: "string",
                example: "Expected format: Bearer <token>"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[403] = {
      description: 'Forbidden',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Forbidden: You do not have the required permissions"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[500] = {
      description: 'Server error while updating subscription',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "server error message"
              }
            }
          }
        }
      }
} */
    return subController.updateLocationSubscription(req, res, next);
  });
  
//get user subscriptions 
router.get("/showSubscriptions/:userId",authorization.authorizeRole("ADMIN","MODERATOR","CITIZEN"),(req, res, next) => {
    // #swagger.tags = ['Alert Subscriptions']
    // #swagger.summary = 'Get all alert subscriptions for a specific user'
    // #swagger.description = 'Gets all alert subscriptions for a specific user(Admin and Moderator can view any user subscriptions, Citizen can view their own subscriptions)'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.parameters['userId'] = {
          in: 'path',
          required: true,
          type: 'integer',
          description: 'User ID whose subscriptions will be retrieved'
    } */

   /* #swagger.responses[200] = {
      description: 'User subscriptions retrieved successfully',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User subscriptions retrieved successfully"
              },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    subscriptionId: { type: "integer", example: 1 },
                    userId: { type: "integer", example: 3 },
                    category: { type: "string", example: "CLOSURE" },
                    latitude: { type: "number", example: 31.9522 },
                    longitude: { type: "number", example: 35.2332 },
                    radius_km: { type: "number", example: 5 },
                    createdAt: {
                      type: "string",
                      example: "2026-04-25T10:00:00.000Z"
                    }
                  }
                }
              }
            }
          }
        }
      }
} */

/* #swagger.responses[500] = {
      description: 'Server error while retrieving subscription',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "server error message"
              }
            }
          }
        }
      }
} */
    return
 subController.getUserSubscriptions(req,res,next)});

module.exports = router;