import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "./firebase";

// ============================================================
// GeoConnect — Push Notification Service (FCM via Expo)
// ============================================================
// Expo Notifications handles FCM (Android) and APNs (iOS)
// secara transparan — satu API untuk kedua platform.
// ============================================================

/**
 * Konfigurasi default behavior notifikasi saat app di foreground.
 * Tanpa ini, notifikasi tidak akan tampil saat app terbuka.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Register untuk push notification dan dapatkan Expo Push Token.
 * Token ini digunakan untuk mengirim notifikasi ke device spesifik.
 *
 * @returns {string|null} Expo Push Token atau null jika gagal
 */
export const registerForPushNotifications = async () => {
  // Push notifications hanya bekerja di physical device
  if (!Device.isDevice) {
    console.warn(
      "[Notifications] Push notifications hanya bekerja di physical device",
    );
    return null;
  }

  try {
    // 1. Cek permission yang sudah ada
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // 2. Minta permission jika belum granted
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("[Notifications] Permission ditolak oleh user");
      return null;
    }

    // 3. Dapatkan Expo Push Token
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    const token = tokenData.data;
    console.log("[Notifications] Push token:", token);

    // 4. Setup Android notification channel
    if (Platform.OS === "android") {
      await setupAndroidChannels();
    }

    return token;
  } catch (error) {
    console.error("[Notifications] Registration error:", error);
    return null;
  }
};

/**
 * Setup Android notification channels.
 * Android 8+ (Oreo) membutuhkan channels untuk kategorisasi notifikasi.
 */
const setupAndroidChannels = async () => {
  // Channel utama: social interactions
  await Notifications.setNotificationChannelAsync("social", {
    name: "Social",
    description: "Follow, like, dan comment notifications",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#4648D4",
    sound: "default",
  });

  // Channel: nearby events
  await Notifications.setNotificationChannelAsync("events", {
    name: "Nearby Events",
    description: "Event baru di sekitar kamu",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#4648D4",
    sound: "default",
  });

  // Channel: location updates (low priority)
  await Notifications.setNotificationChannelAsync("location", {
    name: "Location Updates",
    description: "Background location tracking status",
    importance: Notifications.AndroidImportance.LOW,
    sound: null,
  });
};

/**
 * Simpan push token ke Firestore user profile.
 * Dipanggil setelah login berhasil.
 *
 * @param {string} userId
 * @param {string} token - Expo Push Token
 */
export const savePushToken = async (userId, token) => {
  try {
    await updateDoc(doc(firestore, "users", userId), {
      expoPushToken: token,
      tokenUpdatedAt: new Date(),
    });
    console.log("[Notifications] Token saved to Firestore");
  } catch (error) {
    console.error("[Notifications] Save token error:", error);
  }
};

/**
 * Kirim local notification (tanpa server).
 * Berguna untuk notifikasi dari background task.
 *
 * @param {object} options
 * @param {string} options.title
 * @param {string} options.body
 * @param {object} options.data - Custom data payload
 * @param {string} options.channelId - Android channel ID
 * @returns {string} notification identifier
 */
export const sendLocalNotification = async ({
  title,
  body,
  data = {},
  channelId = "social",
}) => {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: "default",
        ...(Platform.OS === "android" && { channelId }),
      },
      trigger: null, // Langsung kirim (no delay)
    });
    return id;
  } catch (error) {
    console.error("[Notifications] Local notification error:", error);
    return null;
  }
};

/**
 * Kirim notifikasi "Ada event baru di sekitar kamu"
 * Dipanggil dari background location task saat detect event baru nearby.
 *
 * @param {string} eventTitle - Judul event
 * @param {string} distance - Jarak formatted (e.g. "500m")
 */
export const notifyNearbyEvent = async (eventTitle, distance) => {
  return sendLocalNotification({
    title: "🎉 Event Baru di Sekitarmu!",
    body: `${eventTitle} — ${distance} dari lokasimu`,
    data: { type: "nearby_event", eventTitle },
    channelId: "events",
  });
};

/**
 * Kirim notifikasi social interaction
 * @param {"follow"|"like"|"comment"} type
 * @param {string} fromUserName - nama user yang trigger
 * @param {string} context - konteks tambahan (e.g. nama post)
 */
export const notifySocialInteraction = async (type, fromUserName, context = "") => {
  const messages = {
    follow: {
      title: "👤 Follower Baru",
      body: `${fromUserName} mulai mengikuti kamu`,
    },
    like: {
      title: "❤️ Like Baru",
      body: `${fromUserName} menyukai postinganmu${context ? `: "${context}"` : ""}`,
    },
    comment: {
      title: "💬 Komentar Baru",
      body: `${fromUserName} mengomentari postinganmu${context ? `: "${context}"` : ""}`,
    },
  };

  const msg = messages[type] || { title: "GeoConnect", body: "Ada notifikasi baru" };

  return sendLocalNotification({
    title: msg.title,
    body: msg.body,
    data: { type, fromUserName },
    channelId: "social",
  });
};

/**
 * Hapus semua notifikasi yang sudah ditampilkan
 */
export const clearAllNotifications = async () => {
  await Notifications.dismissAllNotificationsAsync();
};

/**
 * Dapatkan badge count
 * @returns {number}
 */
export const getBadgeCount = async () => {
  return await Notifications.getBadgeCountAsync();
};

/**
 * Set badge count
 * @param {number} count
 */
export const setBadgeCount = async (count) => {
  await Notifications.setBadgeCountAsync(count);
};
