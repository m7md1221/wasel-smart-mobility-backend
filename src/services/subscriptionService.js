  const Subscription = require("../models/alertSubmodel");

class SubscriptionService {
  async createSubscription(userId, category, latitude, longitude, radius_km) { 
     const normalizedCategory = String(category || "").trim().toUpperCase();
     if ( !normalizedCategory || latitude == null || longitude == null || radius_km == null)
   {throw new Error("Invalid subscription, provide category and geographic details");}
      const existingSubscription = await Subscription.findOne({
    where: {
      user_id: userId,
      category,
      latitude,
      longitude,
      radius_km
    }
  });

  if (existingSubscription) {
    throw new Error("Subscription already exists for this user");
  }

  return await Subscription.create({
    user_id: userId,
    category : normalizedCategory,
    latitude,
    longitude,
    radius_km
  });
  
  }

  async getUserSubscriptions(userId) {
    return await Subscription.findAll({ where: { user_id: userId } });
  }

  //delete all subscriptions for a user 
  async deleteSubscription(userId) {
      const deletedCount = await Subscription.destroy({
    where: {
      user_id: userId
    }
  });
  return deletedCount;
  }
  
  //delete subscription for a user based on category 
  async deleteCategorySubscription(userId, category) {
    const normalizedCategory = String(category || "").trim().toUpperCase();
    return await Subscription.destroy({
      where: {
        user_id: userId,
        category: normalizedCategory
      }
    });
  }

  // delete  subscription for a user based on location 
  async deleteLocationSubscription(userId, latitude, longitude, radius_km) {
    return await Subscription.destroy({
      where: {
        user_id: userId,
        latitude: latitude,
        longitude: longitude,
        radius_km: radius_km
      }
    });
  }

  //update category subscription 
  async updateCategorySubscription(userId, subscriptionId, newCategory) {
     const normalizedCategory = String(newCategory || "").trim().toUpperCase();
  const subscription = await Subscription.findOne({
    where: {
      id: subscriptionId,
      user_id: userId
    }
  });

  if (!subscription) return null;
  if (!subscription.normalizedCategory) {
    throw new Error("This is not a category subscription");
  }
   if (subscription.category === normalizedCategory) {
    throw new Error("Subscription is already set to this category");
  }
   const existingSubscription = await Subscription.findOne({
    where: {
      user_id: userId,
      category: normalizedCategory
    }
  });
  if (existingSubscription) {
    throw new Error("User is already subscribed to this category");
  }
  subscription.category = normalizedCategory;
  await subscription.save();

  return subscription;
}
//update location subscription
async updateLocationSubscription(
  userId,
  subscriptionId,
  newLatitude,
  newLongitude,
  newRadius
) {
  const subscription = await Subscription.findOne({
    where: {
      id: subscriptionId,
      user_id: userId
    }
  });

  if (!subscription) return null;

  if (subscription.latitude ==null || subscription.longitude ==null || subscription.radius_km ==null) {
    throw new Error("latitude, longitude and radius_km must be defined");
  }
 if (
    subscription.latitude === newLatitude &&
    subscription.longitude === newLongitude &&
    subscription.radius_km === newRadius
  ) {
    throw new Error("Subscription is already set to this location");
  }
  const existingSubscription = await Subscription.findOne({
    where: {
      user_id: userId,
      latitude: newLatitude,
      longitude: newLongitude,
      radius_km: newRadius
    }
  });

  if (existingSubscription && existingSubscription.id !== subscription.id) {
    throw new Error("User is already subscribed to this location");
  }
  subscription.latitude = newLatitude;
  subscription.longitude = newLongitude;
  subscription.radius_km = newRadius;

  await subscription.save();

  return subscription;
}   
}
module.exports = SubscriptionService;