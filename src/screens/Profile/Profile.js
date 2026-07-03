import React, { useRef, useEffect, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore } from '../../store/stores';
import { getUserProfile, getUserPosts, getUserCheckins, followUser, unfollowUser, isFollowing, getFollowers, getFollowing } from '../../services/firestoreService';

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
        body { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-tap-highlight-color: transparent; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .whisper-shadow { box-shadow: 0 10px 30px -10px rgba(70, 72, 212, 0.08); }
        .stagger-reveal { animation: staggerReveal 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; transform: translateY(10px); }
        @keyframes staggerReveal { to { opacity: 1; transform: translateY(0); } }
        .css-spinner { width: 2rem; height: 2rem; border: 2px solid rgba(70, 72, 212, 0.2); border-top-color: #4648d4; border-radius: 50%; animation: cssSpin 0.7s linear infinite; }
        @keyframes cssSpin { 100% { transform: rotate(360deg); } }
        @keyframes delayedFadeIn {
            0% { opacity: 0; }
            80% { opacity: 0; }
            100% { opacity: 1; }
        }
        .delayed-fade {
            animation: delayedFadeIn 1s forwards;
            opacity: 0;
        }
        .break-words { overflow-wrap: break-word; word-break: break-word; }
        /* Modal styles */
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; opacity: 0; pointer-events: none; transition: opacity 0.25s ease; }
        .modal-backdrop.active { opacity: 1; pointer-events: auto; }
        .modal-sheet { position: fixed; bottom: 0; left: 0; right: 0; z-index: 101; border-radius: 1.25rem 1.25rem 0 0; max-height: 80vh; transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.2,0.8,0.2,1); display: flex; flex-direction: column; }
        .modal-sheet.active { transform: translateY(0); }
        .modal-handle { width: 36px; height: 4px; border-radius: 2px; margin: 10px auto 0; flex-shrink: 0; }
        .stat-btn { cursor: pointer; transition: transform 0.15s ease, background 0.15s ease; border-radius: 0.75rem; padding: 8px 4px; }
        .stat-btn:active { transform: scale(0.95); background: rgba(70,72,212,0.06); }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
    </style>
</head>
<body class="bg-background dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface font-body-md min-h-screen pb-4">
<!-- Top Bar -->
<header class="fixed top-0 w-full z-50 bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-md shadow-sm h-16 flex justify-between items-center px-margin-page">
<div class="flex items-center gap-2">
</div>
<div class="flex items-center gap-3">
<button id="settingsBtn" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action:'openSettings'}))" class="p-2 rounded-full hover:bg-surface-variant/50 dark:hover:bg-white/10 transition-colors" style="display: none;">
<span class="material-symbols-outlined text-on-surface-variant dark:text-inverse-on-surface">settings</span>
</button>
</div>
</header>

<main id="profileContent" class="mt-20 px-margin-page max-w-2xl mx-auto space-y-6">
    <div id="profileLoading" class="flex flex-col items-center py-16 gap-3 delayed-fade">
        <div class="css-spinner" aria-hidden="true"></div>
        <p class="text-muted-zinc text-sm">Loading profile...</p>
    </div>
</main>

<!-- Bottom Sheet Modal -->
<div id="modalBackdrop" class="modal-backdrop" onclick="closeModal()"></div>
<div id="modalSheet" class="modal-sheet bg-surface dark:bg-inverse-surface">
    <div class="modal-handle bg-outline-variant dark:bg-white/20"></div>
    <div class="flex items-center justify-between px-5 py-3 border-b border-soft-border dark:border-white/10">
        <h3 id="modalTitle" class="text-lg font-bold text-on-surface dark:text-inverse-on-surface">Title</h3>
        <button onclick="closeModal()" class="p-1 rounded-full hover:bg-surface-variant/50 dark:hover:bg-white/10 transition-colors">
            <span class="material-symbols-outlined text-muted-zinc">close</span>
        </button>
    </div>
    <div id="modalContent" class="flex-1 overflow-y-auto px-5 py-4" style="-webkit-overflow-scrolling: touch;"></div>
</div>

<script>
        function renderProfile(profile) {
            const container = document.getElementById('profileContent');
            const loading = document.getElementById('profileLoading');
            if (loading) loading.remove();

            // Toggle Settings icon visibility in the header
            const settingsBtn = document.getElementById('settingsBtn');
            if (settingsBtn) {
                if (profile.isOwnProfile) {
                    settingsBtn.style.display = 'block';
                } else {
                    settingsBtn.style.display = 'none';
                }
            }

            const name = profile.displayName || 'Explorer';
            const email = profile.email || '';
            const emailHtml = email ? '<p class="text-muted-zinc mt-1 break-words font-medium text-sm">' + email + '</p>' : '';
            const bio = profile.bio || 'GeoConnect Explorer';
            const photo = profile.photoURL || '';
            const followers = profile.followersCount || 0;
            const following = profile.followingCount || 0;
            const postsCount = profile.postsCount || 0;
            const checkinsCount = profile.checkinsCount || 0;
            const avatarImg = photo ? '<img alt="' + name + '" class="w-full h-full object-cover" src="' + photo + '">' : '<div class="w-full h-full bg-primary flex items-center justify-center text-white text-3xl font-bold">' + name.charAt(0) + '</div>';

            let actionBtnHtml = '';
            if (!profile.isOwnProfile) {
                const btnText = profile.isFollowing ? 'Following' : 'Follow';
                const btnClass = profile.isFollowing 
                    ? 'bg-zinc-200 dark:bg-white/10 text-on-surface-variant dark:text-inverse-on-surface border border-soft-border dark:border-white/10' 
                    : 'bg-primary text-on-primary';
                actionBtnHtml = '<div class="mt-4 flex justify-center"><button id="followBtn" onclick="toggleFollow(\\'' + profile.id + '\\', ' + profile.isFollowing + ')" class="px-8 py-2 rounded-full font-bold text-sm transition-all active:scale-[0.98] shadow-sm ' + btnClass + '">' + btnText + '</button></div>';
            }

            container.innerHTML =
                '<section class="stagger-reveal text-center mb-8" style="animation-delay: 0.1s;">' +
                    '<div class="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-primary/20 mb-4 shadow-sm">' + avatarImg + '</div>' +
                    '<h1 class="text-3xl font-bold font-headline-lg-mobile text-on-surface dark:text-inverse-on-surface break-words tracking-tight leading-tight">' + name + '</h1>' +
                    emailHtml +
                    actionBtnHtml +
                    '<div class="mt-4 flex justify-center"><p class="text-on-surface-variant dark:text-inverse-on-surface/80 max-w-xs break-words px-4 leading-relaxed">' + bio + '</p></div>' +
                '</section>' +
                '<section class="stagger-reveal grid grid-cols-4 gap-2 mb-8 px-1" style="animation-delay: 0.2s;">' +
                    '<div class="stat-btn text-center" onclick="openStatModal(\\'posts\\',' + postsCount + ')">' +
                        '<p class="text-2xl font-bold font-headline-md text-primary leading-none">' + postsCount + '</p>' +
                        '<p class="text-xs font-bold text-on-surface dark:text-inverse-on-surface mt-1.5">Posts</p>' +
                    '</div>' +
                    '<div class="stat-btn text-center" onclick="openStatModal(\\'followers\\',' + followers + ')">' +
                        '<p class="text-2xl font-bold font-headline-md text-primary leading-none">' + followers + '</p>' +
                        '<p class="text-xs font-bold text-on-surface dark:text-inverse-on-surface mt-1.5">Followers</p>' +
                    '</div>' +
                    '<div class="stat-btn text-center" onclick="openStatModal(\\'following\\',' + following + ')">' +
                        '<p class="text-2xl font-bold font-headline-md text-primary leading-none">' + following + '</p>' +
                        '<p class="text-xs font-bold text-on-surface dark:text-inverse-on-surface mt-1.5">Following</p>' +
                    '</div>' +
                    '<div class="stat-btn text-center" onclick="openStatModal(\\'checkins\\',' + checkinsCount + ')">' +
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

        function toggleFollow(userId, isCurrentlyFollowing) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                action: 'toggleFollow',
                userId: userId,
                isFollowing: isCurrentlyFollowing
            }));
        }

        function openStatModal(type, count) {
            const titles = { posts: 'Posts', followers: 'Followers', following: 'Following', checkins: 'Check-ins' };
            document.getElementById('modalTitle').innerText = titles[type] || type;
            const content = document.getElementById('modalContent');
            content.innerHTML = '<div class="flex justify-center py-12"><div class="css-spinner"></div></div>';
            document.getElementById('modalBackdrop').classList.add('active');
            document.getElementById('modalSheet').classList.add('active');
            // Ask RN to fetch data
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'fetchStatData', type: type }));
        }

        function closeModal() {
            document.getElementById('modalBackdrop').classList.remove('active');
            document.getElementById('modalSheet').classList.remove('active');
        }

        function renderModalPosts(posts) {
            const content = document.getElementById('modalContent');
            if (!posts || posts.length === 0) {
                content.innerHTML = '<div class="flex flex-col items-center py-12 gap-3"><span class="material-symbols-outlined text-muted-zinc text-4xl">photo_library</span><p class="text-muted-zinc font-medium">No posts yet</p><p class="text-muted-zinc text-xs">Posts will appear here once created.</p></div>';
                return;
            }
            content.innerHTML = posts.map(post => {
                const img = post.imageURL ? '<img src="' + post.imageURL + '" class="w-full h-48 object-cover rounded-xl mt-2">' : '';
                const caption = post.caption || post.title || post.description || '';
                return '<div class="py-3 border-b border-soft-border dark:border-white/10 last:border-0 cursor-pointer" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action:\\'openPost\\', postId:\\'' + post.id + '\\'}))"><p class="text-sm text-on-surface dark:text-inverse-on-surface leading-relaxed">' + caption + '</p>' + img + '</div>';
            }).join('');
        }

        function renderModalUsers(users, emptyIcon, emptyTitle, emptySubtitle) {
            const content = document.getElementById('modalContent');
            if (!users || users.length === 0) {
                content.innerHTML = '<div class="flex flex-col items-center py-12 gap-3"><span class="material-symbols-outlined text-muted-zinc text-4xl">' + emptyIcon + '</span><p class="text-muted-zinc font-medium">' + emptyTitle + '</p><p class="text-muted-zinc text-xs text-center">' + emptySubtitle + '</p></div>';
                return;
            }
            content.innerHTML = users.map(u => {
                const name = u.displayName || 'Explorer';
                const avatar = u.photoURL ? '<img src="' + u.photoURL + '" class="w-11 h-11 rounded-full object-cover">' : '<div class="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-bold text-base">' + name.charAt(0) + '</div>';
                return '<div class="flex items-center gap-3 py-3 border-b border-soft-border dark:border-white/10 last:border-0 cursor-pointer" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action:\\'openUserProfile\\', userId:\\'' + u.id + '\\'}))"><div class="flex-shrink-0">' + avatar + '</div><div class="flex-1 min-w-0"><p class="font-bold text-sm text-on-surface dark:text-inverse-on-surface truncate">' + name + '</p><p class="text-xs text-muted-zinc truncate">' + (u.email || '') + '</p></div><span class="material-symbols-outlined text-muted-zinc text-sm">chevron_right</span></div>';
            }).join('');
        }

        function renderModalCheckins(checkins) {
            const content = document.getElementById('modalContent');
            if (!checkins || checkins.length === 0) {
                content.innerHTML = '<div class="flex flex-col items-center py-12 gap-3"><span class="material-symbols-outlined text-muted-zinc text-4xl">location_off</span><p class="text-muted-zinc font-medium">No check-ins yet</p><p class="text-muted-zinc text-xs text-center">Check-ins will appear here once you visit places.</p></div>';
                return;
            }
            content.innerHTML = checkins.map(c => {
                const name = c.placeName || c.name || 'Unknown Place';
                const addr = c.address || '';
                return '<div class="flex items-center gap-3 py-3 border-b border-soft-border dark:border-white/10 last:border-0"><div class="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center flex-shrink-0"><span class="material-symbols-outlined text-tertiary">location_on</span></div><div class="flex-1 min-w-0"><p class="font-bold text-sm text-on-surface dark:text-inverse-on-surface truncate">' + name + '</p><p class="text-xs text-muted-zinc truncate">' + addr + '</p></div></div>';
            }).join('');
        }

        // Profile data is injected from React Native once ready
    </script>
</body></html>`;
};

export default function Profile({ route, navigation }) {
  const { userId } = route.params || {};
  const { user } = useAuth();
  const isDark = useThemeStore((state) => state.isDark);

  const isProfileTab = route.name === 'Profile';
  const effectiveUserId = isProfileTab ? null : userId;
  const targetUserId = effectiveUserId || user?.uid;
  const isOwnProfile = !effectiveUserId || effectiveUserId === user?.uid;
  const webViewRef = useRef(null);
  const webViewReadyRef = useRef(false);
  const cachedDataRef = useRef(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    webViewRef.current?.injectJavaScript(`
      document.documentElement.className = "${isDark ? 'dark' : 'light'}";
      true;
    `);
  }, [isDark]);

  const injectProfileData = useCallback((profileData, posts) => {
    if (!webViewRef.current) return;
    
    const safeProfileStr = JSON.stringify(JSON.stringify(profileData));
    const safePostsStr = JSON.stringify(JSON.stringify(posts));
    
    webViewRef.current.injectJavaScript(`
      function checkAndInjectProfile() {
        if (typeof renderProfile !== 'undefined') {
          try {
            const pData = JSON.parse(${safeProfileStr});
            const pPosts = JSON.parse(${safePostsStr});
            renderProfile(pData);
            renderUserPosts(pPosts);
          } catch (e) {
            document.getElementById('profileContent').innerHTML = '<p class="text-error p-4">Error parsing injected data: ' + e.message + '</p>';
          }
        } else {
          setTimeout(checkAndInjectProfile, 50);
        }
      }
      checkAndInjectProfile();
      true;
    `);
  }, []);

  const showProfileError = useCallback((message) => {
    webViewRef.current?.injectJavaScript(`
      document.getElementById('profileContent').innerHTML = '<div class="flex flex-col items-center py-16 gap-3"><span class="material-symbols-outlined text-primary text-3xl">error</span><p class="text-muted-zinc text-center px-4">${message}</p></div>';
      true;
    `);
  }, []);

  const fetchProfileData = useCallback(async () => {
    const activeUserId = targetUserId;
    if (!activeUserId) {
      webViewRef.current?.injectJavaScript(`
        document.getElementById('profileContent').innerHTML = '<div class="flex flex-col items-center py-16 gap-3"><span class="material-symbols-outlined text-primary text-3xl">person_off</span><p class="text-muted-zinc">Profile identifier is missing or user is not logged in.</p></div>';
        true;
      `);
      return null;
    }

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Profile loading timeout')), 15000);
    });

    const [profile, posts, checkins] = await Promise.race([
      Promise.all([
        getUserProfile(activeUserId),
        getUserPosts(activeUserId, 30),
        getUserCheckins(activeUserId),
      ]),
      timeoutPromise,
    ]);

    let followingStatus = false;
    if (user && !isOwnProfile) {
      followingStatus = await isFollowing(user.uid, activeUserId);
    }

    const profileData = {
      id: activeUserId,
      displayName: profile?.displayName || 'Explorer',
      email: isOwnProfile ? (user?.email || profile?.email || '') : '',
      bio: profile?.bio || 'GeoConnect Explorer ✨',
      photoURL: profile?.photoURL || '',
      followersCount: profile?.followersCount || 0,
      followingCount: profile?.followingCount || 0,
      postsCount: posts.length,
      checkinsCount: checkins?.length || 0,
      isOwnProfile,
      isFollowing: followingStatus,
      checkinsRaw: checkins || [],
    };

    return { profileData, posts };
  }, [targetUserId, user, isOwnProfile]);

  // Fetch profile data once on mount
  useEffect(() => {
    let cancelled = false;
    hasFetchedRef.current = false;

    const load = async () => {
      try {
        const result = await fetchProfileData();
        if (cancelled || !result) return;

        cachedDataRef.current = result;
        hasFetchedRef.current = true;
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
  }, [targetUserId]);

  const handleWebViewLoadEnd = useCallback(() => {
    webViewReadyRef.current = true;

    if (cachedDataRef.current) {
      injectProfileData(cachedDataRef.current.profileData, cachedDataRef.current.posts);
    }
  }, [injectProfileData]);

  const handleMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.action === 'openSettings') {
        navigation.navigate('Settings');
      }
      else if (data.action === 'openPost') {
        navigation.navigate('PostDetail', { postId: data.postId });
      }
      else if (data.action === 'openUserProfile') {
        navigation.navigate('UserProfile', { userId: data.userId });
      }
      else if (data.action === 'fetchStatData') {
        try {
          if (data.type === 'posts') {
            const posts = cachedDataRef.current?.posts || [];
            const safeStr = JSON.stringify(JSON.stringify(posts));
            webViewRef.current?.injectJavaScript(`
              function tryInjectPosts() {
                if (typeof renderModalPosts !== 'undefined') renderModalPosts(JSON.parse(${safeStr}));
                else setTimeout(tryInjectPosts, 50);
              }
              tryInjectPosts();
              true;
            `);
          } else if (data.type === 'followers') {
            const followers = await getFollowers(targetUserId);
            const followersWithId = followers.map(f => {
              const fUser = { ...f, id: f.uid || f.id };
              if (fUser.id !== user?.uid) delete fUser.email;
              return fUser;
            });
            const safeStr = JSON.stringify(JSON.stringify(followersWithId));
            webViewRef.current?.injectJavaScript(`
              function tryInjectFollowers() {
                if (typeof renderModalUsers !== 'undefined') renderModalUsers(JSON.parse(${safeStr}), 'group_off', 'No followers yet', 'When people follow this account, they will appear here.');
                else setTimeout(tryInjectFollowers, 50);
              }
              tryInjectFollowers();
              true;
            `);
          } else if (data.type === 'following') {
            const following = await getFollowing(targetUserId);
            const followingWithId = following.map(f => {
              const fUser = { ...f, id: f.uid || f.id };
              if (fUser.id !== user?.uid) delete fUser.email;
              return fUser;
            });
            const safeStr = JSON.stringify(JSON.stringify(followingWithId));
            webViewRef.current?.injectJavaScript(`
              function tryInjectFollowing() {
                if (typeof renderModalUsers !== 'undefined') renderModalUsers(JSON.parse(${safeStr}), 'person_search', 'Not following anyone', 'Accounts that are followed will appear here.');
                else setTimeout(tryInjectFollowing, 50);
              }
              tryInjectFollowing();
              true;
            `);
          } else if (data.type === 'checkins') {
            const checkins = cachedDataRef.current?.profileData?.checkinsRaw || [];
            const safeStr = JSON.stringify(JSON.stringify(checkins));
            webViewRef.current?.injectJavaScript(`
              function tryInjectCheckins() {
                if (typeof renderModalCheckins !== 'undefined') renderModalCheckins(JSON.parse(${safeStr}));
                else setTimeout(tryInjectCheckins, 50);
              }
              tryInjectCheckins();
              true;
            `);
          }
        } catch (error) {
          console.error('[Profile] Error fetching stat data:', error);
          webViewRef.current?.injectJavaScript(`document.getElementById('modalContent').innerHTML = '<div class="flex flex-col items-center py-12 gap-3"><span class="material-symbols-outlined text-error text-3xl">error</span><p class="text-muted-zinc">Failed to load data</p></div>'; true;`);
        }
      }
      else if (data.action === 'toggleFollow') {
        if (!user) return;
        try {
          if (data.isFollowing) {
            await unfollowUser(user.uid, data.userId);
          } else {
            await followUser(user.uid, data.userId);
          }
          // Refetch profile data to update UI counters and follow status
          const result = await fetchProfileData();
          if (result) {
            cachedDataRef.current = result;
            injectProfileData(result.profileData, result.posts);
          }
        } catch (error) {
          console.error('[Profile] Error toggling follow status:', error);
        }
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
