import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { storage } from "./firebase";

/**
 * Konversi URI lokal (file:// atau content://) menjadi Blob
 * untuk diupload ke Firebase Storage.
 * @param {string} uri - URI file dari image picker / camera
 * @returns {Promise<Blob>}
 */
const uriToBlob = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

/**
 * Generate nama file unik berdasarkan timestamp + random string
 * @param {string} originalName - nama file asli (opsional)
 * @returns {string}
 */
const generateFileName = (originalName = "") => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split(".").pop() || "jpg";
  return `${timestamp}_${random}.${ext}`;
};

// ===== Upload Foto Post =====

/**
 * Upload foto post ke Firebase Storage dengan progress tracking.
 *
 * Path: /posts/{userId}/{fileName}
 *
 * @param {string} userId       - ID user yang mengupload
 * @param {string} imageUri     - URI lokal gambar (dari expo-image-picker)
 * @param {Function} onProgress - Callback progress (0-100). Dipanggil setiap ada update.
 *                                Signature: (percentage: number) => void
 * @returns {Promise<{ downloadURL: string, storagePath: string }>}
 *
 * @example
 * const { downloadURL } = await uploadPostImage(
 *   userId,
 *   selectedImage.uri,
 *   (progress) => setUploadProgress(progress)
 * );
 */
export const uploadPostImage = async (userId, imageUri, onProgress = null) => {
  try {
    const blob = await uriToBlob(imageUri);
    const fileName = generateFileName();
    const storagePath = `posts/${userId}/${fileName}`;
    const storageRef = ref(storage, storagePath);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress tracking
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          if (onProgress) {
            onProgress(progress);
          }
          console.log(`[Storage] Upload post image: ${progress}%`);
        },
        (error) => {
          // Error handling
          console.error("[Storage] Upload post image failed:", error);
          reject(error);
        },
        async () => {
          // Upload selesai — ambil download URL
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("[Storage] Upload post image complete:", downloadURL);
            resolve({ downloadURL, storagePath });
          } catch (error) {
            reject(error);
          }
        },
      );
    });
  } catch (error) {
    console.error("[Storage] uploadPostImage error:", error);
    throw error;
  }
};

// ===== Upload Foto Profil =====

/**
 * Upload foto profil ke Firebase Storage dengan progress tracking.
 *
 * Path: /profiles/{userId}/avatar.{ext}
 * Overwrite foto profil lama secara otomatis.
 *
 * @param {string} userId       - ID user
 * @param {string} imageUri     - URI lokal gambar
 * @param {Function} onProgress - Callback progress (0-100)
 * @returns {Promise<{ downloadURL: string, storagePath: string }>}
 */
export const uploadProfilePhoto = async (
  userId,
  imageUri,
  onProgress = null,
) => {
  try {
    const blob = await uriToBlob(imageUri);
    const fileName = `avatar_${Date.now()}.jpg`;
    const storagePath = `profiles/${userId}/${fileName}`;
    const storageRef = ref(storage, storagePath);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          if (onProgress) {
            onProgress(progress);
          }
          console.log(`[Storage] Upload profile photo: ${progress}%`);
        },
        (error) => {
          console.error("[Storage] Upload profile photo failed:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log(
              "[Storage] Upload profile photo complete:",
              downloadURL,
            );
            resolve({ downloadURL, storagePath });
          } catch (error) {
            reject(error);
          }
        },
      );
    });
  } catch (error) {
    console.error("[Storage] uploadProfilePhoto error:", error);
    throw error;
  }
};

// ===== Upload Foto Venue / Check-in =====

/**
 * Upload foto untuk venue check-in ke Firebase Storage.
 *
 * Path: /venues/{venueId}/{userId}_{fileName}
 *
 * @param {string} userId       - ID user
 * @param {string} venueId      - ID venue (dari Google Places atau Firestore)
 * @param {string} imageUri     - URI lokal gambar
 * @param {Function} onProgress - Callback progress (0-100)
 * @returns {Promise<{ downloadURL: string, storagePath: string }>}
 */
export const uploadVenuePhoto = async (
  userId,
  venueId,
  imageUri,
  onProgress = null,
) => {
  try {
    const blob = await uriToBlob(imageUri);
    const fileName = generateFileName();
    const storagePath = `venues/${venueId}/${userId}_${fileName}`;
    const storageRef = ref(storage, storagePath);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          if (onProgress) {
            onProgress(progress);
          }
          console.log(`[Storage] Upload venue photo: ${progress}%`);
        },
        (error) => {
          console.error("[Storage] Upload venue photo failed:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("[Storage] Upload venue photo complete:", downloadURL);
            resolve({ downloadURL, storagePath });
          } catch (error) {
            reject(error);
          }
        },
      );
    });
  } catch (error) {
    console.error("[Storage] uploadVenuePhoto error:", error);
    throw error;
  }
};

// ===== Upload Foto Event =====

/**
 * Upload foto cover untuk event.
 *
 * Path: /events/{eventId}/{fileName}
 *
 * @param {string} eventId      - ID event di Firestore
 * @param {string} imageUri     - URI lokal gambar
 * @param {Function} onProgress - Callback progress (0-100)
 * @returns {Promise<{ downloadURL: string, storagePath: string }>}
 */
export const uploadEventPhoto = async (
  eventId,
  imageUri,
  onProgress = null,
) => {
  try {
    const blob = await uriToBlob(imageUri);
    const fileName = generateFileName();
    const storagePath = `events/${eventId}/${fileName}`;
    const storageRef = ref(storage, storagePath);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          if (onProgress) {
            onProgress(progress);
          }
          console.log(`[Storage] Upload event photo: ${progress}%`);
        },
        (error) => {
          console.error("[Storage] Upload event photo failed:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("[Storage] Upload event photo complete:", downloadURL);
            resolve({ downloadURL, storagePath });
          } catch (error) {
            reject(error);
          }
        },
      );
    });
  } catch (error) {
    console.error("[Storage] uploadEventPhoto error:", error);
    throw error;
  }
};

// ===== Generic Upload (Reusable) =====

/**
 * Upload file generik ke Firebase Storage. Bisa dipakai untuk
 * tipe file apa saja dan path kustom.
 *
 * @param {string} storagePath  - Full path di Storage (e.g. "stories/userId/file.jpg")
 * @param {string} fileUri      - URI lokal file
 * @param {Function} onProgress - Callback progress (0-100)
 * @returns {Promise<{ downloadURL: string, storagePath: string }>}
 */
export const uploadFile = async (storagePath, fileUri, onProgress = null) => {
  try {
    const blob = await uriToBlob(fileUri);
    const storageRef = ref(storage, storagePath);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error("[Storage] Upload file failed:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ downloadURL, storagePath });
          } catch (error) {
            reject(error);
          }
        },
      );
    });
  } catch (error) {
    console.error("[Storage] uploadFile error:", error);
    throw error;
  }
};

// ===== Delete File =====

/**
 * Hapus file dari Firebase Storage berdasarkan storage path.
 * @param {string} storagePath - Path file di Storage (e.g. "posts/userId/file.jpg")
 */
export const deleteFile = async (storagePath) => {
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    console.log("[Storage] File deleted:", storagePath);
  } catch (error) {
    // Jika file tidak ditemukan, jangan throw (graceful)
    if (error.code === "storage/object-not-found") {
      console.warn("[Storage] File not found, skipping delete:", storagePath);
      return;
    }
    console.error("[Storage] Delete file failed:", error);
    throw error;
  }
};

/**
 * Hapus semua file di folder tertentu (e.g. semua foto profil lama).
 * @param {string} folderPath - Path folder di Storage
 */
export const deleteFolder = async (folderPath) => {
  try {
    const folderRef = ref(storage, folderPath);
    const listResult = await listAll(folderRef);

    const deletePromises = listResult.items.map((itemRef) =>
      deleteObject(itemRef),
    );
    await Promise.all(deletePromises);

    console.log(
      `[Storage] Folder deleted: ${folderPath} (${listResult.items.length} files)`,
    );
  } catch (error) {
    console.error("[Storage] Delete folder failed:", error);
    throw error;
  }
};

// ===== Get Download URL =====

/**
 * Ambil download URL dari file yang sudah diupload.
 * @param {string} storagePath - Path file di Storage
 * @returns {Promise<string>} download URL
 */
export const getFileURL = async (storagePath) => {
  try {
    const storageRef = ref(storage, storagePath);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("[Storage] Get URL failed:", error);
    throw error;
  }
};
