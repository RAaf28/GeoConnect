import React, { useRef, useEffect, useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore } from '../../store/stores';
import { getUserProfile, getUserPosts, getUserCheckins } from '../../services/firestoreService';

const getHtmlContent = (isDark) => {
  return `<!DOCTYPE html><html class="${isDark ? 'dark' : 'light'}" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>GeoConnect Profile</title>
<link href="https://fonts.googleapis.com" rel="preconnect">
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "muted-zinc": "#64748B","surface-bright": "#fcf8ff","on-secondary": "#ffffff",
                    "on-surface": "#1b1b23","tertiary-fixed-dim": "#ffb783","surface-variant": "#e4e1ed",
                    "error": "#ba1a1a","primary": "#4648d4","secondary-container": "#dae2fd",
                    "primary-fixed-dim": "#c0c1ff","canvas-white": "#F9FAFB","on-tertiary-fixed": "#301400",
                    "on-tertiary": "#ffffff","secondary-fixed": "#dae2fd","primary-container": "#6063ee",
                    "on-error": "#ffffff","error-container": "#ffdad6","outline-variant": "#c7c4d7",
                    "surface-container-low": "#f5f2fe","on-tertiary-container": "#fffbff",
                    "tertiary-fixed": "#ffdcc5","surface-container-high": "#e9e6f3","surface": "#fcf8ff",
                    "tertiary-container": "#b55d00","tertiary": "#904900","on-primary": "#ffffff",
                    "on-error-container": "#93000a","inverse-primary": "#c0c1ff",
                    "on-surface-variant": "#464554","surface-container": "#efecf8",
                    "surface-pure": "#FFFFFF","surface-dim": "#dbd8e4",
                    "surface-container-highest": "#e4e1ed","soft-border": "rgba(226, 232, 240, 0.8)",
                    "background": "#fcf8ff","on-secondary-container": "#5c647a",
                    "secondary-fixed-dim": "#bec6e0","on-tertiary-fixed-variant": "#703700",
                    "on-background": "#1b1b23","surface-container-lowest": "#ffffff",
                    "on-primary-fixed-variant": "#2f2ebe","inverse-on-surface": "#f2effb",
                    "on-secondary-fixed-variant": "#3f465c","primary-fixed": "#e1e0ff",
                    "on-primary-fixed": "#07006c","inverse-surface": "#303038",
                    "secondary": "#565e74","on-secondary-fixed": "#131b2e",
                    "on-primary-container": "#fffbff","outline": "#767586","surface-tint": "#494bd6"
            },
            "borderRadius": {"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},
            "spacing": {"gutter-grid":"16px","margin-page":"24px","stack-gap":"12px","safe-area":"32px"},
            "fontFamily": {"technical-label":["JetBrains Mono"],"headline-lg":["Plus Jakarta Sans"],"headline-lg-mobile":["Plus Jakarta Sans"],"body-lg":["Plus Jakarta Sans"],"headline-md":["Plus Jakarta Sans"],"body-md":["Plus Jakarta Sans"]},
            "fontSize": {"technical-label":["12px",{"lineHeight":"1.4","fontWeight":"500"}],"headline-lg":["32px",{"lineHeight":"1.2","letterSpacing":"-0.02em","fontWeight":"700"}],"headline-lg-mobile":["28px",{"lineHeight":"1.2","fontWeight":"700"}],"body-lg":["16px",{"lineHeight":"1.6","fontWeight":"400"}],"headline-md":["24px",{"lineHeight":"1.2","letterSpacing":"-0.01em","fontWeight":"700"}],"body-md":["14px",{"lineHeight":"1.6","fontWeight":"400"}]}
          },
        },
      }
    </script>
<style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .whisper-shadow { box-shadow: 0 10px 30px -10px rgba(70, 72, 212, 0.08); }
        .stagger-reveal { animation: staggerReveal 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; transform: translateY(10px); }
        @keyframes staggerReveal { to { opacity: 1; transform: translateY(0); } }
        .css-spinner { width: 2rem; height: 2rem; border: 2px solid rgba(70, 72, 212, 0.2); border-top-color: #4648d4; border-radius: 50%; animation: cssSpin 0.7s linear infinite; }
        @keyframes cssSpin { to { transform: rotate(360deg); } }
        .break-words { overflow-wrap: break-word; word-break: break-word; }
    </style>
</head>
<body class="bg-background dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface font-body-md min-h-screen pb-4">
<!-- Top Bar -->
<header class="fixed top-0 w-full z-50 bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-md shadow-sm h-16 flex justify-between items-center px-margin-page">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[28px]" style="font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;">public</span>
<span class="text-headline-md font-headline-md text-primary tracking-tight">GeoConnect</span>
</div>
<div class="flex items-center gap-3">
<button onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action:'openSettings'}))" class="p-2 rounded-full hover:bg-surface-variant/50 dark:hover:bg-white/10 transition-colors">
<span class="material-symbols-outlined text-on-surface-variant dark:text-inverse-on-surface">settings</span>
</button>
</div>
</header>

<main id="profileContent" class="mt-20 px-margin-page max-w-2xl mx-auto space-y-6">
    <div id="profileLoading" class="flex flex-col items-center py-16 gap-3">
        <div class="css-spinner" aria-hidden="true"></div>
        <p class="text-muted-zinc text-sm">Loading profile...</p>
    </div>
</main>

<script>
        function renderProfile(profile) {
            const container = document.getElementById('profileContent');
            const loading = document.getElementById('profileLoading');
            if (loading) loading.remove();
            const name = profile.displayName || 'Explorer';
            const email = profile.email || '';
            const bio = profile.bio || 'GeoConnect Explorer';
            const photo = profile.photoURL || '';
            const followers = profile.followersCount || 0;
            const following = profile.followingCount || 0;
            const postsCount = profile.postsCount || 0;
            const checkinsCount = profile.checkinsCount || 0;
            const avatarImg = photo ? '<img alt="' + name + '" class="w-full h-full object-cover" src="' + photo + '">' : '<div class="w-full h-full bg-primary flex items-center justify-center text-white text-3xl font-bold">' + name.charAt(0) + '</div>';

            container.innerHTML =
                '<section class="stagger-reveal text-center mb-8" style="animation-delay: 0.1s;">' +
                    '<div class="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-primary/20 mb-4 shadow-sm">' + avatarImg + '</div>' +
                    '<h1 class="text-3xl font-bold font-headline-lg-mobile text-on-surface dark:text-inverse-on-surface break-words tracking-tight leading-tight">' + name + '</h1>' +
                    '<p class="text-muted-zinc mt-1 break-words font-medium text-sm">' + email + '</p>' +
                    '<div class="mt-4 flex justify-center"><p class="text-on-surface-variant dark:text-inverse-on-surface/80 max-w-xs break-words px-4 leading-relaxed">' + bio + '</p></div>' +
                '</section>' +
                '<section class="stagger-reveal grid grid-cols-4 gap-2 mb-8 px-1" style="animation-delay: 0.2s;">' +
                    '<div class="text-center">' +
                        '<p class="text-2xl font-bold font-headline-md text-primary leading-none">' + postsCount + '</p>' +
                        '<p class="text-xs font-bold text-on-surface dark:text-inverse-on-surface mt-1.5">Posts</p>' +
                    '</div>' +
                    '<div class="text-center">' +
                        '<p class="text-2xl font-bold font-headline-md text-primary leading-none">' + followers + '</p>' +
                        '<p class="text-xs font-bold text-on-surface dark:text-inverse-on-surface mt-1.5">Followers</p>' +
                    '</div>' +
                    '<div class="text-center">' +
                        '<p class="text-2xl font-bold font-headline-md text-primary leading-none">' + following + '</p>' +
                        '<p class="text-xs font-bold text-on-surface dark:text-inverse-on-surface mt-1.5">Following</p>' +
                    '</div>' +
                    '<div class="text-center">' +
                        '<p class="text-2xl font-bold font-headline-md text-tertiary leading-none">' + checkinsCount + '</p>' +
                        '<p class="text-xs font-bold text-on-surface dark:text-inverse-on-surface mt-1.5">Check-ins</p>' +
                    '</div>' +
                '</section>' +
                '<section class="stagger-reveal" style="animation-delay: 0.3s;">' +
                    '<h2 class="text-technical-label font-technical-label text-muted-zinc uppercase tracking-widest mb-3 px-1">My Posts</h2>' +
                    '<div id="postsGrid" class="grid grid-cols-3 gap-1 rounded-xl overflow-hidden"></div>' +
                '</section>';
        }

        function renderUserPosts(posts) {
            const grid = document.getElementById('postsGrid');
            if (!grid) return;
            if (!posts || posts.length === 0) {
                grid.innerHTML = '<div class="col-span-3 text-center py-8 text-muted-zinc"><span class="material-symbols-outlined text-3xl mb-2">photo_library</span><p>No posts yet</p></div>';
                return;
            }
            grid.innerHTML = posts.map(post => {
                const img = post.imageURL || '';
                if (!img) return '';
                return '<div class="aspect-square overflow-hidden cursor-pointer" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action:\\'openPost\\', postId:\\'' + post.id + '\\'}))">' +
                    '<img class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src="' + img + '">' +
                '</div>';
            }).join('');
        }

        // Profile data is injected from React Native once ready
    </script>
</body></html>`;
};

export default function Profile({ navigation }) {
  const { user } = useAuth();
  const isDark = useThemeStore((state) => state.isDark);
  const webViewRef = useRef(null);
  const webViewReadyRef = useRef(false);
  const [cachedData, setCachedData] = useState(null);

  useEffect(() => {
    webViewRef.current?.injectJavaScript(`
      document.documentElement.className = "${isDark ? 'dark' : 'light'}";
      true;
    `);
  }, [isDark]);

  const injectProfileData = useCallback((profileData, posts) => {
    if (!webViewRef.current) return;
    webViewRef.current.injectJavaScript(`renderProfile(${JSON.stringify(profileData)}); true;`);
    webViewRef.current.injectJavaScript(`renderUserPosts(${JSON.stringify(posts)}); true;`);
  }, []);

  const showProfileError = useCallback((message) => {
    webViewRef.current?.injectJavaScript(`
      document.getElementById('profileContent').innerHTML = '<div class="flex flex-col items-center py-16 gap-3"><span class="material-symbols-outlined text-primary text-3xl">error</span><p class="text-muted-zinc text-center px-4">${message}</p></div>';
      true;
    `);
  }, []);

  const fetchProfileData = useCallback(async () => {
    if (!user) {
      webViewRef.current?.injectJavaScript(`
        document.getElementById('profileContent').innerHTML = '<div class="flex flex-col items-center py-16 gap-3"><span class="material-symbols-outlined text-primary text-3xl">person_off</span><p class="text-muted-zinc">Please log in to view your profile</p></div>';
        true;
      `);
      return null;
    }

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Profile loading timeout')), 15000);
    });

    const [profile, posts, checkins] = await Promise.race([
      Promise.all([
        getUserProfile(user.uid),
        getUserPosts(user.uid, 30),
        getUserCheckins(user.uid),
      ]),
      timeoutPromise,
    ]);

    const profileData = {
      displayName: user.displayName || profile?.displayName || 'Explorer',
      email: user.email || '',
      bio: profile?.bio || 'GeoConnect Explorer ✨',
      photoURL: user.photoURL || profile?.photoURL || '',
      followersCount: profile?.followersCount || 0,
      followingCount: profile?.followingCount || 0,
      postsCount: posts.length,
      checkinsCount: checkins.length,
    };

    return { profileData, posts };
  }, [user]);

  // Prefetch profile data as soon as the screen mounts
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const result = await fetchProfileData();
        if (cancelled || !result) return;

        setCachedData(result);
        if (webViewReadyRef.current) {
          injectProfileData(result.profileData, result.posts);
        }
      } catch (error) {
        if (cancelled) return;
        console.error('[Profile] Error loading profile data:', error);

        if (!webViewReadyRef.current) return;

        const message =
          error.message === 'Profile loading timeout'
            ? 'Loading timed out. Please check your connection and try again.'
            : 'Failed to load profile. Please check your connection and try again.';
        showProfileError(message);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [fetchProfileData, injectProfileData, showProfileError]);

  const handleWebViewLoadEnd = useCallback(() => {
    webViewReadyRef.current = true;

    if (cachedData) {
      injectProfileData(cachedData.profileData, cachedData.posts);
    }
  }, [cachedData, injectProfileData]);

  const handleMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.action === 'openSettings') {
        navigation.navigate('Settings');
      }
      else if (data.action === 'openPost') {
        navigation.navigate('PostDetail', { postId: data.postId });
      }
    } catch (error) {
      console.error('[Profile] Error handling message:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView 
        ref={webViewRef}
        source={{ html: getHtmlContent(isDark) }} 
        style={styles.webview}
        originWhitelist={['*']}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoadEnd={handleWebViewLoadEnd}
        onMessage={handleMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf8ff',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
