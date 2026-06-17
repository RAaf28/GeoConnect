import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WebView } from 'react-native-webview';

const htmlContent = `<!DOCTYPE html><html class="light" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0, viewport-fit=cover" name="viewport">
<title>GeoConnect | Explore Map</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet">
<!-- Icons -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-secondary-fixed": "#131b2e",
                    "on-primary-container": "#fffbff",
                    "tertiary-container": "#b55d00",
                    "surface-bright": "#fcf8ff",
                    "surface-container-high": "#e9e6f3",
                    "on-secondary-fixed-variant": "#3f465c",
                    "on-primary-fixed": "#07006c",
                    "inverse-on-surface": "#f2effb",
                    "primary-fixed-dim": "#c0c1ff",
                    "tertiary-fixed": "#ffdcc5",
                    "secondary-fixed-dim": "#bec6e0",
                    "on-tertiary-container": "#fffbff",
                    "on-error-container": "#93000a",
                    "surface-container-low": "#f5f2fe",
                    "on-surface": "#1b1b23",
                    "on-tertiary-fixed": "#301400",
                    "tertiary-fixed-dim": "#ffb783",
                    "secondary-fixed": "#dae2fd",
                    "surface-container-highest": "#e4e1ed",
                    "on-secondary": "#ffffff",
                    "surface-container": "#efecf8",
                    "on-secondary-container": "#5c647a",
                    "on-primary": "#ffffff",
                    "soft-border": "rgba(226, 232, 240, 0.8)",
                    "surface-dim": "#dbd8e4",
                    "on-error": "#ffffff",
                    "tertiary": "#904900",
                    "background": "#fcf8ff",
                    "error-container": "#ffdad6",
                    "inverse-primary": "#c0c1ff",
                    "primary": "#4648d4",
                    "surface-container-lowest": "#ffffff",
                    "on-surface-variant": "#464554",
                    "on-background": "#1b1b23",
                    "muted-zinc": "#64748B",
                    "surface": "#fcf8ff",
                    "error": "#ba1a1a",
                    "canvas-white": "#F9FAFB",
                    "primary-fixed": "#e1e0ff",
                    "secondary-container": "#dae2fd",
                    "outline": "#767586",
                    "outline-variant": "#c7c4d7",
                    "on-tertiary-fixed-variant": "#703700",
                    "on-primary-fixed-variant": "#2f2ebe",
                    "surface-pure": "#FFFFFF",
                    "surface-variant": "#e4e1ed",
                    "secondary": "#565e74",
                    "surface-tint": "#494bd6",
                    "primary-container": "#6063ee",
                    "inverse-surface": "#303038",
                    "on-tertiary": "#ffffff"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "margin-page": "24px",
                    "safe-area": "32px",
                    "gutter-grid": "16px",
                    "stack-gap": "12px"
            },
            "fontFamily": {
                    "body-lg": ["Plus Jakarta Sans"],
                    "technical-label": ["JetBrains Mono"],
                    "headline-md": ["Plus Jakarta Sans"],
                    "headline-lg": ["Plus Jakarta Sans"],
                    "body-md": ["Plus Jakarta Sans"],
                    "headline-lg-mobile": ["Plus Jakarta Sans"]
            },
            "fontSize": {
                    "body-lg": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
                    "technical-label": ["12px", {"lineHeight": "1.4", "fontWeight": "500"}],
                    "headline-md": ["24px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "700"}],
                    "headline-lg": ["32px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "body-md": ["14px", {"lineHeight": "1.6", "fontWeight": "400"}],
                    "headline-lg-mobile": ["28px", {"lineHeight": "1.2", "fontWeight": "700"}]
            }
          },
        },
      }
    </script>
<style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #fcf8ff; }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            vertical-align: middle;
        }
        .whisper-shadow {
            box-shadow: 0 10px 30px -5px rgba(70, 72, 212, 0.08);
        }
        .marker-pulse::after {
            content: '';
            position: absolute;
            inset: -4px;
            border-radius: 9999px;
            border: 2px solid #4648d4;
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(1.5); opacity: 0; }
        }
        .glass-panel {
            background: rgba(252, 248, 255, 0.8);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }
        .range-slider::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            background: #4648d4;
            border: 4px solid #ffffff;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .range-slider::-webkit-slider-thumb:active {
            transform: scale(1.2);
        }
    </style>

  </head>
<body class="overflow-hidden h-screen w-screen flex flex-col">
<!-- Map Canvas (Background Layer) -->
<div class="fixed inset-0 z-0">
<div class="w-full h-full grayscale-[0.2] brightness-[1.02]" data-location="Tokyo, Japan">
<!-- Simulated Map Elements via CSS/Overlays -->
<div class="absolute inset-0 bg-[#f8f9fa] opacity-10"></div>
<!-- Mock Map Markers -->
<!-- Marker 1: Cluster -->
<div class="absolute top-[35%] left-[25%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
<div class="relative flex items-center justify-center w-12 h-12 bg-primary rounded-full ring-4 ring-white whisper-shadow transition-transform group-active:scale-95">
<span class="font-technical-label text-white text-[16px] font-bold">12</span>
</div>
</div>
<!-- Marker 2: Individual Post -->
<div class="absolute top-[50%] left-[60%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
<div class="relative marker-pulse" style="transform: translateY(-2.46849px);">
<div class="w-14 h-14 rounded-full overflow-hidden ring-4 ring-white whisper-shadow transition-all group-hover:scale-110">
<img class="w-full h-full object-cover" data-alt="A portrait of a stylish young man with a focused expression, standing outdoors in a modern urban environment. The lighting is crisp and natural, highlighting high-end textures. The visual style is premium and clean, with a cool color temperature that matches the GeoConnect brand aesthetic, emphasizing sophisticated, high-contrast discovery." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEai_Klv_9k2j3yby_Nea35rnTKGqMC2fpONYbRi-YbSYaichseMDWfX7QleWqxmyu6qqrkYDcr20vRH1fMQTgL8LoDBaR1hCSV4VxjIbZrQK3zclk0UnzNV3mrdUV83tFdx9eOKNHRPJufQCYQU0tmERJgvXsA6Gwi-TcGEUZXMmRz4hKuMvV9o8S4xd9fdZcict9z2Pthn5QFKwJvDJvOYVHSKHvwDlICXwn-cQ6LfrGPN4Gl-i2TBpNKsbFxRkbigaKSQaTcrI">
</div>
<div class="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center ring-2 ring-white">
<span class="material-symbols-outlined text-white text-[14px]" style="font-variation-settings: 'FILL' 1;">favorite</span>
</div>
</div>
</div>
<!-- Marker 3: Individual Post -->
<div class="absolute top-[20%] left-[75%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
<div class="w-12 h-12 rounded-full overflow-hidden ring-4 ring-white whisper-shadow transition-all group-hover:scale-110">
<img class="w-full h-full object-cover" data-alt="A close-up portrait of a woman with a warm, natural smile, set against a soft-focus architectural background. The scene is bathed in bright, optimistic daylight, reflecting a clean and modern discovery ethos. The color palette is composed of sophisticated neutrals and light-mode brights, aligning with the professional, airy GeoConnect design system." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqpC4lYDG7WSN7VHojrFuWoKCxBVDILB842yT45tiDrbpgMuKpoqZYYFrtWYMVQEkVhWjjI4nbiW71tZ0pc-p1_BoM3pXw9yqTY7N9WJstmZIMFsDFtInOedS2LzWQKxKNzYNCQuPim_DOY_gLdFqn_U0Tyib-4AAoDxvKBE5ykLIk2T2yyLMsdndNFG09dUzFE5H8ommeOOn6lTGcG_kdHwNGT95lekrTRSrkO0hxd_dORrRRxDnqEVR7-0PS7HHEMTvxn15aan4">
</div>
</div>
</div>
</div>
<!-- Top Navigation Layer (Shared Component: TopAppBar style) -->
<header class="fixed top-0 left-0 right-0 z-50 flex items-center px-4 h-14 max-w-lg mx-auto bg-surface/80 dark:bg-surface-container-high/80 backdrop-blur-md rounded-full mx-margin-page mt-4 soft-border shadow-sm">
<div class="flex items-center w-full gap-3 px-2">
<span class="material-symbols-outlined text-primary">search</span>
<input class="bg-transparent border-none focus:ring-0 w-full font-body-md text-on-surface placeholder-on-surface-variant/60" placeholder="Search GeoConnect..." type="text">
<button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-lowest transition-colors">
<span class="material-symbols-outlined text-on-surface-variant">tune</span>
</button>
</div>
</header>
<!-- Map Interaction Controls (Asymmetric Placement) -->
<div class="fixed top-24 right-4 z-10 flex flex-col gap-2">
<button class="w-12 h-12 bg-surface-pure rounded-xl whisper-shadow flex items-center justify-center text-on-surface transition-transform active:scale-95">
<span class="material-symbols-outlined">my_location</span>
</button>
<button class="w-12 h-12 bg-surface-pure rounded-xl whisper-shadow flex items-center justify-center text-on-surface transition-transform active:scale-95">
<span class="material-symbols-outlined">layers</span>
</button>
</div>
<!-- Radius Slider Layer -->
<div class="fixed bottom-40 left-0 right-0 z-20 px-margin-page pointer-events-none">
<div class="max-w-md mx-auto pointer-events-auto">
<div class="glass-panel p-4 rounded-2xl whisper-shadow border border-white/50">
<div class="flex justify-between items-center mb-3">
<span class="font-headline-md text-[14px] text-on-surface">Search Radius</span>
<span class="font-technical-label text-primary bg-primary/10 px-2 py-0.5 rounded-full" id="radius-val">1.0km</span>
</div>
<input class="range-slider w-full h-1.5 bg-surface-container-highest rounded-full appearance-none cursor-pointer" max="2" min="0" oninput="updateRadius(this.value)" step="1" type="range" value="1">
<div class="flex justify-between mt-2 font-technical-label text-[10px] text-on-surface-variant uppercase tracking-wider">
<span class="">500m</span>
<span class="">1km</span>
<span class="">5km</span>
</div>
</div>
</div>
</div>
<!-- Bottom Sheet (Partially Visible) -->
<div class="fixed bottom-0 left-0 right-0 z-30 transition-transform duration-500 ease-[cubic-bezier(0.2,0,0,1)]" id="bottom-sheet" style="transform: translateY(calc(100% - 180px));">
<div class="max-w-2xl mx-auto bg-surface rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] pb-safe overflow-hidden">
<!-- Drag Handle -->
<div class="w-full flex justify-center pt-3 pb-2 cursor-pointer" onclick="toggleSheet()">
<div class="w-12 h-1 bg-outline-variant/40 rounded-full"></div>
</div>
<div class="px-margin-page pb-4">
<div class="flex justify-between items-center mb-6">
<h2 class="font-headline-md text-on-surface">Nearby Posts</h2>
<span class="font-technical-label text-on-surface-variant">24 Discovery</span>
</div>
<!-- Post Cards Container (Bento/Staggered Feel) -->
<div class="space-y-stack-gap">
<!-- Post Card 1 -->
<div class="bg-surface-pure p-4 rounded-2xl whisper-shadow flex gap-4 items-start border border-soft-border/20 transition-transform active:scale-[0.98]">
<div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
<img class="w-full h-full object-cover" data-alt="A modern architectural detail of a glass and steel building, reflecting a clear blue sky. The composition is geometric and minimalist, highlighting sharp angles and clean lines. The lighting is bright and technical, with a premium feel that aligns with the GeoConnect brand's focus on high-contrast urban discovery and modern minimalist design." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVfiYVNOZP4FHdnAaVg7DkVVFL8GH7rcrBXP8GnsDNUwT1cWH1cNoP49Xp3fnBlbWADYg7b23mzZnBtujnHq3EF29yixi2Z4K02r9qpKr_daYt8DjLMLBQmO0RKN_CWj6XzsEkNcnFb0snqAf2w-xNxxx7zTaSbyi0ROOeiheAs_nvIXtZGmx3t1-tqauXH4Rn9r3Eiih6eNSjO6HMxiPhVHa_nvQOXJBPH_5mdP3yx5QPzIwonoCc53Il0n74Un3d8EA0r0Y1ICk">
</div>
<div class="flex-1">
<div class="flex justify-between items-start mb-1">
<span class="font-technical-label text-[10px] text-primary uppercase tracking-widest">Architecture</span>
<span class="font-technical-label text-[10px] text-on-surface-variant">200m away</span>
</div>
<h3 class="font-headline-md text-[16px] text-on-surface leading-snug mb-2">Geometric Symmetry in Shibuya</h3>
<div class="flex items-center gap-2">
<div class="w-5 h-5 rounded-full overflow-hidden">
<img class="w-full h-full object-cover" data-alt="User avatar profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-orB61Y9syOMwDlaeQdXrYXquMcwBJ7cuklgOFr_tgOLBlYAeDzgAFZToxopPYJ3PGISPRS4YSqx3Hwk856ur8lE1zT_b2lELJjJWXGws5Cfhe6pGo-IQ82Xdhv8Cf8xUedCLIYeNjocftLNPnITVvbufoLICvzWCpW6e4QdRW_VSt4_x4HJ7a8O7W_BTRMobXdq0xsxlIPLjqo4nljDcJPoE8juq1mmVGsRbyL08bfXOHn-6Jb6FT_QH0luXfgPReSEALf3wG68">
</div>
<span class="font-body-md text-[12px] text-on-surface-variant">@arc_finder</span>
</div>
</div>
</div>
<!-- Post Card 2 -->
<div class="bg-surface-pure p-4 rounded-2xl whisper-shadow flex gap-4 items-start border border-soft-border/20 opacity-40">
<div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-low"></div>
<div class="flex-1 space-y-2">
<div class="h-3 w-16 bg-surface-container-low rounded"></div>
<div class="h-4 w-full bg-surface-container-low rounded"></div>
<div class="h-3 w-24 bg-surface-container-low rounded"></div>
</div>
</div>
</div>
</div>
</div>
</div>
<!-- Bottom Navigation Shell (Shared Component) -->

<script>
        function updateRadius(val) {
            const label = document.getElementById('radius-val');
            const values = ['500m', '1.0km', '5.0km'];
            label.textContent = values[val];
            
            // Interaction feedback
            label.classList.add('scale-110', 'text-primary');
            setTimeout(() => {
                label.classList.remove('scale-110');
            }, 200);
        }

        let isSheetOpen = false;
        const sheet = document.getElementById('bottom-sheet');
        
        // Initial state: partially visible
        sheet.style.transform = 'translateY(calc(100% - 180px))';

        function toggleSheet() {
            if (isSheetOpen) {
                sheet.style.transform = 'translateY(calc(100% - 180px))';
            } else {
                sheet.style.transform = 'translateY(0)';
            }
            isSheetOpen = !isSheetOpen;
        }

        // Lightweight atmospheric effect: subtle map marker float
        document.querySelectorAll('.marker-pulse').forEach(marker => {
            let offset = Math.random() * 2000;
            setInterval(() => {
                const y = Math.sin((Date.now() + offset) / 1000) * 3;
                marker.style.transform = \`translateY(\${y}px)\`;
            }, 50);
        });
    </script>


</body></html>`;

export default function ExploreMap() {
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
