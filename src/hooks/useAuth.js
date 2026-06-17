import { useEffect, useState } from "react";
import { onAuthChange } from "../services/authService";
import { getUserProfile } from "../services/firestoreService";
import { useAuthStore } from "../store/stores";

export const useAuth = () => {
  const { user, loading, setUser, setLoading, setError } = useAuthStore();

  useEffect(() => {
    console.log("[useAuth] Hook mounted, listening to auth changes...");
    const unsubscribe = onAuthChange(async (authUser) => {
      console.log("[useAuth] onAuthChange event fired. authUser:", authUser ? authUser.uid : "null");
      if (authUser) {
        try {
          console.log("[useAuth] Fetching user profile from Firestore...");
          const profile = await getUserProfile(authUser.uid);
          console.log("[useAuth] User profile fetched successfully.");
          setUser({
            uid: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName,
            photoURL: authUser.photoURL,
            ...profile,
          });
        } catch (error) {
          console.error("[useAuth] Error fetching user profile:", error);
          setError(error);
          setLoading(false);
        }
      } else {
        console.log("[useAuth] No authenticated user found.");
        setUser(null);
      }
      setLoading(false);
      console.log("[useAuth] Finished loading state updates.");
    });

    return unsubscribe;
  }, [setUser, setLoading, setError]);

  return { user, loading };
};

export const useAuthActions = () => {
  const { setUser, setError, logout } = useAuthStore();
  return { setUser, setError, logout };
};
