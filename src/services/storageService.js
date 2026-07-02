import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";

/**
 * Upload a profile photo to Firebase Storage.
 * Path: profilePhotos/{userId}
 * @param {string} userId
 * @param {string} imageUri - Local file URI
 * @param {function} onProgress - Optional callback (0-100)
 * @returns {string} Download URL of the uploaded photo
 */
export const uploadProfilePhoto = async (userId, imageUri, onProgress) => {
  try {
    const storageRef = ref(storage, `profilePhotos/${userId}`);
    const response = await fetch(imageUri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error("[Storage] Profile photo upload error:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        },
      );
    });
  } catch (error) {
    console.error("[Storage] Error preparing profile photo upload:", error);
    throw error;
  }
};

/**
 * Upload a post image to Firebase Storage.
 * Path: posts/{userId}/{timestamp}
 * @param {string} userId
 * @param {string} imageUri - Local file URI
 * @param {function} onProgress - Optional callback (0-100)
 * @returns {string} Download URL of the uploaded image
 */
export const uploadPostImage = async (userId, imageUri, onProgress) => {
  try {
    const timestamp = Date.now();
    const storageRef = ref(storage, `posts/${userId}/${timestamp}`);
    const response = await fetch(imageUri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error("[Storage] Post image upload error:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        },
      );
    });
  } catch (error) {
    console.error("[Storage] Error preparing post image upload:", error);
    throw error;
  }
};

/**
 * Upload a venue/event image to Firebase Storage.
 * Path: venues/{venueId}/{timestamp}
 * @param {string} venueId
 * @param {string} imageUri - Local file URI
 * @param {function} onProgress - Optional callback (0-100)
 * @returns {string} Download URL
 */
export const uploadVenueImage = async (venueId, imageUri, onProgress) => {
  try {
    const timestamp = Date.now();
    const storageRef = ref(storage, `venues/${venueId}/${timestamp}`);
    const response = await fetch(imageUri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          if (onProgress) onProgress(progress);
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        },
      );
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Delete an image from Firebase Storage.
 * @param {string} storagePath - Full path in storage (e.g., "posts/userId/1234567890")
 */
export const deleteImage = async (storagePath) => {
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("[Storage] Error deleting image:", error);
    throw error;
  }
};

/**
 * Get the download URL for a file in Firebase Storage.
 * @param {string} storagePath - Full path in storage
 * @returns {string} Download URL
 */
export const getImageUrl = async (storagePath) => {
  try {
    const storageRef = ref(storage, storagePath);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("[Storage] Error getting image URL:", error);
    throw error;
  }
};
