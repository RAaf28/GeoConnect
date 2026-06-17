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
  const { setCurrentLocation, setWatchId } = useLocationStore();

  useEffect(() => {
    if (!enabled) return;

    let subscription;
    (async () => {
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 10, // Update every 10m
        },
        (loc) => {
          setLocation(loc);
          setCurrentLocation(loc.coords);
        },
      );
      setWatchId(subscription);
    })();

    return () => {
      if (subscription) subscription.remove();
    };
  }, [enabled, setCurrentLocation, setWatchId]);

  return location;
};
