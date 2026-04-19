const express = require('express');
const subController = require("../controllers/subscriptionController");
const validate = require("../middlewares/validateMiddleware");
const { createSubscriptionSchema, updateCategorySubscriptionSchema, updateLocationSubscriptionSchema } = require("../validators/subscriptionValidator");
const authentication = require("../middlewares/auth"); 
const authorization = require("../middlewares/rolesAuthorize");
const router = express.Router();

//all are prtoceted (authentication and autherization)
router.use(authentication.checkAuth);
//create user subscription 
 router.post("/subscribe",authorization.authorizeRole("CITIZEN"),validate(createSubscriptionSchema), subController.createSubscription);
//delete all user subscriptions 
 router.delete("/unsubscribeAll/:userId",authorization.authorizeRole("CITIZEN"), subController.deleteSubscription);
// delete user category subscription 
 router.delete("/unsubscribe/category",authorization.authorizeRole("CITIZEN","ADMIN","MODERATOR"), subController.deleteCategorySubscription);
// delete user location subscription
 router.delete("/unsubscribe/location",authorization.authorizeRole("CITIZEN","ADMIN","MODERATOR"), subController.deleteLocationSubscription);
// update user category subscription
 router.put("/update/category",authorization.authorizeRole("CITIZEN"),validate(updateCategorySubscriptionSchema), subController.updateCategorySubscription);
// update user location subscription
 router.put("/update/location",authorization.authorizeRole("CITIZEN"),validate(updateLocationSubscriptionSchema), subController.updateLocationSubscription);
//get user subscriptions 
router.get("/showSubscriptions/:userId",authorization.authorizeRole("ADMIN","MODERATOR","CITIZEN"), subController.getUserSubscriptions);

module.exports = router;