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
    // #swagger.summary = 'Create a new alert subscription for the authenticated citizen'
    // #swagger.security = [{ BearerAuth: [] }]
    return subController.createSubscription(req, res, next);
  }
);

//delete all user subscriptions 
 router.delete("/unsubscribeAll/:userId",authorization.authorizeRole("CITIZEN"),(req, res, next) => {
    // #swagger.tags = ['Alert Subscriptions']
    // #swagger.summary = 'Delete all alert subscriptions for the authenticated citizen'
    // #swagger.security = [{ BearerAuth: [] }]
    return subController.deleteSubscription(req, res, next);
  });
// delete user category subscription 
 router.delete("/unsubscribe/category",authorization.authorizeRole("CITIZEN","ADMIN","MODERATOR"),(req, res, next) => {
    // #swagger.tags = ['Alert Subscriptions']
    // #swagger.summary = 'Delete a specific alert subscription for the authenticated citizen based on category'
    // #swagger.security = [{ BearerAuth: [] }]
    return subController.deleteCategorySubscription(req, res, next);
  });
// delete user location subscription
 router.delete("/unsubscribe/location",authorization.authorizeRole("CITIZEN","ADMIN","MODERATOR"),(req, res, next) => {
    // #swagger.tags = ['Alert Subscriptions']
    // #swagger.summary = 'Delete a specific alert subscription for the authenticated citizen based on location'
    // #swagger.security = [{ BearerAuth: [] }]
    return subController.deleteLocationSubscription(req, res, next);
  });
// update user category subscription
 router.put("/update/category",authorization.authorizeRole("CITIZEN"),validate(updateCategorySubscriptionSchema),(req, res, next) => {
    // #swagger.tags = ['Alert Subscriptions']
    // #swagger.summary = 'Update category of a  specific alert subscription for the authenticated citizen'
    // #swagger.security = [{ BearerAuth: [] }]
     return
  subController.updateCategorySubscription});
// update user location subscription
 router.put("/update/location",authorization.authorizeRole("CITIZEN"),validate(updateLocationSubscriptionSchema),(req, res, next) => {
    // #swagger.tags = ['Alert Subscriptions']
    // #swagger.summary = 'Update location of a  specific alert subscription for the authenticated citizen'
    // #swagger.security = [{ BearerAuth: [] }]
    return subController.updateLocationSubscription(req, res, next);
  });
  
//get user subscriptions 
router.get("/showSubscriptions/:userId",authorization.authorizeRole("ADMIN","MODERATOR","CITIZEN"),(req, res, next) => {
    // #swagger.tags = ['Alert Subscriptions']
    // #swagger.summary = 'Get all alert subscriptions for a specific user (Admin and Moderator can view any user subscriptions, Citizen can view their own subscriptions)'
    // #swagger.security = [{ BearerAuth: [] }]
    return
 subController.getUserSubscriptions});

module.exports = router;