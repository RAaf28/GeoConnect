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

export const getPostsNearby = async (geoHashPrefix, limit = 20) => {
  try {
    const q = query(
      collection(firestore, "posts"),
      where("geoHash", ">=", geoHashPrefix),
      where("geoHash", "<", geoHashPrefix + "z"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
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

export const getEventsNearby = async (geoHashPrefix) => {
  try {
    const q = query(
      collection(firestore, "events"),
      where("geoHash", ">=", geoHashPrefix),
      where("geoHash", "<", geoHashPrefix + "z"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
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
    querySnapshot.docs.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (error) {
    throw error;
  }
};
