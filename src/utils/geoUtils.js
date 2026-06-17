// ponytail: naive geohash encoder using simple grid approach
// Upgrade to proper GeoHash library (geohash2) if precision > 9 or querying becomes bottleneck
import { calculateHash } from "geofire-common";

export const encodeGeoHash = (latitude, longitude, precision = 9) => {
  try {
    return calculateHash([latitude, longitude]).substring(0, precision);
  } catch (error) {
    console.error("GeoHash encode error:", error);
    return "";
  }
};

export const decodeGeoHashRange = (geoHash) => {
  // Returns a range prefix for Firestore query
  return {
    start: geoHash,
    end: geoHash + "z",
  };
};

// Blurred location: randomize coordinates within ±500m
export const blurLocation = (latitude, longitude, radiusMeters = 500) => {
  const earthRadiusMeters = 6371000;
  const randomBearing = Math.random() * 2 * Math.PI;
  const randomDistance = Math.random() * radiusMeters;

  const latChange = (randomDistance / earthRadiusMeters) * (180 / Math.PI);
  const lngChange =
    (randomDistance /
      (earthRadiusMeters * Math.cos((latitude * Math.PI) / 180))) *
    (180 / Math.PI);

  const blurredLat = latitude + latChange * Math.cos(randomBearing);
  const blurredLng = longitude + lngChange * Math.sin(randomBearing);

  return {
    latitude: parseFloat(blurredLat.toFixed(6)),
    longitude: parseFloat(blurredLng.toFixed(6)),
  };
};

// Calculate distance between two points (Haversine formula)
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Format distance for display (e.g., "500m" or "2.5km")
export const formatDistance = (distanceKm) => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
};
