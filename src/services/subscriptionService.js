  const Subscription = require("../models/alertSubmodel");

class SubscriptionService {
  async createSubscription(userId, category, latitude, longitude, radius_km) { 
     if ( !category || latitude == null || longitude == null || radius_km == null)
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
    category,
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
    return await Subscription.destroy({
      where: {
        user_id: userId,
        category: category
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
  const subscription = await Subscription.findOne({
    where: {
      id: subscriptionId,
      user_id: userId
    }
  });

  if (!subscription) return null;
  if (!subscription.category) {
    throw new Error("This is not a category subscription");
  }
   if (subscription.category === newCategory) {
    throw new Error("Subscription is already set to this category");
  }
   const existingSubscription = await Subscription.findOne({
    where: {
      user_id: userId,
      category: newCategory
    }
  });
  if (existingSubscription) {
    throw new Error("User is already subscribed to this category");
  }
  subscription.category = newCategory;
  await subscription.save();

  return subscription;
}
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