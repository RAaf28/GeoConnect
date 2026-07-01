import React, { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore } from '../../store/stores';

const getHtmlContent = (isDark) => {
  // Base HTML string from the user's provided code, with the back button made functional
  let html = `<!DOCTYPE html>
<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>GeoConnect - Personal Information</title>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-secondary-fixed": "#002113",
                    "surface-dim": "#cbdbf5",
                    "tertiary-fixed-dim": "#ffb693",
                    "on-secondary-container": "#00714d",
                    "surface-container-highest": "#d3e4fe",
                    "inverse-primary": "#c0c1ff",
                    "error-container": "#ffdad6",
                    "on-tertiary-container": "#ffcab2",
                    "surface-variant": "#d3e4fe",
                    "tertiary-container": "#9d3f00",
                    "on-background": "#0b1c30",
                    "on-secondary-fixed-variant": "#005236",
                    "on-tertiary-fixed": "#351000",
                    "on-secondary": "#ffffff",
                    "surface-container-low": "#eff4ff",
                    "secondary-fixed": "#6ffbbe",
                    "tertiary-fixed": "#ffdbcc",
                    "surface-glass": "rgba(255, 255, 255, 0.7)",
                    "border-glass": "rgba(255, 255, 255, 0.3)",
                    "danger": "#ef4444",
                    "on-error": "#ffffff",
                    "on-primary-fixed": "#06006c",
                    "on-primary": "#ffffff",
                    "on-primary-container": "#d1d1ff",
                    "primary": "#2c2abc",
                    "surface-container": "#e5eeff",
                    "bg-gradient-start": "#f8fafc",
                    "surface-container-lowest": "#ffffff",
                    "on-error-container": "#93000a",
                    "primary-fixed-dim": "#c0c1ff",
                    "tertiary": "#772e00",
                    "surface": "#f8f9ff",
                    "on-tertiary": "#ffffff",
                    "on-surface-variant": "#464554",
                    "inverse-on-surface": "#eaf1ff",
                    "on-tertiary-fixed-variant": "#7a2f00",
                    "outline-variant": "#c6c5d7",
                    "bg-gradient-end": "#e2e8f0",
                    "on-primary-fixed-variant": "#2e2ebe",
                    "outline": "#767586",
                    "secondary-fixed-dim": "#4edea3",
                    "primary-container": "#4648d4",
                    "error": "#ba1a1a",
                    "secondary": "#006c49",
                    "surface-container-high": "#dce9ff",
                    "background": "#f8f9ff",
                    "on-surface": "#0b1c30",
                    "primary-fixed": "#e1e0ff",
                    "surface-tint": "#484bd6",
                    "surface-bright": "#f8f9ff",
                    "inverse-surface": "#213145",
                    "secondary-container": "#6cf8bb"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "gutter": "24px",
                    "margin-desktop": "40px",
                    "container-max": "1200px",
                    "margin-mobile": "16px",
                    "unit": "4px"
            },
            "fontFamily": {
                    "headline-lg-mobile": ["Plus Jakarta Sans"],
                    "headline-md": ["Plus Jakarta Sans"],
                    "body-md": ["Plus Jakarta Sans"],
                    "headline-lg": ["Plus Jakarta Sans"],
                    "display": ["Plus Jakarta Sans"],
                    "label-sm": ["Plus Jakarta Sans"],
                    "body-lg": ["Plus Jakarta Sans"],
                    "label-md": ["Plus Jakarta Sans"]
            },
            "fontSize": {
                    "headline-lg-mobile": ["24px", {"lineHeight": "1.3", "fontWeight": "700"}],
                    "headline-md": ["24px", {"lineHeight": "1.4", "fontWeight": "600"}],
                    "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
                    "headline-lg": ["32px", {"lineHeight": "1.3", "letterSpacing": "-0.01em", "fontWeight": "700"}],
                    "display": ["48px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "800"}],
                    "label-sm": ["12px", {"lineHeight": "1.2", "fontWeight": "500"}],
                    "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
                    "label-md": ["14px", {"lineHeight": "1.2", "letterSpacing": "0.01em", "fontWeight": "600"}]
            }
          },
        },
      }
    </script>
<style>
        body {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            min-height: 100vh;
        }
        .glass-panel {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .active-icon {
            font-variation-settings: 'FILL' 1;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="font-body-md text-on-surface">
<!-- Top Navigation Bar (Shared Component Strategy) -->
<header class="fixed top-0 w-full z-50 bg-surface-glass backdrop-blur-lg border-b border-glass shadow-sm">
<div class="flex justify-between items-center px-gutter h-16 w-full max-w-container-max mx-auto">
<div class="flex items-center gap-4">
<button class="p-2 rounded-full hover:bg-surface-container-low transition-colors active:scale-95 duration-150" onclick="window.ReactNativeWebView.postMessage('goBack')">
<span class="material-symbols-outlined text-primary">arrow_back</span>
</button>
<h1 class="font-headline-md text-headline-md text-on-surface">Personal Information</h1>
</div>
<div class="flex items-center">
<button class="p-2 rounded-full hover:bg-surface-container-low transition-colors">
<span class="material-symbols-outlined text-primary">account_circle</span>
</button>
</div>
</div>
</header>
<main class="pt-24 pb-32 px-gutter max-w-[800px] mx-auto">
<!-- Breadcrumbs -->
<nav class="mb-8 flex items-center gap-2 text-on-surface-variant font-label-sm">
<span>Settings</span>
<span class="material-symbols-outlined text-[16px]">chevron_right</span>
<span class="text-primary font-bold">Personal Information</span>
</nav>
<!-- User Profile Section -->
<section class="glass-panel rounded-xl p-8 mb-10 relative overflow-hidden">
<!-- Decorative atmospheric light -->
<div class="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 blur-3xl rounded-full"></div>
<div class="flex flex-col items-center">
<div class="relative">
<div class="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden glass-panel">
<img class="w-full h-full object-cover" data-alt="A professional studio portrait of Alex Rivera, a young Hispanic male professional with a confident smile. He has short dark hair and is wearing a sleek indigo blazer. The background is a soft, out-of-focus modern office space with high-key lighting, maintaining a clean glassmorphic aesthetic and indigo primary color accents. The mood is sophisticated and approachable." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-f5IA7pFiWgRo1aC9297lKcc_O5SBgWXT3RQw6dhuh4aPgLKl7_CzbqH1hDWP5iuxXM0WnT_ExX1O8ldh3LKOTPf2X2HXPCiEmI789pcQwgvBWQz60OMASI9QNFdoYrcFD7rZCQQU4H-aQYWydpaBL3c-w7JUB1bM0rU2vKSsZ4hNlJx-F1J7X4A3D__4Kky8C86HDU60wuIuux-tMVW33pRy2DutmTqua5MMNXsC9Kd3W_S0DNVc_zymkjUbAa413Sfnv4vHwo4R"/>
</div>
<button class="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full shadow-lg hover:bg-primary-container transition-all active:scale-90 border-2 border-white flex items-center justify-center">
<span class="material-symbols-outlined text-[20px]">edit</span>
</button>
</div>
<div class="mt-4 text-center">
<h2 class="font-headline-md text-headline-md">Alex Rivera</h2>
<p class="text-on-surface-variant font-body-md">Product Lead at GeoConnect</p>
</div>
</div>
</section>
<!-- Form Fields Section -->
<section class="glass-panel rounded-xl p-8 space-y-10">
<h3 class="font-headline-md text-headline-md mb-6 border-b border-glass pb-4">Contact Details</h3>
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
<!-- Full Name -->
<div class="space-y-2">
<label class="block font-label-md text-on-surface-variant ml-1">Full Name</label>
<div class="relative group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">person</span>
<input class="w-full bg-white/30 border border-glass rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-md" type="text" value="Alex Rivera"/>
</div>
</div>
<!-- Email Address -->
<div class="space-y-2">
<label class="block font-label-md text-on-surface-variant ml-1">Email Address</label>
<div class="relative group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">mail</span>
<input class="w-full bg-white/30 border border-glass rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-md" type="email" value="alex.rivera@geoconnect.io"/>
</div>
</div>
<!-- Phone Number -->
<div class="space-y-2">
<label class="block font-label-md text-on-surface-variant ml-1">Phone Number</label>
<div class="relative group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">call</span>
<input class="w-full bg-white/30 border border-glass rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-md" type="tel" value="+1 555 0123"/>
</div>
</div>
<!-- Location -->
<div class="space-y-2">
<label class="block font-label-md text-on-surface-variant ml-1">Home Address</label>
<div class="relative group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">location_on</span>
<input class="w-full bg-white/30 border border-glass rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-md" type="text" value="San Francisco, CA"/>
</div>
</div>
</div>
<!-- Additional Options -->
<div class="pt-6 border-t border-glass">
<div class="flex items-center justify-between p-4 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer group">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-on-surface-variant">verified_user</span>
<div>
<p class="font-label-md text-on-surface">Two-Factor Authentication</p>
<p class="text-label-sm text-on-surface-variant">Extra security for your personal data</p>
</div>
</div>
<div class="w-12 h-6 bg-secondary-container rounded-full relative transition-colors p-1 flex items-center justify-end">
<div class="w-4 h-4 bg-white rounded-full shadow-sm"></div>
</div>
</div>
</div>
</section>
<!-- Save Button -->
<div class="mt-12 flex justify-end gap-4">
<button class="px-8 py-3 rounded-xl border border-glass text-primary font-label-md hover:bg-primary/5 transition-all">Cancel</button>
<button class="px-10 py-3 rounded-xl bg-primary text-on-primary font-label-md shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 flex items-center gap-2">
                Save Changes
                <span class="material-symbols-outlined text-[18px]">check_circle</span>
</button>
</div>
</main>
<!-- Bottom Navigation Bar (Mobile Visibility Check) -->
<nav class="md:hidden fixed bottom-0 w-full z-50 bg-surface-glass backdrop-blur-lg border-t border-glass shadow-lg">
<div class="flex justify-around items-center h-20 w-full pb-safe">
<div class="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all">
<span class="material-symbols-outlined">home</span>
<span class="text-label-md font-label-md">Home</span>
</div>
<div class="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all">
<span class="material-symbols-outlined">lock</span>
<span class="text-label-md font-label-md">Security</span>
</div>
<div class="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all">
<span class="material-symbols-outlined">shield</span>
<span class="text-label-md font-label-md">Privacy</span>
</div>
<!-- Active State: Account -->
<div class="flex flex-col items-center justify-center text-primary dark:text-secondary-fixed-dim bg-primary-container/10 rounded-xl px-3 py-1">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">person</span>
<span class="text-label-md font-label-md font-bold">Account</span>
</div>
</div>
</nav>
<!-- Micro-interactions Script -->
<script>
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.parentElement.classList.add('scale-[1.01]');
            });
            input.addEventListener('blur', () => {
                input.parentElement.parentElement.classList.remove('scale-[1.01]');
            });
        });

        // Toggle simulation
        const toggle = document.querySelector('.bg-secondary-container');
        toggle?.addEventListener('click', function() {
            if(this.classList.contains('bg-secondary-container')) {
                this.classList.replace('bg-secondary-container', 'bg-outline-variant');
                this.classList.replace('justify-end', 'justify-start');
            } else {
                this.classList.replace('bg-outline-variant', 'bg-secondary-container');
                this.classList.replace('justify-start', 'justify-end');
            }
        });
    </script>
</body></html>`;

  // Replace the back button to make it functional (already done in the string above, but we do it again for safety)
  // Actually, we already added the onclick in the string above, so we don't need to replace again.
  // But note: the string above already has the onclick on the back button.

  return html;
};

export default function PersonalInformation({ navigation }) {
  const { user } = useAuth();
  const isDark = useThemeStore((state) => state.isDark);
  const webViewRef = useRef(null);

  useEffect(() => {
    webViewRef.current?.injectJavaScript(`
      document.documentElement.className = "${isDark ? 'dark' : 'light'}";
      true;
    `);
  }, [isDark]);

  const handleMessage = async (event) => {
    try {
      const data = event.nativeEvent.data;
      if (data === 'goBack') {
        navigation.goBack();
      }
      // Note: We could handle other messages here in the future (like saving changes)
    } catch (error) {
      console.error('[PersonalInformation] Error handling message:', error);
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