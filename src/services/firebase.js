import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
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

console.log("[Firebase] Initializing Firebase App...");
const app = initializeApp(firebaseConfig);
console.log("[Firebase] Firebase App initialized successfully.");

console.log("[Firebase] Initializing Auth...");
let authInstance;
try {
  authInstance = getAuth(app);
  console.log("[Firebase] Firebase Auth already initialized, reusing instance.");
} catch (e) {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  console.log("[Firebase] Firebase Auth initialized successfully with AsyncStorage persistence.");
}
export const auth = authInstance;

console.log("[Firebase] Initializing Firestore...");
export const firestore = getFirestore(app);
console.log("[Firebase] Firestore initialized successfully.");

console.log("[Firebase] Initializing Storage...");
export const storage = getStorage(app);
console.log("[Firebase] Storage initialized successfully.");

export default app;
