import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WebView } from 'react-native-webview';

const htmlContent = `<!DOCTYPE html><html class="light" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>GeoConnect | Location Privacy Settings</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-panel {
            background: rgba(252, 248, 255, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }
        .whisper-shadow {
            box-shadow: 0 10px 30px -5px rgba(70, 72, 212, 0.08);
        }
        .toggle-checkbox:checked + .toggle-label {
            background-color: #4648d4;
        }
        .toggle-checkbox:checked + .toggle-label .toggle-dot {
            transform: translateX(20px);
        }
        .stagger-reveal {
            animation: staggerReveal 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            opacity: 0;
            transform: translateY(10px);
        }
        @keyframes staggerReveal {
            to {
                opacity: 1;
                transform: translateY(0);
            }
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
<body class="bg-background font-body-md text-on-surface antialiased min-h-screen overflow-x-hidden pb-4">
<!-- TopAppBar Shell -->
<header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm">
<div class="flex justify-between items-center px-margin-page h-16 w-full">
<div class="flex items-center gap-3">
<button class="flex items-center justify-center p-2 rounded-full hover:bg-surface-variant/50 transition-colors" onclick="window.history.back()">
<span class="material-symbols-outlined text-primary">arrow_back</span>
</button>
<h1 class="text-headline-md font-headline-md text-primary tracking-tight">GeoConnect</h1>
</div>
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-primary">explore</span>
<span class="material-symbols-outlined text-on-surface-variant">search</span>
</div>
</div>
</header>
<main class="mt-20 px-margin-page max-w-2xl mx-auto space-y-6">
<!-- Header Section -->
<section class="stagger-reveal" style="animation-delay: 0.1s;">
<h2 class="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">Location Privacy</h2>
<p class="text-on-surface-variant mt-2 font-body-md">Control how GeoConnect uses your coordinates and who can see your digital footprint.</p>
</section>
<!-- Master Toggle Card -->
<section class="stagger-reveal" style="animation-delay: 0.2s;">
<div class="bg-surface-pure rounded-xl p-5 whisper-shadow border border-soft-border flex items-center justify-between">
<div class="flex-1 pr-4">
<h3 class="font-headline-md text-headline-md text-primary-container text-lg">Master Location Toggle</h3>
<p class="text-body-md text-muted-zinc mt-1 leading-snug">Globally enable or disable location services. Turning this off hides you from all maps immediately.</p>
</div>
<div class="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
<input checked="" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 checked:border-primary" id="master_toggle" name="master_toggle" type="checkbox">
<label class="toggle-label block overflow-hidden h-6 rounded-full bg-surface-dim cursor-pointer transition-colors duration-300" for="master_toggle"></label>
</div>
</div>
</section>
<!-- Location Mode Selection (Bento-style Radio Cards) -->
<section class="stagger-reveal space-y-3" style="animation-delay: 0.3s;">
<h3 class="font-technical-label text-technical-label text-muted-zinc uppercase tracking-widest px-1">Location Mode</h3>
<div class="grid grid-cols-1 gap-3">
<!-- Exact -->
<label class="group relative bg-surface-pure rounded-xl p-4 whisper-shadow border border-soft-border flex items-start gap-4 cursor-pointer hover:bg-surface-container-low transition-all">
<input checked="" class="hidden peer" name="loc_mode" type="radio">
<div class="w-5 h-5 rounded-full border-2 border-outline mt-1 flex items-center justify-center peer-checked:border-primary peer-checked:bg-primary transition-all">
<div class="w-2 h-2 bg-white rounded-full"></div>
</div>
<div>
<span class="font-bold text-on-surface block">Exact</span>
<p class="text-body-md text-on-surface-variant mt-1">High-precision GPS. Best for navigation and finding friends within 1-3 meters.</p>
</div>
<span class="material-symbols-outlined absolute top-4 right-4 text-primary opacity-20 group-hover:opacity-100 transition-opacity">my_location</span>
</label>
<!-- Blurred -->
<label class="group relative bg-surface-pure rounded-xl p-4 whisper-shadow border border-soft-border flex items-start gap-4 cursor-pointer hover:bg-surface-container-low transition-all">
<input class="hidden peer" name="loc_mode" type="radio">
<div class="w-5 h-5 rounded-full border-2 border-outline mt-1 flex items-center justify-center peer-checked:border-primary peer-checked:bg-primary transition-all">
<div class="w-2 h-2 bg-white rounded-full"></div>
</div>
<div>
<span class="font-bold text-on-surface block">Blurred</span>
<p class="text-body-md text-on-surface-variant mt-1">Shows your general neighborhood (approx. 500m radius). Provides privacy while staying relevant.</p>
</div>
<span class="material-symbols-outlined absolute top-4 right-4 text-primary opacity-20 group-hover:opacity-100 transition-opacity">blur_on</span>
</label>
<!-- Hidden -->
<label class="group relative bg-surface-pure rounded-xl p-4 whisper-shadow border border-soft-border flex items-start gap-4 cursor-pointer hover:bg-surface-container-low transition-all">
<input class="hidden peer" name="loc_mode" type="radio">
<div class="w-5 h-5 rounded-full border-2 border-outline mt-1 flex items-center justify-center peer-checked:border-primary peer-checked:bg-primary transition-all">
<div class="w-2 h-2 bg-white rounded-full"></div>
</div>
<div>
<span class="font-bold text-on-surface block">Hidden</span>
<p class="text-body-md text-on-surface-variant mt-1">Hides your marker from public discovery but allows you to see others on the map.</p>
</div>
<span class="material-symbols-outlined absolute top-4 right-4 text-primary opacity-20 group-hover:opacity-100 transition-opacity">visibility_off</span>
</label>
</div>
</section>
<!-- Invisible Mode Card -->
<section class="stagger-reveal" style="animation-delay: 0.4s;">
<div class="bg-primary/5 rounded-xl p-5 border border-primary/20 flex items-center justify-between">
<div class="flex-1 pr-4">
<div class="flex items-center gap-2">
<h3 class="font-bold text-primary">Invisible Mode</h3>
<span class="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Premium</span>
</div>
<p class="text-body-md text-on-surface-variant mt-1">Browse the map without leaving any trace of your visit. No 'Last Seen' update.</p>
</div>
<div class="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
<input class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 checked:border-primary" id="invisible_mode" name="invisible_mode" type="checkbox">
<label class="toggle-label block overflow-hidden h-6 rounded-full bg-surface-dim cursor-pointer transition-colors duration-300" for="invisible_mode"></label>
</div>
</div>
</section>
<!-- Location History Section -->
<section class="stagger-reveal space-y-3" style="animation-delay: 0.5s;">
<h3 class="font-technical-label text-technical-label text-muted-zinc uppercase tracking-widest px-1">Location History</h3>
<div class="bg-surface-pure rounded-xl p-5 whisper-shadow border border-soft-border">
<div class="flex items-center justify-between mb-4">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-lg bg-secondary-container/30 flex items-center justify-center">
<span class="material-symbols-outlined text-secondary">history</span>
</div>
<div>
<p class="font-bold text-on-surface">Stored History</p>
<p class="text-technical-label text-muted-zinc">142 locations recorded</p>
</div>
</div>
<button class="text-error font-bold text-body-md px-3 py-1.5 rounded-lg hover:bg-error-container/20 transition-colors active:-translate-y-px" id="clearBtn">
                        Clear History
                    </button>
</div>
<div class="h-1 bg-surface-container rounded-full overflow-hidden">
<div class="h-full bg-primary w-2/3 rounded-full"></div>
</div>
<p class="text-body-md text-muted-zinc mt-4">History is used to provide personalized discovery recommendations. Clearing it will reset your discovery algorithm.</p>
</div>
</section>
<!-- Map Visualization Placeholder (Decorative) -->
<div class="stagger-reveal rounded-2xl h-48 overflow-hidden relative border border-soft-border" style="animation-delay: 0.6s;">
<img class="w-full h-full object-cover grayscale opacity-40" data-alt="A high-angle aerial photograph of a clean, minimalist urban layout with grid-like streets and soft, pastel-colored buildings. The lighting is diffused and bright, creating a calm, modern light-mode atmosphere. Subtle digital grid lines and nodes are overlaid on the terrain to represent a geographical data layer, maintaining a sophisticated technical exploration aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAm3p4XjdMSVBx0YZXibxlM0r8U5GdZX48tzfwQrLvA01kXIRJkOQoOihjqTjLYAxQHKacTmb73enWfgPquiSY75Hn5iCqbkdZ-6HCHYXJin3OJdxXrBwL_ciVPP5ozsogkZMXfe8nDgzo4h6-OUsXzB6V286TiEY1lcTa9jLwuEUwLFWuDhk_iwpSYiZDgnF6_ytFJwMvbg1pxF2qQqFzhu756GB4Q7UtPz8vFUkxyzdsTYxbeHAt9LNi3Ux9jxa2ItWhJiD5NQF0">
<div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
<div class="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-lg flex items-center justify-between">
<div class="flex items-center gap-2">
<div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
<span class="text-technical-label font-bold text-on-surface">CURRENT VISIBILITY: EXACT</span>
</div>
<span class="material-symbols-outlined text-primary text-sm">info</span>
</div>
</div>
</main>
<!-- BottomNavBar Shell -->

<script>
        // Micro-interactions and Clear History feedback
        document.getElementById('clearBtn').addEventListener('click', function() {
            if(confirm('Are you sure you want to permanently clear your location history? This action cannot be undone.')) {
                const btn = this;
                btn.innerHTML = 'Clearing...';
                btn.disabled = true;
                setTimeout(() => {
                    btn.innerHTML = 'Cleared';
                    btn.classList.replace('text-error', 'text-muted-zinc');
                    const progressBar = btn.closest('.bg-surface-pure').querySelector('.bg-primary');
                    progressBar.style.width = '0%';
                    progressBar.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
                    const countLabel = btn.closest('.bg-surface-pure').querySelector('.text-technical-label');
                    countLabel.innerHTML = '0 locations recorded';
                }, 1200);
            }
        });

        // Toggle logic for Master Switch
        const masterToggle = document.getElementById('master_toggle');
        const contentCards = document.querySelectorAll('main > section:not(:first-child)');
        
        masterToggle.addEventListener('change', function() {
            if(!this.checked) {
                contentCards.forEach((card, index) => {
                    if(index > 0) { // Keep Master toggle visible
                        card.style.opacity = '0.5';
                        card.style.pointerEvents = 'none';
                        card.style.filter = 'grayscale(1)';
                    }
                });
            } else {
                contentCards.forEach((card) => {
                    card.style.opacity = '1';
                    card.style.pointerEvents = 'auto';
                    card.style.filter = 'none';
                });
            }
        });
    </script>


</body></html>`;

export default function PrivacySettings() {
  return (
    <SafeAreaView style={styles.container}>
      <WebView 
        source={{ html: htmlContent }} 
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
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
