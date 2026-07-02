import { geohashForLocation, geohashQueryBounds } from "geofire-common";

/**
 * Get GeoHash query bounds for a given center and radius.
 * Returns an array of [start, end] bounds for Firestore range queries.
 * This is the recommended approach from geofire-common for accurate geo queries.
 * @param {number} latitude - Center latitude
 * @param {number} longitude - Center longitude
 * @param {number} radiusMeters - Search radius in meters
 * @returns {Array<[string, string]>} Array of [startHash, endHash] bounds
 */
export const getGeoHashBounds = (latitude, longitude, radiusMeters) => {
  try {
    return geohashQueryBounds([latitude, longitude], radiusMeters);
  } catch (error) {
    console.error("[GeoUtils] Error calculating GeoHash bounds:", error);
    return [];
  }
};

/**
 * Encode latitude/longitude into a GeoHash string.
 * Uses geofire-common for standard GeoHash encoding.
 * @param {number} latitude
 * @param {number} longitude
 * @param {number} precision - GeoHash precision level (1-12, default 9)
 * @returns {string} GeoHash string
 */
export const encodeGeoHash = (latitude, longitude, precision = 9) => {
  try {
    return geohashForLocation([latitude, longitude], precision);
  } catch (error) {
    console.error("[GeoUtils] GeoHash encode error:", error);
    return "";
  }
};

/**
 * Get the appropriate GeoHash precision level for a given search radius.
 * Lower precision = larger area covered by GeoHash prefix = broader query.
 *
 * GeoHash precision vs approximate area:
 *   1 → ~5000km    (continent level)
 *   2 → ~1250km    (large country)
 *   3 → ~156km     (large city / state)
 *   4 → ~39km      (city)
 *   5 → ~4.9km     (neighborhood) ← good for 5-10km
 *   6 → ~1.2km     (street block)  ← good for 1-5km
 *   7 → ~153m      (block)         ← good for 500m-1km
 *   8 → ~38m       (building)
 *   9 → ~4.8m      (room)
 *
 * @param {number} radiusKm - Search radius in kilometers
 * @returns {number} Recommended GeoHash precision level
 */
export const getGeoHashPrecisionForRadius = (radiusKm) => {
  if (radiusKm <= 0.5) return 7; // 500m → precision 7 (~153m cells)
  if (radiusKm <= 1) return 6; // 1km → precision 6 (~1.2km cells)
  if (radiusKm <= 5) return 5; // 5km → precision 5 (~4.9km cells)
  if (radiusKm <= 10) return 5; // 10km → precision 5
  if (radiusKm <= 50) return 4; // 50km → precision 4 (~39km cells)
  return 3; // >50km → precision 3
};

/**
 * Returns GeoHash range bounds for Firestore queries.
 * @param {string} geoHash - GeoHash prefix
 * @returns {{ start: string, end: string }}
 */
export const decodeGeoHashRange = (geoHash) => {
  return {
    start: geoHash,
    end: geoHash + "\uf8ff",
  };
};

/**
 * Blurred location: randomize coordinates within a given radius.
 * Used for "blurred" privacy mode to protect exact user location.
 * @param {number} latitude - Original latitude
 * @param {number} longitude - Original longitude
 * @param {number} radiusMeters - Blur radius in meters (default 500m)
 * @returns {{ latitude: number, longitude: number }} Blurred coordinates
 */
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

/**
 * Calculate distance between two geographic points using the Haversine formula.
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lng1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lng2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
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

/**
 * Format distance for display (e.g., "500m" or "2.5km").
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distanceKm) => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
};

/**
 * Apply privacy mode to location data before saving.
 * Used when creating posts or updating user location.
 * @param {number} lat - Original latitude
 * @param {number} lng - Original longitude
 * @param {string} privacyMode - "exact" | "blurred" | "hidden"
 * @returns {{ lat: number|null, lng: number|null, geoHash: string|null }}
 */
export const applyPrivacyToLocation = (lat, lng, privacyMode) => {
  if (privacyMode === "hidden") {
    return { lat: null, lng: null, geoHash: null };
  }

  if (privacyMode === "blurred") {
    const blurred = blurLocation(lat, lng);
    return {
      lat: blurred.latitude,
      lng: blurred.longitude,
      geoHash: encodeGeoHash(blurred.latitude, blurred.longitude),
    };
  }

  // "exact" mode
  return {
    lat,
    lng,
    geoHash: encodeGeoHash(lat, lng),
  };
};
