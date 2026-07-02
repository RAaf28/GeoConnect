import { getApps, initializeApp, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

if (__DEV__) console.log("[Firebase] Initializing Firebase App...");
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
if (__DEV__) console.log("[Firebase] Firebase App initialized successfully.");

if (__DEV__) console.log("[Firebase] Initializing Auth with AsyncStorage persistence...");
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  if (__DEV__) console.log("[Firebase] Firebase Auth initialized successfully with AsyncStorage persistence.");
} catch (e) {
  // If already initialized, get the existing auth instance
  if (__DEV__) console.log("[Firebase] Firebase Auth already initialized, reusing instance.");
  auth = getAuth(app);
}

if (__DEV__) console.log("[Firebase] Initializing Firestore...");
const firestore = getFirestore(app);
if (__DEV__) console.log("[Firestore] Firestore initialized successfully.");

if (__DEV__) console.log("[Firebase] Initializing Storage...");
const storage = getStorage(app);
if (__DEV__) console.log("[Storage] Storage initialized successfully.");

export { auth, firestore, storage };
export default app;