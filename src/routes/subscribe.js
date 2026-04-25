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
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Subscription created successfully" },
              data: { type: "object" }
            }
          },
          example: {
            success: true,
            message: "Subscription created successfully",
            data: { id: 1 }
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Invalid subscription data or subscription already exists" }
            }
          },
          example: {
            success: false,
            message: "Invalid subscription data or subscription already exists"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Missing or invalid token" }
            }
          },
          example: {
            success: false,
            message: "Missing or invalid token"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Forbidden - only citizens can create subscriptions" }
            }
          },
          example: {
            success: false,
            message: "Forbidden - only citizens can create subscriptions"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Server error while creating subscription" }
            }
          },
          example: {
            success: false,
            message: "Server error while creating subscription"
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
              success: { type: "boolean", example: true },
              message: { type: "string", example: "All subscriptions deleted successfully" },
              data: { type: "object" }
            }
          },
          example: {
            success: true,
            message: "All subscriptions deleted successfully",
            data: { id: 1 }
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "No subscriptions found for this user" }
            }
          },
          example: {
            success: false,
            message: "No subscriptions found for this user"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Missing or invalid token" }
            }
          },
          example: {
            success: false,
            message: "Missing or invalid token"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Forbidden - only citizens can delete subscriptions" }
            }
          },
          example: {
            success: false,
            message: "Forbidden - only citizens can delete subscriptions"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Server error while deleting subscription" }
            }
          },
          example: {
            success: false,
            message: "Server error while deleting subscription"
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
                 success: { type: "boolean", example: true },
                 message: { type: "string", example: "Category subscription deleted successfully" },
                 data: { type: "object" }
               }
             },
             example: {
               success: true,
               message: "Category subscription deleted successfully",
               data: { id: 1 }
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Subscription not found" }
            }
          },
          example: {
            success: false,
            message: "Subscription not found"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Missing or invalid token" }
            }
          },
          example: {
            success: false,
            message: "Missing or invalid token"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Forbidden" }
            }
          },
          example: {
            success: false,
            message: "Forbidden"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Server error while deleting subscription" }
            }
          },
          example: {
            success: false,
            message: "Server error while deleting subscription"
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
                 success: { type: "boolean", example: true },
                 message: { type: "string", example: "Location subscription deleted successfully" },
                 data: { type: "object" }
               }
             },
             example: {
               success: true,
               message: "Location subscription deleted successfully",
               data: { id: 1 }
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Subscription not found" }
            }
          },
          example: {
            success: false,
            message: "Subscription not found"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Missing or invalid token" }
            }
          },
          example: {
            success: false,
            message: "Missing or invalid token"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Forbidden" }
            }
          },
          example: {
            success: false,
            message: "Forbidden"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Server error while deleting subscription" }
            }
          },
          example: {
            success: false,
            message: "Server error while deleting subscription"
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
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Category subscription updated successfully" },
              data: { type: "object" }
            }
          },
          example: {
            success: true,
            message: "Category subscription updated successfully",
            data: { id: 1 }
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Invalid update request" }
            }
          },
          example: {
            success: false,
            message: "Invalid update request"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Subscription not found" }
            }
          },
          example: {
            success: false,
            message: "Subscription not found"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Missing or invalid token" }
            }
          },
          example: {
            success: false,
            message: "Missing or invalid token"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Forbidden" }
            }
          },
          example: {
            success: false,
            message: "Forbidden"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Server error while updating subscription" }
            }
          },
          example: {
            success: false,
            message: "Server error while updating subscription"
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
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Location subscription updated successfully" },
              data: { type: "object" }
            }
          },
          example: {
            success: true,
            message: "Location subscription updated successfully",
            data: { id: 1 }
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Invalid update request" }
            }
          },
          example: {
            success: false,
            message: "Invalid update request"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Subscription not found" }
            }
          },
          example: {
            success: false,
            message: "Subscription not found"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Missing or invalid token" }
            }
          },
          example: {
            success: false,
            message: "Missing or invalid token"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Forbidden" }
            }
          },
          example: {
            success: false,
            message: "Forbidden"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Server error while updating subscription" }
            }
          },
          example: {
            success: false,
            message: "Server error while updating subscription"
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
                 success: { type: "boolean", example: true },
                 message: { type: "string", example: "User subscriptions retrieved successfully" },
                 data: { type: "object" }
               }
             },
             example: {
               success: true,
               message: "User subscriptions retrieved successfully",
               data: { id: 1 }
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Server error while retrieving subscription" }
            }
          },
          example: {
            success: false,
            message: "Server error while retrieving subscription"
          }
        }
      }
} */
    return
 subController.getUserSubscriptions(req,res,next)});

module.exports = router;