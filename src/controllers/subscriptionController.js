const AlertSubscription = require("../models/alertSubmodel");
const SubscriptionService = require("../services/subscriptionService");
const subscriptionService = new SubscriptionService();

exports.createSubscription = async (req, res) => {
  try {
    const userId = req.user.userId; // get id from authentication
    const { category, latitude, longitude, radius_km } = req.body;
   
    const sub = await subscriptionService.createSubscription(
      userId,
      category,
      latitude,
      longitude,
      radius_km
    );

    res.status(201).json({
      message: "Subscription created successfully",
      data: {
        subscriptionId: sub.id,
        userId: sub.user_id,
        category: sub.category,
        latitude: sub.latitude,
        longitude: sub.longitude,
        radius_km: sub.radius_km,
        createdAt: sub.createdAt
      }
    });
  } catch (err) {
    if (err.message === "Subscription already exists for this user" ||err.message === "Invalid subscription, provide category and geographic details")  {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.getUserSubscriptions = async (req, res) => {
  try {
    const subs = await subscriptionService.getUserSubscriptions(req.params.userId);
    res.status(200).json({
      message: "User subscriptions retrieved successfully",
      data: subs.map(sub => ({
        subscriptionId: sub.id,
         userId: sub.user_id,
        category: sub.category,
        latitude: sub.latitude,
        longitude: sub.longitude,
        radius_km: sub.radius_km,
        createdAt: sub.createdAt
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//delete all subscriptions 
exports.deleteSubscription = async (req, res) => {
  try {
    const userId = req.params.userId;
    const deletedCount = await subscriptionService.deleteSubscription(userId);

    //no susbscriptions for the user
    if (deletedCount === 0) {
      return res.status(404).json({
        message: "No subscriptions found for this user"
      });
    }
    res.json({
      message: "All subscriptions deleted successfully",
      deletedCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// delete subscription based on category
exports.deleteCategorySubscription = async (req, res) => {
  try {
    const { userId, category } = req.body;

    const deleted = await subscriptionService.deleteCategorySubscription(userId, category);

    if (!deleted) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    
    res.status(200).json({ message: "subscription deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//delete subscription based on location
exports.deleteLocationSubscription = async (req, res) => {
  try {
    const { userId, latitude, longitude, radius_km } = req.body;

    const deleted = await subscriptionService.deleteLocationSubscription(
      userId,
      latitude,
      longitude,
      radius_km
    );

    if (!deleted) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    
    res.status(200).json({ message: "subscription deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//update subscription category
exports.updateCategorySubscription = async (req, res) => {
  try {
    const userId = req.user.userId; // get id from authentication
    const { subscriptionId, newCategory } = req.body;

    const updated = await subscriptionService.updateCategorySubscription(
      userId,
      subscriptionId,
      newCategory
    );

    if (!updated) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json({
      message: "Category subscription updated",
      subscription: updated
    });
  } catch (err) {
    if (
      err.message === "User is already subscribed to this category" ||
      err.message === "Subscription is already set to this category" ||
      err.message === "This is not a category subscription"
    ) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};
//update subscription location
exports.updateLocationSubscription = async (req, res) => {
  try {
    const userId = req.user.userId; //get id from authentication 

    const {
      subscriptionId,
      newLatitude,
      newLongitude,
      newRadius
    } = req.body;

    const updated = await subscriptionService.updateLocationSubscription(
      userId,
      subscriptionId,
      newLatitude,
      newLongitude,
      newRadius
    );

    if (!updated) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json({ message: "Location subscription updated", subscription: updated });

  }  catch (err) {
    if (
      err.message === "User is already subscribed to this location" ||
      err.message === "Subscription is already set to this location" ||
      err.message === "latitude, longitude and radius_km must be defined"
    ) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

