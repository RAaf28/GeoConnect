import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "./firebase";

/**
 * Notification types:
 * - "follow"     → Someone followed you
 * - "like"       → Someone liked your post
 * - "comment"    → Someone commented on your post
 * - "event"      → New event near you
 * - "checkin"    → Friend checked in nearby
 * - "rsvp"       → Someone RSVP'd to your event
 */

/**
 * Create a notification for a user.
 * @param {string} userId - The user receiving the notification
 * @param {string} type - Notification type (follow/like/comment/event/checkin/rsvp)
 * @param {Object} data - Additional data for the notification
 *   - { fromUserId, fromUserName, fromUserPhoto, postId, eventId, message }
 * @returns {string} Notification document ID
 */
export const createNotification = async (userId, type, data = {}) => {
  try {
    const docRef = await addDoc(collection(firestore, "notifications"), {
      userId,
      type,
      ...data,
      read: false,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("[Notifications] Error creating notification:", error);
    throw error;
  }
};

/**
 * Get notifications for a user, ordered by most recent.
 * @param {string} userId
 * @param {number} maxResults
 * @returns {Array} List of notification objects
 */
export const getNotifications = async (userId, maxResults = 50) => {
  try {
    const q = query(
      collection(firestore, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      firestoreLimit(maxResults),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error("[Notifications] Error fetching notifications:", error);
    throw error;
  }
};

/**
 * Get unread notification count for a user.
 * @param {string} userId
 * @returns {number} Count of unread notifications
 */
export const getUnreadCount = async (userId) => {
  try {
    const q = query(
      collection(firestore, "notifications"),
      where("userId", "==", userId),
      where("read", "==", false),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error("[Notifications] Error getting unread count:", error);
    throw error;
  }
};

/**
 * Mark a single notification as read.
 * @param {string} notificationId
 */
export const markAsRead = async (notificationId) => {
  try {
    await updateDoc(doc(firestore, "notifications", notificationId), {
      read: true,
    });
  } catch (error) {
    console.error("[Notifications] Error marking as read:", error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user.
 * @param {string} userId
 */
export const markAllAsRead = async (userId) => {
  try {
    const q = query(
      collection(firestore, "notifications"),
      where("userId", "==", userId),
      where("read", "==", false),
    );
    const querySnapshot = await getDocs(q);
    const updatePromises = querySnapshot.docs.map((doc) =>
      updateDoc(doc.ref, { read: true }),
    );
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("[Notifications] Error marking all as read:", error);
    throw error;
  }
};

/**
 * Helper: Create a follow notification.
 * @param {string} targetUserId - User being followed
 * @param {Object} fromUser - { uid, displayName, photoURL }
 */
export const notifyFollow = async (targetUserId, fromUser) => {
  return createNotification(targetUserId, "follow", {
    fromUserId: fromUser.uid,
    fromUserName: fromUser.displayName || "Someone",
    fromUserPhoto: fromUser.photoURL || "",
    message: `${fromUser.displayName || "Someone"} started following you`,
  });
};

/**
 * Helper: Create a like notification.
 * @param {string} postAuthorId - Owner of the liked post
 * @param {Object} fromUser - { uid, displayName, photoURL }
 * @param {string} postId
 */
export const notifyLike = async (postAuthorId, fromUser, postId) => {
  return createNotification(postAuthorId, "like", {
    fromUserId: fromUser.uid,
    fromUserName: fromUser.displayName || "Someone",
    fromUserPhoto: fromUser.photoURL || "",
    postId,
    message: `${fromUser.displayName || "Someone"} liked your post`,
  });
};

/**
 * Helper: Create a comment notification.
 * @param {string} postAuthorId - Owner of the commented post
 * @param {Object} fromUser - { uid, displayName, photoURL }
 * @param {string} postId
 * @param {string} commentText
 */
export const notifyComment = async (
  postAuthorId,
  fromUser,
  postId,
  commentText,
) => {
  return createNotification(postAuthorId, "comment", {
    fromUserId: fromUser.uid,
    fromUserName: fromUser.displayName || "Someone",
    fromUserPhoto: fromUser.photoURL || "",
    postId,
    message: `${fromUser.displayName || "Someone"} commented: "${commentText.substring(0, 50)}"`,
  });
};

/**
 * Helper: Create a nearby event notification.
 * @param {string} userId - User to notify
 * @param {string} eventId
 * @param {string} eventTitle
 */
export const notifyNearbyEvent = async (userId, eventId, eventTitle) => {
  return createNotification(userId, "event", {
    eventId,
    message: `New event near you: ${eventTitle}`,
  });
};
