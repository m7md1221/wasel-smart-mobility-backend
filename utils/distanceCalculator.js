//distance calculation using Haversine formula
// this function used for calculating distance range for notifying users about new alerts based on their subscription preferences
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180; // convert degrees to radians
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a = // Haversine formula
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));n// return distance in kilometers
}

module.exports = { calculateDistance };