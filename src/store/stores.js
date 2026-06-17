import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Auth Store
export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  logout: () => set({ user: null, error: null }),
}));

// Location Store
export const useLocationStore = create(
  persist(
    (set) => ({
      currentLocation: null,
      permissionStatus: "undetermined",
      watchId: null,

      setCurrentLocation: (location) => set({ currentLocation: location }),
      setPermissionStatus: (status) => set({ permissionStatus: status }),
      setWatchId: (id) => set({ watchId: id }),
    }),
    {
      name: "location-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

// Feed Store
export const useFeedStore = create((set) => ({
  posts: [],
  loading: false,
  error: null,

  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

// Theme Store
export const useThemeStore = create(
  persist(
    (set) => ({
      isDark: false,

      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      setDarkMode: (isDark) => set({ isDark }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

// Privacy Store
export const usePrivacyStore = create(
  persist(
    (set) => ({
      locationPrivacy: {
        mode: "hidden", // 'exact' | 'blurred' | 'hidden'
        invisibleMode: false,
      },

      setLocationPrivacy: (privacy) => set({ locationPrivacy: privacy }),
      updatePrivacyMode: (mode) =>
        set((state) => ({
          locationPrivacy: { ...state.locationPrivacy, mode },
        })),
      toggleInvisibleMode: () =>
        set((state) => ({
          locationPrivacy: {
            ...state.locationPrivacy,
            invisibleMode: !state.locationPrivacy.invisibleMode,
          },
        })),
    }),
    {
      name: "privacy-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
