import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();

// Create account with email
export const createAccount = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Sign in with email
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    throw error;
  }
};

// Update user profile (displayName and photoURL)
export const updateUserProfile = async (displayName, photoURL) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    await updateProfile(user, {
      displayName: displayName || null,
      photoURL: photoURL || null,
    });

    return user;
  } catch (error) {
    throw error;
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Listen to auth state changes
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};


// Send password reset email
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

// Change password for email/password accounts (requires current password)
export const changePassword = async (currentPassword, newPassword) => {
  const user = auth.currentUser;
  if (!user?.email) throw new Error("No email user logged in");

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};

// Get sign-in info for the security screen
export const getAuthSecurityInfo = () => {
  const user = auth.currentUser;
  if (!user) return null;

  const providers = user.providerData.map((p) => p.providerId);
  const hasPassword = providers.includes("password");
  const hasGoogle = providers.includes("google.com");

  return {
    email: user.email,
    emailVerified: user.emailVerified,
    providers,
    hasPassword,
    hasGoogle,
    createdAt: user.metadata.creationTime,
    lastSignIn: user.metadata.lastSignInTime,
  };
};
