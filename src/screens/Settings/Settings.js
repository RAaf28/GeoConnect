import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore } from '../../store/stores';
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
<header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm h-16 flex justify-between items-center px-margin-page">
<div class="flex items-center gap-3">
<button class="p-2 -ml-2 rounded-full hover:bg-surface-variant/50 transition-colors" onclick="window.ReactNativeWebView.postMessage('goBack')">
<span class="material-symbols-outlined text-primary">arrow_back</span>
</button>
<h1 class="text-headline-md font-headline-md text-primary tracking-tight">Settings</h1>
</div>
<div class="flex items-center">
<button class="p-2 rounded-full hover:bg-surface-variant/50 transition-colors">
<span class="material-symbols-outlined text-on-surface-variant">search</span>
</button>
</div>
</header>
<main class="mt-20 px-margin-page max-w-2xl mx-auto space-y-6">
<!-- Profile Anchor Card -->
<section class="staggered-entry bg-surface-pure rounded-xl p-4 whisper-shadow flex items-center gap-4">
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
<button class="ml-auto p-2 text-primary hover:bg-primary-container/10 rounded-full transition-all">
<span class="material-symbols-outlined">edit</span>
</button>
</section>
<!-- Account Section -->
<div class="staggered-entry delay-1">
<h3 class="text-technical-label font-technical-label text-muted-zinc mb-3 px-1 uppercase tracking-widest">Account</h3>
<div class="bg-surface-pure rounded-xl whisper-shadow divide-y divide-soft-border overflow-hidden">
<div class="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group" onclick="window.ReactNativeWebView.postMessage('navigatePersonalInformation')">
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
<div class="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group" onclick="window.ReactNativeWebView.postMessage('navigatePrivacy')">
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
<div class="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group" onclick="window.ReactNativeWebView.postMessage('openPrivacySettings')">
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
<div class="staggered-entry delay-2">
<h3 class="text-technical-label font-technical-label text-muted-zinc mb-3 px-1 uppercase tracking-widest">Preferences</h3>
<div class="bg-surface-pure rounded-xl whisper-shadow divide-y divide-soft-border overflow-hidden">
<div class="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group" onclick="window.ReactNativeWebView.postMessage('navigateNotifications')">
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
<div class="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group" onclick="window.ReactNativeWebView.postMessage('navigateLocationSettings')">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-lg bg-tertiary-fixed/30 flex items-center justify-center text-tertiary">
<span class="material-symbols-outlined">location_on</span>
</div>
<div>
<p class="font-bold text-on-surface">Location Tracking</p>
<p class="text-on-surface-variant text-[12px]">Precise discovery mode</p>
</div>
</div>
<label class="relative inline-flex items-center cursor-pointer">
<input class="sr-only peer" type="checkbox"/>
<div class="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
</div>
</div>
<!-- Geo Discovery Section -->
<div class="staggered-entry delay-3">
<h3 class="text-technical-label font-technical-label text-muted-zinc mb-3 px-1 uppercase tracking-widest">Discovery</h3>
<div class="bg-surface-pure rounded-xl whisper-shadow p-6">
<div class="flex justify-between items-center mb-6">
<p class="font-bold text-on-surface">Search Radius</p>
<span class="text-technical-label font-technical-label text-primary bg-primary-fixed px-2 py-1 rounded-md">25 km</span>
</div>
<input class="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary" max="100" min="5" type="range" value="25"/>
<div class="flex justify-between mt-2 text-[10px] font-technical-label text-outline uppercase">
<span>5 km</span>
<span>100 km</span>
</div>
<div class="mt-8 grid grid-cols-2 gap-3">
<div class="p-4 rounded-xl border border-soft-hover border-primary/30 transition-colors group cursor-pointer" onclick="window.ReactNativeWebView.postMessage('navigateMapTheme')">
<span class="material-symbols-outlined text-primary mb-2">map</span>
<p class="font-bold text-[14px]">Map Theme</p>
<p class="text-[12px] text-on-surface-variant">Terrain High-Def</p>
</div>
<div class="p-4 rounded-xl border border-soft-border hover:border-primary/30 transition-colors group cursor-pointer" onclick="window.ReactNativeWebView.postMessage('navigateOverlays')">
<span class="material-symbols-outlined text-primary mb-2">layers</span>
<p class="font-bold text-[14px]">Overlays</p>
<p class="text-[12px] text-on-surface-variant">Social Heatmap</p>
</div>
</div>
</div>
</div>
<!-- Logout Action -->
<div class="staggered-entry delay-4 pt-4">
<button onclick="window.ReactNativeWebView.postMessage('performLogout')" class="w-full bg-surface-container-high text-error font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-error-container/20 transition-all group active:scale-[0.98]">
<span class="material-symbols-outlined transition-transform group-hover:rotate-12">logout</span>
                Logout ${displayName}
            </button>
<p class="text-center text-[10px] text-muted-zinc mt-8 font-technical-label uppercase tracking-widest">GeoConnect Version 2.4.0 (Stable)</p>
</div>
</main>
<!-- BottomNavBar -->

<script>
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
        source={{ html: getHtmlContent(user) }}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={async (event) => {
          const action = event.nativeEvent.data;
          if (action === 'goBack') {
            navigation.goBack();
          } else if (action === 'openPrivacySettings') {
            navigation.navigate('PrivacySettings');
          } else if (action === 'navigateProfile') {
            navigation.navigate('Profile');
          } else if (action === 'navigatePersonalInformation') {
            navigation.navigate('PersonalInformation');
          } else if (action === 'navigatePrivacy') {
            navigation.navigate('PrivacySettings');
          } else if (action === 'navigateNotifications') {
            navigation.navigate('Notifications');
          } else if (action === 'navigateLocationSettings') {
            // For now, navigate to PrivacySettings as a placeholder
            navigation.navigate('PrivacySettings');
          } else if (action === 'navigateMapTheme') {
            // For now, navigate to PrivacySettings as a placeholder
            navigation.navigate('PrivacySettings');
          } else if (action === 'navigateOverlays') {
            // For now, navigate to PrivacySettings as a placeholder
            navigation.navigate('PrivacySettings');
          } else if (action === 'performLogout') {
            try {
              await logOut();
            } catch (error) {
              Alert.alert("Logout Error", error.message);
            }
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
