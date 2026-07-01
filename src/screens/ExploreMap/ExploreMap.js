import React, { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore, useLocationStore } from '../../store/stores';
import { useWatchLocation } from '../../hooks/useLocation';
import { getPostsNearby, getUserProfile } from '../../services/firestoreService';
import { encodeGeoHash, getGeoHashPrecisionForRadius } from '../../utils/geoUtils';

const getHtmlContent = (isDark) => {
  return `<!DOCTYPE html><html class="${isDark ? 'dark' : 'light'}" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0, viewport-fit=cover" name="viewport"/>
<title>GeoConnect | Explore Map</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "muted-zinc":"#64748B","surface-bright":"#fcf8ff","on-secondary":"#ffffff",
                    "on-surface":"#1b1b23","surface-variant":"#e4e1ed","error":"#ba1a1a",
                    "primary":"#4648d4","primary-container":"#6063ee","on-primary":"#ffffff",
                    "on-surface-variant":"#464554","surface-container":"#efecf8",
                    "surface-pure":"#FFFFFF","surface-dim":"#dbd8e4",
                    "surface-container-highest":"#e4e1ed","soft-border":"rgba(226, 232, 240, 0.8)",
                    "background":"#fcf8ff","inverse-on-surface":"#f2effb",
                    "inverse-surface":"#303038","outline-variant":"#c7c4d7",
                    "surface-container-low":"#f5f2fe","surface-container-high":"#e9e6f3",
                    "surface":"#fcf8ff","tertiary":"#904900","on-error-container":"#93000a",
                    "error-container":"#ffdad6","inverse-primary":"#c0c1ff","primary-fixed":"#e1e0ff",
                    "outline":"#767586","surface-tint":"#494bd6","on-primary-container":"#fffbff",
                    "secondary":"#565e74","on-background":"#1b1b23","canvas-white":"#F9FAFB"
            },
            "borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},
            "spacing":{"margin-page":"24px","safe-area":"32px","gutter-grid":"16px","stack-gap":"12px"},
            "fontFamily":{"body-lg":["Plus Jakarta Sans"],"technical-label":["JetBrains Mono"],"headline-md":["Plus Jakarta Sans"],"headline-lg":["Plus Jakarta Sans"],"body-md":["Plus Jakarta Sans"],"headline-lg-mobile":["Plus Jakarta Sans"]},
            "fontSize":{"body-lg":["16px",{"lineHeight":"1.6","fontWeight":"400"}],"technical-label":["12px",{"lineHeight":"1.4","fontWeight":"500"}],"headline-md":["24px",{"lineHeight":"1.2","letterSpacing":"-0.01em","fontWeight":"700"}],"body-md":["14px",{"lineHeight":"1.6","fontWeight":"400"}]}
          },
        }
      }
    </script>
<style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #fcf8ff; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; display: inline-block; vertical-align: middle; }
        .whisper-shadow { box-shadow: 0 10px 30px -5px rgba(70, 72, 212, 0.08); }
        .glass-panel { background: rgba(252, 248, 255, 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .dark .glass-panel { background: rgba(27, 27, 35, 0.8); }
        .marker-pulse::after { content: ''; position: absolute; inset: -4px; border-radius: 9999px; border: 2px solid #4648d4; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }
        .range-slider::-webkit-slider-thumb { appearance: none; width: 20px; height: 20px; background: #4648d4; border: 4px solid #ffffff; border-radius: 50%; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }

        #map {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 0;
            width: 100%;
            height: 100%;
        }
        .custom-user-icon .marker-inner {
            width: 14px;
            height: 14px;
            background: #4648d4;
            border: 2px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 0 6px rgba(70, 72, 212, 0.6);
        }
        .custom-user-icon .marker-pulse-div {
            position: absolute;
            width: 32px;
            height: 32px;
            background: rgba(70, 72, 212, 0.25);
            border-radius: 50%;
            animation: pulse-animation 2s infinite;
        }
        @keyframes pulse-animation {
            0% { transform: scale(0.4); opacity: 1; }
            100% { transform: scale(1.4); opacity: 0; }
        }
        .custom-post-icon img {
            border-radius: 50%;
            border: 2px solid #4648d4;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            background: white;
        }
        .custom-post-icon .placeholder-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #4648d4;
            border: 2px solid #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        }
    </style>
</head>
<body class="overflow-hidden h-screen w-screen flex flex-col bg-background dark:bg-inverse-surface">

<!-- Leaflet Map Container -->
<div id="map"></div>

<!-- Top Search Bar -->
<header class="fixed top-0 left-0 right-0 z-[1000] flex items-center px-4 h-14 bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-md rounded-full mx-margin-page mt-4 shadow-sm">
<div class="flex items-center w-full gap-3 px-2">
<span class="material-symbols-outlined text-primary">search</span>
<input class="bg-transparent border-none focus:ring-0 w-full font-body-md text-on-surface dark:text-inverse-on-surface placeholder-on-surface-variant/60 dark:placeholder-inverse-on-surface/40" placeholder="Search GeoConnect..." type="text"/>
</div>
</header>
<!-- Radius Slider -->
<div class="fixed bottom-48 left-0 right-0 z-[1000] px-margin-page pointer-events-none">
<div class="max-w-md mx-auto pointer-events-auto">
<div class="glass-panel p-4 rounded-2xl whisper-shadow border border-white/50 dark:border-white/10">
<div class="flex justify-between items-center mb-3">
<span class="font-headline-md text-[14px] text-on-surface dark:text-inverse-on-surface">Search Radius</span>
<span class="font-technical-label text-primary bg-primary/10 px-2 py-0.5 rounded-full" id="radius-val">1.0km</span>
</div>
<input class="range-slider w-full h-1.5 bg-surface-container-highest dark:bg-white/10 rounded-full appearance-none cursor-pointer" max="2" min="0" oninput="updateRadius(this.value)" step="1" type="range" value="1"/>
<div class="flex justify-between mt-2 font-technical-label text-[10px] text-on-surface-variant dark:text-inverse-on-surface/50 uppercase tracking-wider">
<span>500m</span><span>1km</span><span>5km</span>
</div>
</div>
</div>
</div>
<!-- Bottom Sheet -->
<div class="fixed bottom-0 left-0 right-0 z-[1001] transition-transform duration-500 ease-[cubic-bezier(0.2,0,0,1)]" id="bottom-sheet" style="transform: translateY(calc(100% - 200px));">
<div class="max-w-2xl mx-auto bg-surface dark:bg-inverse-surface rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] pb-safe overflow-hidden">
<div class="w-full flex justify-center pt-3 pb-2 cursor-pointer" onclick="toggleSheet()">
<div class="w-12 h-1 bg-outline-variant/40 dark:bg-white/20 rounded-full"></div>
</div>
<div class="px-margin-page pb-4">
<div class="flex justify-between items-center mb-4">
<h2 class="font-headline-md text-on-surface dark:text-inverse-on-surface">Nearby Posts</h2>
<span id="postsCount" class="font-technical-label text-on-surface-variant dark:text-inverse-on-surface/50">Loading...</span>
</div>
<div id="postsContainer" class="space-y-stack-gap max-h-[50vh] overflow-y-auto">
    <div class="text-center text-muted-zinc py-8"><span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span><p class="mt-2">Discovering posts...</p></div>
</div>
</div>
</div>
</div>
<script>
        const radiusValues = [0.5, 1.0, 5.0];
        let currentRadiusKm = 1.0;
        let map;
        let userMarker;
        let markersLayer;
        let currentTileLayer;

        function updateRadius(val) {
            currentRadiusKm = radiusValues[val];
            const label = document.getElementById('radius-val');
            label.textContent = currentRadiusKm < 1 ? (currentRadiusKm * 1000) + 'm' : currentRadiusKm + 'km';
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'updateRadius', radiusKm: currentRadiusKm }));
        }

        let isSheetOpen = false;
        function toggleSheet() {
            const sheet = document.getElementById('bottom-sheet');
            isSheetOpen = !isSheetOpen;
            sheet.style.transform = isSheetOpen ? 'translateY(0)' : 'translateY(calc(100% - 200px))';
        }

        function initMap(lat, lng) {
            if (map) return;
            map = L.map('map', { zoomControl: false, attributionControl: false }).setView([lat, lng], 14);

            const isDark = document.documentElement.classList.contains('dark');
            const tileUrl = isDark
                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

            currentTileLayer = L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);
            markersLayer = L.layerGroup().addTo(map);

            const userIcon = L.divIcon({
                className: 'custom-user-icon flex items-center justify-center',
                html: '<div class="relative flex items-center justify-center"><div class="marker-pulse-div"></div><div class="marker-inner"></div></div>',
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            });
            userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
        }

        function updateMapCenter(lat, lng) {
            if (!map) {
                initMap(lat, lng);
            } else {
                map.setView([lat, lng]);
                if (userMarker) {
                    userMarker.setLatLng([lat, lng]);
                }
            }
        }

        function updateTheme(isDark) {
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            if (map) {
                if (currentTileLayer) {
                    map.removeLayer(currentTileLayer);
                }
                const tileUrl = isDark
                    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
                currentTileLayer = L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);
            }
        }

        function renderNearbyPosts(posts) {
            const container = document.getElementById('postsContainer');
            const countEl = document.getElementById('postsCount');
            countEl.textContent = (posts ? posts.length : 0) + ' Discovery';

            if (markersLayer) {
                markersLayer.clearLayers();
            }

            if (!posts || posts.length === 0) {
                container.innerHTML = '<div class="text-center text-muted-zinc py-8"><span class="material-symbols-outlined text-3xl">explore_off</span><p class="mt-2">No posts found nearby</p></div>';
                return;
            }

            container.innerHTML = posts.map(post => {
                const img = post.imageURL || '';
                const authorName = post.authorName || 'Explorer';
                const authorPhoto = post.authorPhoto || '';
                const category = post.locationLabel || 'Nearby';
                const imgHtml = img ? '<div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"><img class="w-full h-full object-cover" src="' + img + '"></div>' : '';
                const avatarHtml = authorPhoto ? '<img class="w-full h-full object-cover" src="' + authorPhoto + '">' : '<div class="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">' + authorName.charAt(0) + '</div>';

                if (map && markersLayer && post.lat && post.lng) {
                    const postIcon = L.divIcon({
                        className: 'custom-post-icon',
                        html: img
                            ? '<div class="w-9 h-9"><img src="' + img + '" class="w-full h-full object-cover rounded-full border-2 border-primary shadow" /></div>'
                            : '<div class="placeholder-icon"><span class="material-symbols-outlined text-white text-[16px]">explore</span></div>',
                        iconSize: [36, 36],
                        iconAnchor: [18, 18]
                    });
                    const marker = L.marker([post.lat, post.lng], { icon: postIcon });
                    marker.on('click', () => {
                        window.ReactNativeWebView.postMessage(JSON.stringify({action: 'openPost', postId: post.id}));
                    });
                    markersLayer.addLayer(marker);
                }

                return '<div class="bg-surface-pure dark:bg-white/5 p-4 rounded-2xl whisper-shadow flex gap-4 items-start border border-soft-border/20 dark:border-white/10 transform active:scale-[0.98] cursor-pointer" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action:\\'openPost\\', postId:\\'' + post.id + '\\'}))">' +
                    imgHtml +
                    '<div class="flex-1">' +
                        '<div class="flex justify-between items-start mb-1">' +
                            '<span class="font-technical-label text-[10px] text-primary uppercase tracking-widest">' + category + '</span>' +
                        '</div>' +
                        '<h3 class="font-headline-md text-[16px] text-on-surface dark:text-inverse-on-surface leading-snug mb-2">' + (post.caption || '').substring(0, 60) + '</h3>' +
                        '<div class="flex items-center gap-2">' +
                            '<div class="w-5 h-5 rounded-full overflow-hidden">' + avatarHtml + '</div>' +
                            '<span class="font-body-md text-[12px] text-on-surface-variant dark:text-inverse-on-surface/60">' + authorName + '</span>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'loadNearbyPosts', radiusKm: 1.0 }));
            }, 300);
        });
    </script>
</body></html>`;
};

export default function ExploreMap({ navigation }) {
  const { user } = useAuth();
  const isDark = useThemeStore((state) => state.isDark);
  const { currentLocation, permissionStatus } = useLocationStore();

  // Watch for location updates
  const watchedLocation = useWatchLocation(true);

  // Use watched location if available, otherwise fall back to stored location or default
  const lat = watchedLocation?.latitude ?? currentLocation?.latitude ?? -6.324260;
  const lng = watchedLocation?.longitude ?? currentLocation?.longitude ?? 106.791550;
  const webViewRef = useRef(null);

  useEffect(() => {
    webViewRef.current?.injectJavaScript(`
      updateTheme(${isDark});
      true;
    `);

    // Cleanup function to prevent memory leaks
    return () => {
      if (webViewRef.current) {
        // Clear any intervals or listeners if needed
        webViewRef.current?.injectJavaScript(`
          // Cleanup map resources if they exist
          if (typeof markersLayer !== 'undefined' && markersLayer) {
            markersLayer.clearLayers();
          }
          if (typeof map !== 'undefined' && map) {
            map.remove();
          }
          true;
        `);
      }
    };
  }, [isDark]);

  const loadNearbyPosts = async (radiusKm) => {
    try {
      // Check if we have valid location coordinates
      if (lat === null || lng === null) {
        throw new Error('Location not available');
      }

      const precision = getGeoHashPrecisionForRadius(radiusKm);
      const geoHashPrefix = encodeGeoHash(lat, lng, precision);
      const posts = await getPostsNearby(geoHashPrefix, 20);

      const enriched = await Promise.all(
        posts.map(async (post) => {
          try {
            const author = await getUserProfile(post.authorId);
            return { ...post, authorName: author?.displayName || 'Explorer', authorPhoto: author?.photoURL || '' };
          } catch (e) {
            return { ...post, authorName: 'Explorer', authorPhoto: '' };
          }
        })
      );

      webViewRef.current?.injectJavaScript(`
        updateTheme(${isDark});
        updateMapCenter(${lat}, ${lng});
        renderNearbyPosts(${JSON.stringify(enriched)});
        true;
      `);
    } catch (error) {
      console.error('[ExploreMap] Error loading posts:', error);
      webViewRef.current?.injectJavaScript(`
        updateTheme(${isDark});
        updateMapCenter(${-6.324260}, ${106.791550});
        renderNearbyPosts([]);
        true;
      `);
    }
  };

  const handleMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.action === 'loadNearbyPosts') {
        await loadNearbyPosts(data.radiusKm || 1.0);
      }
      else if (data.action === 'updateRadius') {
        await loadNearbyPosts(data.radiusKm);
      }
      else if (data.action === 'openPost') {
        navigation.navigate('PostDetail', { postId: data.postId });
      }
    } catch (error) {
      console.error('[ExploreMap] Error handling message:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: getHtmlContent(isDark) }}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleMessage}
        onError={error => {
          console.error('[ExploreMap] WebView error:', error);
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