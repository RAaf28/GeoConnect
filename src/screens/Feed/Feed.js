import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WebView } from 'react-native-webview';

const htmlContent = `<!DOCTYPE html><html class="light" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0, viewport-fit=cover" name="viewport">
<title>GeoConnect | Feed</title>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
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
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .glass-panel { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .whisper-shadow { box-shadow: 0 10px 30px -10px rgba(70, 72, 212, 0.08); }
        .post-card-stagger { animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
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
<body class="bg-background text-on-surface">
<!-- Top Navigation Bar -->
<header class="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface-container/80 backdrop-blur-md shadow-sm h-16 flex justify-between items-center px-margin-page">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[28px]">explore</span>
<span class="text-headline-md font-headline-md text-primary tracking-tight">GeoConnect</span>
</div>
<div class="flex items-center gap-4">
<button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant/50 transition-colors">
<span class="material-symbols-outlined text-on-surface-variant">search</span>
</button>
<div class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
<img alt="User" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7O_AiaTmqUI-8RtP8H_aDP_Y9H19LrkRwbP7fAOtrtHyWA3A2V4jfZy1vRPMqwdTIdeshS9QqmZo-OHapLmohk4JrvRsASxBrHmNibWZwd2i0OQwT6ZnsS6yiVrzmBHhJEsZ8HM2ZJyoD_RU5MW7fam0nZ6VC9WOlzPeSQrOPLXNftsG8l5XkOAhpapyoHH62t7d78LLKcjXuMbieojsM5d6zOZLW7vp3jtelrp3JyHE9gHYnr2yWq2ZRCkE4c1rA8faytyw3Ti4">
</div>
</div>
</header>
<!-- Main Content Area -->
<main class="pt-20 pb-4 max-w-2xl mx-auto px-4 lg:px-0">
<!-- Filter Bar -->
<div class="sticky top-16 z-40 py-4 bg-background/95 backdrop-blur-sm mb-2">
<div class="flex items-center justify-between">
<div class="flex gap-2 p-1 bg-surface-container-low rounded-full">
<button class="px-6 py-2 rounded-full text-technical-label font-technical-label bg-primary text-on-primary shadow-sm transition-all">Feed</button>
<button class="px-6 py-2 rounded-full text-technical-label font-technical-label text-on-surface-variant hover:bg-surface-variant/50 transition-all">Trending</button>
</div>
<label class="relative inline-flex items-center cursor-pointer group">
<input class="sr-only peer" type="checkbox" value="">
<span class="mr-3 text-technical-label font-technical-label text-on-surface-variant">Nearby Only</span>
<div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[21px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
</div>
<!-- Post List (Infinite Scroll Logic simulated by multiple cards) -->
<div class="space-y-6">
<!-- Post Card 1 -->
<article class="post-card-stagger bg-surface-pure rounded-xl overflow-hidden whisper-shadow border border-soft-border group transition-all hover:-translate-y-px duration-300 opacity-100" style="animation-delay: 0.1s;">
<!-- Card Header -->
<div class="p-4 flex items-center justify-between">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5">
<img alt="Sasha" class="w-full h-full rounded-full object-cover" data-alt="A portrait-style profile avatar of a young, creative professional woman with a warm expression and short hair, rendered in a crisp, modern minimalist digital illustration style with soft, professional lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYL4wmwp3XgWvOehw59YSIe1r17D5Krjv8SpNsiIKJbWMUu8I7CzeD4-HUm5d6bibS2oGOQuZjEysl2qtGtUpx_jYSTu23JGxVO7HO_sYi6FL6jxeE8EO1ikKTg4-PhmQfaQXlMRFy8vCh8C7onysdga17jyIQzIaxm0XLjAwYNyxEQ6UGKOYxPzKCRO8KYC9Q6kgJR8iRrVcP6n1viCB7tiK17lphzhvMOpfTVEIpRsRfrpx1nKC5Qs20l_Z85dS--HVazMd_HTE">
</div>
<div>
<h3 class="font-headline-md text-[15px] leading-tight text-on-surface">Sasha K.</h3>
<div class="flex items-center gap-1.5 mt-0.5">
<span class="material-symbols-outlined text-[14px] text-primary">location_on</span>
<button class="text-technical-label font-technical-label text-primary hover:underline">Zion National Park, UT</button>
<span class="text-[10px] text-muted-zinc">•</span>
<time class="text-technical-label font-technical-label text-muted-zinc">2h ago</time>
</div>
</div>
</div>
<button class="text-muted-zinc hover:text-on-surface transition-colors">
<span class="material-symbols-outlined">more_vert</span>
</button>
</div>
<!-- Card Content -->
<div class="aspect-[4/5] overflow-hidden relative">
<img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="A breathtaking wide-angle landscape photograph of Zion National Park at sunrise, capturing the majestic orange sandstone cliffs and deep green valleys. The lighting is ethereal with golden morning rays filtering through a slight mist, creating a serene and adventurous atmosphere. The visual style is premium and high-definition, consistent with a modern discovery aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgK3GmUCEjvHxKKR_Q6uae-02LEnsS9hcZzO9ofenTqdId5tKoJqD4zDr0zJZp8L5g6mVSzvL3ukJYj0H2Tc5wqh8vnilrY7ewndj-9jmiUx07l_Tn83PeVjnNlAOH2YiH_vg9_vdRvcRLjoZfXF2ejO6yZ22vIjuS2nzoNg9263hfuiAvJH0BysD7qm2JaWPBrzTXtwVHZ2-mqnX7iBRbPq7i6EDbpZRmIG1YWnBlxuKZjWtH6gFNOzib6aUjMYRtcsl-4EFR_8Q">
<div class="absolute top-4 right-4 bg-surface-pure/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30">
<div class="flex items-center gap-2">
<div class="w-2 h-2 rounded-full bg-primary nearby-pulse"></div>
<span class="text-technical-label font-technical-label text-white drop-shadow-md">Nearby Activity</span>
</div>
</div>
</div>
<!-- Card Footer Actions -->
<div class="p-4">
<div class="flex items-center justify-between mb-4">
<div class="flex items-center gap-5">
<button class="flex items-center gap-1.5 text-on-surface group/action">
<span class="material-symbols-outlined text-[24px] group-hover/action:text-error transition-colors">favorite</span>
<span class="text-technical-label font-technical-label">1.2k</span>
</button>
<button class="flex items-center gap-1.5 text-on-surface group/action">
<span class="material-symbols-outlined text-[24px] group-hover/action:text-primary transition-colors">chat_bubble</span>
<span class="text-technical-label font-technical-label">42</span>
</button>
<button class="flex items-center gap-1.5 text-on-surface group/action">
<span class="material-symbols-outlined text-[24px] group-hover/action:text-primary transition-colors">send</span>
</button>
</div>
<button class="text-on-surface hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[24px]">bookmark</span>
</button>
</div>
<div class="space-y-1">
<p class="text-body-md font-body-md text-on-surface">
<span class="font-bold">Sasha K.</span> Finally made it to the Narrows. The water was freezing but the view was absolutely spiritual. Highly recommend the 5AM start to beat the crowds! 🏔️✨
                        </p>
<button class="text-technical-label font-technical-label text-muted-zinc hover:text-primary transition-colors">View all 42 comments</button>
</div>
</div>
</article>
<!-- Post Card 2 -->
<article class="post-card-stagger bg-surface-pure rounded-xl overflow-hidden whisper-shadow border border-soft-border group transition-all hover:-translate-y-px duration-300 opacity-100" style="animation-delay: 0.2s;">
<div class="p-4 flex items-center justify-between">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5">
<img alt="Marco" class="w-full h-full rounded-full object-cover" data-alt="A profile picture of a young male explorer with a friendly smile, outdoor gear, and a vibrant forest background. The art style is modern, clean, and minimalist, utilizing soft focus and professional high-key lighting for a premium discovery app aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTEKFMh2ZYFyJm8qgeDvN1qbDIqEG4exSxbhC3LIOaH7gsoI5QiXO9XbNxNscD92_ek11aCTwcf0Kq5TyLITguyzeezBCgauc1BBlDP8lk8G1c9oxzNP63jAb81Iv4EZHM522DZQHF_jc5hENk1aE2Q7LfbU1m-UQZboBHXnsFrx0GKvkysKn1HT3fI_A-vOHhJUmrPPFGoU3C7W3tKzCgItsT5k0qThV0BEkNB323pB-M133Bf7h2hHs5LO7qMcpTTC9jhVOjBlQ">
</div>
<div>
<h3 class="font-headline-md text-[15px] leading-tight text-on-surface">Marco Polo</h3>
<div class="flex items-center gap-1.5 mt-0.5">
<span class="material-symbols-outlined text-[14px] text-primary">location_on</span>
<button class="text-technical-label font-technical-label text-primary hover:underline">Old Town, Prague</button>
<span class="text-[10px] text-muted-zinc">•</span>
<time class="text-technical-label font-technical-label text-muted-zinc">5h ago</time>
</div>
</div>
</div>
<button class="text-muted-zinc hover:text-on-surface transition-colors">
<span class="material-symbols-outlined">more_vert</span>
</button>
</div>
<div class="aspect-[16/9] overflow-hidden">
<img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="A cinematic night-time view of Prague's Old Town Square, featuring the illuminated Týn Church and historical clock tower. The cobblestone streets reflect the warm amber glow of city lanterns, creating a magical, historical atmosphere. The photograph captures rich textures and deep shadows, emphasizing a premium travel experience." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6NzgYqUCo_Fa5hL6tsuxs9hQZyZp67g3oN4klQpR-blKNr0WbG_YCGsMoXJMTZQ3hxhAItzVmSnt815xuzNWkYZMMn1SahiI-BwC9qMzsD7IK8SciftdjttcxCogZPQ-IQqgizQ9tz6IpvMfgu0faTq6WF8xYQ-C8ge6oUYC26wfD6MGVYQ9Nv9s7JluwvFE9BQMC_HT5MrMX4naKUukZ-Wwbr0TIL9XOsLJtMXeaYWEyz_7r8dX51DGqBv9wHuEthsr6ikqWKLk">
</div>
<div class="p-4">
<div class="flex items-center justify-between mb-4">
<div class="flex items-center gap-5">
<button class="flex items-center gap-1.5 text-on-surface group/action">
<span class="material-symbols-outlined text-[24px] group-hover/action:text-error transition-colors">favorite</span>
<span class="text-technical-label font-technical-label">842</span>
</button>
<button class="flex items-center gap-1.5 text-on-surface group/action">
<span class="material-symbols-outlined text-[24px] group-hover/action:text-primary transition-colors">chat_bubble</span>
<span class="text-technical-label font-technical-label">12</span>
</button>
<button class="flex items-center gap-1.5 text-on-surface group/action">
<span class="material-symbols-outlined text-[24px] group-hover/action:text-primary transition-colors">send</span>
</button>
</div>
<button class="text-on-surface hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[24px]" style="font-variation-settings: 'FILL' 1;">bookmark</span>
</button>
</div>
<div class="space-y-1">
<p class="text-body-md font-body-md text-on-surface">
<span class="font-bold">Marco Polo</span> Prague hits different at midnight. The silence of the history here is deafening in the best way possible. 🇨🇿
                        </p>
</div>
</div>
</article>
<!-- Loading Spinner (End of Scroll) -->
<div class="flex flex-col items-center py-8 gap-3">
<div class="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
<p class="text-technical-label font-technical-label text-muted-zinc uppercase tracking-widest">Discovering more...</p>
</div>
</div>
</main>
<!-- Bottom Navigation Bar -->

<!-- Float Action Button (Optional contextual context) -->

<script>
        // Micro-interaction: Like Heart Animation
        document.querySelectorAll('.group\\\\/action button:first-child').forEach(btn => {
            btn.addEventListener('click', function() {
                const icon = this.querySelector('.material-symbols-outlined');
                if (icon.style.fontVariationSettings.includes("'FILL' 1")) {
                    icon.style.fontVariationSettings = "'FILL' 0";
                    icon.classList.remove('text-error');
                } else {
                    icon.style.fontVariationSettings = "'FILL' 1";
                    icon.classList.add('text-error');
                    // Add small pop effect
                    this.style.transform = 'scale(1.3)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 150);
                }
            });
        });

        // Simple scroll observer for infinite scroll simulation
        const observerOptions = {
            root: null,
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100');
                    entry.target.classList.remove('opacity-0', 'translate-y-4');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.post-card-stagger').forEach(card => {
            observer.observe(card);
        });
    </script>


</body></html>`;

export default function Feed() {
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
