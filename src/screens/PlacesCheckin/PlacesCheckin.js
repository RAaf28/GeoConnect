import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WebView } from 'react-native-webview';

const htmlContent = `<!DOCTYPE html><html class="light" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-panel {
            background: rgba(252, 248, 255, 0.8);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }
        .whisper-shadow {
            box-shadow: 0 10px 30px -5px rgba(70, 72, 212, 0.08), 0 4px 12px -2px rgba(70, 72, 212, 0.03);
        }
        .stagger-reveal {
            animation: reveal 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            opacity: 0;
            transform: translateY(10px);
        }
        @keyframes reveal {
            to { opacity: 1; transform: translateY(0); }
        }
        .map-canvas {
            background-image: radial-gradient(circle at 2px 2px, #e1e0ff 1px, transparent 0);
            background-size: 40px 40px;
        }
        /* Custom spring physics for detail sheet */
        .detail-sheet {
            transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
<body class="bg-background text-on-surface font-body-md min-h-screen overflow-x-hidden">
<!-- Top Navigation Bar -->
<header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm">
<nav class="flex justify-between items-center px-margin-page h-16 w-full">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-headline-md">explore</span>
<h1 class="text-headline-md font-headline-md text-primary tracking-tight">GeoConnect</h1>
</div>
<div class="flex items-center gap-4">
<button class="p-2 rounded-full hover:bg-surface-variant/50 transition-colors text-on-surface-variant">
<span class="material-symbols-outlined">search</span>
</button>
<div class="hidden md:flex gap-6">
<a class="text-primary font-bold -translate-y-px transition-transform duration-200" href="#">Explore</a>
<a class="text-on-surface-variant hover:bg-surface-variant/50 transition-colors" href="#">Feed</a>
<a class="text-on-surface-variant hover:bg-surface-variant/50 transition-colors" href="#">Alerts</a>
</div>
</div>
</nav>
</header>
<!-- Main Content: Map-First Discovery Canvas -->
<main class="pt-16 pb-20 md:pb-0 h-screen relative overflow-hidden">
<!-- Abstract Map Layer -->
<div class="absolute inset-0 z-0 map-canvas flex items-center justify-center">
<div class="relative w-full h-full opacity-40">
<!-- Marker 1: Active -->
<div class="absolute top-1/4 left-1/3 animate-pulse">
<div class="w-12 h-12 bg-primary rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
<img class="w-full h-full object-cover" data-alt="A modern, sunlit boutique cafe interior with minimalist wooden furniture and hanging pendant lights. The image has a clean, airy aesthetic with soft morning light streaming through large glass windows, highlighting lush indoor plants in the corner." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLe_ygiAF60MJFXoN9ZuxYCqt36xs0apTpNCCsd7-dI-S0gIUCyAaZxKOM5msbVn6LoKCxuffp-CsN8t4kNZfTO357HjvSjCfca724Ck1pztw_VFblZkftL4ifFfMB8BU2BbM5k3DYbQR6V0UqbRflnHKBCmvd2LL5lUTTeiWFJcgAIdbXsZbH_qSjK-bAMrRPh3pPpbGulKBtXri5cuNgdrhvz2MID-KsxxBuM0zYn-E9NuIqyffj8lK43TsOypb7uwzVqq4SMIE">
</div>
<div class="absolute -bottom-1 -right-1 w-4 h-4 bg-tertiary-container border-2 border-white rounded-full"></div>
</div>
<!-- Marker 2: Standard -->
<div class="absolute top-1/2 left-1/2">
<div class="w-10 h-10 bg-secondary rounded-full border-2 border-white shadow-lg flex items-center justify-center overflow-hidden">
<img class="w-full h-full object-cover" data-alt="A serene city park with a modern geometric sculpture at the center of a circular walking path. The landscape features manicured lawns, tall vibrant trees in the golden hour light, and a soft-focus urban skyline in the distant background under a clear blue sky." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOjvkDZZHK8pxpM0CoipYY4Y-i4B4IymF_ARLkVPQW93lFbk4etuk4s-T4wJvXfZoCIvcPTfdmtZ7XZs6F4xEjw9MzCJu8BnBWxuEB_tMjJFaujZymckJuWBU3r5-cRAVLgn6dvUUbuZFKBq-lVINGpsr2MdzZb3m34y5stUbN3J_uLFa0N6n05-RCDf11Y9KVhvHwJMBTcNWZL3yHp1wqhYsVjEVTRvXgEvf93-nDjJCyudo8Nusyh59DY-uicnhjE2j4t9z1yuQ">
</div>
</div>
</div>
</div>
<!-- Floating UI: Search & Categories -->
<section class="relative z-10 p-margin-page pointer-events-none">
<div class="max-w-xl mx-auto space-y-4 pointer-events-auto">
<!-- Search Bar -->
<div class="glass-panel rounded-xl whisper-shadow p-2 flex items-center gap-3 border border-soft-border stagger-reveal" style="animation-delay: 0s;">
<div class="pl-3 text-muted-zinc">
<span class="material-symbols-outlined">location_on</span>
</div>
<input class="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder-muted-zinc font-body-md py-2" placeholder="Where are you exploring today?" type="text">
<button class="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:-translate-y-px transition-all">
<span class="material-symbols-outlined text-[20px]">filter_list</span>
<span class="">Filters</span>
</button>
</div>
<!-- Category Chips -->
<div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar stagger-reveal" style="animation-delay: 0.1s;">
<button class="flex-shrink-0 bg-primary-container text-on-primary-container px-5 py-2 rounded-full font-bold text-body-md whisper-shadow flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]">local_cafe</span>
<span class="">Cafes</span>
</button>
<button class="flex-shrink-0 glass-panel text-on-surface-variant px-5 py-2 rounded-full font-medium text-body-md border border-soft-border hover:bg-surface-variant/40 transition-colors flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]">park</span>
<span class="">Parks</span>
</button>
<button class="flex-shrink-0 glass-panel text-on-surface-variant px-5 py-2 rounded-full font-medium text-body-md border border-soft-border hover:bg-surface-variant/40 transition-colors flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]">shopping_bag</span>
<span class="">Malls</span>
</button>
<button class="flex-shrink-0 glass-panel text-on-surface-variant px-5 py-2 rounded-full font-medium text-body-md border border-soft-border hover:bg-surface-variant/40 transition-colors flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]">museum</span>
<span class="">Culture</span>
</button>
</div>
</div>
</section>
<!-- Trending Side Bar (Desktop) / Carousel (Mobile) -->
<aside class="absolute left-margin-page top-64 bottom-margin-page w-80 hidden lg:flex flex-col gap-4 z-10">
<h3 class="text-headline-md font-headline-md text-on-surface-variant stagger-reveal" style="animation-delay: 0.2s;">Trending Now</h3>
<div class="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar">
<!-- Trending Card 1 -->
<div class="glass-panel border border-soft-border rounded-xl p-4 whisper-shadow stagger-reveal cursor-pointer group" onclick="toggleDetail()" style="animation-delay: 0.3s;">
<div class="relative h-32 rounded-lg overflow-hidden mb-3">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A trendy urban coffee shop with industrial aesthetics, featuring exposed brick walls, sleek black furniture, and large windows. The lighting is warm and inviting, with a vibrant coffee bar illuminated by neon accents, creating a high-contrast and sophisticated modern atmosphere." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrnsxRXjibSBwD_xcv8jF2V6ybTAeEXdHhIEmoDvG5hwGNaS9SQBiVHJiIKFfoh6gkl0ac2U1rXwf6S62NV3WuFr7CCtuMgW9XJAtAQOh4aLhssQejR1hBzB1Y60rdos82pZYCd9l9Jb7S355heSvpWEOd0dSsnwwoCRsRcNy5qwKDoP1nTB7O5baSCX5MoPPEEtf-MDyk_NgDx_2SDQzsrH3MXkxEm42nQTn5x94EyQBPHwB6dO-odxDkkcJZKMkdAuQxtRClTWw">
<div class="absolute top-2 right-2 bg-primary/90 text-white text-[10px] px-2 py-1 rounded-full font-technical-label">4.9 ★</div>
</div>
<h4 class="font-headline-md text-[18px] leading-tight mb-1">The Kinetic Brew</h4>
<p class="text-muted-zinc text-body-md mb-2">Modernism &amp; Espresso</p>
<div class="flex items-center justify-between">
<span class="text-primary font-technical-label text-[12px]">2.4km away</span>
<div class="flex -space-x-2">
<div class="w-6 h-6 rounded-full border-2 border-surface-pure overflow-hidden bg-muted-zinc"></div>
<div class="w-6 h-6 rounded-full border-2 border-surface-pure overflow-hidden bg-primary"></div>
<div class="flex items-center justify-center w-6 h-6 rounded-full border-2 border-surface-pure bg-surface-variant text-[8px] font-bold">+12</div>
</div>
</div>
</div>
<!-- Trending Card 2 -->
<div class="glass-panel border border-soft-border rounded-xl p-4 whisper-shadow stagger-reveal cursor-pointer group" style="animation-delay: 0.4s;">
<div class="relative h-32 rounded-lg overflow-hidden mb-3">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A futuristic urban park with geometric concrete structures and glowing integrated path lights. Lush greenery and modern white benches create a clean, minimalist outdoor space designed for exploration and relaxation, under a twilight sky with soft purple and blue tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmBP5y60d-J0Ut-V3ZzAD_tiHYstx35gf9XSGk5_8_V0HJTmDR-8eTvFD7cExJl90HPxn6JNirDA3HbiJVNKzQT_yhq3VqcPe0hdhSxMPZf7EzwiMQqvb6L-zHLVakppcv4vRrwPNLIVp59ANeQv5uREeaWJxCaTW88yBFMAx28kMP999TM95aXrR862_2nKmaAsOy-zNTYYSPEXf0TXKxgXs0hbkhmcFSBOrnyH_D6cDYQcBQ7MvCs0Bqx_BIMfwmobnJThs4FJQ">
<div class="absolute top-2 right-2 bg-primary/90 text-white text-[10px] px-2 py-1 rounded-full font-technical-label">4.7 ★</div>
</div>
<h4 class="font-headline-md text-[18px] leading-tight mb-1">Vertex Plaza</h4>
<p class="text-muted-zinc text-body-md mb-2">Public Arts &amp; Tech</p>
<div class="flex items-center justify-between">
<span class="text-primary font-technical-label text-[12px]">0.8km away</span>
<div class="flex -space-x-2">
<div class="w-6 h-6 rounded-full border-2 border-surface-pure bg-secondary"></div>
<div class="w-6 h-6 rounded-full border-2 border-surface-pure bg-tertiary"></div>
</div>
</div>
</div>
</div>
</aside>
<!-- Place Detail Screen (Slide-up Sheet) -->
<div class="fixed inset-x-0 bottom-0 md:inset-x-auto md:right-margin-page md:top-24 md:bottom-24 md:w-96 z-[60] bg-surface-pure rounded-t-[32px] md:rounded-[32px] shadow-2xl detail-sheet translate-y-full flex flex-col border border-soft-border overflow-hidden" id="detailSheet">
<!-- Drag Handle -->
<div class="w-full flex justify-center py-4 md:hidden">
<div class="w-12 h-1.5 bg-surface-variant rounded-full cursor-pointer" onclick="toggleDetail()"></div>
</div>
<!-- Content Container -->
<div class="flex-1 overflow-y-auto px-6 pb-4 md:pb-6">
<!-- Header Actions -->
<div class="flex justify-between items-center mb-6 pt-2 md:pt-4">
<button class="p-2 rounded-full bg-surface-container hover:bg-surface-variant transition-colors" onclick="toggleDetail()">
<span class="material-symbols-outlined">close</span>
</button>
<div class="flex gap-2">
<button class="p-2 rounded-full bg-surface-container hover:bg-surface-variant transition-colors">
<span class="material-symbols-outlined">share</span>
</button>
<button class="p-2 rounded-full bg-surface-container hover:bg-surface-variant transition-colors">
<span class="material-symbols-outlined">bookmark</span>
</button>
</div>
</div>
<!-- Venue Info -->
<div class="mb-6">
<div class="flex items-baseline gap-2 mb-1">
<h2 class="text-headline-lg font-headline-lg">The Kinetic Brew</h2>
<span class="text-primary font-technical-label">Verified</span>
</div>
<div class="flex items-center gap-3 text-muted-zinc mb-4">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-[16px] text-tertiary">star</span>
<span class="font-bold text-on-surface">4.9</span>
<span class="">(1,240 reviews)</span>
</div>
<span class="w-1 h-1 bg-muted-zinc rounded-full"></span>
<span class="">Cafe &amp; Workspace</span>
</div>
<!-- Photos Grid -->
<div class="grid grid-cols-2 gap-2 mb-6">
<div class="aspect-square rounded-xl overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Close-up of an expertly crafted latte art in a white ceramic cup. The setting is a minimalist cafe table with a soft bokeh background of warm wood tones and professional coffee-making equipment, emphasizing a high-end gourmet experience." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLJiefIgOyKNhc5CG_gcZhu7FaUIDcm40bTvN-hKvZX94lDibYmBeKGVTYRx2XhfYoQlF2O2Hd1Juh9O2IlywUSDxpQg1Tvenp8mchyxVB_L4IU_iEb9rSrWdwC-aORDq12TbVA_bLZzT3Psk1sQpZxYt58H9x_-wQ8c4VGR2tdT61Kmwijl-loCz3R0WLUzBybWdQcfAVu6HGrJ59FRqBNg0vXXGB7ba88bzUZrUp-eGoKxUCWM0881dLDyin_n81809IXOtoj_M">
</div>
<div class="grid grid-rows-2 gap-2">
<div class="rounded-xl overflow-hidden">
<img class="w-full h-full object-cover" data-alt="A collection of artisan pastries arranged on a sleek marble counter inside a contemporary bakery. The lighting is bright and clean, reflecting a high-quality food presentation in a modern urban environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgyqdp7aXgWsQINFPPRRU1wUElmL6on_8AJIT9bEiPm3bipgb2wZeApd0eeft4lnw8b0sTUAbKbWJ5kRBb5bO3odfEQ6E9nkC1sncjU9c9D0Rg_GkDtLOjD-JrXgxjP0DkBFSfzqQsTHvWhHspBCxBs9UDtKQNzfq-S5RjLqGdbZkqvpWWObI_8sxawQHglxJVTHQBIheOoS9O1H1Tsk2U2ceGC4awXyYnh6E2hGeCTKAN79RYEnSzygUA_-aYj-wdjp0Qp3aMso4">
</div>
<div class="rounded-xl overflow-hidden relative">
<img class="w-full h-full object-cover" data-alt="A group of young professionals collaborating on laptops in a stylish, open-concept co-working space within a cafe. The interior features industrial metal accents, glass partitions, and a modern aesthetic focused on productivity and social interaction." src="https://lh3.googleusercontent.com/aida-public/AB6AXuARgKiUxPNXwgIpVhbG7mCfUrBZBD3ech4wQgtOMysfXcopoWFCiUYJpnuZ38rP_IM6Hmgqk8JLrNj-Fie8z6JimEiDBxgXE5Kn3O3VtLqAwle4fVQ-vulWs2NV613asTqL43p73vLiMZUCRv3tquTcP3iWtk7bkyWMjQ9ylHeGWZJjcb06F96LzlPc8pYDx7No35lzQsjXyS08ptBeLqpRnybVeErymlzkjMdSi2HywPLHCIY1WA2HYOsd7oWooKb6Wm4HOS-e0IA">
<div class="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold">+18</div>
</div>
</div>
</div>
<!-- Action Button -->
<button class="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-lg whisper-shadow flex items-center justify-center gap-2 active:scale-[0.98] transition-all mb-8">
<span class="material-symbols-outlined">where_to_vote</span>
                        Check-in to Venue
                    </button>
<!-- Leaderboard -->
<div class="space-y-4">
<div class="flex justify-between items-center">
<h3 class="font-headline-md text-[20px]">Local Legends</h3>
<span class="text-primary font-technical-label cursor-pointer">View All</span>
</div>
<div class="space-y-2">
<!-- Rank 1 -->
<div class="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low border border-soft-border">
<div class="flex-shrink-0 w-8 h-8 flex items-center justify-center font-technical-label text-tertiary">#1</div>
<div class="w-10 h-10 rounded-full bg-secondary overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Portrait of a young male creative with a friendly expression, set against a blurred urban background. The lighting is soft and natural, emphasizing a high-definition, professional social media profile style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpi2DH_YkmLERc2GoG-WO4bj4bBFlacnxdeNCrJ0F3dy3FMMDH55VbtMcSWK4TVOW4cRUsH4E9cGwhtnVdhy_EEjtmtFuv6ofaQYiXqUHsfQldHl03KoMAn4NkOPzAq7mtpSzNIXpel-YHY22IS5HHBJpq0U4BZlboXxYgCtROqw6ROjn99B_DRhjGI21tw7YO8jW_PWYj2OpgVtju94GtceYuW2-M4_rfA2zGB2xtgSlbJf4Asx-BtvopjSbS2Ymmp64JJU7e-5I">
</div>
<div class="flex-1">
<div class="font-bold text-on-surface">Marcus Chen</div>
<div class="text-[12px] text-muted-zinc">84 Check-ins</div>
</div>
<div class="text-primary">
<span class="material-symbols-outlined fill-1" style="font-variation-settings: 'FILL' 1;">workspace_premium</span>
</div>
</div>
<!-- Rank 2 -->
<div class="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-lowest transition-colors border border-transparent">
<div class="flex-shrink-0 w-8 h-8 flex items-center justify-center font-technical-label text-muted-zinc">#2</div>
<div class="w-10 h-10 rounded-full bg-tertiary overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Studio portrait of a vibrant young woman with a joyful smile. The background is a clean, neutral pastel, giving the image a modern and professional aesthetic suitable for a social application avatar." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtQi7h6pAmy7h60uNoITWTpC7qvuGu9692ygT5_uhLHHueaMYzfzEgi2OO2GJTAtVV9M96Vnf5t_ynLXwrF-vifx_b2SDbhRNJ6XZbM1txip5ItGyw3UMp3r-OEsRE6S_dPCjci_Wt8Fj7hPx17DAYp9RTAX4Xve72Db-IKowVhlWT5TeSAaPoF_rqW61QZfG_noisFoQITtNV6QMcYVN1CTrnJOY8qbomj8oXk-HrClotbTUxIDh2C_uPHUqoqe8HS88orVNYYSU">
</div>
<div class="flex-1">
<div class="font-bold text-on-surface">Sarah Bloom</div>
<div class="text-[12px] text-muted-zinc">62 Check-ins</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
<!-- Bottom Navigation Bar (Mobile only) -->
<footer class="md:hidden fixed bottom-0 w-full z-50 bg-surface/90 backdrop-blur-lg border-t border-soft-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-xl">
<nav class="flex justify-around items-center h-20 px-4 pb-safe-area w-full">
<div class="flex flex-col items-center justify-center text-muted-zinc px-3 py-1 hover:text-primary transition-all">
<span class="material-symbols-outlined">dynamic_feed</span>
<span class="text-technical-label font-technical-label">Feed</span>
</div>
<div class="flex flex-col items-center justify-center text-primary bg-primary-container/20 rounded-xl px-3 py-1 scale-95 transition-all duration-300 ease-out">
<span class="material-symbols-outlined">explore</span>
<span class="text-technical-label font-technical-label">Explore</span>
</div>
<div class="flex flex-col items-center justify-center -mt-8">
  <button class="w-14 h-14 bg-[#6366F1] text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform border-4 border-surface-pure">
    <span class="material-symbols-outlined text-[32px]">add</span>
  </button>
  <span class="text-technical-label font-technical-label text-muted-zinc mt-1">Post</span>
</div>
<div class="flex flex-col items-center justify-center text-muted-zinc px-3 py-1 hover:text-primary transition-all">
<span class="material-symbols-outlined">notifications</span>
<span class="text-technical-label font-technical-label">Alerts</span>
</div>
<div class="flex flex-col items-center justify-center text-muted-zinc px-3 py-1 hover:text-primary transition-all">
<span class="material-symbols-outlined">person</span>
<span class="text-technical-label font-technical-label">Profile</span>
</div>
</nav>
</footer>
<!-- Overlay for sheet on desktop -->
<div class="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 hidden opacity-0 transition-opacity duration-300" id="overlay" onclick="toggleDetail()"></div>
<script>
        function toggleDetail() {
            const sheet = document.getElementById('detailSheet');
            const overlay = document.getElementById('overlay');
            
            if (sheet.classList.contains('translate-y-full')) {
                sheet.classList.remove('translate-y-full');
                sheet.classList.add('translate-y-0');
                if (window.innerWidth >= 1024) {
                    overlay.classList.remove('hidden');
                    setTimeout(() => overlay.classList.add('opacity-100'), 10);
                }
            } else {
                sheet.classList.add('translate-y-full');
                sheet.classList.remove('translate-y-0');
                overlay.classList.remove('opacity-100');
                setTimeout(() => overlay.classList.add('hidden'), 300);
            }
        }

        // Initialize animations slightly staggered
        document.addEventListener('DOMContentLoaded', () => {
            const items = document.querySelectorAll('.stagger-reveal');
            items.forEach((item, index) => {
                item.style.animationDelay = \`\${index * 0.1}s\`;
            });
        });
    </script>


</body></html>`;

export default function PlacesCheckin() {
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
