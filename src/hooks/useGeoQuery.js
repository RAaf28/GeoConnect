import { useEffect, useState, useCallback } from "react";
import { useLocationStore } from "../store/stores";
import {
  encodeGeoHash,
  calculateDistance,
  getGeoHashPrecisionForRadius,
} from "../utils/geoUtils";
import {
  getPostsNearby,
  getEventsNearby,
  getNearbyUsers,
} from "../services/firestoreService";

/**
 * Hook to fetch nearby posts from Firestore using GeoHash range queries.
 * Filters results by Haversine distance to ensure accuracy within the specified radius.
 * @param {number} radiusKm - Search radius in kilometers (default 1)
 * @returns {{ nearbyPosts: Array, loading: boolean, error: Error|null, refresh: Function }}
 */
export const useNearbyPosts = (radiusKm = 1) => {
  const [nearbyPosts, setNearbyPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentLocation = useLocationStore((state) => state.currentLocation);

  const fetchNearbyPosts = useCallback(async () => {
    if (!currentLocation) return;

    try {
      setLoading(true);
      setError(null);

      // Get appropriate GeoHash precision for the radius
      const precision = getGeoHashPrecisionForRadius(radiusKm);
      const geoHash = encodeGeoHash(
        currentLocation.latitude,
        currentLocation.longitude,
        precision,
      );

      if (!geoHash) {
        console.warn("[useNearbyPosts] Failed to encode GeoHash");
        setNearbyPosts([]);
        return;
      }

      // Fetch posts from Firestore using GeoHash range query
      const posts = await getPostsNearby(geoHash);

      // Client-side Haversine filter for precise radius
      const filtered = posts
        .filter((post) => {
          if (!post.lat || !post.lng) return false;
          const distance = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            post.lat,
            post.lng,
          );
          return distance <= radiusKm;
        })
        .map((post) => ({
          ...post,
          distance: calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            post.lat,
            post.lng,
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      setNearbyPosts(filtered);
    } catch (err) {
      console.error("[useNearbyPosts] Error fetching nearby posts:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [currentLocation, radiusKm]);

  useEffect(() => {
    fetchNearbyPosts();
  }, [fetchNearbyPosts]);

  return { nearbyPosts, loading, error, refresh: fetchNearbyPosts };
};

/**
 * Hook to fetch nearby people (users who have shared their location).
 * Respects privacy settings — hidden/invisible users are excluded server-side.
 * @param {number} radiusKm - Search radius in kilometers (default 1)
 * @returns {{ nearbyPeople: Array, loading: boolean, error: Error|null, refresh: Function }}
 */
export const useNearbyPeople = (radiusKm = 1) => {
  const [nearbyPeople, setNearbyPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentLocation = useLocationStore((state) => state.currentLocation);

  const fetchNearbyPeople = useCallback(async () => {
    if (!currentLocation) return;

    try {
      setLoading(true);
      setError(null);

      const precision = getGeoHashPrecisionForRadius(radiusKm);
      const geoHash = encodeGeoHash(
        currentLocation.latitude,
        currentLocation.longitude,
        precision,
      );

      if (!geoHash) {
        setNearbyPeople([]);
        return;
      }

      // Fetch nearby users (already filtered for hidden/invisible in service)
      const users = await getNearbyUsers(geoHash);

      // Client-side Haversine filter for precise radius
      const filtered = users
        .filter((user) => {
          if (!user.lastLat || !user.lastLng) return false;
          const distance = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            user.lastLat,
            user.lastLng,
          );
          return distance <= radiusKm;
        })
        .map((user) => ({
          ...user,
          distance: calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            user.lastLat,
            user.lastLng,
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      setNearbyPeople(filtered);
    } catch (err) {
      console.error("[useNearbyPeople] Error fetching nearby people:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [currentLocation, radiusKm]);

  useEffect(() => {
    fetchNearbyPeople();
  }, [fetchNearbyPeople]);

  return { nearbyPeople, loading, error, refresh: fetchNearbyPeople };
};

/**
 * Hook to fetch nearby events from Firestore using GeoHash range queries.
 * @param {number} radiusKm - Search radius in kilometers (default 5)
 * @returns {{ nearbyEvents: Array, loading: boolean, error: Error|null, refresh: Function }}
 */
export const useNearbyEvents = (radiusKm = 5) => {
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentLocation = useLocationStore((state) => state.currentLocation);

  const fetchNearbyEvents = useCallback(async () => {
    if (!currentLocation) return;

    try {
      setLoading(true);
      setError(null);

      const precision = getGeoHashPrecisionForRadius(radiusKm);
      const geoHash = encodeGeoHash(
        currentLocation.latitude,
        currentLocation.longitude,
        precision,
      );

      if (!geoHash) {
        setNearbyEvents([]);
        return;
      }

      // Fetch events from Firestore using GeoHash range query
      const events = await getEventsNearby(geoHash);

      // Client-side Haversine filter for precise radius
      const filtered = events
        .filter((event) => {
          if (!event.lat || !event.lng) return false;
          const distance = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            event.lat,
            event.lng,
          );
          return distance <= radiusKm;
        })
        .map((event) => ({
          ...event,
          distance: calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            event.lat,
            event.lng,
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      setNearbyEvents(filtered);
    } catch (err) {
      console.error("[useNearbyEvents] Error fetching nearby events:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [currentLocation, radiusKm]);

  useEffect(() => {
    fetchNearbyEvents();
  }, [fetchNearbyEvents]);

  return { nearbyEvents, loading, error, refresh: fetchNearbyEvents };
};
