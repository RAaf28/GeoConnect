import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { encodeGeoHash } from "../utils/geoUtils";
import { addLocationHistory } from "./firestoreService";

// ============================================================
// GeoConnect — Background Location Service
// ============================================================
// Menggunakan expo-location TaskManager untuk background location.
// Efisien: hanya update saat user bergerak ≥ 100m, interval 5 menit.
// Tidak drain baterai karena pakai Balanced accuracy.
// ============================================================

const BACKGROUND_LOCATION_TASK = "geoconnect-background-location";
const LOCATION_STORAGE_KEY = "@geoconnect_last_bg_location";

/**
 * Definisi background task.
 * PENTING: Harus dipanggil di TOP-LEVEL (bukan di dalam component).
 * Biasanya di App.js atau file yang di-import langsung oleh App.js.
 */
TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error("[BgLocation] Task error:", error.message);
    return;
  }

  if (data) {
    const { locations } = data;
    const location = locations?.[0];

    if (!location) return;

    const { latitude, longitude } = location.coords;
    const timestamp = location.timestamp;

    console.log(
      `[BgLocation] Received: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
    );

    try {
      // 1. Simpan lokasi terakhir ke AsyncStorage (untuk akses cepat)
      const locationData = {
        latitude,
        longitude,
        geoHash: encodeGeoHash(latitude, longitude),
        timestamp,
        accuracy: location.coords.accuracy,
      };

      await AsyncStorage.setItem(
        LOCATION_STORAGE_KEY,
        JSON.stringify(locationData),
      );

      // 2. Simpan ke Firestore location history (jika user login)
      const userIdRaw = await AsyncStorage.getItem("@geoconnect_bg_user_id");
      if (userIdRaw) {
        await addLocationHistory(userIdRaw, {
          lat: latitude,
          lng: longitude,
          geoHash: locationData.geoHash,
          accuracy: location.coords.accuracy,
        });
      }
    } catch (err) {
      console.error("[BgLocation] Save error:", err);
    }
  }
});

/**
 * Start background location tracking.
 * Membutuhkan background location permission.
 *
 * @param {string} userId - ID user yang sedang login (untuk Firestore)
 * @returns {boolean} true jika berhasil dimulai
 */
export const startBackgroundLocation = async (userId) => {
  try {
    // 1. Cek foreground permission
    const { status: fgStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (fgStatus !== "granted") {
      console.warn("[BgLocation] Foreground permission ditolak");
      return false;
    }

    // 2. Cek background permission
    const { status: bgStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (bgStatus !== "granted") {
      console.warn("[BgLocation] Background permission ditolak");
      return false;
    }

    // 3. Cek apakah task sudah berjalan
    const isRunning = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_LOCATION_TASK,
    );
    if (isRunning) {
      console.log("[BgLocation] Task sudah berjalan");
      return true;
    }

    // 4. Simpan userId untuk akses di background task
    await AsyncStorage.setItem("@geoconnect_bg_user_id", userId);

    // 5. Start background location updates
    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
      accuracy: Location.Accuracy.Balanced, // ~100m accuracy, battery efficient
      timeInterval: 5 * 60 * 1000, // Minimal setiap 5 menit
      distanceInterval: 100, // Atau setiap bergerak 100 meter
      deferredUpdatesInterval: 5 * 60 * 1000,
      deferredUpdatesDistance: 100,
      showsBackgroundLocationIndicator: true, // iOS: indicator di status bar
      foregroundService: {
        // Android: persistent notification (required for background)
        notificationTitle: "GeoConnect",
        notificationBody: "Tracking lokasi di background",
        notificationColor: "#4648D4",
      },
      pausesUpdatesAutomatically: true, // iOS: pause saat diam
      activityType: Location.ActivityType.Other,
    });

    console.log("[BgLocation] Background tracking dimulai");
    return true;
  } catch (error) {
    console.error("[BgLocation] Start error:", error);
    return false;
  }
};

/**
 * Stop background location tracking.
 */
export const stopBackgroundLocation = async () => {
  try {
    const isRunning = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_LOCATION_TASK,
    );

    if (isRunning) {
      await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
      console.log("[BgLocation] Background tracking dihentikan");
    }

    // Bersihkan user ID
    await AsyncStorage.removeItem("@geoconnect_bg_user_id");

    return true;
  } catch (error) {
    console.error("[BgLocation] Stop error:", error);
    return false;
  }
};

/**
 * Cek apakah background location tracking sedang aktif
 * @returns {boolean}
 */
export const isBackgroundLocationRunning = async () => {
  try {
    return await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_LOCATION_TASK,
    );
  } catch {
    return false;
  }
};

/**
 * Ambil lokasi terakhir dari background tracking (dari AsyncStorage).
 * Berguna saat app baru dibuka — tidak perlu tunggu GPS fix.
 *
 * @returns {object|null} { latitude, longitude, geoHash, timestamp, accuracy }
 */
export const getLastBackgroundLocation = async () => {
  try {
    const raw = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Nama task (export untuk referensi)
 */
export const TASK_NAME = BACKGROUND_LOCATION_TASK;
