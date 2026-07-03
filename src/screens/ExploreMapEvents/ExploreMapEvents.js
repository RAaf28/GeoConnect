import React, { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore, useLocationStore } from '../../store/stores';
import { useWatchLocation } from '../../hooks/useLocation';
import { getEventsNearby } from '../../services/firestoreService';
import { encodeGeoHash, getGeoHashPrecisionForRadius } from '../../utils/geoUtils';

const getHtmlContent = (isDark) => {
  return `<!DOCTYPE html><html class="${isDark ? 'dark' : 'light'}" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0, viewport-fit=cover" name="viewport"/>
<title>GeoConnect | Explore Events Map</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
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
            "fontFamily":{"body-lg":["Plus Jakarta Sans"],"technical-label":["JetBrains Mono"],"headline-md":["Plus Jakarta Sans"],"body-md":["Plus Jakarta Sans"]},
            "fontSize":{"body-lg":["16px",{"lineHeight":"1.6","fontWeight":"400"}],"technical-label":["12px",{"lineHeight":"1.4","fontWeight":"500"}],"headline-md":["24px",{"lineHeight":"1.2","letterSpacing":"-0.01em","fontWeight":"700"}],"body-md":["14px",{"lineHeight":"1.6","fontWeight":"400"}]}
          },
        },
      }
    </script>
<style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; display: inline-block; vertical-align: middle; }
        .whisper-shadow { box-shadow: 0 4px 20px -4px rgba(0,0,0,0.05), 0 0 3px rgba(0,0,0,0.02); }
        @keyframes delayedFadeIn { 0% { opacity: 0; } 80% { opacity: 0; } 100% { opacity: 1; } }
        .delayed-fade { animation: delayedFadeIn 1s forwards; opacity: 0; }
        .glass-panel { background: rgba(252, 248, 255, 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .dark .glass-panel { background: rgba(27, 27, 35, 0.8); }

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
        .custom-event-icon .marker-outer {
            width: 36px;
            height: 36px;
            background: #904900;
            border: 2.5px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>
</head>
<body class="overflow-hidden h-screen w-screen flex flex-col bg-background dark:bg-inverse-surface">

<!-- Leaflet Map Container -->
<div id="map"></div>

<!-- Top Search -->
<header class="fixed top-0 left-0 right-0 z-[1000] flex items-center px-4 h-14 bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-md rounded-full mx-margin-page mt-4 shadow-sm">
<div class="flex items-center w-full gap-3 px-2">
<span class="material-symbols-outlined text-primary">search</span>
<input class="bg-transparent border-none focus:ring-0 w-full font-body-md text-on-surface dark:text-inverse-on-surface placeholder-on-surface-variant/60 dark:placeholder-inverse-on-surface/40" placeholder="Search events..." type="text"/>
</div>
</header>
<!-- Events Filter Chip -->
<div class="fixed top-24 left-1/2 -translate-x-1/2 z-[1000]">
<button class="flex items-center gap-2 px-4 py-2 bg-surface-pure dark:bg-white/10 rounded-full whisper-shadow border border-soft-border/20 dark:border-white/10 transition-transform active:scale-95">
<span class="material-symbols-outlined text-primary text-[20px]">local_activity</span>
<span class="font-body-md text-[14px] font-bold text-on-surface dark:text-inverse-on-surface">Events</span>
</button>
</div>
<!-- Featured Event Card -->
<div id="featuredEvent" class="fixed bottom-8 left-0 right-0 z-[1000] px-margin-page pointer-events-none">
<div class="max-w-md mx-auto pointer-events-auto">
<div class="glass-panel p-4 rounded-2xl whisper-shadow border border-white/50 dark:border-white/10 flex flex-col gap-3">
<div class="text-center text-muted-zinc py-4 delayed-fade"><span class="material-symbols-outlined animate-spin">progress_activity</span><p class="text-sm mt-1">Loading events...</p></div>
</div>
</div>
</div>
<script>
        let map;
        let userMarker;
        let markersLayer;
        let currentTileLayer;

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

        function formatDate(dateStr) {
            if (!dateStr) return '';
            const date = dateStr.seconds ? new Date(dateStr.seconds * 1000) : new Date(dateStr);
            const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
            const h = date.getHours();
            const m = date.getMinutes();
            const ampm = h >= 12 ? 'PM' : 'AM';
            return days[date.getDay()] + ', ' + ((h % 12) || 12) + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
        }

        function renderFeaturedEvent(events) {
            const container = document.getElementById('featuredEvent');
            
            if (markersLayer) {
                markersLayer.clearLayers();
            }

            if (!events || events.length === 0) {
                container.innerHTML = '<div class="max-w-md mx-auto pointer-events-auto"><div class="glass-panel p-4 rounded-2xl whisper-shadow border border-white/50 dark:border-white/10 text-center text-muted-zinc py-4"><span class="material-symbols-outlined text-2xl">event_busy</span><p class="text-sm mt-1">No events nearby</p></div></div>';
                return;
            }

            let html = '';
            events.slice(0, 3).forEach((evt, idx) => {
                const title = evt.title || 'Event';
                const timeStr = formatDate(evt.startDate);
                const going = evt.rsvpCounts?.going || 0;
                const isFirst = idx === 0;

                if (map && markersLayer && evt.lat && evt.lng) {
                    const eventIcon = L.divIcon({
                        className: 'custom-event-icon',
                        html: '<div class="marker-outer"><span class="material-symbols-outlined text-white text-[18px]">calendar_today</span></div>',
                        iconSize: [36, 36],
                        iconAnchor: [18, 18]
                    });
                    const marker = L.marker([evt.lat, evt.lng], { icon: eventIcon });
                    marker.on('click', () => {
                        viewDetail(evt.id);
                    });
                    markersLayer.addLayer(marker);
                }

                html += '<div class="max-w-md mx-auto pointer-events-auto ' + (idx > 0 ? 'mt-3' : '') + '">' +
                    '<div class="glass-panel p-4 rounded-2xl whisper-shadow border border-white/50 dark:border-white/10 flex flex-col gap-3">' +
                        '<div class="flex justify-between items-start">' +
                            '<div>' +
                                (isFirst ? '<span class="font-technical-label text-[10px] text-tertiary uppercase tracking-widest">Featured Event</span>' : '') +
                                '<h2 class="font-headline-md text-[18px] text-on-surface dark:text-inverse-on-surface">' + title + '</h2>' +
                            '</div>' +
                        '</div>' +
                        '<div class="flex items-center gap-4 text-on-surface-variant dark:text-inverse-on-surface/60">' +
                            '<div class="flex items-center gap-1"><span class="material-symbols-outlined text-[18px]">schedule</span><span class="font-body-md text-[12px]">' + timeStr + '</span></div>' +
                            '<div class="flex items-center gap-1"><span class="material-symbols-outlined text-[18px]">group</span><span class="font-body-md text-[12px]">' + going + ' going</span></div>' +
                        '</div>' +
                        '<button onclick="viewDetail(\\'' + evt.id + '\\')" class="w-full py-3 bg-primary text-white rounded-xl font-bold text-[14px] transition-transform active:scale-[0.98]">View Details</button>' +
                    '</div>' +
                '</div>';
            });

            container.innerHTML = html;
        }

        function viewDetail(eventId) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'viewEventDetail', eventId: eventId }));
        }

        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'loadEvents' }));
            }, 300);
        });
    </script>
</body></html>`;
};

export default function ExploreMapEvents({ navigation }) {
  const { user } = useAuth();
  const isDark = useThemeStore((state) => state.isDark);
  const { currentLocation } = useLocationStore();
  const webViewRef = useRef(null);

  useEffect(() => {
    webViewRef.current?.injectJavaScript(`
      updateTheme(${isDark});
      true;
    `);

    // Cleanup function to prevent memory leaks
    return () => {
      if (webViewRef.current) {
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

  const handleMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.action === 'loadEvents') {
        try {
          const lat = currentLocation?.latitude || -6.324260;
          const lng = currentLocation?.longitude || 106.791550;
          const geoHashPrefix = encodeGeoHash(lat, lng, 5);
          const events = await getEventsNearby(geoHashPrefix);
          
          webViewRef.current?.injectJavaScript(`
            updateTheme(${isDark});
            updateMapCenter(${lat}, ${lng});
            renderFeaturedEvent(${JSON.stringify(events)});
            true;
          `);
        } catch (error) {
          console.error('[ExploreMapEvents] Error loading events:', error);
          webViewRef.current?.injectJavaScript(`
            updateTheme(${isDark});
            updateMapCenter(${-6.324260}, ${106.791550});
            renderFeaturedEvent([]);
            true;
          `);
        }
      }
      else if (data.action === 'viewEventDetail') {
        navigation.navigate('EventDetail', { eventId: data.eventId });
      }
    } catch (error) {
      console.error('[ExploreMapEvents] Error handling message:', error);
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
          console.error('[ExploreMapEvents] WebView error:', error);
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
