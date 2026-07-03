import React, { useRef, useEffect, useState, useCallback } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore, useFeedStore } from '../../store/stores';
import { subscribeToPosts, subscribeToEvents, getUserProfile, likePost, unlikePost, hasLikedPost } from '../../services/firestoreService';

const getHtmlContent = (isDark) => {
  return `<!DOCTYPE html><html class="${isDark ? 'dark' : 'light'}" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0, viewport-fit=cover" name="viewport">
<title>GeoConnect | Feed</title>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "muted-zinc": "#64748B",
                    "surface-bright": "#fcf8ff",
                    "on-secondary": "#ffffff",
                    "on-surface": "#1b1b23",
                    "tertiary-fixed-dim": "#ffb783",
                    "surface-variant": "#e4e1ed",
                    "error": "#ba1a1a",
                    "primary": "#4648d4",
                    "secondary-container": "#dae2fd",
                    "primary-fixed-dim": "#c0c1ff",
                    "canvas-white": "#F9FAFB",
                    "on-tertiary-fixed": "#301400",
                    "on-tertiary": "#ffffff",
                    "secondary-fixed": "#dae2fd",
                    "primary-container": "#6063ee",
                    "on-error": "#ffffff",
                    "error-container": "#ffdad6",
                    "outline-variant": "#c7c4d7",
                    "surface-container-low": "#f5f2fe",
                    "on-tertiary-container": "#fffbff",
                    "tertiary-fixed": "#ffdcc5",
                    "surface-container-high": "#e9e6f3",
                    "surface": "#fcf8ff",
                    "tertiary-container": "#b55d00",
                    "tertiary": "#904900",
                    "on-primary": "#ffffff",
                    "on-error-container": "#93000a",
                    "inverse-primary": "#c0c1ff",
                    "on-surface-variant": "#464554",
                    "surface-container": "#efecf8",
                    "surface-pure": "#FFFFFF",
                    "surface-dim": "#dbd8e4",
                    "surface-container-highest": "#e4e1ed",
                    "soft-border": "rgba(226, 232, 240, 0.8)",
                    "background": "#fcf8ff",
                    "on-secondary-container": "#5c647a",
                    "secondary-fixed-dim": "#bec6e0",
                    "on-tertiary-fixed-variant": "#703700",
                    "on-background": "#1b1b23",
                    "surface-container-lowest": "#ffffff",
                    "on-primary-fixed-variant": "#2f2ebe",
                    "inverse-on-surface": "#f2effb",
                    "on-secondary-fixed-variant": "#3f465c",
                    "primary-fixed": "#e1e0ff",
                    "on-primary-fixed": "#07006c",
                    "inverse-surface": "#303038",
                    "secondary": "#565e74",
                    "on-secondary-fixed": "#131b2e",
                    "on-primary-container": "#fffbff",
                    "outline": "#767586",
                    "surface-tint": "#494bd6"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "gutter-grid": "16px",
                    "margin-page": "24px",
                    "stack-gap": "12px",
                    "safe-area": "32px"
            },
            "fontFamily": {
                    "technical-label": ["JetBrains Mono"],
                    "headline-lg": ["Plus Jakarta Sans"],
                    "headline-lg-mobile": ["Plus Jakarta Sans"],
                    "body-lg": ["Plus Jakarta Sans"],
                    "headline-md": ["Plus Jakarta Sans"],
                    "body-md": ["Plus Jakarta Sans"]
            },
            "fontSize": {
                    "technical-label": ["12px", {"lineHeight": "1.4", "fontWeight": "500"}],
                    "headline-lg": ["32px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "headline-lg-mobile": ["28px", {"lineHeight": "1.2", "fontWeight": "700"}],
                    "body-lg": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
                    "headline-md": ["24px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "700"}],
                    "body-md": ["14px", {"lineHeight": "1.6", "fontWeight": "400"}]
            }
          },
        },
      }
    </script>
<style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        .dark body { background-color: #1b1b23; color: #f2effb; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .glass-panel { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        @keyframes delayedFadeIn {
            0% { opacity: 0; }
            80% { opacity: 0; }
            100% { opacity: 1; }
        }
        .delayed-fade {
            animation: delayedFadeIn 1s forwards;
            opacity: 0;
        }
        .whisper-shadow {
            box-shadow: 0 4px 20px -4px rgba(0,0,0,0.05), 0 0 3px rgba(0,0,0,0.02);
        }.post-card-stagger { animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .nearby-pulse { animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite; }
        @keyframes pulse-ring {
            0% { transform: scale(.8); opacity: 0.5; }
            50% { transform: scale(1); opacity: 1; }
            100% { transform: scale(.8); opacity: 0.5; }
        }
    </style>
</head>
<body class="bg-background dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface">
<!-- Top Navigation Bar -->
<header class="fixed top-0 w-full z-50 bg-surface/90 dark:bg-inverse-surface/90 backdrop-blur-md shadow-sm px-4 pt-12 pb-3 flex flex-col gap-3" style="padding-top: env(safe-area-inset-top, 48px);">
  <div class="flex items-center gap-2 px-1">
    <span class="material-symbols-outlined text-primary text-[28px]">explore</span>
    <span class="text-headline-md font-headline-md text-primary tracking-tight">GeoConnect</span>
  </div>
  <div class="w-full bg-surface-variant dark:bg-white/5 rounded-full flex items-center px-4 py-2 border border-soft-border dark:border-white/10 shadow-sm focus-within:border-primary dark:focus-within:border-[#8c8eff] transition-colors relative">
    <span class="material-symbols-outlined text-muted-zinc mr-2 text-xl">search</span>
    <input type="text" id="searchInput" oninput="handleSearch(this.value)" placeholder="Search posts, people, events..." class="bg-transparent border-none text-sm text-on-surface dark:text-inverse-on-surface focus:ring-0 w-full p-0" autocomplete="off" autocorrect="off" autocapitalize="none">
    <button id="clearBtn" onclick="clearSearch()" class="hidden absolute right-4 text-muted-zinc hover:text-primary"><span class="material-symbols-outlined text-sm">close</span></button>
  </div>
</header>
<!-- Main Content Area -->
<main class="pt-[140px] pb-4 max-w-2xl mx-auto px-4 lg:px-0">
<!-- Filter Bar -->
<div class="sticky top-[130px] z-40 py-4 bg-background/95 dark:bg-inverse-surface/95 backdrop-blur-sm mb-2">
<div class="flex items-center justify-between">
<div class="flex gap-2 p-1 bg-surface-container-low dark:bg-white/5 rounded-full">
<button id="tabFeed" onclick="switchTab('feed')" class="px-6 py-2 rounded-full text-technical-label font-technical-label bg-primary text-on-primary shadow-sm transition-all">Feed</button>
<button id="tabTrending" onclick="switchTab('trending')" class="px-6 py-2 rounded-full text-technical-label font-technical-label text-on-surface-variant dark:text-inverse-on-surface hover:bg-surface-variant/50 dark:hover:bg-white/10 transition-all">Trending</button>
</div>
</div>
</div>
<!-- Post List -->
<div id="feedContainer" class="space-y-6">
    <div class="flex flex-col items-center py-16 gap-4 delayed-fade">
        <div class="flex gap-1.5">
            <div class="w-2 h-2 rounded-full bg-primary animate-bounce" style="animation-delay: 0s;"></div>
            <div class="w-2 h-2 rounded-full bg-primary animate-bounce" style="animation-delay: 0.15s;"></div>
            <div class="w-2 h-2 rounded-full bg-primary animate-bounce" style="animation-delay: 0.3s;"></div>
        </div>
        <p class="text-technical-label font-technical-label text-muted-zinc uppercase tracking-widest">Loading feed...</p>
    </div>
</div>
<!-- Pull to Refresh Indicator -->
<div id="pullIndicator" class="fixed top-[130px] left-0 right-0 z-[60] flex justify-center transition-all duration-300 pointer-events-none" style="opacity:0; transform: translateY(-40px);">
    <div class="bg-primary text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
        <span class="material-symbols-outlined animate-spin text-sm">progress_activity</span>
        <span class="text-xs font-bold">Refreshing...</span>
    </div>
</div>
</main>

<script>
        function formatTimeAgo(dateStr) {
            if (!dateStr) return 'now';
            const date = dateStr.seconds ? new Date(dateStr.seconds * 1000) : new Date(dateStr);
            const now = new Date();
            const diffMs = now - date;
            const diffMin = Math.floor(diffMs / 60000);
            if (diffMin < 1) return 'now';
            if (diffMin < 60) return diffMin + 'm ago';
            const diffH = Math.floor(diffMin / 60);
            if (diffH < 24) return diffH + 'h ago';
            const diffD = Math.floor(diffH / 24);
            return diffD + 'd ago';
        }

        let allPosts = [];
        let searchQuery = '';

        function renderPosts(posts) {
            allPosts = posts;
            applySearchAndRender();
        }

        function handleSearch(query) {
            searchQuery = query.toLowerCase();
            const clearBtn = document.getElementById('clearBtn');
            if (searchQuery.length > 0) {
                clearBtn.classList.remove('hidden');
            } else {
                clearBtn.classList.add('hidden');
            }
            applySearchAndRender();
        }

        function clearSearch() {
            const input = document.getElementById('searchInput');
            input.value = '';
            handleSearch('');
            input.focus();
        }

        function applySearchAndRender() {
            const container = document.getElementById('feedContainer');
            let filtered = allPosts;

            if (searchQuery.trim() !== '') {
                filtered = allPosts.filter(post => {
                    const caption = (post.caption || '').toLowerCase();
                    const title = (post.title || '').toLowerCase();
                    const description = (post.description || '').toLowerCase();
                    const author = (post.authorName || '').toLowerCase();
                    const location = (post.locationLabel || '').toLowerCase();
                    const category = (post.category || '').toLowerCase();
                    return caption.includes(searchQuery) ||
                           title.includes(searchQuery) ||
                           description.includes(searchQuery) ||
                           author.includes(searchQuery) ||
                           location.includes(searchQuery) ||
                           category.includes(searchQuery);
                });
            }

            if (!filtered || filtered.length === 0) {
                container.innerHTML = '<div class="flex flex-col items-center py-16 gap-3"><span class="material-symbols-outlined text-muted-zinc text-4xl">search_off</span><p class="text-on-surface-variant dark:text-inverse-on-surface font-bold text-lg">No matches found</p><p class="text-muted-zinc text-sm">Try searching for different keywords</p></div>';
                return;
            }

            container.innerHTML = filtered.map((post, idx) => {
                const authorName = post.authorName || 'Explorer';
                const authorPhoto = post.authorPhoto || '';
                const authorId = post.authorId || post.creatorId || '';
                const locationLabel = post.locationLabel || '';
                const timeAgo = formatTimeAgo(post.createdAt);
                const likeCount = post.likesCount || 0;
                const commentCount = post.commentsCount || 0;
                const isLiked = post.isLiked || false;
                const heartFill = isLiked ? "font-variation-settings: \\'FILL\\' 1;" : "";
                const heartColor = isLiked ? "text-error" : "";
                const imgTag = post.imageURL ? '<img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="' + post.imageURL + '">' : '';
                const imgSection = post.imageURL ? '<div class="aspect-[4/5] overflow-hidden relative cursor-pointer" onclick="openPost(\\'' + post.id + '\\')">' + imgTag + '</div>' : '';
                const avatarImg = authorPhoto ? '<img alt="' + authorName + '" class="w-full h-full rounded-full object-cover" src="' + authorPhoto + '">' : '<div class="w-full h-full rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">' + (authorName.charAt(0) || 'E') + '</div>';
                const locationHtml = locationLabel ? '<span class="material-symbols-outlined text-[14px] text-primary">location_on</span><span class="text-technical-label font-technical-label text-primary">' + locationLabel + '</span><span class="text-[10px] text-muted-zinc">•</span>' : '';

                return '<article class="post-card-stagger bg-surface-pure dark:bg-inverse-surface rounded-xl overflow-hidden whisper-shadow border border-soft-border dark:border-white/10 group transition-all hover:-translate-y-px duration-300" style="animation-delay: ' + (idx * 0.05) + 's;">' +
                    '<div class="p-4 flex items-center justify-between">' +
                        '<div class="flex items-center gap-3 cursor-pointer" onclick="openProfile(\\'' + authorId + '\\')">' +
                            '<div class="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5">' + avatarImg + '</div>' +
                            '<div>' +
                                '<h3 class="font-headline-md text-[15px] leading-tight text-on-surface dark:text-inverse-on-surface">' + authorName + '</h3>' +
                                '<div class="flex items-center gap-1.5 mt-0.5">' + locationHtml +
                                    '<time class="text-technical-label font-technical-label text-muted-zinc">' + timeAgo + '</time>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<button class="text-muted-zinc hover:text-on-surface dark:hover:text-inverse-on-surface transition-colors"><span class="material-symbols-outlined">more_vert</span></button>' +
                    '</div>' +
                    imgSection +
                    '<div class="p-4">' +
                        '<div class="flex items-center justify-between mb-4">' +
                            '<div class="flex items-center gap-5">' +
                                '<button class="flex items-center gap-1.5 text-on-surface dark:text-inverse-on-surface group/action" onclick="toggleLike(\\'' + post.id + '\\', ' + isLiked + ')">' +
                                    '<span class="material-symbols-outlined text-[24px] ' + heartColor + ' transition-colors" style="' + heartFill + '">favorite</span>' +
                                    '<span id="like-count-' + post.id + '" class="text-technical-label font-technical-label">' + likeCount + '</span>' +
                                '</button>' +
                                '<button class="flex items-center gap-1.5 text-on-surface dark:text-inverse-on-surface group/action" onclick="openPost(\\'' + post.id + '\\')">' +
                                    '<span class="material-symbols-outlined text-[24px] transition-colors">chat_bubble</span>' +
                                    '<span class="text-technical-label font-technical-label">' + commentCount + '</span>' +
                                '</button>' +
                                '<button class="flex items-center gap-1.5 text-on-surface dark:text-inverse-on-surface group/action">' +
                                    '<span class="material-symbols-outlined text-[24px] transition-colors">send</span>' +
                                '</button>' +
                            '</div>' +
                            '<button class="text-on-surface dark:text-inverse-on-surface hover:text-primary transition-colors"><span class="material-symbols-outlined text-[24px]">bookmark</span></button>' +
                        '</div>' +
                        '<div class="space-y-1">' +
                            (post.type === 'event' 
                                ? '<div class="mb-2 cursor-pointer" onclick="openPost(\\'' + post.id + '\\')"><span class="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-1">' + (post.category || 'Event') + '</span><h4 class="font-headline-md text-[16px] leading-tight text-on-surface dark:text-inverse-on-surface">' + (post.title || '') + '</h4><p class="text-body-md font-body-md text-muted-zinc mt-1">' + (post.description || '') + '</p></div>' 
                                : (post.caption ? '<p class="text-body-md font-body-md text-on-surface dark:text-inverse-on-surface"><span class="font-bold cursor-pointer" onclick="openProfile(\\'' + authorId + '\\')">' + authorName + '</span> ' + post.caption + '</p>' : '')
                            ) +
                            (commentCount > 0 ? '<button onclick="openPost(\\'' + post.id + '\\')" class="text-technical-label font-technical-label text-muted-zinc hover:text-primary transition-colors">View all ' + commentCount + ' comments</button>' : '') +
                        '</div>' +
                    '</div>' +
                '</article>';
            }).join('');
        }

        function toggleLike(postId, isCurrentlyLiked) {
            const action = isCurrentlyLiked ? 'unlikePost' : 'likePost';
            window.ReactNativeWebView.postMessage(JSON.stringify({
                action: action,
                postId: postId
            }));
        }

        function openPost(postId) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                action: 'openPost',
                postId: postId
            }));
        }

        function openProfile(userId) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                action: 'openProfile',
                userId: userId
            }));
        }

        function updateLikeUI(postId, isLiked, newCount) {
            const countEl = document.getElementById('like-count-' + postId);
            if (countEl) countEl.textContent = newCount;
        }

        // Tab switching logic
        var activeTab = 'feed';
        function switchTab(tab) {
            if (activeTab === tab) return;
            activeTab = tab;
            var feedBtn = document.getElementById('tabFeed');
            var trendBtn = document.getElementById('tabTrending');
            if (tab === 'feed') {
                feedBtn.className = 'px-6 py-2 rounded-full text-technical-label font-technical-label bg-primary text-on-primary shadow-sm transition-all';
                trendBtn.className = 'px-6 py-2 rounded-full text-technical-label font-technical-label text-on-surface-variant dark:text-inverse-on-surface hover:bg-surface-variant/50 dark:hover:bg-white/10 transition-all';
            } else {
                trendBtn.className = 'px-6 py-2 rounded-full text-technical-label font-technical-label bg-primary text-on-primary shadow-sm transition-all';
                feedBtn.className = 'px-6 py-2 rounded-full text-technical-label font-technical-label text-on-surface-variant dark:text-inverse-on-surface hover:bg-surface-variant/50 dark:hover:bg-white/10 transition-all';
            }
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'switchTab', tab: tab }));
        }

        // Pull to refresh support
        let touchStartY = 0;
        let isPulling = false;
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });
        document.addEventListener('touchmove', (e) => {
            if (window.scrollY === 0 && touchStartY > 0) {
                const diff = e.touches[0].clientY - touchStartY;
                if (diff > 80 && !isPulling) {
                    isPulling = true;
                    const indicator = document.getElementById('pullIndicator');
                    indicator.style.opacity = '1';
                    indicator.style.transform = 'translateY(0)';
                }
            }
        }, { passive: true });
        document.addEventListener('touchend', () => {
            if (isPulling) {
                isPulling = false;
                window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'refreshFeed' }));
                setTimeout(() => {
                    const indicator = document.getElementById('pullIndicator');
                    indicator.style.opacity = '0';
                    indicator.style.transform = 'translateY(-40px)';
                }, 1500);
            }
            touchStartY = 0;
        }, { passive: true });

        // Load feed on page ready
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'loadFeed' }));
            }, 300);
        });
    </script>
</body></html>`;
};

export default function Feed({ navigation }) {
  const { user } = useAuth();
  const isDark = useThemeStore((state) => state.isDark);
  const { setPosts, likePostLocal, unlikePostLocal } = useFeedStore();
  const webViewRef = useRef(null);
  const [webViewReady, setWebViewReady] = useState(false);
  const rawPostsRef = useRef([]);
  const rawEventsRef = useRef([]);
  const activeTabRef = useRef('feed');

  // Sync Dark/Light Mode
  useEffect(() => {
    webViewRef.current?.injectJavaScript(`
      document.documentElement.className = "${isDark ? 'dark' : 'light'}";
      true;
    `);
  }, [isDark]);

  const enrichAndRender = useCallback(async () => {
    if (!webViewReady) return;
    try {
      const posts = rawPostsRef.current || [];
      const events = rawEventsRef.current || [];

      const typedPosts = posts.map(p => ({ ...p, type: 'post' }));
      const typedEvents = events.map(e => ({ ...e, type: 'event' }));

      let combined = [...typedPosts, ...typedEvents].sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      }).slice(0, 20);

      // If trending tab is active, sort by likes count
      if (activeTabRef.current === 'trending') {
        combined = combined.sort((a, b) => {
          const likesA = a.likesCount || 0;
          const likesB = b.likesCount || 0;
          return likesB - likesA;
        });
      }

      const enrichedPosts = await Promise.all(
        combined.map(async (item) => {
          try {
            const authorId = item.authorId || item.creatorId;
            const author = await getUserProfile(authorId);
            let liked = false;
            if (item.type === 'post') {
              liked = user ? await hasLikedPost(item.id, user.uid) : false;
            }
            // Use current user's auth displayName as fallback when viewing own posts
            let displayName = author?.displayName || 'Explorer';
            if (user && (item.authorId === user.uid || item.creatorId === user.uid)) {
              displayName = author?.displayName || user.displayName || 'Explorer';
            }
            return {
              ...item,
              authorName: displayName,
              authorPhoto: author?.photoURL || (user && (item.authorId === user.uid || item.creatorId === user.uid) ? user.photoURL || '' : ''),
              isLiked: liked,
            };
          } catch (e) {
            return {
              ...item,
              authorName: 'Explorer',
              authorPhoto: '',
              isLiked: false,
            };
          }
        })
      );

      setPosts(enrichedPosts);
      webViewRef.current?.injectJavaScript(`renderPosts(${JSON.stringify(enrichedPosts)}); true;`);
    } catch (error) {
      console.error('[Feed] Failed to load feed:', error);
      webViewRef.current?.injectJavaScript(`
        document.getElementById('feedContainer').innerHTML = '<div class="flex flex-col items-center py-16 gap-3"><span class="material-symbols-outlined text-error text-4xl">error</span><p class="text-on-surface-variant dark:text-inverse-on-surface font-bold text-lg">Failed to load feed</p><p class="text-muted-zinc text-sm">Please pull to refresh</p></div>';
        true;
      `);
    }
  }, [user, webViewReady, setPosts]);

  useEffect(() => {
    const unsubPosts = subscribeToPosts(20, (posts) => {
      rawPostsRef.current = posts;
      enrichAndRender();
    });
    const unsubEvents = subscribeToEvents(20, (events) => {
      rawEventsRef.current = events;
      enrichAndRender();
    });
    return () => {
      unsubPosts();
      unsubEvents();
    };
  }, [enrichAndRender]);

  const handleMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.action === 'loadFeed') {
        setWebViewReady(true);
      } else if (data.action === 'refreshFeed') {
        enrichAndRender();
      } else if (data.action === 'switchTab') {
        activeTabRef.current = data.tab;
        enrichAndRender();
      }
      else if (data.action === 'likePost') {
        if (!user) {
          Alert.alert('Login Required', 'Please log in to like posts.');
          return;
        }
        // Optimistic UI update
        likePostLocal(data.postId);
        const posts = useFeedStore.getState().posts;
        const post = posts.find(p => p.id === data.postId);
        const newCount = post ? post.likesCount : 0;
        webViewRef.current?.injectJavaScript(`updateLikeUI('${data.postId}', true, ${newCount}); true;`);

        try {
          await likePost(data.postId, user.uid);
          // UI will auto-update via subscription
        } catch (error) {
          // Rollback on failure
          unlikePostLocal(data.postId);
          console.error('[Feed] Like error:', error);
        }
      }
      else if (data.action === 'unlikePost') {
        if (!user) return;
        unlikePostLocal(data.postId);
        const posts = useFeedStore.getState().posts;
        const post = posts.find(p => p.id === data.postId);
        const newCount = post ? post.likesCount : 0;
        webViewRef.current?.injectJavaScript(`updateLikeUI('${data.postId}', false, ${newCount}); true;`);

        try {
          await unlikePost(data.postId, user.uid);
          // UI will auto-update via subscription
        } catch (error) {
          likePostLocal(data.postId);
          console.error('[Feed] Unlike error:', error);
        }
      }
      if (data.action === 'openSearch') {
        navigation.navigate('Search');
      }
      else if (data.action === 'openPost') {
        const posts = useFeedStore.getState().posts;
        const post = posts.find(p => p.id === data.postId);
        if (post && post.type === 'event') {
          navigation.navigate('EventDetail', { eventId: data.postId });
        } else {
          navigation.navigate('PostDetail', { postId: data.postId });
        }
      }
      else if (data.action === 'openProfile') {
        navigation.navigate('UserProfile', { userId: data.userId });
      }
    } catch (error) {
      console.error('[Feed] Error handling message:', error);
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
        onMessage={handleMessage}
        keyboardDisplayRequiresUserAction={false}
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
