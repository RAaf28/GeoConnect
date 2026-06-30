import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  increment,
  orderBy,
  limit as firestoreLimit,
  runTransaction,
} from "firebase/firestore";
import { firestore } from "./firebase";

// ===== Users Collection =====
export const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(firestore, "users", userId), {
      ...userData,
      createdAt: serverTimestamp(),
      locationPrivacy: {
        mode: "hidden", // default OFF
        invisibleMode: false,
      },
      followersCount: 0,
      followingCount: 0,
    });
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const docSnap = await getDoc(doc(firestore, "users", userId));
    return docSnap.exists() ? { ...docSnap.data(), id: docSnap.id } : null;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    await updateDoc(doc(firestore, "users", userId), updates);
  } catch (error) {
    throw error;
  }
};

// ===== Location Privacy Settings =====
export const updateLocationPrivacy = async (userId, privacySettings) => {
  try {
    await updateDoc(doc(firestore, "users", userId), {
      locationPrivacy: privacySettings,
    });
  } catch (error) {
    throw error;
  }
};

export const getLocationPrivacy = async (userId) => {
  try {
    const userDoc = await getDoc(doc(firestore, "users", userId));
    return (
      userDoc.data()?.locationPrivacy || {
        mode: "hidden",
        invisibleMode: false,
      }
    );
  } catch (error) {
    throw error;
  }
};

// ===== Posts Collection =====
export const createPost = async (userId, postData) => {
  try {
    const docRef = await addDoc(collection(firestore, "posts"), {
      ...postData,
      authorId: userId,
      createdAt: serverTimestamp(),
      likesCount: 0,
      commentsCount: 0,
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil single post by ID
 * @param {string} postId
 * @returns {object|null} post data dengan id
 */
export const getPost = async (postId) => {
  try {
    const docSnap = await getDoc(doc(firestore, "posts", postId));
    return docSnap.exists() ? { ...docSnap.data(), id: docSnap.id } : null;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil semua post milik user tertentu
 * @param {string} userId
 * @returns {Array} list of posts
 */
export const getUserPosts = async (userId) => {
  try {
    const q = query(
      collection(firestore, "posts"),
      where("authorId", "==", userId),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil posts di area sekitar berdasarkan GeoHash prefix (legacy simple approach).
 * Untuk query yang lebih akurat, gunakan getPostsByGeoHashBounds().
 */
export const getPostsNearby = async (geoHashPrefix, maxResults = 20) => {
  try {
    const q = query(
      collection(firestore, "posts"),
      where("geoHash", ">=", geoHashPrefix),
      where("geoHash", "<", geoHashPrefix + "z"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil posts di area sekitar menggunakan multi-range GeoHash bounds.
 * Ini adalah cara BENAR untuk melakukan radius query — menggunakan
 * bounds dari geohashQueryBounds() di geofire-common.
 *
 * @param {Array<[string, string]>} bounds - Array of [startHash, endHash] from getGeoHashBounds()
 * @returns {Array} merged list of posts (may contain results outside actual radius — filter client-side)
 */
export const getPostsByGeoHashBounds = async (bounds) => {
  try {
    const promises = bounds.map(([startHash, endHash]) => {
      const q = query(
        collection(firestore, "posts"),
        where("geoHash", ">=", startHash),
        where("geoHash", "<=", endHash),
        orderBy("geoHash"),
      );
      return getDocs(q);
    });

    const snapshots = await Promise.all(promises);

    // Merge results dan deduplicate by doc id
    const seen = new Set();
    const results = [];
    for (const snap of snapshots) {
      for (const d of snap.docs) {
        if (!seen.has(d.id)) {
          seen.add(d.id);
          results.push({ ...d.data(), id: d.id });
        }
      }
    }

    return results;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil events di area sekitar menggunakan multi-range GeoHash bounds.
 * @param {Array<[string, string]>} bounds - Array of [startHash, endHash]
 * @returns {Array} merged list of events
 */
export const getEventsByGeoHashBounds = async (bounds) => {
  try {
    const promises = bounds.map(([startHash, endHash]) => {
      const q = query(
        collection(firestore, "events"),
        where("geoHash", ">=", startHash),
        where("geoHash", "<=", endHash),
        orderBy("geoHash"),
      );
      return getDocs(q);
    });

    const snapshots = await Promise.all(promises);

    const seen = new Set();
    const results = [];
    for (const snap of snapshots) {
      for (const d of snap.docs) {
        if (!seen.has(d.id)) {
          seen.add(d.id);
          results.push({ ...d.data(), id: d.id });
        }
      }
    }

    return results;
  } catch (error) {
    throw error;
  }
};

// ===== Follow / Unfollow =====
// Schema: /follows/{followerId_followingId}
//   - followerId, followingId, createdAt
// Counters: users/{userId}.followersCount, users/{userId}.followingCount

/**
 * Follow seorang user. Menggunakan transaction untuk atomicity
 * agar followersCount & followingCount selalu konsisten.
 * @param {string} currentUserId - user yang melakukan follow
 * @param {string} targetUserId  - user yang di-follow
 */
export const followUser = async (currentUserId, targetUserId) => {
  if (currentUserId === targetUserId) {
    throw new Error("Tidak bisa follow diri sendiri");
  }

  const followDocId = `${currentUserId}_${targetUserId}`;
  const followRef = doc(firestore, "follows", followDocId);
  const currentUserRef = doc(firestore, "users", currentUserId);
  const targetUserRef = doc(firestore, "users", targetUserId);

  try {
    await runTransaction(firestore, async (transaction) => {
      const followSnap = await transaction.get(followRef);

      if (followSnap.exists()) {
        throw new Error("Sudah follow user ini");
      }

      // Buat dokumen follow
      transaction.set(followRef, {
        followerId: currentUserId,
        followingId: targetUserId,
        createdAt: serverTimestamp(),
      });

      // Increment counter di kedua user
      transaction.update(currentUserRef, {
        followingCount: increment(1),
      });
      transaction.update(targetUserRef, {
        followersCount: increment(1),
      });
    });

    return { success: true, followDocId };
  } catch (error) {
    throw error;
  }
};

/**
 * Unfollow seorang user. Transaction-based counter decrement.
 * @param {string} currentUserId - user yang melakukan unfollow
 * @param {string} targetUserId  - user yang di-unfollow
 */
export const unfollowUser = async (currentUserId, targetUserId) => {
  const followDocId = `${currentUserId}_${targetUserId}`;
  const followRef = doc(firestore, "follows", followDocId);
  const currentUserRef = doc(firestore, "users", currentUserId);
  const targetUserRef = doc(firestore, "users", targetUserId);

  try {
    await runTransaction(firestore, async (transaction) => {
      const followSnap = await transaction.get(followRef);

      if (!followSnap.exists()) {
        throw new Error("Belum follow user ini");
      }

      // Hapus dokumen follow
      transaction.delete(followRef);

      // Decrement counter di kedua user
      transaction.update(currentUserRef, {
        followingCount: increment(-1),
      });
      transaction.update(targetUserRef, {
        followersCount: increment(-1),
      });
    });

    return { success: true };
  } catch (error) {
    throw error;
  }
};

/**
 * Cek apakah currentUser sudah follow targetUser
 * @param {string} currentUserId
 * @param {string} targetUserId
 * @returns {boolean}
 */
export const isFollowing = async (currentUserId, targetUserId) => {
  try {
    const followDocId = `${currentUserId}_${targetUserId}`;
    const followSnap = await getDoc(doc(firestore, "follows", followDocId));
    return followSnap.exists();
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil daftar followers dari user tertentu
 * @param {string} userId
 * @returns {Array} list of follower user IDs
 */
export const getFollowers = async (userId) => {
  try {
    const q = query(
      collection(firestore, "follows"),
      where("followingId", "==", userId),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil daftar user yang di-follow oleh user tertentu
 * @param {string} userId
 * @returns {Array} list of following user IDs
 */
export const getFollowing = async (userId) => {
  try {
    const q = query(
      collection(firestore, "follows"),
      where("followerId", "==", userId),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));
  } catch (error) {
    throw error;
  }
};

// ===== Like / Unlike =====
// Schema: /posts/{postId}/likes/{userId}
//   - userId, createdAt
// Counter: posts/{postId}.likesCount

/**
 * Like sebuah post. Transaction-based untuk atomic counter update.
 * @param {string} userId - user yang like
 * @param {string} postId - post yang di-like
 */
export const likePost = async (userId, postId) => {
  const likeRef = doc(firestore, "posts", postId, "likes", userId);
  const postRef = doc(firestore, "posts", postId);

  try {
    await runTransaction(firestore, async (transaction) => {
      const likeSnap = await transaction.get(likeRef);

      if (likeSnap.exists()) {
        throw new Error("Sudah like post ini");
      }

      // Buat dokumen like
      transaction.set(likeRef, {
        userId,
        createdAt: serverTimestamp(),
      });

      // Increment likesCount di post
      transaction.update(postRef, {
        likesCount: increment(1),
      });
    });

    return { success: true };
  } catch (error) {
    throw error;
  }
};

/**
 * Unlike sebuah post. Transaction-based counter decrement.
 * @param {string} userId - user yang unlike
 * @param {string} postId - post yang di-unlike
 */
export const unlikePost = async (userId, postId) => {
  const likeRef = doc(firestore, "posts", postId, "likes", userId);
  const postRef = doc(firestore, "posts", postId);

  try {
    await runTransaction(firestore, async (transaction) => {
      const likeSnap = await transaction.get(likeRef);

      if (!likeSnap.exists()) {
        throw new Error("Belum like post ini");
      }

      // Hapus dokumen like
      transaction.delete(likeRef);

      // Decrement likesCount di post
      transaction.update(postRef, {
        likesCount: increment(-1),
      });
    });

    return { success: true };
  } catch (error) {
    throw error;
  }
};

/**
 * Toggle like: otomatis like jika belum, unlike jika sudah
 * @param {string} userId
 * @param {string} postId
 * @returns {{ liked: boolean }} status setelah toggle
 */
export const toggleLike = async (userId, postId) => {
  const likeRef = doc(firestore, "posts", postId, "likes", userId);
  const postRef = doc(firestore, "posts", postId);

  try {
    const result = await runTransaction(firestore, async (transaction) => {
      const likeSnap = await transaction.get(likeRef);

      if (likeSnap.exists()) {
        // Unlike
        transaction.delete(likeRef);
        transaction.update(postRef, { likesCount: increment(-1) });
        return { liked: false };
      } else {
        // Like
        transaction.set(likeRef, {
          userId,
          createdAt: serverTimestamp(),
        });
        transaction.update(postRef, { likesCount: increment(1) });
        return { liked: true };
      }
    });

    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Cek apakah user sudah like post tertentu
 * @param {string} userId
 * @param {string} postId
 * @returns {boolean}
 */
export const hasLikedPost = async (userId, postId) => {
  try {
    const likeSnap = await getDoc(
      doc(firestore, "posts", postId, "likes", userId),
    );
    return likeSnap.exists();
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil daftar user yang like post tertentu
 * @param {string} postId
 * @returns {Array} list of likes
 */
export const getPostLikes = async (postId) => {
  try {
    const q = query(collection(firestore, "posts", postId, "likes"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));
  } catch (error) {
    throw error;
  }
};

// ===== Comments =====
// Schema: /posts/{postId}/comments/{commentId}
//   - authorId, text, createdAt, updatedAt
// Counter: posts/{postId}.commentsCount

/**
 * Tambah komentar pada post. Transaction-based counter update.
 * @param {string} userId   - user yang komentar
 * @param {string} postId   - post yang dikomentari
 * @param {string} text     - isi komentar
 * @returns {string} commentId
 */
export const addComment = async (userId, postId, text) => {
  if (!text || text.trim().length === 0) {
    throw new Error("Komentar tidak boleh kosong");
  }

  const postRef = doc(firestore, "posts", postId);
  const commentsRef = collection(firestore, "posts", postId, "comments");

  try {
    // Tambah komentar dulu (addDoc tidak bisa di dalam transaction)
    const commentDocRef = await addDoc(commentsRef, {
      authorId: userId,
      text: text.trim(),
      createdAt: serverTimestamp(),
      updatedAt: null,
    });

    // Increment commentsCount di post
    await updateDoc(postRef, {
      commentsCount: increment(1),
    });

    return commentDocRef.id;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil semua komentar pada post, diurutkan dari terbaru
 * @param {string} postId
 * @param {number} maxResults - jumlah maksimum komentar
 * @returns {Array} list of comments
 */
export const getComments = async (postId, maxResults = 50) => {
  try {
    const q = query(
      collection(firestore, "posts", postId, "comments"),
      orderBy("createdAt", "desc"),
      firestoreLimit(maxResults),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));
  } catch (error) {
    throw error;
  }
};

/**
 * Update isi komentar (hanya oleh author)
 * @param {string} postId    - post tempat komentar berada
 * @param {string} commentId - ID komentar
 * @param {string} userId    - user yang request update (untuk validasi ownership)
 * @param {string} newText   - isi komentar baru
 */
export const updateComment = async (postId, commentId, userId, newText) => {
  if (!newText || newText.trim().length === 0) {
    throw new Error("Komentar tidak boleh kosong");
  }

  const commentRef = doc(
    firestore,
    "posts",
    postId,
    "comments",
    commentId,
  );

  try {
    // Validasi ownership
    const commentSnap = await getDoc(commentRef);
    if (!commentSnap.exists()) {
      throw new Error("Komentar tidak ditemukan");
    }
    if (commentSnap.data().authorId !== userId) {
      throw new Error("Tidak bisa mengedit komentar orang lain");
    }

    await updateDoc(commentRef, {
      text: newText.trim(),
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    throw error;
  }
};

/**
 * Hapus komentar (hanya oleh author atau post owner)
 * @param {string} postId    - post tempat komentar berada
 * @param {string} commentId - ID komentar
 * @param {string} userId    - user yang request hapus
 */
export const deleteComment = async (postId, commentId, userId) => {
  const commentRef = doc(
    firestore,
    "posts",
    postId,
    "comments",
    commentId,
  );
  const postRef = doc(firestore, "posts", postId);

  try {
    // Validasi ownership (author komentar ATAU pemilik post boleh hapus)
    const [commentSnap, postSnap] = await Promise.all([
      getDoc(commentRef),
      getDoc(postRef),
    ]);

    if (!commentSnap.exists()) {
      throw new Error("Komentar tidak ditemukan");
    }

    const isCommentAuthor = commentSnap.data().authorId === userId;
    const isPostOwner = postSnap.exists() && postSnap.data().authorId === userId;

    if (!isCommentAuthor && !isPostOwner) {
      throw new Error("Tidak punya izin untuk menghapus komentar ini");
    }

    await deleteDoc(commentRef);

    // Decrement commentsCount di post
    await updateDoc(postRef, {
      commentsCount: increment(-1),
    });

    return { success: true };
  } catch (error) {
    throw error;
  }
};

/**
 * Hitung jumlah komentar pada post (dari subcollection, bukan counter)
 * Berguna untuk validasi/sync counter
 * @param {string} postId
 * @returns {number}
 */
export const getCommentsCount = async (postId) => {
  try {
    const q = query(collection(firestore, "posts", postId, "comments"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    throw error;
  }
};

// ===== Check-ins Collection =====
export const createCheckin = async (userId, checkinData) => {
  try {
    const docRef = await addDoc(collection(firestore, "checkins"), {
      ...checkinData,
      userId,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// ===== Events Collection =====

/**
 * Buat event baru dengan data geolokasi
 * @param {string} userId   - ID user creator
 * @param {object} eventData - { title, description, startDate, endDate, geoHash, lat, lng, locationLabel, imageURL? }
 * @returns {string} eventId
 */
export const createEvent = async (userId, eventData) => {
  try {
    const docRef = await addDoc(collection(firestore, "events"), {
      ...eventData,
      creatorId: userId,
      createdAt: serverTimestamp(),
      rsvpCounts: { going: 0, interested: 0 },
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil single event by ID
 * @param {string} eventId
 * @returns {object|null} event data dengan id
 */
export const getEvent = async (eventId) => {
  try {
    const docSnap = await getDoc(doc(firestore, "events", eventId));
    return docSnap.exists() ? { ...docSnap.data(), id: docSnap.id } : null;
  } catch (error) {
    throw error;
  }
};

/**
 * Update data event (hanya oleh creator)
 * @param {string} eventId
 * @param {object} updates - fields yang mau diupdate
 */
export const updateEvent = async (eventId, updates) => {
  try {
    await updateDoc(doc(firestore, "events", eventId), updates);
  } catch (error) {
    throw error;
  }
};

/**
 * Hapus event beserta semua RSVP-nya
 * @param {string} eventId
 * @param {string} userId - untuk validasi ownership
 */
export const deleteEvent = async (eventId, userId) => {
  try {
    const eventSnap = await getDoc(doc(firestore, "events", eventId));
    if (!eventSnap.exists()) {
      throw new Error("Event tidak ditemukan");
    }
    if (eventSnap.data().creatorId !== userId) {
      throw new Error("Hanya creator yang bisa menghapus event");
    }

    // Hapus semua RSVP terkait event ini
    const rsvpQuery = query(
      collection(firestore, "rsvp"),
      where("eventId", "==", eventId),
    );
    const rsvpSnapshot = await getDocs(rsvpQuery);
    const deletePromises = rsvpSnapshot.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);

    // Hapus event
    await deleteDoc(doc(firestore, "events", eventId));
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil events di area sekitar berdasarkan GeoHash prefix
 * @param {string} geoHashPrefix
 * @returns {Array} list of events
 */
export const getEventsNearby = async (geoHashPrefix) => {
  try {
    const q = query(
      collection(firestore, "events"),
      where("geoHash", ">=", geoHashPrefix),
      where("geoHash", "<", geoHashPrefix + "z"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil semua event yang dibuat oleh user tertentu
 * @param {string} userId
 * @returns {Array} list of events
 */
export const getUserEvents = async (userId) => {
  try {
    const q = query(
      collection(firestore, "events"),
      where("creatorId", "==", userId),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
  } catch (error) {
    throw error;
  }
};

// ===== RSVP (Event Response) =====
// Schema: /rsvp/{eventId_userId}
//   - userId, eventId, status: "going"|"interested"|"not_going", createdAt, updatedAt
// Counter: events/{eventId}.rsvpCounts: { going: number, interested: number }

/**
 * Set atau update RSVP status untuk sebuah event.
 * Menggunakan transaction untuk atomic counter update.
 *
 * Jika user sudah punya RSVP sebelumnya, counter lama akan di-decrement
 * dan counter baru di-increment (status transition).
 *
 * @param {string} userId  - user yang RSVP
 * @param {string} eventId - event yang di-RSVP
 * @param {"going"|"interested"|"not_going"} status - status RSVP
 * @returns {{ success: boolean, previousStatus: string|null }}
 */
export const setRSVP = async (userId, eventId, status) => {
  const validStatuses = ["going", "interested", "not_going"];
  if (!validStatuses.includes(status)) {
    throw new Error(
      `Status RSVP tidak valid: "${status}". Harus salah satu dari: ${validStatuses.join(", ")}`,
    );
  }

  const rsvpDocId = `${eventId}_${userId}`;
  const rsvpRef = doc(firestore, "rsvp", rsvpDocId);
  const eventRef = doc(firestore, "events", eventId);

  try {
    const result = await runTransaction(firestore, async (transaction) => {
      const rsvpSnap = await transaction.get(rsvpRef);
      const eventSnap = await transaction.get(eventRef);

      if (!eventSnap.exists()) {
        throw new Error("Event tidak ditemukan");
      }

      let previousStatus = null;

      if (rsvpSnap.exists()) {
        previousStatus = rsvpSnap.data().status;

        // Jika status sama, tidak perlu update
        if (previousStatus === status) {
          return { success: true, previousStatus, changed: false };
        }

        // Decrement counter status lama (hanya going & interested yang di-track)
        if (previousStatus === "going") {
          transaction.update(eventRef, {
            "rsvpCounts.going": increment(-1),
          });
        } else if (previousStatus === "interested") {
          transaction.update(eventRef, {
            "rsvpCounts.interested": increment(-1),
          });
        }
      }

      // Increment counter status baru (hanya going & interested)
      if (status === "going") {
        transaction.update(eventRef, {
          "rsvpCounts.going": increment(1),
        });
      } else if (status === "interested") {
        transaction.update(eventRef, {
          "rsvpCounts.interested": increment(1),
        });
      }

      // Set/update dokumen RSVP
      transaction.set(rsvpRef, {
        userId,
        eventId,
        status,
        createdAt: rsvpSnap.exists()
          ? rsvpSnap.data().createdAt
          : serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return { success: true, previousStatus, changed: true };
    });

    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Hapus RSVP (cancel attendance). Decrement counter yang sesuai.
 * @param {string} userId
 * @param {string} eventId
 */
export const cancelRSVP = async (userId, eventId) => {
  const rsvpDocId = `${eventId}_${userId}`;
  const rsvpRef = doc(firestore, "rsvp", rsvpDocId);
  const eventRef = doc(firestore, "events", eventId);

  try {
    await runTransaction(firestore, async (transaction) => {
      const rsvpSnap = await transaction.get(rsvpRef);

      if (!rsvpSnap.exists()) {
        throw new Error("RSVP tidak ditemukan");
      }

      const currentStatus = rsvpSnap.data().status;

      // Decrement counter status saat ini
      if (currentStatus === "going") {
        transaction.update(eventRef, {
          "rsvpCounts.going": increment(-1),
        });
      } else if (currentStatus === "interested") {
        transaction.update(eventRef, {
          "rsvpCounts.interested": increment(-1),
        });
      }

      // Hapus dokumen RSVP
      transaction.delete(rsvpRef);
    });

    return { success: true };
  } catch (error) {
    throw error;
  }
};

/**
 * Toggle RSVP: jika sudah RSVP dengan status yang sama → cancel,
 * jika belum atau beda status → set status baru.
 *
 * Cocok untuk tombol "Going" / "Interested" di UI.
 *
 * @param {string} userId
 * @param {string} eventId
 * @param {"going"|"interested"} status
 * @returns {{ currentStatus: string|null }} status setelah toggle
 */
export const toggleRSVP = async (userId, eventId, status) => {
  const rsvpDocId = `${eventId}_${userId}`;
  const rsvpRef = doc(firestore, "rsvp", rsvpDocId);

  try {
    const rsvpSnap = await getDoc(rsvpRef);

    if (rsvpSnap.exists() && rsvpSnap.data().status === status) {
      // Sudah RSVP dengan status yang sama → cancel
      await cancelRSVP(userId, eventId);
      return { currentStatus: null };
    } else {
      // Belum RSVP atau beda status → set status baru
      await setRSVP(userId, eventId, status);
      return { currentStatus: status };
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil RSVP status user untuk event tertentu
 * @param {string} userId
 * @param {string} eventId
 * @returns {string|null} status ("going"|"interested"|"not_going") atau null
 */
export const getUserRSVP = async (userId, eventId) => {
  try {
    const rsvpDocId = `${eventId}_${userId}`;
    const rsvpSnap = await getDoc(doc(firestore, "rsvp", rsvpDocId));
    return rsvpSnap.exists() ? rsvpSnap.data().status : null;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil semua user yang RSVP ke event tertentu
 * @param {string} eventId
 * @param {"going"|"interested"|null} filterStatus - filter berdasarkan status (null = semua)
 * @returns {Array} list of RSVPs
 */
export const getEventRSVPs = async (eventId, filterStatus = null) => {
  try {
    let q;
    if (filterStatus) {
      q = query(
        collection(firestore, "rsvp"),
        where("eventId", "==", eventId),
        where("status", "==", filterStatus),
      );
    } else {
      q = query(
        collection(firestore, "rsvp"),
        where("eventId", "==", eventId),
      );
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil semua event yang user sudah RSVP (untuk "My Events" page)
 * @param {string} userId
 * @param {"going"|"interested"|null} filterStatus - filter berdasarkan status
 * @returns {Array} list of RSVPs dengan eventId
 */
export const getUserRSVPs = async (userId, filterStatus = null) => {
  try {
    let q;
    if (filterStatus) {
      q = query(
        collection(firestore, "rsvp"),
        where("userId", "==", userId),
        where("status", "==", filterStatus),
      );
    } else {
      q = query(
        collection(firestore, "rsvp"),
        where("userId", "==", userId),
      );
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));
  } catch (error) {
    throw error;
  }
};

// ===== Location History =====
export const addLocationHistory = async (userId, locationData) => {
  try {
    await addDoc(collection(firestore, "locationHistory", userId, "entries"), {
      ...locationData,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};

export const deleteLocationHistory = async (userId) => {
  try {
    const q = query(
      collection(firestore, "locationHistory", userId, "entries"),
    );
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    throw error;
  }
};
