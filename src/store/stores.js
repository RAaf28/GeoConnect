import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ===== Auth Store =====
export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  logout: () => set({ user: null, error: null }),
}));

// ===== Location Store =====
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

// ===== Feed Store =====
export const useFeedStore = create((set) => ({
  posts: [],
  loading: false,
  error: null,

  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  removePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== postId),
    })),
  updatePost: (postId, updates) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, ...updates } : p,
      ),
    })),
  // Like/unlike helpers that update local state optimistically
  likePostLocal: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? { ...p, likesCount: (p.likesCount || 0) + 1, isLiked: true }
          : p,
      ),
    })),
  unlikePostLocal: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              likesCount: Math.max(0, (p.likesCount || 0) - 1),
              isLiked: false,
            }
          : p,
      ),
    })),
  incrementCommentCount: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? { ...p, commentsCount: (p.commentsCount || 0) + 1 }
          : p,
      ),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

// ===== Theme Store =====
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

// ===== Privacy Store =====
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

// ===== Notification Store =====
export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  markAsReadLocal: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllReadLocal: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  setUnreadCount: (count) => set({ unreadCount: count }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
