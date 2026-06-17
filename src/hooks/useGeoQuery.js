import { useEffect, useState } from "react";
import { useLocationStore } from "../store/stores";
import { encodeGeoHash, calculateDistance } from "../utils/geoUtils";

export const useNearbyPosts = (radiusKm = 1) => {
  const [nearbyPosts, setNearbyPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentLocation = useLocationStore((state) => state.currentLocation);

  useEffect(() => {
    if (!currentLocation) return;

    // ponytail: placeholder implementation
    // Upgrade to actual Firestore geospatial query when firestoreService.getPostsNearby is fully implemented
    const geoHash = encodeGeoHash(
      currentLocation.latitude,
      currentLocation.longitude,
    );
    // TODO: fetch posts with geoHash prefix from Firestore
  }, [currentLocation, radiusKm]);

  return { nearbyPosts, loading };
};

export const useNearbyPeople = (radiusKm = 1) => {
  const [nearbyPeople, setNearbyPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentLocation = useLocationStore((state) => state.currentLocation);

  // TODO: implement nearby people fetching
  return { nearbyPeople, loading };
};

export const useNearbyEvents = (radiusKm = 1) => {
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentLocation = useLocationStore((state) => state.currentLocation);

  // TODO: implement nearby events fetching
  return { nearbyEvents, loading };
};
