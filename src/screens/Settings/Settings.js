import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore, useMapSettingsStore } from '../../store/stores';
import { MAP_THEME_LABELS } from '../../utils/mapTheme';
import { logOut } from '../../services/authService';

const getHtmlContent = (user) => {
  const displayName = user?.displayName || "Explorer";
  const email = user?.email || "explorer@geoconnect.io";
  return `<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>GeoConnect Settings</title>
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "secondary-fixed-dim": "#bec6e0",
                        "background": "#fcf8ff",
                        "surface-bright": "#fcf8ff",
                        "surface-container": "#efecf8",
                        "surface": "#fcf8ff",
                        "primary-container": "#6063ee",
                        "secondary-fixed": "#dae2fd",
                        "on-secondary-container": "#5c647a",
                        "on-primary-container": "#fffbff",
                        "surface-container-lowest": "#ffffff",
                        "tertiary": "#904900",
                        "on-tertiary-fixed": "#301400",
                        "secondary-container": "#dae2fd",
                        "on-background": "#1b1b23",
                        "tertiary-fixed-dim": "#ffb783",
                        "surface-container-highest": "#e4e1ed",
                        "surface-container-low": "#f5f2fe",
                        "on-primary-fixed-variant": "#2f2ebe",
                        "surface-variant": "#e4e1ed",
                        "on-tertiary": "#ffffff",
                        "surface-tint": "#494bd6",
                        "on-secondary-fixed": "#131b2e",
                        "primary-fixed": "#e1e0ff",
                        "tertiary-fixed": "#ffdcc5",
                        "on-tertiary-container": "#fffbff",
                        "secondary": "#565e74",
                        "surface-container-high": "#e9e6f3",
                        "on-surface-variant": "#464554",
                        "on-error-container": "#93000a",
                        "error": "#ba1a1a",
                        "muted-zinc": "#64748B",
                        "tertiary-container": "#b55d00",
                        "primary-fixed-dim": "#c0c1ff",
                        "on-primary": "#ffffff",
                        "canvas-white": "#F9FAFB",
                        "on-secondary-fixed-variant": "#3f465c",
                        "on-error": "#ffffff",
                        "error-container": "#ffdad6",
                        "surface-pure": "#FFFFFF",
                        "outline-variant": "#c7c4d7",
                        "on-primary-fixed": "#07006c",
                        "outline": "#767586",
                        "inverse-on-surface": "#f2effb",
                        "soft-border": "rgba(226, 232, 240, 0.8)",
                        "inverse-primary": "#c0c1ff",
                        "on-secondary": "#ffffff",
                        "inverse-surface": "#303038",
                        "on-tertiary-fixed-variant": "#703700",
                        "primary": "#4648d4",
                        "surface-dim": "#dbd8e4",
                        "on-surface": "#1b1b23"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "stack-gap": "12px",
                        "safe-area": "32px",
                        "margin-page": "24px",
                        "gutter-grid": "16px"
                    },
                    "fontFamily": {
                        "body-md": ["Plus Jakarta Sans"],
                        "body-lg": ["Plus Jakarta Sans"],
                        "technical-label": ["JetBrains Mono"],
                        "headline-md": ["Plus Jakarta Sans"],
                        "headline-lg-mobile": ["Plus Jakarta Sans"],
                        "headline-lg": ["Plus Jakarta Sans"]
                    },
                    "fontSize": {
                        "body-md": ["14px", {"lineHeight": "1.6", "fontWeight": "400"}],
                        "body-lg": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
                        "technical-label": ["12px", {"lineHeight": "1.4", "fontWeight": "500"}],
                        "headline-md": ["24px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "700"}],
                        "headline-lg-mobile": ["28px", {"lineHeight": "1.2", "fontWeight": "700"}],
                        "headline-lg": ["32px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700"}]
                    }
                },
            },
        }
    </script>
<style>
        .whisper-shadow {
            box-shadow: 0 10px 30px -10px rgba(70, 72, 212, 0.08);
        }
        .glass-effect {
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }
        .staggered-entry {
            animation: slideUpFade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            opacity: 0;
            transform: translateY(10px);
        }
        @keyframes slideUpFade {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
    </style>

  </head>
<body class="bg-background text-on-background font-body-md min-h-screen pb-4">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm h-16 flex items-center px-margin-page">
<div class="flex items-center gap-3">
<button class="p-2 -ml-2 rounded-full hover:bg-surface-variant/50 transition-colors" onclick="window.ReactNativeWebView.postMessage('goBack')">
<span class="material-symbols-outlined text-primary">arrow_back</span>
</button>
<h1 class="text-headline-md font-headline-md text-primary tracking-tight">Settings</h1>
</div>
</header>
<main class="mt-20 px-margin-page max-w-2xl mx-auto space-y-6">
<!-- Profile Anchor Card -->
<section id="profileSection" class="staggered-entry bg-surface-pure rounded-xl p-4 whisper-shadow flex items-center gap-4 settings-search-item" data-search="profile edit account ${displayName} ${email}">
<div class="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary-fixed-dim">
<img alt="User Profile" class="w-full h-full object-cover" src="${user?.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName) + '&background=4648d4&color=fff&size=128'}"/>
</div>
<div>
<h2 class="font-headline-md text-body-lg text-on-surface">${displayName}</h2>
<p class="text-on-surface-variant text-body-md">${email}</p>
<span class="inline-flex items-center text-technical-label font-technical-label text-primary mt-1">
<span class="material-symbols-outlined text-[14px] mr-1" style="font-variation-settings: 'FILL' 1;">verified</span> Verified Explorer
                </span>
</div>
<button class="ml-auto p-2 text-primary hover:bg-primary-container/10 rounded-full transition-all" onclick="window.ReactNativeWebView.postMessage('navigateEditProfile')">
<span class="material-symbols-outlined">edit</span>
</button>
</section>
<!-- Account Section -->
<div class="staggered-entry delay-1 settings-section">
<h3 class="text-technical-label font-technical-label text-muted-zinc mb-3 px-1 uppercase tracking-widest">Account</h3>
<div class="bg-surface-pure rounded-xl whisper-shadow divide-y divide-soft-border overflow-hidden">
<div class="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group settings-search-item" data-search="personal information phone address legal name" onclick="window.ReactNativeWebView.postMessage('navigatePersonalInformation')">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
<span class="material-symbols-outlined">person</span>
</div>
<div>
<p class="font-bold text-on-surface">Personal Information</p>
<p class="text-on-surface-variant text-[12px]">Phone, address, and legal name</p>
</div>
</div>
<span class="material-symbols-outlined text-outline-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
</div>
<div class="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group settings-search-item" data-search="login security password 2fa two factor authentication" onclick="window.ReactNativeWebView.postMessage('navigateLoginSecurity')">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
<span class="material-symbols-outlined">shield</span>
</div>
<div>
<p class="font-bold text-on-surface">Login &amp; Security</p>
<p class="text-on-surface-variant text-[12px]">Passwords and 2FA settings</p>
</div>
</div>
<span class="material-symbols-outlined text-outline-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
</div>
<div class="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group settings-search-item" data-search="privacy settings data location history invisible" onclick="window.ReactNativeWebView.postMessage('openPrivacySettings')">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
<span class="material-symbols-outlined">lock</span>
</div>
<div>
<p class="font-bold text-on-surface">Privacy Settings</p>
<p class="text-on-surface-variant text-[12px]">Manage your data and privacy</p>
</div>
</div>
<span class="material-symbols-outlined text-outline-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
</div>
</div>
</div>
<!-- Preferences Section -->
<div class="staggered-entry delay-2 settings-section">
<h3 class="text-technical-label font-technical-label text-muted-zinc mb-3 px-1 uppercase tracking-widest">Preferences</h3>
<div class="bg-surface-pure rounded-xl whisper-shadow divide-y divide-soft-border overflow-hidden">
<div class="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group settings-search-item" data-search="push notifications alerts nearby map activity" onclick="window.ReactNativeWebView.postMessage('navigateNotifications')">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-lg bg-tertiary-fixed/30 flex items-center justify-center text-tertiary">
<span class="material-symbols-outlined">notifications_active</span>
</div>
<div>
<p class="font-bold text-on-surface">Push Notifications</p>
<p class="text-on-surface-variant text-[12px]">Alerts for nearby map activity</p>
</div>
</div>
<label class="relative inline-flex items-center cursor-pointer">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
<div class="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors group settings-search-item" data-search="location tracking precise discovery mode gps">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-lg bg-tertiary-fixed/30 flex items-center justify-center text-tertiary">
<span class="material-symbols-outlined">location_on</span>
</div>
<div>
<p class="font-bold text-on-surface">Location Tracking</p>
<p class="text-on-surface-variant text-[12px]">Precise discovery mode</p>
</div>
</div>
<label class="relative inline-flex items-center cursor-pointer" onclick="event.stopPropagation()">
<input id="locationToggle" class="sr-only peer" type="checkbox" onchange="window.ReactNativeWebView.postMessage(JSON.stringify({action:'toggleLocation', enabled: this.checked}))"/>
<div class="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
</div>
</div>
<!-- Geo Discovery Section -->
<div class="staggered-entry delay-3 settings-section">
<h3 class="text-technical-label font-technical-label text-muted-zinc mb-3 px-1 uppercase tracking-widest">Discovery</h3>
<div class="bg-surface-pure rounded-xl whisper-shadow p-6 settings-search-item" data-search="discovery search radius map theme standard terrain satellite dark mode">
<div class="flex justify-between items-center mb-6">
<p class="font-bold text-on-surface">Search Radius</p>
<span class="text-technical-label font-technical-label text-primary bg-primary-fixed px-2 py-1 rounded-md">25 km</span>
</div>
<input class="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary" max="100" min="5" type="range" value="25"/>
<div class="flex justify-between mt-2 text-[10px] font-technical-label text-outline uppercase">
<span>5 km</span>
<span>100 km</span>
</div>
<div class="mt-6 pt-5 border-t border-soft-border settings-search-item" data-search="map theme standard terrain satellite dark mode">
<button type="button" class="w-full p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group rounded-xl" onclick="openMapThemeModal()">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
<span class="material-symbols-outlined">map</span>
</div>
<div class="text-left">
<p class="font-bold text-on-surface">Map Theme</p>
<p id="currentMapTheme" class="text-on-surface-variant text-[12px]">Standard</p>
</div>
</div>
<span class="material-symbols-outlined text-outline-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
</button>
</div>
</div>
</div>
<div id="noSearchResults" class="hidden text-center py-12">
<span class="material-symbols-outlined text-4xl text-muted-zinc mb-2">search_off</span>
<p class="text-muted-zinc font-medium">No settings found</p>
<p class="text-on-surface-variant text-sm mt-1">Try a different keyword</p>
</div>
<!-- Logout Action -->
<div id="logoutSection" class="staggered-entry delay-4 pt-4 settings-search-item" data-search="logout sign out exit ${displayName}">
<button onclick="window.ReactNativeWebView.postMessage('performLogout')" class="w-full bg-surface-container-high text-error font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-error-container/20 transition-all group active:scale-[0.98]">
<span class="material-symbols-outlined transition-transform group-hover:rotate-12">logout</span>
                Logout ${displayName}
            </button>
<p class="text-center text-[10px] text-muted-zinc mt-8 font-technical-label uppercase tracking-widest">GeoConnect Version 2.4.0 (Stable)</p>
</div>
</main>

<!-- Map Theme Modal -->
<div id="mapThemeModal" class="fixed inset-0 z-[100] flex items-end justify-center" style="display:none;">
<div class="absolute inset-0 bg-black/40" onclick="closeMapThemeModal()"></div>
<div class="relative w-full max-w-2xl bg-surface-pure rounded-t-2xl p-6 shadow-2xl" style="animation: slideUp 0.3s ease-out;">
<div class="w-12 h-1 bg-outline-variant rounded-full mx-auto mb-4"></div>
<h3 class="font-bold text-lg text-on-surface mb-4">Map Theme</h3>
<div class="space-y-2" id="mapThemeOptions">
<label class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
<input type="radio" name="mapTheme" value="standard" class="accent-primary w-4 h-4" onchange="selectMapTheme('standard', 'Standard')"/>
<span class="material-symbols-outlined text-primary">map</span>
<span class="font-bold">Standard</span>
</label>
<label class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
<input type="radio" name="mapTheme" value="terrain" class="accent-primary w-4 h-4" onchange="selectMapTheme('terrain', 'Terrain')"/>
<span class="material-symbols-outlined text-primary">terrain</span>
<span class="font-bold">Terrain</span>
</label>
<label class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
<input type="radio" name="mapTheme" value="satellite" class="accent-primary w-4 h-4" onchange="selectMapTheme('satellite', 'Satellite')"/>
<span class="material-symbols-outlined text-primary">satellite_alt</span>
<span class="font-bold">Satellite</span>
</label>
<label class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
<input type="radio" name="mapTheme" value="dark" class="accent-primary w-4 h-4" onchange="selectMapTheme('dark', 'Dark Mode')"/>
<span class="material-symbols-outlined text-primary">dark_mode</span>
<span class="font-bold">Dark Mode</span>
</label>
</div>
<button onclick="closeMapThemeModal()" class="w-full mt-4 py-3 bg-primary text-on-primary font-bold rounded-xl">Done</button>
</div>
</div>

<style>
@keyframes slideUp {
from { transform: translateY(100%); }
to { transform: translateY(0); }
}
</style>

<script>
        let settingsSearchActive = false;

        function toggleSettingsSearch(force) {
            settingsSearchActive = typeof force === 'boolean' ? force : !settingsSearchActive;
            const title = document.getElementById('headerTitle');
            const searchBar = document.getElementById('headerSearchBar');
            const searchIcon = document.getElementById('searchToggleIcon');
            const input = document.getElementById('settingsSearchInput');

            if (settingsSearchActive) {
                title.classList.add('hidden');
                searchBar.classList.remove('hidden');
                searchIcon.textContent = 'close';
                setTimeout(function() { input.focus(); }, 100);
            } else {
                title.classList.remove('hidden');
                searchBar.classList.add('hidden');
                searchIcon.textContent = 'search';
                input.value = '';
                filterSettings('');
            }
        }

        function filterSettings(query) {
            const q = query.trim().toLowerCase();
            const items = document.querySelectorAll('.settings-search-item');
            const sections = document.querySelectorAll('.settings-section');
            let visibleCount = 0;

            items.forEach(function(item) {
                const text = (item.getAttribute('data-search') || item.textContent || '').toLowerCase();
                const match = !q || text.indexOf(q) !== -1;
                item.style.display = match ? '' : 'none';
                if (match) visibleCount++;
            });

            sections.forEach(function(section) {
                const sectionItems = section.querySelectorAll('.settings-search-item');
                const hasVisible = Array.from(sectionItems).some(function(el) {
                    return el.style.display !== 'none';
                });
                section.style.display = !q || hasVisible ? '' : 'none';
            });

            const noResults = document.getElementById('noSearchResults');
            if (noResults) {
                noResults.classList.toggle('hidden', !q || visibleCount > 0);
            }
        }

        // Map Theme Modal
        function openMapThemeModal() {
            document.getElementById('mapThemeModal').style.display = 'flex';
        }
        function closeMapThemeModal() {
            document.getElementById('mapThemeModal').style.display = 'none';
        }
        function selectMapTheme(themeKey, themeLabel) {
            document.getElementById('currentMapTheme').textContent = themeLabel;
            window.ReactNativeWebView.postMessage(JSON.stringify({action: 'setMapTheme', theme: themeKey}));
        }

        function applyMapTheme(themeKey, themeLabel) {
            document.getElementById('currentMapTheme').textContent = themeLabel;
            const radio = document.querySelector('input[name="mapTheme"][value="' + themeKey + '"]');
            if (radio) radio.checked = true;
        }

        // Micro-interactions for tactile feedback
        document.querySelectorAll('button, .cursor-pointer').forEach(el => {
            el.addEventListener('mousedown', () => {
                el.style.transform = 'translateY(1px)';
            });
            el.addEventListener('mouseup', () => {
                el.style.transform = 'translateY(0)';
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translateY(0)';
            });
        });

        // Simple range slider update logic
        const slider = document.querySelector('input[type="range"]');
        const radiusDisplay = document.querySelector('.bg-primary-fixed');
        if (slider && radiusDisplay) {
            slider.addEventListener('input', (e) => {
                radiusDisplay.textContent = e.target.value + ' km';
            });
        }
    </script>
</body></html>`;
};

export default function Settings({ navigation }) {
  const { user } = useAuth();
  const webViewRef = useRef(null);
  const isDark = useThemeStore((state) => state.isDark);
  const mapTheme = useMapSettingsStore((state) => state.mapTheme);
  const setMapTheme = useMapSettingsStore((state) => state.setMapTheme);

  useEffect(() => {
    webViewRef.current?.injectJavaScript(`
      document.documentElement.className = "${isDark ? 'dark' : 'light'}";
      true;
    `);
  }, [isDark]);

  useEffect(() => {
    const label = MAP_THEME_LABELS[mapTheme] || MAP_THEME_LABELS.standard;
    webViewRef.current?.injectJavaScript(`
      applyMapTheme(${JSON.stringify(mapTheme)}, ${JSON.stringify(label)});
      true;
    `);
  }, [mapTheme]);

  const handleWebViewLoadEnd = () => {
    const label = MAP_THEME_LABELS[mapTheme] || MAP_THEME_LABELS.standard;
    webViewRef.current?.injectJavaScript(`
      applyMapTheme(${JSON.stringify(mapTheme)}, ${JSON.stringify(label)});
      true;
    `);
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: getHtmlContent(user) }}
        style={styles.webview}
        originWhitelist={['*']}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoadEnd={handleWebViewLoadEnd}
        onMessage={async (event) => {
          try {
            // First check if it's a JSON string
            let action;
            let data = {};
            if (event.nativeEvent.data.startsWith('{')) {
              data = JSON.parse(event.nativeEvent.data);
              action = data.action;
            } else {
              action = event.nativeEvent.data;
            }

            if (action === 'goBack') {
              navigation.goBack();
            } else if (action === 'openPrivacySettings') {
              navigation.navigate('PrivacySettings');
            } else if (action === 'navigateProfile') {
              navigation.navigate('Profile');
            } else if (action === 'navigateEditProfile') {
              navigation.navigate('EditProfile');
            } else if (action === 'navigatePersonalInformation') {
              navigation.navigate('PersonalInformation');
            } else if (action === 'navigateLoginSecurity') {
              navigation.navigate('LoginSecurity');
            } else if (action === 'navigateNotifications') {
              navigation.navigate('Notifications');
            } else if (action === 'toggleLocation') {
               // Location toggle logic can be handled here or passed to a store
               console.log('Location tracking toggled:', data.enabled);
            } else if (action === 'setMapTheme') {
              if (data.theme && MAP_THEME_LABELS[data.theme]) {
                setMapTheme(data.theme);
              }
            } else if (action === 'performLogout') {
              try {
                await logOut();
              } catch (error) {
                Alert.alert("Logout Error", error.message);
              }
            }
          } catch (e) {
            console.error('Error handling Settings message', e);
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
