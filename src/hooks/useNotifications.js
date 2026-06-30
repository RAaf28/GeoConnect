import { useEffect, useRef, useState, useCallback } from "react";
import * as Notifications from "expo-notifications";
import {
  registerForPushNotifications,
  savePushToken,
} from "../services/notificationService";
import { useAuthStore } from "../store/stores";

/**
 * Hook utama untuk push notifications.
 * Handles: permission request, token registration, listener setup.
 *
 * Harus dipanggil di komponen top-level (App.js atau root navigator).
 *
 * @returns {{
 *   expoPushToken: string|null,
 *   notification: object|null,
 *   error: string|null
 * }}
 *
 * @example
 * // Di App.js:
 * const { expoPushToken, notification } = useNotifications();
 *
 * useEffect(() => {
 *   if (notification) {
 *     // Handle notification tap
 *     console.log("Notification data:", notification.request.content.data);
 *   }
 * }, [notification]);
 */
export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  const notificationListener = useRef();
  const responseListener = useRef();

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // 1. Register push notifications
    registerForPushNotifications()
      .then(async (token) => {
        if (token) {
          setExpoPushToken(token);

          // Simpan token ke Firestore jika user sudah login
          if (user?.uid) {
            await savePushToken(user.uid, token);
          }
        }
      })
      .catch((err) => {
        console.error("[useNotifications] Registration error:", err);
        setError(err.message);
      });

    // 2. Listener: notifikasi diterima saat app di foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notif) => {
        console.log("[useNotifications] Received:", notif.request.content.title);
        setNotification(notif);
      });

    // 3. Listener: user tap notifikasi (dari background/killed state)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("[useNotifications] User tapped:", data);

        // Bisa navigate ke screen yang sesuai berdasarkan data.type
        // Contoh: navigation.navigate("EventDetail", { eventId: data.eventId })
        setNotification(response.notification);
      });

    // 4. Cleanup listeners
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(
          responseListener.current,
        );
      }
    };
  }, [user?.uid]);

  return { expoPushToken, notification, error };
};
