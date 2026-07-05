import React, { useRef, useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore, useLocationStore } from '../../store/stores';
import { useLocationPermission } from '../../hooks/useLocation';
import { getNearbyPlaces } from '../../services/placesAPI';
import { createCheckin, getCheckinsForVenue } from '../../services/firestoreService';

const getHtmlContent = (isDark) => {
  return `<!DOCTYPE html><html class="${isDark ? 'dark' : 'light'}" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-panel {
            background: rgba(252, 248, 255, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }
        .dark .glass-panel {
            background: rgba(27, 27, 35, 0.85);
            border-color: rgba(255, 255, 255, 0.1);
        }
        .whisper-shadow { box-shadow: 0 4px 20px -4px rgba(0,0,0,0.05), 0 0 3px rgba(0,0,0,0.02); }
        @keyframes delayedFadeIn { 0% { opacity: 0; } 80% { opacity: 0; } 100% { opacity: 1; } }
        .delayed-fade { animation: delayedFadeIn 1s forwards; opacity: 0; }
        .stagger-reveal {
            animation: reveal 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            opacity: 0;
            transform: translateY(10px);
        }
        @keyframes reveal {
            to { opacity: 1; transform: translateY(0); }
        }
        .map-canvas {
            background-image: radial-gradient(circle at 2px 2px, #e1e0ff 1px, transparent 0);
            background-size: 40px 40px;
        }
        .dark .map-canvas {
            background-image: radial-gradient(circle at 2px 2px, #303048 1px, transparent 0);
        }
        .detail-sheet {
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
    </style>
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
</head>
<body class="bg-background dark:bg-inverse-surface text-on-background dark:text-inverse-on-surface font-body-md h-screen w-screen overflow-hidden flex flex-col">
<!-- Top Navigation Bar -->
<header class="fixed top-0 w-full z-50 bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-md shadow-sm">
<nav class="flex justify-between items-center px-margin-page h-16 w-full">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-headline-md">explore</span>
<h1 class="text-headline-md font-headline-md text-primary tracking-tight">GeoConnect</h1>
</div>
<div class="flex items-center gap-4">
<button class="p-2 rounded-full hover:bg-surface-variant/50 dark:hover:bg-surface-container-highest/20 transition-colors text-on-surface-variant dark:text-inverse-on-surface" onclick="performSearch()">
<span class="material-symbols-outlined">search</span>
</button>
</div>
</nav>
</header>
<!-- Main Content: Map-First Discovery Canvas -->
<main class="pt-16 pb-20 md:pb-0 flex-1 relative overflow-hidden w-full flex flex-col">
<!-- Abstract Map Layer -->
<div class="absolute inset-0 z-0 map-canvas flex items-center justify-center">
<div class="relative w-full h-full opacity-40">
<div class="absolute top-1/4 left-1/3 animate-pulse">
<div class="w-12 h-12 bg-primary rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
<span class="material-symbols-outlined text-white">location_on</span>
</div>
<div class="absolute -bottom-1 -right-1 w-4 h-4 bg-tertiary-container border-2 border-white rounded-full"></div>
</div>
</div>
</div>
<!-- Floating UI: Search & Categories -->
<section class="relative z-10 p-margin-page pointer-events-none">
<div class="max-w-xl mx-auto space-y-4 pointer-events-auto">
<!-- Search Bar -->
<div class="glass-panel rounded-xl whisper-shadow p-2 flex items-center gap-3 border border-soft-border dark:border-white/10 stagger-reveal" style="animation-delay: 0s;">
<div class="pl-3 text-muted-zinc">
<span class="material-symbols-outlined">location_on</span>
</div>
<input id="searchInput" class="bg-transparent border-none focus:ring-0 w-full text-on-surface dark:text-inverse-on-surface placeholder-muted-zinc font-body-md py-2 outline-none" placeholder="Where are you exploring today?" type="text" onkeypress="handleSearchKeyPress(event)">
<button onclick="performSearch()" class="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:-translate-y-px transition-all">
<span class="material-symbols-outlined text-[20px]">search</span>
<span class="">Search</span>
</button>
</div>
<!-- Category Chips -->
<div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar stagger-reveal" style="animation-delay: 0.1s;">
<button id="chip-Cafe" onclick="selectCategory('Cafe')" class="flex-shrink-0 bg-primary text-white px-5 py-2 rounded-full font-bold text-body-md whisper-shadow flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]">local_cafe</span>
<span class="">Cafes</span>
</button>
<button id="chip-Park" onclick="selectCategory('Park')" class="flex-shrink-0 glass-panel text-on-surface-variant dark:text-inverse-on-surface px-5 py-2 rounded-full font-medium text-body-md border border-soft-border hover:bg-surface-variant/40 dark:hover:bg-white/10 transition-colors flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]">park</span>
<span class="">Parks</span>
</button>
<button id="chip-Mall" onclick="selectCategory('Mall')" class="flex-shrink-0 glass-panel text-on-surface-variant dark:text-inverse-on-surface px-5 py-2 rounded-full font-medium text-body-md border border-soft-border hover:bg-surface-variant/40 dark:hover:bg-white/10 transition-colors flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]">shopping_bag</span>
<span class="">Malls</span>
</button>
<button id="chip-Culture" onclick="selectCategory('Culture')" class="flex-shrink-0 glass-panel text-on-surface-variant dark:text-inverse-on-surface px-5 py-2 rounded-full font-medium text-body-md border border-soft-border hover:bg-surface-variant/40 dark:hover:bg-white/10 transition-colors flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]">museum</span>
<span class="">Culture</span>
</button>
</div>
</div>
</section>

<!-- Places Sidebar -->
<aside class="absolute left-4 right-4 lg:right-auto lg:w-80 top-60 bottom-24 lg:bottom-margin-page flex flex-col gap-4 z-10 bg-white/85 dark:bg-inverse-surface/85 backdrop-blur-md p-4 rounded-2xl border border-soft-border dark:border-white/10 overflow-hidden shadow-xl stagger-reveal" style="animation-delay: 0.2s;">
<h3 class="text-headline-md font-headline-md text-on-surface-variant dark:text-inverse-on-surface">Nearby Places</h3>
<div id="placesList" class="flex-1 overflow-y-auto flex flex-col gap-4 pr-1 scroll-smooth pb-4">
        <div class="text-center text-muted-zinc py-8 delayed-fade">
        <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
        <p class="mt-2">Loading nearby spots...</p>
        </div>
    </div>
</aside>

<!-- Place Detail Slide-up Sheet -->
<div class="fixed inset-x-0 bottom-0 md:inset-x-auto md:right-margin-page md:top-24 md:bottom-24 md:w-96 z-[60] bg-surface-pure dark:bg-inverse-surface rounded-t-[32px] md:rounded-[32px] shadow-2xl detail-sheet translate-y-full flex flex-col border border-soft-border dark:border-white/10 overflow-hidden" id="detailSheet">
<!-- Drag Handle -->
<div class="w-full flex justify-center py-4 md:hidden">
<div class="w-12 h-1.5 bg-surface-variant dark:bg-white/10 rounded-full cursor-pointer" onclick="toggleDetail()"></div>
</div>
<!-- Content Container -->
<div class="flex-1 overflow-y-auto px-6 pb-4 md:pb-6">
<!-- Header Actions -->
<div class="flex justify-between items-center mb-6 pt-2 md:pt-4">
<button class="p-2 rounded-full bg-surface-container dark:bg-white/10 hover:bg-surface-variant dark:hover:bg-white/20 transition-colors text-on-surface dark:text-inverse-on-surface" onclick="toggleDetail()">
<span class="material-symbols-outlined">close</span>
</button>
</div>
<!-- Venue Info -->
<div class="mb-6">
<h2 id="detailName" class="text-headline-lg font-headline-lg mb-1 text-on-surface dark:text-inverse-on-surface">Venue Name</h2>
<div class="flex items-center gap-3 text-muted-zinc mb-4">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-[16px] text-yellow-500">star</span>
<span id="detailRating" class="font-bold text-on-surface dark:text-inverse-on-surface">4.9</span>
</div>
<span class="w-1 h-1 bg-muted-zinc rounded-full"></span>
<span id="detailCategory" class="">Category</span>
</div>
<p id="detailAddress" class="text-muted-zinc text-body-md mb-4">123 Address Rd.</p>
<!-- Photos Grid -->
<div class="grid grid-cols-2 gap-2 mb-6">
<div class="aspect-square rounded-xl overflow-hidden">
<img id="detailImage1" class="w-full h-full object-cover" src="">
</div>
<div class="grid grid-rows-2 gap-2">
<div class="rounded-xl overflow-hidden">
<img id="detailImage2" class="w-full h-full object-cover" src="">
</div>
<div class="rounded-xl overflow-hidden relative">
<img id="detailImage3" class="w-full h-full object-cover" src="">
<div class="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold">+5</div>
</div>
</div>
</div>
<!-- Action Button -->
<button id="checkinBtn" onclick="performCheckin()" class="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-lg whisper-shadow flex items-center justify-center gap-2 active:scale-[0.98] transition-all mb-8">
<span class="material-symbols-outlined">where_to_vote</span>
<span id="checkinBtnText">Check-in to Venue</span>
</button>
<!-- Leaderboard -->
<div class="space-y-4">
<div class="flex justify-between items-center">
<h3 class="font-headline-md text-[20px] text-on-surface dark:text-inverse-on-surface">Local Legends</h3>
</div>
<div id="leaderboardList" class="space-y-2">
    <!-- Dynamic leaderboard -->
</div>
</div>
</div>
</div>
</div>
</main>
<!-- Overlay for sheet on desktop -->
<div class="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 hidden opacity-0 transition-opacity duration-300" id="overlay" onclick="toggleDetail()"></div>
<script>
        let selectedPlace = null;
        let activeCategory = 'Cafe';

        function selectCategory(category) {
            activeCategory = category;
            ['Cafe', 'Park', 'Mall', 'Culture'].forEach(cat => {
                const chip = document.getElementById('chip-' + cat);
                if (cat === category) {
                    chip.className = "flex-shrink-0 bg-primary text-white px-5 py-2 rounded-full font-bold text-body-md whisper-shadow flex items-center gap-2";
                } else {
                    chip.className = "flex-shrink-0 glass-panel text-on-surface-variant dark:text-inverse-on-surface px-5 py-2 rounded-full font-medium text-body-md border border-soft-border dark:border-white/10 hover:bg-surface-variant/40 dark:hover:bg-white/10 transition-colors flex items-center gap-2";
                }
            });
            
            document.getElementById('placesList').innerHTML = '<div class="text-center text-muted-zinc py-8 delayed-fade"><span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span><p class="mt-2">Searching...</p></div>';
            
            window.ReactNativeWebView.postMessage(JSON.stringify({
                action: 'loadPlaces',
                category: category
            }));
        }

        function handleSearchKeyPress(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        }

        function performSearch() {
            const query = document.getElementById('searchInput').value;
            if (!query.trim()) return;
            
            document.getElementById('placesList').innerHTML = '<div class="text-center text-muted-zinc py-8 delayed-fade"><span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span><p class="mt-2">Searching...</p></div>';
            
            window.ReactNativeWebView.postMessage(JSON.stringify({
                action: 'searchPlaces',
                query: query,
                category: activeCategory
            }));
        }

        function renderPlaces(places) {
            const listDiv = document.getElementById('placesList');
            if (!places || places.length === 0) {
                listDiv.innerHTML = '<div class="text-center text-muted-zinc py-8">No venues found nearby.</div>';
                return;
            }

            listDiv.innerHTML = places.map((place) => {
                const img = place.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500';
                const rating = place.rating || 4.5;
                const desc = place.description || 'Venue';
                const distText = place.distance ? place.distance.toFixed(1) + 'km away' : 'Nearby';
                const placeStr = JSON.stringify(place).replace(/"/g, '&quot;');
                
                return '<div class="glass-panel border border-soft-border dark:border-white/10 rounded-xl p-4 whisper-shadow cursor-pointer group hover:-translate-y-px transition-all" onclick="selectPlace(' + placeStr + ')">' +
                    '<div class="relative h-32 rounded-lg overflow-hidden mb-3">' +
                        '<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="' + img + '">' +
                        '<div class="absolute top-2 right-2 bg-primary/90 text-white text-[10px] px-2 py-1 rounded-full font-technical-label">' + rating + ' ★</div>' +
                    '</div>' +
                    '<h4 class="font-headline-md text-[18px] leading-tight mb-1 text-on-surface dark:text-inverse-on-surface">' + place.name + '</h4>' +
                    '<p class="text-muted-zinc text-body-md mb-2 truncate">' + desc + '</p>' +
                    '<div class="flex items-center justify-between">' +
                        '<span class="text-primary font-technical-label text-[12px]">' + distText + '</span>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        function selectPlace(place) {
            selectedPlace = place;
            document.getElementById('detailName').innerText = place.name;
            document.getElementById('detailRating').innerText = place.rating || '4.5';
            document.getElementById('detailCategory').innerText = place.category || 'Venue';
            document.getElementById('detailAddress').innerText = place.address || '';
            
            const imgUrl1 = place.images?.[0] || place.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500';
            const imgUrl2 = place.images?.[1] || place.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500';
            const imgUrl3 = place.images?.[2] || place.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500';
            document.getElementById('detailImage1').src = imgUrl1;
            document.getElementById('detailImage2').src = imgUrl2;
            document.getElementById('detailImage3').src = imgUrl3;
            
            document.getElementById('leaderboardList').innerHTML = '<div class="text-center text-muted-zinc py-4 delayed-fade"><span class="material-symbols-outlined animate-spin">progress_activity</span> Loading legends...</div>';
            
            window.ReactNativeWebView.postMessage(JSON.stringify({
                action: 'requestLeaderboard',
                placeId: place.id
            }));

            const sheet = document.getElementById('detailSheet');
            const overlay = document.getElementById('overlay');
            sheet.classList.remove('translate-y-full');
            sheet.classList.add('translate-y-0');
            if (window.innerWidth >= 1024) {
                overlay.classList.remove('hidden');
                setTimeout(() => overlay.classList.add('opacity-100'), 10);
            }
        }

        function renderLeaderboard(leaderboard) {
            const lbList = document.getElementById('leaderboardList');
            if (!leaderboard || leaderboard.length === 0) {
                lbList.innerHTML = '<div class="text-center text-muted-zinc py-4">Be the first to check in here!</div>';
                return;
            }

            lbList.innerHTML = leaderboard.map((user, idx) => {
                const isFirst = idx === 0;
                const rankBadge = isFirst ? '<div class="text-primary"><span class="material-symbols-outlined fill-1" style="font-variation-settings: \'FILL\' 1;">workspace_premium</span></div>' : '';
                const itemClass = isFirst ? 'bg-surface-container-low dark:bg-white/5 border border-soft-border dark:border-white/10' : 'hover:bg-surface-container-lowest dark:hover:bg-white/5 transition-colors';
                const rankClass = isFirst ? 'text-tertiary' : 'text-muted-zinc';
                const photo = user.photoURL || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpi2DH_YkmLERc2GoG-WO4bj4bBFlacnxdeNCrJ0F3dy3FMMDH55VbtMcSWK4TVOW4cRUsH4E9cGwhtnVdhy_EEjtmtFuv6ofaQYiXqUHsfQldHl03KoMAn4NkOPzAq7mtpSzNIXpel-YHY22IS5HHBJpq0U4BZlboXxYgCtROqw6ROjn99B_DRhjGI21tw7YO8jW_PWYj2OpgVtju94GtceYuW2-M4_rfA2zGB2xtgSlbJf4Asx-BtvopjSbS2Ymmp64JJU7e-5I';
                
                return '<div class="flex items-center gap-4 p-3 rounded-xl ' + itemClass + '">' +
                    '<div class="flex-shrink-0 w-8 h-8 flex items-center justify-center font-technical-label ' + rankClass + '">#' + (idx + 1) + '</div>' +
                    '<div class="w-10 h-10 rounded-full overflow-hidden bg-secondary">' +
                        '<img class="w-full h-full object-cover" src="' + photo + '">' +
                    '</div>' +
                    '<div class="flex-1">' +
                        '<div class="font-bold text-on-surface dark:text-inverse-on-surface">' + user.displayName + '</div>' +
                        '<div class="text-[12px] text-muted-zinc">' + user.count + ' check-ins</div>' +
                    '</div>' +
                    rankBadge +
                '</div>';
            }).join('');
        }

        function performCheckin() {
            if (!selectedPlace) return;
            
            const btn = document.getElementById('checkinBtn');
            const txt = document.getElementById('checkinBtnText');
            btn.disabled = true;
            txt.innerText = 'Checking in...';
            
            window.ReactNativeWebView.postMessage(JSON.stringify({
                action: 'performCheckin',
                placeId: selectedPlace.id,
                placeName: selectedPlace.name,
                latitude: selectedPlace.latitude,
                longitude: selectedPlace.longitude,
                category: selectedPlace.category
            }));
        }

        function onCheckinSuccess() {
            const btn = document.getElementById('checkinBtn');
            const txt = document.getElementById('checkinBtnText');
            btn.disabled = false;
            txt.innerText = 'Check-in to Venue';
        }

        function onCheckinFailure() {
            const btn = document.getElementById('checkinBtn');
            const txt = document.getElementById('checkinBtnText');
            btn.disabled = false;
            txt.innerText = 'Check-in to Venue';
        }

        function toggleDetail() {
            const sheet = document.getElementById('detailSheet');
            const overlay = document.getElementById('overlay');
            
            sheet.classList.add('translate-y-full');
            sheet.classList.remove('translate-y-0');
            overlay.classList.remove('opacity-100');
            setTimeout(() => overlay.classList.add('hidden'), 300);
        }

        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                // Check if we have location permission and data before loading places
                if (!hasLocationPermission || lat === null || lng === null || lat === undefined || lng === undefined) {
                    // Show error message in the places list
                    const safeLocationError = (locationError || 'Location unavailable').replace(/'/g, "\\'");
                    document.getElementById('placesList').innerHTML = '<div class="text-center text-muted-zinc py-8"><span class="material-symbols-outlined text-3xl">error</span><p class="mt-2">' + safeLocationError + '</p></div>';
                    document.getElementById('leaderboardList').innerHTML = '<div class="text-center text-muted-zinc py-4">Location unavailable</div>';
                    return;
                }

                window.ReactNativeWebView.postMessage(JSON.stringify({
                    action: 'loadPlaces',
                    category: 'Cafe'
                }));
            }, 300);
        });
</script>
</body></html>`;
};

export default function PlacesCheckin() {
  const { user } = useAuth();
  const { currentLocation } = useLocationStore();
  const isDark = useThemeStore((state) => state.isDark);
  const webViewRef = useRef(null);

  // Check/request location permissions
  const locationPermission = useLocationPermission();

  // Determine if we have permission and location
  const hasLocationPermission = locationPermission === 'granted';
  let locationError = null;
  let lat, lng;

  if (!hasLocationPermission) {
    locationError = 'Location permission is required to show nearby places.';
  } else if (!currentLocation) {
    locationError = 'Unable to determine your location. Please ensure location services are enabled.';
  } else {
    lat = currentLocation?.latitude;
    lng = currentLocation?.longitude;
  }

  // Sync Dark/Light Mode
  useEffect(() => {
    webViewRef.current?.injectJavaScript(`
      document.documentElement.className = "${isDark ? 'dark' : 'light'}";
      true;
    `);
  }, [isDark]);

  return (
    <SafeAreaView style={styles.container}>
      <WebView 
        ref={webViewRef}
        source={{ html: getHtmlContent(isDark) }} 
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={async (event) => {
          try {
            const message = event.nativeEvent.data;
            const data = JSON.parse(message);

            // Check if we have location permission and data
            if (!hasLocationPermission || lat === null || lng === null || lat === undefined || lng === undefined) {
                // Show error for location-dependent actions
                if (data.action === 'loadPlaces' || data.action === 'searchPlaces') {
                    const safeLocationError = locationError.replace(/'/g, "\\'");
                    webViewRef.current?.injectJavaScript(
                        'document.getElementById(\'placesList\').innerHTML = \'<div class="text-center text-muted-zinc py-8"><span class="material-symbols-outlined text-3xl">error</span><p class="mt-2">' + safeLocationError + '</p></div>\'; document.getElementById(\'leaderboardList\').innerHTML = \'<div class="text-center text-muted-zinc py-4">Location unavailable</div>\'; true;'
                    );
                    return;
                }
                // For other actions that don't require location, we might still want to proceed
                // but for now, let's block location-dependent ones
                if (['loadPlaces', 'searchPlaces'].includes(data.action)) {
                    return;
                }
            }

            // Use the permission-checked latitude and longitude
            const latitude = lat;
            const longitude = lng;

            if (data.action === 'loadPlaces') {
              const results = await getNearbyPlaces(lat, lng, data.category);
              webViewRef.current?.injectJavaScript(`renderPlaces(${JSON.stringify(results)}); true;`);
            } 
            else if (data.action === 'searchPlaces') {
              const results = await getNearbyPlaces(lat, lng, data.category || 'Cafe');
              const filtered = results.filter(p => p.name.toLowerCase().includes(data.query.toLowerCase()));
              webViewRef.current?.injectJavaScript(`renderPlaces(${JSON.stringify(filtered)}); true;`);
            }
            else if (data.action === 'requestLeaderboard') {
              const checkins = await getCheckinsForVenue(data.placeId);
              const counts = {};
              checkins.forEach(c => {
                const uId = c.userId || 'anonymous';
                if (!counts[uId]) {
                  counts[uId] = {
                    displayName: c.displayName || 'Explorer',
                    photoURL: c.photoURL || '',
                    count: 0
                  };
                }
                counts[uId].count += 1;
              });
              const leaderboard = Object.values(counts).sort((a, b) => b.count - a.count);
              webViewRef.current?.injectJavaScript(`renderLeaderboard(${JSON.stringify(leaderboard)}); true;`);
            }
            else if (data.action === 'performCheckin') {
              if (!user) {
                Alert.alert("Authentication Required", "Please log in to check in to venues.");
                webViewRef.current?.injectJavaScript(`onCheckinFailure(); true;`);
                return;
              }
              await createCheckin(user.uid, {
                venueId: data.placeId,
                venueName: data.placeName,
                displayName: user.displayName || 'Explorer',
                photoURL: user.photoURL || '',
                latitude: data.latitude,
                longitude: data.longitude,
              });
              
              // Refresh leaderboard
              const checkins = await getCheckinsForVenue(data.placeId);
              const counts = {};
              checkins.forEach(c => {
                const uId = c.userId || 'anonymous';
                if (!counts[uId]) {
                  counts[uId] = {
                    displayName: c.displayName || 'Explorer',
                    photoURL: c.photoURL || '',
                    count: 0
                  };
                }
                counts[uId].count += 1;
              });
              const leaderboard = Object.values(counts).sort((a, b) => b.count - a.count);
              
              webViewRef.current?.injectJavaScript(`
                onCheckinSuccess();
                renderLeaderboard(${JSON.stringify(leaderboard)});
                true;
              `);
            }
          } catch (error) {
            console.error("[PlacesCheckin] Error handling message:", error);
            webViewRef.current?.injectJavaScript(`onCheckinFailure(); true;`);
          }
        }}
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
