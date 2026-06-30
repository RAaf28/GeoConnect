// GeoHash utilities using geofire-common for geospatial queries
// geohashQueryBounds returns multiple [start, end] bounds for proper radius coverage
import { geohashQueryBounds, distanceBetween, geohashForLocation } from "geofire-common";

/**
 * Encode koordinat ke GeoHash string
 * @param {number} latitude
 * @param {number} longitude
 * @param {number} precision - panjang hash (default 9 = ~5m presisi)
 * @returns {string} geohash
 */
export const encodeGeoHash = (latitude, longitude, precision = 9) => {
  try {
    return geohashForLocation([latitude, longitude], precision);
  } catch (error) {
    console.error("GeoHash encode error:", error);
    return "";
  }
};

/**
 * Hitung GeoHash query bounds untuk radius tertentu.
 * Mengembalikan array pasangan [start, end] yang mencakup area dalam radius.
 *
 * Ini adalah cara BENAR untuk melakukan radius query di Firestore dengan GeoHash —
 * satu prefix query saja bisa miss hasil di boundary hash yang berbeda.
 *
 * @param {number} latitude  - center lat
 * @param {number} longitude - center lng
 * @param {number} radiusKm  - radius dalam kilometer
 * @returns {Array<[string, string]>} array of [startHash, endHash] bounds
 */
export const getGeoHashBounds = (latitude, longitude, radiusKm) => {
  try {
    const radiusMeters = radiusKm * 1000;
    const bounds = geohashQueryBounds([latitude, longitude], radiusMeters);
    return bounds;
  } catch (error) {
    console.error("GeoHash bounds error:", error);
    return [];
  }
};

/**
 * Hitung jarak antara dua titik menggunakan geofire-common (lebih akurat)
 * @param {number} lat1
 * @param {number} lng1
 * @param {number} lat2
 * @param {number} lng2
 * @returns {number} jarak dalam km
 */
export const geoDistance = (lat1, lng1, lat2, lng2) => {
  try {
    // distanceBetween returns km
    return distanceBetween([lat1, lng1], [lat2, lng2]);
  } catch (error) {
    console.error("geoDistance error:", error);
    return Infinity;
  }
};

export const decodeGeoHashRange = (geoHash) => {
  // Returns a range prefix for Firestore query (legacy simple approach)
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
