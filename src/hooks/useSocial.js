import { useState, useCallback } from "react";
import {
  followUser,
  unfollowUser,
  isFollowing,
  getFollowers,
  getFollowing,
  likePost,
  unlikePost,
  toggleLike,
  hasLikedPost,
  addComment,
  getComments,
  updateComment,
  deleteComment,
  setRSVP,
  cancelRSVP,
  toggleRSVP,
  getUserRSVP,
  getEventRSVPs,
  getUserRSVPs,
} from "../services/firestoreService";

/**
 * Hook untuk follow/unfollow user
 * @param {string} currentUserId - user yang sedang login
 */
export const useFollow = (currentUserId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const follow = useCallback(
    async (targetUserId) => {
      setLoading(true);
      setError(null);
      try {
        await followUser(currentUserId, targetUserId);
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [currentUserId],
  );

  const unfollow = useCallback(
    async (targetUserId) => {
      setLoading(true);
      setError(null);
      try {
        await unfollowUser(currentUserId, targetUserId);
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [currentUserId],
  );

  const checkFollowing = useCallback(
    async (targetUserId) => {
      try {
        return await isFollowing(currentUserId, targetUserId);
      } catch (err) {
        setError(err.message);
        return false;
      }
    },
    [currentUserId],
  );

  const fetchFollowers = useCallback(async (userId) => {
    try {
      return await getFollowers(userId);
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, []);

  const fetchFollowing = useCallback(async (userId) => {
    try {
      return await getFollowing(userId);
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, []);

  return {
    follow,
    unfollow,
    checkFollowing,
    fetchFollowers,
    fetchFollowing,
    loading,
    error,
  };
};

/**
 * Hook untuk like/unlike post
 * @param {string} userId - user yang sedang login
 */
export const useLike = (userId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggle = useCallback(
    async (postId) => {
      setLoading(true);
      setError(null);
      try {
        const result = await toggleLike(userId, postId);
        return result; // { liked: true/false }
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  const like = useCallback(
    async (postId) => {
      setLoading(true);
      setError(null);
      try {
        await likePost(userId, postId);
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  const unlike = useCallback(
    async (postId) => {
      setLoading(true);
      setError(null);
      try {
        await unlikePost(userId, postId);
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  const checkLiked = useCallback(
    async (postId) => {
      try {
        return await hasLikedPost(userId, postId);
      } catch (err) {
        setError(err.message);
        return false;
      }
    },
    [userId],
  );

  return { toggle, like, unlike, checkLiked, loading, error };
};

/**
 * Hook untuk comment CRUD pada post
 * @param {string} userId - user yang sedang login
 */
export const useComments = (userId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async (postId, maxResults = 50) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getComments(postId, maxResults);
      setComments(result);
      return result;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const add = useCallback(
    async (postId, text) => {
      setLoading(true);
      setError(null);
      try {
        const commentId = await addComment(userId, postId, text);
        // Refresh comments setelah add
        await fetchComments(postId);
        return commentId;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId, fetchComments],
  );

  const edit = useCallback(
    async (postId, commentId, newText) => {
      setLoading(true);
      setError(null);
      try {
        await updateComment(postId, commentId, userId, newText);
        // Refresh comments setelah edit
        await fetchComments(postId);
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [userId, fetchComments],
  );

  const remove = useCallback(
    async (postId, commentId) => {
      setLoading(true);
      setError(null);
      try {
        await deleteComment(postId, commentId, userId);
        // Refresh comments setelah delete
        await fetchComments(postId);
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [userId, fetchComments],
  );

  return {
    comments,
    fetchComments,
    add,
    edit,
    remove,
    loading,
    error,
  };
};

/**
 * Hook untuk RSVP event (Going / Interested / Not Going)
 * @param {string} userId - user yang sedang login
 *
 * @example
 * const { toggle, currentStatus, loading } = useRSVP(userId);
 *
 * // Di tombol "Going":
 * <Button onPress={() => toggle(eventId, "going")} />
 *
 * // Di tombol "Interested":
 * <Button onPress={() => toggle(eventId, "interested")} />
 */
export const useRSVP = (userId) => {
  const [currentStatus, setCurrentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Toggle RSVP: klik "Going" saat sudah going â†’ cancel.
   * Klik "Interested" saat sudah going â†’ switch ke interested.
   * @param {string} eventId
   * @param {"going"|"interested"} status
   * @returns {{ currentStatus: string|null }}
   */
  const toggle = useCallback(
    async (eventId, status) => {
      setLoading(true);
      setError(null);
      try {
        const result = await toggleRSVP(userId, eventId, status);
        setCurrentStatus(result.currentStatus);
        return result;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  /**
   * Set RSVP status secara langsung (tanpa toggle behavior)
   * @param {string} eventId
   * @param {"going"|"interested"|"not_going"} status
   */
  const setStatus = useCallback(
    async (eventId, status) => {
      setLoading(true);
      setError(null);
      try {
        await setRSVP(userId, eventId, status);
        setCurrentStatus(status);
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  /**
   * Cancel RSVP (hapus attendance)
   * @param {string} eventId
   */
  const cancel = useCallback(
    async (eventId) => {
      setLoading(true);
      setError(null);
      try {
        await cancelRSVP(userId, eventId);
        setCurrentStatus(null);
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  /**
   * Cek status RSVP user untuk event tertentu
   * @param {string} eventId
   * @returns {string|null} "going"|"interested"|"not_going"|null
   */
  const checkStatus = useCallback(
    async (eventId) => {
      try {
        const status = await getUserRSVP(userId, eventId);
        setCurrentStatus(status);
        return status;
      } catch (err) {
        setError(err.message);
        return null;
      }
    },
    [userId],
  );

  /**
   * Ambil daftar semua RSVP untuk event tertentu
   * @param {string} eventId
   * @param {"going"|"interested"|null} filterStatus
   * @returns {Array}
   */
  const fetchEventRSVPs = useCallback(
    async (eventId, filterStatus = null) => {
      setLoading(true);
      try {
        const result = await getEventRSVPs(eventId, filterStatus);
        return result;
      } catch (err) {
        setError(err.message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Ambil semua event yang user sudah RSVP
   * @param {"going"|"interested"|null} filterStatus
   * @returns {Array}
   */
  const fetchMyRSVPs = useCallback(
    async (filterStatus = null) => {
      setLoading(true);
      try {
        const result = await getUserRSVPs(userId, filterStatus);
        return result;
      } catch (err) {
        setError(err.message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  return {
    currentStatus,
    toggle,
    setStatus,
    cancel,
    checkStatus,
    fetchEventRSVPs,
    fetchMyRSVPs,
    loading,
    error,
  };
};

