import { useState, useCallback, useEffect } from "react";
import {
  startBackgroundLocation,
  stopBackgroundLocation,
  isBackgroundLocationRunning,
  getLastBackgroundLocation,
} from "../services/backgroundLocation";
import { useAuthStore, useLocationStore } from "../store/stores";

/**
 * Hook untuk mengelola background location tracking.
 *
 * Features:
 * - Start/stop background tracking
 * - Cek status (aktif / tidak aktif)
 * - Ambil lokasi terakhir dari background
 * - Auto-stop saat logout
 *
 * @returns {{
 *   isTracking: boolean,
 *   lastLocation: object|null,
 *   loading: boolean,
 *   error: string|null,
 *   startTracking: Function,
 *   stopTracking: Function,
 *   refreshStatus: Function,
 *   getLastLocation: Function
 * }}
 *
 * @example
 * const { isTracking, startTracking, stopTracking } = useBackgroundLocation();
 *
 * // Di Privacy Settings toggle:
 * <Switch value={isTracking} onValueChange={(val) =>
 *   val ? startTracking() : stopTracking()
 * } />
 */
export const useBackgroundLocation = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [lastLocation, setLastLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = useAuthStore((state) => state.user);
  const setCurrentLocation = useLocationStore(
    (state) => state.setCurrentLocation,
  );

  /**
   * Cek status tracking saat ini
   */
  const refreshStatus = useCallback(async () => {
    try {
      const running = await isBackgroundLocationRunning();
      setIsTracking(running);
      return running;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  /**
   * Start background location tracking
   */
  const startTracking = useCallback(async () => {
    if (!user?.uid) {
      setError("User harus login terlebih dahulu");
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const success = await startBackgroundLocation(user.uid);

      if (success) {
        setIsTracking(true);
        console.log("[useBackgroundLocation] Tracking started");
      } else {
        setError("Gagal memulai background tracking. Pastikan izin lokasi diberikan.");
      }

      return success;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  /**
   * Stop background location tracking
   */
  const stopTracking = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const success = await stopBackgroundLocation();
      if (success) {
        setIsTracking(false);
        console.log("[useBackgroundLocation] Tracking stopped");
      }
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Ambil lokasi terakhir dari background tracking
   */
  const getLastLocation = useCallback(async () => {
    try {
      const loc = await getLastBackgroundLocation();
      if (loc) {
        setLastLocation(loc);

        // Update location store juga agar hooks geo-query bisa pakai
        setCurrentLocation({
          latitude: loc.latitude,
          longitude: loc.longitude,
        });
      }
      return loc;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [setCurrentLocation]);

  // Cek status saat hook pertama kali dipanggil
  useEffect(() => {
    refreshStatus();
    getLastLocation();
  }, [refreshStatus, getLastLocation]);

  // Auto-stop tracking saat user logout
  useEffect(() => {
    if (!user) {
      stopBackgroundLocation().catch(() => {});
      setIsTracking(false);
    }
  }, [user]);

  return {
    isTracking,
    lastLocation,
    loading,
    error,
    startTracking,
    stopTracking,
    refreshStatus,
    getLastLocation,
  };
};
