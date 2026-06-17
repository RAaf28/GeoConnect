import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const htmlContent = `<!DOCTYPE html><html class="light" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0, viewport-fit=cover" name="viewport">
<title>GeoConnect - Create Post</title>
<!-- Font and Icons -->
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;family=JetBrains+Mono:wght@500&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@100..900&amp;display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<style>
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
    .glass-panel {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
    .whisper-shadow {
      box-shadow: 0 4px 20px -2px rgba(73, 75, 214, 0.08);
    }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      overscroll-behavior: none;
    }
    .tap-scale {
      transition: transform 0.15s ease-out;
    }
    .tap-scale:active {
      transform: translateY(1px) scale(0.98);
    }
  </style>
<script id="tailwind-config">
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          "colors": {
                  "primary-fixed": "#e1e0ff",
                  "on-primary-container": "#fffbff",
                  "soft-border": "rgba(226, 232, 240, 0.8)",
                  "on-surface-variant": "#464554",
                  "on-secondary": "#ffffff",
                  "surface-dim": "#dbd8e4",
                  "outline": "#767586",
                  "canvas-white": "#F9FAFB",
                  "inverse-on-surface": "#f2effb",
                  "on-tertiary-fixed-variant": "#703700",
                  "on-tertiary-container": "#fffbff",
                  "on-tertiary-fixed": "#301400",
                  "on-error-container": "#93000a",
                  "tertiary": "#904900",
                  "outline-variant": "#c7c4d7",
                  "on-primary-fixed-variant": "#2f2ebe",
                  "tertiary-fixed-dim": "#ffb783",
                  "surface-pure": "#FFFFFF",
                  "inverse-surface": "#303038",
                  "inverse-primary": "#c0c1ff",
                  "error-container": "#ffdad6",
                  "secondary-container": "#dae2fd",
                  "on-tertiary": "#ffffff",
                  "surface": "#fcf8ff",
                  "surface-bright": "#fcf8ff",
                  "on-secondary-fixed": "#131b2e",
                  "on-background": "#1b1b23",
                  "on-secondary-fixed-variant": "#3f465c",
                  "surface-container": "#efecf8",
                  "surface-container-low": "#f5f2fe",
                  "surface-variant": "#e4e1ed",
                  "primary-fixed-dim": "#c0c1ff",
                  "muted-zinc": "#64748B",
                  "surface-tint": "#494bd6",
                  "tertiary-container": "#b55d00",
                  "on-error": "#ffffff",
                  "secondary": "#565e74",
                  "background": "#fcf8ff",
                  "surface-container-highest": "#e4e1ed",
                  "secondary-fixed-dim": "#bec6e0",
                  "error": "#ba1a1a",
                  "tertiary-fixed": "#ffdcc5",
                  "on-secondary-container": "#5c647a",
                  "on-surface": "#1b1b23",
                  "secondary-fixed": "#dae2fd",
                  "primary": "#4648d4",
                  "surface-container-lowest": "#ffffff",
                  "on-primary-fixed": "#07006c",
                  "on-primary": "#ffffff",
                  "surface-container-high": "#e9e6f3",
                  "primary-container": "#6063ee"
          },
          "borderRadius": {
                  "DEFAULT": "0.25rem",
                  "lg": "0.5rem",
                  "xl": "0.75rem",
                  "full": "9999px"
          },
          "spacing": {
                  "safe-area": "32px",
                  "margin-page": "24px",
                  "gutter-grid": "16px",
                  "stack-gap": "12px"
          },
          "fontFamily": {
                  "technical-label": ["JetBrains Mono"],
                  "headline-md": ["Plus Jakarta Sans"],
                  "body-md": ["Plus Jakarta Sans"],
                  "body-lg": ["Plus Jakarta Sans"],
                  "headline-lg": ["Plus Jakarta Sans"],
                  "headline-lg-mobile": ["Plus Jakarta Sans"]
          },
          "fontSize": {
                  "technical-label": ["12px", {"lineHeight": "1.4", "fontWeight": "500"}],
                  "headline-md": ["24px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "700"}],
                  "body-md": ["14px", {"lineHeight": "1.6", "fontWeight": "400"}],
                  "body-lg": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
                  "headline-lg": ["32px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                  "headline-lg-mobile": ["28px", {"lineHeight": "1.2", "fontWeight": "700"}]
          }
        },
      },
    }
  </script>
</head>
<body class="bg-surface text-on-surface">
<!-- TopAppBar (Transactional Screen: Hide BottomNavBar and SideNav) -->
<header class="sticky top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm flex justify-between items-center px-margin-page h-16 w-full">
<button aria-label="Cancel" class="flex items-center justify-center p-2 text-on-surface-variant hover:opacity-80 transition-opacity active:translate-y-[1px]">
<span class="font-body-lg text-body-lg">Cancel</span>
</button>
<h1 class="font-headline-md text-headline-md font-bold text-primary">New Post</h1>
<button class="bg-primary-container text-on-primary-container px-6 py-2 rounded-xl font-bold shadow-sm hover:opacity-90 active:translate-y-[1px] transition-all">
      Post
    </button>
</header>
<main class="max-w-2xl mx-auto px-margin-page pt-stack-gap pb-safe-area space-y-6">
<!-- Profile & Visibility Context -->
<section class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full overflow-hidden border border-soft-border">
<img class="w-full h-full object-cover" data-alt="A portrait of a young professional man with a friendly expression in a brightly lit studio. The aesthetic is clean and modern, featuring soft natural lighting that emphasizes a high-end light-mode look. The color palette is composed of soft whites and neutrals with a subtle hint of the primary indigo brand color in his shirt. High-definition detailing captures a sense of approachability and technical precision." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9uNGwZd05KPepH_30jUvNm5ILCaeWOFqzBSmmEsSUKq-Y06p855OauyNvZ1XOVBeKKy6nfPCvp-xHHN3-zOpxjQK6X0TTPUujY5I0xts4v168yqdOosUAfNN3Y8aXR7o5eTByVBxRzl6OD36DKzesBSvUZOJ9E6lBR18ARdmlLarsM3bXF1UmA-8PLiGY74CFR-fimTaFzq8ZLuodU840-7cAeiIh3W2cp8X6g_z7nHgqHXD4KlQptS2Zsc_aWWLPqqQeujP4zCc">
</div>
<div>
<h2 class="font-body-md text-body-md font-bold text-on-surface">Alex Rivera</h2>
<div class="flex items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined text-[14px]">public</span>
<span class="font-technical-label text-[11px] uppercase tracking-wider">Public</span>
<span class="material-symbols-outlined text-[14px]">expand_more</span>
</div>
</div>
</section>
<!-- Text Input Area -->
<section class="space-y-4">
<textarea class="w-full bg-transparent border-none focus:ring-0 font-body-lg text-body-lg min-h-[120px] resize-none placeholder:text-outline/60" placeholder="What's happening at this location?"></textarea>
</section>
<!-- Media Upload Bento Section -->
<section class="grid grid-cols-2 gap-4">
<!-- Media Slot 1 (Placeholder) -->
<div class="relative aspect-square rounded-xl bg-surface-container-low overflow-hidden group border-2 border-dashed border-outline-variant hover:border-primary-container transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
<span class="material-symbols-outlined text-primary text-4xl">add_a_photo</span>
<span class="font-body-md text-on-surface-variant font-medium">Add Media</span>
</div>
<!-- Current Selection Suggestion (Visual Interest) -->
<div class="relative aspect-square rounded-xl bg-surface-container-highest overflow-hidden group whisper-shadow">
<img class="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" data-alt="A breathtaking panoramic landscape view of Yosemite Valley during the golden hour. The image features dramatic mountain peaks and lush greenery under a warm, glowing sky. The visual style is crisp and vivid, aligning with the GeoConnect brand's focus on exploration and discovery. The lighting is rich and atmospheric, creating deep contrasts and a premium aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHmIVWpnrzij4K4gWdyfRkqCPhQp6B4Pwt6m5uVyKvTax3RpE-BSsJiLqZVURoseYwCw3e3-9GdUJIbGGQAu_7WP6nTTr2DSP7UrymRRPu00gjWkX6ztKejp8T0imoAmWVhTp1VCJcNREQ1n-MrULLycb7MlzdGRx1EjKV9AzXjpEWNe6oyB5B0uOwiC8qYl9LmpdqzOiiH3IzQWSfKejDgYLDPR8X3V30zunwVpFGF0Ld-2YBtoRWQmbBbGlVRpCdE1Yvz9AU5WQ">
<div class="absolute inset-0 flex items-center justify-center">
<span class="material-symbols-outlined text-surface-pure text-3xl drop-shadow-md">collections</span>
</div>
</div>
</section>
<!-- Tag Location Section -->
<section class="bg-surface-pure rounded-xl p-4 whisper-shadow border border-soft-border space-y-3">
<div class="flex items-center justify-between">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center">
<span class="material-symbols-outlined text-primary">location_on</span>
</div>
<div>
<p class="font-body-md text-body-md font-bold text-on-surface">Tag Location</p>
<p class="font-technical-label text-[12px] text-on-surface-variant">Recommended: Presidio Park, San Francisco</p>
</div>
</div>
<button class="material-symbols-outlined text-outline">search</button>
</div>
<!-- Mini Map Context -->
<div class="w-full h-32 rounded-lg overflow-hidden relative">
<img class="w-full h-full object-cover" data-alt="A stylized overhead map view of a vibrant urban coastal area with clean white roads, soft blue water, and minimalist park markers in indigo. The design is modern and technical, using a light mode aesthetic with high legibility and glassmorphic interface elements overlaid. The overall feel is architectural and explorative." data-location="San Francisco" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAR-PJ9R5pUZNJyjke2jGxqx9rCyeA11fq_MCKSMtw6rUcS8RITLVeb-RnsnA81MXF4SOA8PCYis3UDQFiPLrdW6pMR1u6zKsrZd1ayP6pAUB60G6QLa9aXjpYMwRFQ9Drd-8i5BlyvMBetc2FTTWP3tjrMnwnUr8PV-5bDAJid9h8oIubnaFNWsgZiapQz3EJqtsOYy3fEANqnu2VFKZc8MW3zsGAbHY-Et1lHtRdv8uwboAZ9ECN6Uz_tyJSTyhWnrsEs-4Zu-aQ">
<div class="absolute inset-0 bg-primary/10 flex items-center justify-center">
<div class="relative">
<div class="absolute inset-0 animate-ping rounded-full bg-primary/40 h-8 w-8 -m-2"></div>
<div class="relative w-4 h-4 bg-primary rounded-full border-2 border-surface-pure shadow-lg"></div>
</div>
</div>
</div>
</section>
<!-- Options & Toggles -->
<section class="space-y-2">
<!-- Visibility Setting -->
<div class="flex items-center justify-between p-4 bg-surface-pure rounded-xl border border-soft-border tap-scale cursor-pointer">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-on-surface-variant">visibility</span>
<span class="font-body-md text-body-md font-medium">Post Visibility</span>
</div>
<div class="flex items-center gap-2">
<span class="text-primary font-bold text-body-md">Public</span>
<span class="material-symbols-outlined text-outline">chevron_right</span>
</div>
</div>
<!-- Share to toggle -->
<div class="flex items-center justify-between p-4 bg-surface-pure rounded-xl border border-soft-border">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-on-surface-variant">share</span>
<span class="font-body-md text-body-md font-medium">Share to Instagram</span>
</div>
<button class="w-11 h-6 bg-surface-container-highest rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none" onclick="this.classList.toggle('bg-primary'); this.querySelector('div').classList.toggle('translate-x-5')">
<div class="w-5 h-5 bg-surface-pure rounded-full shadow-md transform transition-transform duration-200 ease-in-out"></div>
</button>
</div>
<!-- Advanced Tags -->
<div class="flex items-center justify-between p-4 bg-surface-pure rounded-xl border border-soft-border tap-scale cursor-pointer">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-on-surface-variant">sell</span>
<span class="font-body-md text-body-md font-medium">Tag Friends</span>
</div>
<span class="material-symbols-outlined text-outline">add</span>
</div>
</section>
</main>
<!-- Sticky Tooltip/Bar (Optional Micro-interaction) -->
<div class="fixed bottom-0 left-0 w-full flex justify-center pointer-events-none" id="footer-actions">
<div class="w-full max-w-md mx-auto bg-surface/90 backdrop-blur-md border-t border-soft-border flex items-center justify-around h-20 pb-safe-area px-6">
  <button class="flex flex-col items-center justify-center gap-1 text-primary transition-colors">
    <span class="material-symbols-outlined text-2xl">image</span>
    <span class="font-technical-label text-[12px] font-medium">Photo</span>
    <div class="absolute top-0 w-8 h-1 bg-primary rounded-b-full"></div>
  </button>
  <button class="flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
    <span class="material-symbols-outlined text-2xl">videocam</span>
    <span class="font-technical-label text-[12px] font-medium">Video</span>
  </button>
  <div class="relative -top-4">
    <button class="w-14 h-14 bg-primary text-surface-pure rounded-full shadow-lg flex items-center justify-center tap-scale">
      <span class="material-symbols-outlined text-3xl">add</span>
    </button>
  </div>
  <button class="flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
    <span class="material-symbols-outlined text-2xl">alternate_email</span>
    <span class="font-technical-label text-[12px] font-medium">Mention</span>
  </button>
  <button class="flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
    <span class="material-symbols-outlined text-2xl">tag</span>
    <span class="font-technical-label text-[12px] font-medium">Hash</span>
  </button>
</div>
</div>
<script>
    // Micro-interaction for feedback
    document.querySelectorAll('.tap-scale').forEach(button => {
      button.addEventListener('click', () => {
        // Handle logic here if needed
      });
    });

    // Simple scroll effect for top bar shadow
    window.addEventListener('scroll', () => {
      const header = document.querySelector('header');
      if (window.scrollY > 0) {
        header.classList.add('shadow-md');
        header.classList.remove('shadow-sm');
      } else {
        header.classList.add('shadow-sm');
        header.classList.remove('shadow-md');
      }
    });
  </script>


</body></html>`;

export default function CreatePost() {
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
