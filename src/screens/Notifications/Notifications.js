import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WebView } from 'react-native-webview';

const htmlContent = `<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>GeoConnect | Notifications</title>
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Tailwind Config -->
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
        .glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }
        .whisper-shadow {
            box-shadow: 0 10px 30px -5px rgba(70, 72, 212, 0.05);
        }
        .staggered-reveal > * {
            opacity: 0;
            transform: translateY(10px);
            animation: reveal 0.5s ease forwards;
        }
        @keyframes reveal {
            to { opacity: 1; transform: translateY(0); }
        }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }

        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .filled-icon {
            font-variation-settings: 'FILL' 1;
        }
    </style>

  </head>
<body class="bg-background text-on-background font-body-md min-h-screen pb-4">
<!-- TopAppBar Shell -->
<header class="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface-container/80 backdrop-blur-md shadow-sm">
<div class="flex justify-between items-center px-margin-page h-16 w-full">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary">explore</span>
<h1 class="text-headline-md font-headline-md text-primary tracking-tight">GeoConnect</h1>
</div>
<button class="hover:bg-surface-variant/50 transition-colors p-2 rounded-full">
<span class="material-symbols-outlined text-on-surface-variant">search</span>
</button>
</div>
</header>
<!-- Content Canvas -->
<main class="pt-24 px-margin-page max-w-2xl mx-auto">
<header class="mb-8">
<h2 class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-2">Notifications</h2>
<p class="text-body-md text-muted-zinc">Stay updated with your local discoveries</p>
</header>
<!-- Notification Feed -->
<div class="space-y-stack-gap staggered-reveal">
<!-- Category Header -->
<div class="stagger-1 py-2">
<span class="text-technical-label font-technical-label uppercase tracking-widest text-primary">New Activity</span>
</div>
<!-- Notification Item 1: Like -->
<div class="stagger-2 glass-card whisper-shadow border border-soft-border rounded-xl p-4 flex items-start gap-4 active:-translate-y-px transition-transform duration-200">
<div class="relative flex-shrink-0">
<img alt="User Profile" class="w-12 h-12 rounded-full object-cover border-2 border-primary/20" data-alt="A close-up portrait of a friendly man with a warm smile, set against a blurred urban background. The lighting is soft and natural, reflecting a bright and modern light-mode aesthetic. The photo is high-resolution, emphasizing clear skin textures and professional color grading consistent with a vibrant discovery app." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8lhx6xF1HoaaQ3exWShNKWlT8khEzSjQBq165fq3Dpet1P6v3GSE1TmWUkv-fFDn2f3nN9HeLgZCoa_zuPOvV1w5K6S1rtbMbJHswOgdBvgxcqs5aWXwlAwlnNzzsWT4E1inDy89zzZF6k27HSDYKcQdTmA6hl4AY4w4cdXNl3JpwYrrRbi2DNFuBA0DLnQs5SVhR-5t8BVHy3icVUYBygLEdN1NFRfsNInFDxwWfY8C-3b9n1clcOVzgHzRIEgNJyLVcBubKbNQ"/>
<div class="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full border-2 border-surface flex items-center justify-center">
<span class="material-symbols-outlined text-[12px] filled-icon">favorite</span>
</div>
</div>
<div class="flex-grow">
<p class="text-body-md text-on-surface leading-tight">
<span class="font-bold">Marco Polo</span> liked your post
                    </p>
<p class="text-[12px] text-muted-zinc mt-1">2 mins ago • Recent Post</p>
</div>
<div class="w-12 h-12 bg-surface-container rounded-lg flex-shrink-0 overflow-hidden">
<img alt="Post Thumbnail" class="w-full h-full object-cover opacity-80" data-alt="A beautiful architectural shot of a modern glass skyscraper reflecting a clear blue sky. The visual style is clean, sharp, and professional, echoing a high-end photography portfolio. Soft sunlight creates elegant highlights on the building's surface, maintaining the light-mode discovery theme of the application." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjAKQfW2CbR3bMOjgRPYKcUHb1iW1DhCufox1mP2gzOFrGR_Oa6AmtYqX-Hm2n1G9tI_CDmMUWtLhKxg7fkguiDWV07HBSRqLJ9Pf4LSSCoL59826jQxagvn2s2G3CdvRouZmNQAKVl9FnCdx1dpJN3Kt1-BZvzMwOHLAqVvI0sfZDsm_k4PbF4LIDmlo9TLzgRGXrns96V4q1JruazUza9ZJGFyImh5iYpE-7kyJN0hAOnkvtG789Pn2x--2LQVDKmoru92Mk1hE"/>
</div>
</div>
<!-- Notification Item 2: Event -->
<div class="stagger-3 glass-card whisper-shadow border border-soft-border rounded-xl p-4 flex items-start gap-4 active:-translate-y-px transition-transform duration-200">
<div class="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center flex-shrink-0 text-on-secondary-container">
<span class="material-symbols-outlined filled-icon">event_available</span>
</div>
<div class="flex-grow">
<p class="text-body-md text-on-surface leading-tight">
<span class="font-bold">New event:</span> Urban Photography Workshop near you
                    </p>
<p class="text-[12px] text-muted-zinc mt-1">1 hour ago • Arts &amp; Culture</p>
<div class="mt-3 flex gap-2">
<button class="bg-primary text-on-primary-container px-4 py-1.5 rounded-lg text-technical-label font-technical-label hover:opacity-90 transition-opacity">
                            View Details
                        </button>
</div>
</div>
</div>
<!-- Category Header -->
<div class="stagger-4 py-2 pt-6">
<span class="text-technical-label font-technical-label uppercase tracking-widest text-muted-zinc">Earlier</span>
</div>
<!-- Notification Item 3: Check-in -->
<div class="stagger-4 glass-card whisper-shadow border border-soft-border rounded-xl p-4 flex items-start gap-4 active:-translate-y-px transition-transform duration-200">
<div class="relative flex-shrink-0">
<img alt="User Profile" class="w-12 h-12 rounded-full object-cover border-2 border-secondary/20" data-alt="A portrait of a young woman with a trendy aesthetic, wearing stylish glasses and looking thoughtfully into the distance. The setting is a cozy, brightly lit indoor space with plants in the background. The lighting is airy and soft, fitting a minimalist and modern design system with a premium feel." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCriEg7t6ao2saBEaXRkP9vUoAa4A7A63iMKnV1KEnfnk2gDY0IsBmmNQtF_3BHxxu10FMhry5iRLOYqGi4qT5nfdaC6aMklxiResODMRJ5pN0fvlIFKQs92t1F6ayw0jZW9u4j2NsDhhgputlBmyTAAurvko-p0V-iyPsn5TrI1s7NQx32Kns5Y0s0GXKDnzgKDl0VeXDfpq6lqBQ6bQIQiaWn4GaEsFl37LmAF7Vr82C8HfKLeFgWgNZQSqVmxuSFJlapH7mMa8M"/>
<div class="absolute -bottom-1 -right-1 bg-tertiary-container text-white p-1 rounded-full border-2 border-surface flex items-center justify-center">
<span class="material-symbols-outlined text-[12px] filled-icon">location_on</span>
</div>
</div>
<div class="flex-grow">
<p class="text-body-md text-on-surface leading-tight">
<span class="font-bold">Someone</span> checked in at your favorite Cafe
                    </p>
<p class="text-[12px] text-muted-zinc mt-1">4 hours ago • Local Hangout</p>
</div>
<div class="w-12 h-12 bg-surface-container rounded-lg flex-shrink-0 overflow-hidden">
<img alt="Cafe Location" class="w-full h-full object-cover opacity-80" data-alt="A warm, inviting interior of a modern artisan cafe with wooden furniture and minimalist decor. Sunlight streams through large windows, creating a bright and airy atmosphere. The image feels peaceful and sophisticated, perfectly aligned with the discovery and social interaction themes of the GeoConnect brand." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwglDOAP_JTMoi3yt7Tl5B-dmu5zSELRisI9CqzyMItj6rKM905xPfDC5Sn33-rzHKaNZNff8RZD1_Ud9PdkpLrWnelbBkQn3zJyudfoGEu1DkDCT-B3GLLs_H156M_ybqKX_vFbBv6pPG0b9xcmkykoFwaOIh34hNdOYrk3-u5m7B56seINZzwxB7utdi5JgBbGR9_wNbu0ZLD2PpVYKdSN3lzKfw-1JdzpNS48qPrIR5aAVY3BExBW5sW_qTzLooPrM8_qIe0RM"/>
</div>
</div>
</div>
</main>
<!-- BottomNavBar Shell -->

<script>
        // Micro-interaction for notification clicks
        document.querySelectorAll('.glass-card').forEach(card => {
            card.addEventListener('mousedown', () => {
                card.style.transform = 'scale(0.98)';
            });
            card.addEventListener('mouseup', () => {
                card.style.transform = 'scale(1)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1)';
            });
        });
    </script>
</body></html>`;

export default function Notifications() {
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
