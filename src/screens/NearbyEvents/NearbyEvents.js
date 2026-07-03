import React, { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore, useLocationStore } from '../../store/stores';
import { getNearbyUsers, getEventsNearby, updateRSVP } from '../../services/firestoreService';
import { encodeGeoHash } from '../../utils/geoUtils';

const getHtmlContent = (isDark) => {
  return `<!DOCTYPE html><html class="${isDark ? 'dark' : 'light'}" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0, viewport-fit=cover" name="viewport">
<title>GeoConnect | Nearby People &amp; Events</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        .whisper-shadow { box-shadow: 0 10px 30px -5px rgba(70, 72, 212, 0.08); }
        .stagger-card { animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
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
                    "secondary":"#565e74","on-background":"#1b1b23",
                    "primary-fixed-dim":"#c0c1ff","tertiary-fixed-dim":"#ffb783"
            },
            "fontFamily":{"technical-label":["JetBrains Mono"],"headline-lg":["Plus Jakarta Sans"],"headline-md":["Plus Jakarta Sans"],"body-lg":["Plus Jakarta Sans"],"body-md":["Plus Jakarta Sans"]},
            "fontSize":{"technical-label":["12px",{"lineHeight":"1.4","fontWeight":"500"}],"headline-md":["24px",{"lineHeight":"1.2","letterSpacing":"-0.01em","fontWeight":"700"}],"body-md":["14px",{"lineHeight":"1.6","fontWeight":"400"}]}
          }
        }
      }
    </script>
</head>
<body class="bg-background dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface">
<!-- Top Navigation Bar -->
<header class="fixed top-0 w-full z-50 bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-md shadow-sm flex justify-between items-center px-6 h-16">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary">explore</span>
<span class="text-headline-md font-headline-md text-primary tracking-tight">GeoConnect</span>
</div>
</header>
<main class="pt-20 pb-4 min-h-screen">
<div class="relative z-10 px-6 py-6 space-y-8">
<!-- Section: Nearby People -->
<section class="space-y-4">
<div class="flex justify-between items-end">
<div>
<h2 class="text-headline-md font-headline-md text-on-surface dark:text-inverse-on-surface">Nearby People</h2>
<p class="text-body-md text-muted-zinc">Connect with explorers around you</p>
</div>
</div>
<div id="peopleContainer" class="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-4">
    <div class="text-center text-muted-zinc py-4 w-full"><span class="material-symbols-outlined animate-spin">progress_activity</span></div>
</div>
</section>
<!-- Section: Public Events -->
<section class="space-y-4">
<div class="flex justify-between items-center">
<h2 class="text-headline-md font-headline-md text-on-surface dark:text-inverse-on-surface">Public Events</h2>
</div>
<div id="eventsContainer" class="grid gap-6">
    <div class="text-center text-muted-zinc py-8"><span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span><p class="mt-2">Loading events...</p></div>
</div>
</section>
</div>
</main>

<script>
        function formatDate(dateStr) {
            if (!dateStr) return '';
            const date = dateStr.seconds ? new Date(dateStr.seconds * 1000) : new Date(dateStr);
            const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
            return months[date.getMonth()] + ' ' + date.getDate();
        }

        function renderNearbyPeople(users) {
            const container = document.getElementById('peopleContainer');
            if (!users || users.length === 0) {
                container.innerHTML = '<div class="text-center text-muted-zinc py-4 w-full"><span class="material-symbols-outlined text-2xl">person_off</span><p class="text-sm mt-1">No nearby explorers found</p></div>';
                return;
            }
            container.innerHTML = users.map(u => {
                const photo = u.photoURL || '';
                const name = u.displayName || 'Explorer';
                const shortName = name.length > 10 ? name.substring(0, 10) + '.' : name;
                const avatarHtml = photo ? '<img alt="' + name + '" class="w-full h-full object-cover rounded-full" src="' + photo + '">' : '<div class="w-full h-full rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">' + name.charAt(0) + '</div>';
                return '<div class="flex-shrink-0 w-32 group cursor-pointer" onclick="openProfile(\\'' + u.id + '\\')">' +
                    '<div class="relative mb-2">' +
                        '<div class="w-24 h-24 mx-auto rounded-full p-1 border-2 border-primary/20 overflow-hidden bg-surface-pure dark:bg-white/5 group-hover:scale-105 transition-transform duration-300">' + avatarHtml + '</div>' +
                        '<div class="absolute top-1 right-5 w-3 h-3 bg-green-500 border-2 border-white dark:border-inverse-surface rounded-full"></div>' +
                    '</div>' +
                    '<div class="text-center">' +
                        '<p class="font-headline-md text-sm text-on-surface dark:text-inverse-on-surface">' + shortName + '</p>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        function renderEvents(events) {
            const container = document.getElementById('eventsContainer');
            if (!events || events.length === 0) {
                container.innerHTML = '<div class="text-center text-muted-zinc py-8"><span class="material-symbols-outlined text-3xl">event_busy</span><p class="mt-2">No events found nearby</p></div>';
                return;
            }
            container.innerHTML = events.map((evt, idx) => {
                const title = evt.title || 'Untitled Event';
                const location = evt.locationLabel || 'Nearby';
                const dateStr = formatDate(evt.startDate);
                const going = evt.rsvpCounts?.going || 0;
                const img = evt.imageURL || '';
                const imgHtml = img ? '<img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="' + img + '">' : '<div class="w-full h-full bg-primary/10 flex items-center justify-center"><span class="material-symbols-outlined text-primary text-5xl">event</span></div>';

                return '<div class="stagger-card bg-surface-pure dark:bg-white/5 rounded-2xl overflow-hidden whisper-shadow border border-soft-border dark:border-white/10 group" style="animation-delay: ' + (idx * 0.1) + 's;">' +
                    '<div class="relative h-48 overflow-hidden cursor-pointer" onclick="openEvent(\\'' + evt.id + '\\')">' + imgHtml +
                        '<div class="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 rounded-lg text-technical-label font-technical-label shadow-lg">' + dateStr + '</div>' +
                        '<div class="absolute bottom-4 right-4 bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1"><span class="material-symbols-outlined text-sm">group</span> ' + going + ' Going</div>' +
                    '</div>' +
                    '<div class="p-5 space-y-3">' +
                        '<div class="cursor-pointer" onclick="openEvent(\\'' + evt.id + '\\')"><h3 class="text-headline-md text-lg text-on-surface dark:text-inverse-on-surface leading-tight">' + title + '</h3>' +
                        '<p class="text-body-md text-muted-zinc flex items-center gap-1 mt-1"><span class="material-symbols-outlined text-xs">location_on</span> ' + location + '</p></div>' +
                        '<div class="flex gap-3 pt-2">' +
                            '<button onclick="rsvpEvent(\\'' + evt.id + '\\', \\'going\\')" class="flex-1 bg-primary text-on-primary py-2.5 rounded-xl font-bold text-sm hover:bg-primary-container transition-all active:-translate-y-px">Going</button>' +
                            '<button onclick="rsvpEvent(\\'' + evt.id + '\\', \\'interested\\')" class="flex-1 border border-primary text-primary py-2.5 rounded-xl font-bold text-sm hover:bg-primary/5 transition-all">Interested</button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        function rsvpEvent(eventId, status) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'rsvpEvent', eventId: eventId, status: status }));
        }

        function openEvent(eventId) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'openEvent', eventId: eventId }));
        }

        function openProfile(userId) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'openProfile', userId: userId }));
        }

        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'loadNearbyData' }));
            }, 300);
        });
    </script>
</body></html>`;
};

export default function NearbyEvents({ navigation }) {
  const { user } = useAuth();
  const isDark = useThemeStore((state) => state.isDark);
  const { currentLocation } = useLocationStore();
  const webViewRef = useRef(null);

  useEffect(() => {
    webViewRef.current?.injectJavaScript(`
      document.documentElement.className = "${isDark ? 'dark' : 'light'}";
      true;
    `);

    // Cleanup function to prevent memory leaks
    return () => {
      if (webViewRef.current) {
        webViewRef.current?.injectJavaScript(`
          // Cleanup resources if they exist
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

      if (data.action === 'loadNearbyData') {
        const lat = currentLocation?.latitude || -6.324260;
        const lng = currentLocation?.longitude || 106.791550;
        const geoHashPrefix = encodeGeoHash(lat, lng, 5);

        // Load nearby users
        try {
          const users = await getNearbyUsers(geoHashPrefix);
          webViewRef.current?.injectJavaScript(`renderNearbyPeople(${JSON.stringify(users)}); true;`);
        } catch (e) {
          webViewRef.current?.injectJavaScript(`renderNearbyPeople([]); true;`);
        }

        // Load nearby events
        try {
          const events = await getEventsNearby(geoHashPrefix);
          webViewRef.current?.injectJavaScript(`renderEvents(${JSON.stringify(events)}); true;`);
        } catch (e) {
          webViewRef.current?.injectJavaScript(`renderEvents([]); true;`);
        }
      }
      else if (data.action === 'rsvpEvent') {
        if (!user) return;
        try {
          await updateRSVP(data.eventId, user.uid, data.status);
          // Reload events to get updated counts
          const lat = currentLocation?.latitude || -6.324260;
          const lng = currentLocation?.longitude || 106.791550;
          const geoHashPrefix = encodeGeoHash(lat, lng, 5);
          const events = await getEventsNearby(geoHashPrefix);
          webViewRef.current?.injectJavaScript(`renderEvents(${JSON.stringify(events)}); true;`);
        } catch (error) {
          console.error('[NearbyEvents] RSVP error:', error);
        }
      }
      else if (data.action === 'openEvent') {
        navigation.navigate('EventDetail', { eventId: data.eventId });
      }
      else if (data.action === 'openProfile') {
        navigation.navigate('Profile', { userId: data.userId });
      }
    } catch (error) {
      console.error('[NearbyEvents] Error handling message:', error);
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
          console.error('[NearbyEvents] WebView error:', error);
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
