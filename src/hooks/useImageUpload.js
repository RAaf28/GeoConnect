import { useState, useCallback } from "react";
import {
  uploadPostImage,
  uploadProfilePhoto,
  uploadVenuePhoto,
  uploadEventPhoto,
  deleteFile,
} from "../services/storageService";
import { updateUserProfile } from "../services/firestoreService";

/**
 * Hook untuk upload gambar dengan progress tracking dan state management.
 * Menyediakan state `progress`, `uploading`, `error`, dan `downloadURL`
 * yang bisa langsung dipakai di UI (misalnya progress bar).
 *
 * @example
 * const { uploadPost, progress, uploading, downloadURL } = useImageUpload();
 *
 * // Di handler submit:
 * const url = await uploadPost(userId, imageUri);
 *
 * // Di UI:
 * {uploading && <ProgressBar progress={progress} />}
 */
export const useImageUpload = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);

  /** Reset semua state sebelum upload baru */
  const resetState = useCallback(() => {
    setProgress(0);
    setUploading(false);
    setError(null);
    setDownloadURL(null);
  }, []);

  /**
   * Upload foto post
   * @param {string} userId
   * @param {string} imageUri - URI lokal dari image picker
   * @returns {Promise<string|null>} download URL atau null jika gagal
   */
  const uploadPost = useCallback(async (userId, imageUri) => {
    resetState();
    setUploading(true);
    try {
      const result = await uploadPostImage(userId, imageUri, (p) => {
        setProgress(p);
      });
      setDownloadURL(result.downloadURL);
      return result.downloadURL;
    } catch (err) {
      setError(err.message || "Upload gagal");
      return null;
    } finally {
      setUploading(false);
    }
  }, [resetState]);

  /**
   * Upload foto profil + update photoURL di Firestore user profile
   * @param {string} userId
   * @param {string} imageUri
   * @returns {Promise<string|null>} download URL atau null jika gagal
   */
  const uploadProfile = useCallback(async (userId, imageUri) => {
    resetState();
    setUploading(true);
    try {
      const result = await uploadProfilePhoto(userId, imageUri, (p) => {
        setProgress(p);
      });

      // Auto-update photoURL di Firestore user profile
      await updateUserProfile(userId, {
        photoURL: result.downloadURL,
      });

      setDownloadURL(result.downloadURL);
      return result.downloadURL;
    } catch (err) {
      setError(err.message || "Upload gagal");
      return null;
    } finally {
      setUploading(false);
    }
  }, [resetState]);

  /**
   * Upload foto venue / check-in
   * @param {string} userId
   * @param {string} venueId
   * @param {string} imageUri
   * @returns {Promise<string|null>} download URL atau null jika gagal
   */
  const uploadVenue = useCallback(async (userId, venueId, imageUri) => {
    resetState();
    setUploading(true);
    try {
      const result = await uploadVenuePhoto(userId, venueId, imageUri, (p) => {
        setProgress(p);
      });
      setDownloadURL(result.downloadURL);
      return result.downloadURL;
    } catch (err) {
      setError(err.message || "Upload gagal");
      return null;
    } finally {
      setUploading(false);
    }
  }, [resetState]);

  /**
   * Upload foto event cover
   * @param {string} eventId
   * @param {string} imageUri
   * @returns {Promise<string|null>} download URL atau null jika gagal
   */
  const uploadEvent = useCallback(async (eventId, imageUri) => {
    resetState();
    setUploading(true);
    try {
      const result = await uploadEventPhoto(eventId, imageUri, (p) => {
        setProgress(p);
      });
      setDownloadURL(result.downloadURL);
      return result.downloadURL;
    } catch (err) {
      setError(err.message || "Upload gagal");
      return null;
    } finally {
      setUploading(false);
    }
  }, [resetState]);

  /**
   * Hapus file dari Storage
   * @param {string} storagePath
   */
  const removeFile = useCallback(async (storagePath) => {
    try {
      await deleteFile(storagePath);
      return true;
    } catch (err) {
      setError(err.message || "Delete gagal");
      return false;
    }
  }, []);

  return {
    // State
    progress,
    uploading,
    error,
    downloadURL,

    // Actions
    uploadPost,
    uploadProfile,
    uploadVenue,
    uploadEvent,
    removeFile,
    resetState,
  };
};
