import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useLocationStore } from "../store/stores";

export const useLocationPermission = () => {
  const [permission, setPermission] = useState(null);
  const { setPermissionStatus } = useLocationStore();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermission(status);
      setPermissionStatus(status);
    })();
  }, [setPermissionStatus]);

  return permission;
};

export const useCurrentLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const { setCurrentLocation } = useLocationStore();

  const getLocation = async () => {
    try {
      const currentLoc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLoc);
      setCurrentLocation(currentLoc.coords);
      return currentLoc.coords;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return { location, error, getLocation };
};

export const useWatchLocation = (enabled = false) => {
  const [location, setLocation] = useState(null);
  const { setCurrentLocation, setWatchId, permissionStatus } = useLocationStore();

  useEffect(() => {
    if (!enabled || permissionStatus !== "granted") return;

    let subscription;
    let isMounted = true;

    (async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') return;

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 10, // Update every 10m
          },
          (loc) => {
            if (isMounted) {
              setLocation(loc);
              setCurrentLocation(loc.coords);
            }
          },
        );
        if (isMounted) {
          setWatchId(subscription);
        }
      } catch (err) {
        console.error("[useWatchLocation] Error starting location watch:", err);
      }
    })();

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.remove();
      }
    };
  }, [enabled, permissionStatus, setCurrentLocation, setWatchId]);

  return location;
};
