import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WebView } from 'react-native-webview';

const htmlContent = `<!DOCTYPE html><html class="light" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0, viewport-fit=cover" name="viewport">
<title>GeoConnect | Nearby People &amp; Events</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;family=JetBrains+Mono:wght@500&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@100..900&amp;display=swap" rel="stylesheet">
<style>
        :root {
            --satosh-font: 'Plus Jakarta Sans', sans-serif;
        }
        body {
            font-family: var(--satosh-font);
            -webkit-font-smoothing: antialiased;
            background-color: #fcf8ff;
        }
        .glass-panel {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }
        .whisper-shadow {
            box-shadow: 0 10px 30px -5px rgba(70, 72, 212, 0.08);
        }
        .stagger-card {
            animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            opacity: 0;
        }
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .map-canvas {
            mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
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
              "fontFamily": {
                      "technical-label": ["JetBrains Mono"],
                      "headline-lg": ["Plus Jakarta Sans"],
                      "headline-lg-mobile": ["Plus Jakarta Sans"],
                      "body-lg": ["Plus Jakarta Sans"],
                      "headline-md": ["Plus Jakarta Sans"],
                      "body-md": ["Plus Jakarta Sans"]
              },
            }
          }
        }
      </script>
</head>
<body class="bg-background text-on-surface">
<!-- Top Navigation Bar -->
<header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm flex justify-between items-center px-margin-page h-16 w-full">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary" data-icon="explore">explore</span>
<span class="text-headline-md font-headline-md text-primary tracking-tight">GeoConnect</span>
</div>
<div class="flex items-center gap-4">
<button class="p-2 rounded-full hover:bg-surface-variant/50 transition-colors">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="search">search</span>
</button>
<div class="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center">
<img alt="User Profile" class="w-full h-full rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ5IX1E1T2p8zwhM46hCeXIxJtVrIVc2FdEBB8wG-o4tI1whWxo6cAejrNgT_6GhMIK6AFOx6pM0UsuXZREPfz6_Gf4IsxgtJIXz6Iw2CXgUE-d141yYLjQZ1ii8bZV0kfmFUqkP8r8VgYu1W-AW5d3VcXMJ7w0cnydpxY6bA8r_-nF5fJH3Z9N4P65aq7e3yvVJryPDUdFTBN152SAlxxeOnCD3NsqOz633rgOsPhMNonQ4jfy4deKxW7pQCCqYVB9OyNfbSAjDY">
</div>
</div>
</header>
<main class="pt-16 pb-4 min-h-screen">
<!-- Background Map Canvas (Visual Element) -->
<div class="fixed inset-0 z-0 opacity-40 map-canvas pointer-events-none">
<img class="w-full h-full object-cover" data-alt="A stylized aerial satellite view of a modern urban neighborhood map with clean minimalist lines and a soft color palette of grays and blues. The lighting is bright and airy, reflecting a high-end contemporary UI aesthetic. The map features subtle highlights on parks and water bodies, creating a sense of calm geographical exploration. No text or icons are present on the raw map image." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmvesx5dGCBLPeNfRUfuNRr4ogRE_Ko26tuSHCMpT-of65vCohzni9-jiO4frH-yFSGNV-qs4nPQebMYupgEYJlz2JQs4lg9euIiPp4UzyP0bG3kp5j_xYKeUhBkLbH4UZOsmefGQZQsmMyelfc7jBZD7epPnNP0lLdUUyPbN0_t_6o855tlTYV2RbUvVr_ZDQ6sIlzl93Zmw4pIUiNKede9pncprxEv_aGR5qyPlenHaqTnhQKn3TNdjvsYEXkxNwmG6MVYvVMYs">
</div>
<div class="relative z-10 px-margin-page py-6 space-y-8">
<!-- Section: Nearby People -->
<section class="space-y-4">
<div class="flex justify-between items-end">
<div>
<h2 class="text-headline-md font-headline-md text-on-surface">Nearby People</h2>
<p class="text-body-md font-body-md text-muted-zinc">Connect with explorers around you</p>
</div>
<button class="text-primary text-technical-label font-technical-label flex items-center gap-1 hover:underline">
                        SEE ALL <span class="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
<div class="flex gap-4 overflow-x-auto hide-scrollbar -mx-margin-page px-margin-page pb-4">
<!-- Person Card 1 -->
<div class="flex-shrink-0 w-32 group">
<div class="relative mb-2">
<div class="w-24 h-24 mx-auto rounded-full p-1 border-2 border-primary ring-4 ring-primary/10 overflow-hidden bg-surface-pure group-hover:scale-105 transition-transform duration-300">
<img alt="Sarah" class="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOHEgRqZGjQtepe1f0WCZPbOQle2EMRdLB4cejGlHrAv8H1a3xV3eX9y5Dk02s686g1O7NLhu0uEWSj4RNsj5n071aQhw7_muZjcDhM_htFknVR-kDrynCXc3R7hkHak54cTHBbi9VSZnP61s6kOip9sxZLSN4qo0mqIswX8m2Sb3AvOVLqy70kx-8U9eHNlz3lbFJpeYZ5hFi4HaFzbgDBd5y9omVND62PyW5yHV9UV0a-WZRzv3zHmRlVJL4CliqtKiAPNTXqlU">
</div>
<div class="absolute bottom-1 right-5 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-surface shadow-md">
                                0.2m
                            </div>
<div class="absolute top-1 right-5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
</div>
<div class="text-center">
<p class="font-headline-md text-sm text-on-surface">Sarah J.</p>
<p class="text-technical-label text-muted-zinc text-[10px]">Digital Nomad</p>
</div>
</div>
<!-- Person Card 2 -->
<div class="flex-shrink-0 w-32 group">
<div class="relative mb-2">
<div class="w-24 h-24 mx-auto rounded-full p-1 border-2 border-outline-variant overflow-hidden bg-surface-pure group-hover:scale-105 transition-transform duration-300">
<img alt="Mike" class="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5linraAP8zKULztxnj5s8XCSKVkqy0j97_7Qc5nWn0gFFdzQMtKccdz8tnjvnzFCEqLVpw8MP10KfcGBXeCUyS5lGbgmMUQ8IU6JV2ONepUSRqYUECnis_UgBuplIwxP4w4Rev4raCKv4eR22WxH4ZoeXwIZmyhNn_tt7mZqrhS4Cj2nca46uPWf792pF0aYVPou2-PG_M-gdk5VuzqrEINn89A9CgMumilqLD9Q2sVqDRwQSTpapZEEVi2KLIbpJhxQMVda7a_Y">
</div>
<div class="absolute bottom-1 right-5 bg-surface-container-highest text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-surface shadow-md">
                                0.8m
                            </div>
</div>
<div class="text-center">
<p class="font-headline-md text-sm text-on-surface">Mike Chen</p>
<p class="text-technical-label text-muted-zinc text-[10px]">Photographer</p>
</div>
</div>
<!-- Person Card 3 -->
<div class="flex-shrink-0 w-32 group">
<div class="relative mb-2">
<div class="w-24 h-24 mx-auto rounded-full p-1 border-2 border-outline-variant overflow-hidden bg-surface-pure group-hover:scale-105 transition-transform duration-300">
<img alt="Elena" class="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaVHWd8T2vpSOobak_t4ZjXMTr1TfnB9RTl4AP8M8Gn4hOhgNaLB7BZvr8A_YxQK7LMygpEn0fTERiL-ZSJVKpq_utyrArk4jBKGSPsyZqgLHQ0hWmNC1CgZ0pX5-ami_2IOOumythvCeDbJXJMS7c8aQJnoz7kTwGXuFbsFJDe1J1KMOZTnF5n_9byIUCsvA6BihuL56FIojXnephxfibUNq6MQwtpEW3EVCkS-0OYWbfdkmSiiD5Z6zVzDruCi2o7MrLsaRtNbc">
</div>
<div class="absolute bottom-1 right-5 bg-surface-container-highest text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-surface shadow-md">
                                1.5m
                            </div>
</div>
<div class="text-center">
<p class="font-headline-md text-sm text-on-surface">Elena R.</p>
<p class="text-technical-label text-muted-zinc text-[10px]">UI Designer</p>
</div>
</div>
<!-- Person Card 4 -->
<div class="flex-shrink-0 w-32 group">
<div class="relative mb-2">
<div class="w-24 h-24 mx-auto rounded-full p-1 border-2 border-outline-variant overflow-hidden bg-surface-pure group-hover:scale-105 transition-transform duration-300">
<img alt="Jordan" class="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBj4kLyfo2XH3sg6ZReY7_ZDxyyAw5Sce5FpagiSM358wKEL56x749QOQ0Wo0cFsjCF9VXFNpLEthmxpBjLjN6pugwEK3eMHEPp7ecgW0js2IL7Wx-1iI2Dz4BSpDyvzhlPiSpXKZaj83PnIufJxa3yyuJv5hqPGjvSHb3blD42Lzp3W-AgGHQm9utDpTVid2PTI-Mq00vRIZV2YFWlM-lW9HRMo44ubkEGaTiH5YhWxaZsCnAfAITs3zYHAtpP0uxMugJNdKiW3yw">
</div>
<div class="absolute bottom-1 right-5 bg-surface-container-highest text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-surface shadow-md">
                                2.1m
                            </div>
</div>
<div class="text-center">
<p class="font-headline-md text-sm text-on-surface">Jordan L.</p>
<p class="text-technical-label text-muted-zinc text-[10px]">Coffee Nerd</p>
</div>
</div>
<!-- Person Card 5 -->
<div class="flex-shrink-0 w-32 group">
<div class="relative mb-2">
<div class="w-24 h-24 mx-auto rounded-full p-1 border-2 border-outline-variant overflow-hidden bg-surface-pure group-hover:scale-105 transition-transform duration-300">
<img alt="Sophie" class="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6k4FsUE1-FWIkPhqB1OWHjJimS6AGc1sxbYBrN6MBplKqoxKBL_BUegej4_NqPc6ejrke8_ZkcCXthvgI-gaH2JY7UixWtQQkreO8Jltjv25WcBawGKOgHmIhIKg93upCI4wM3qN5VgGHmQCG6bpPsNCNjPi_CqbuqeUlJEychlUvKEmKWnNHK9PbFyKAD76gGPUb3IkfYpMQAp65LdHJw-ckku2SmqmBo7et2-6OlsoKNbKhVGFLCZvz4nN3biW64068TEcS5dk">
</div>
<div class="absolute bottom-1 right-5 bg-surface-container-highest text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-surface shadow-md">
                                3.4m
                            </div>
</div>
<div class="text-center">
<p class="font-headline-md text-sm text-on-surface">Sophie K.</p>
<p class="text-technical-label text-muted-zinc text-[10px]">Architect</p>
</div>
</div>
</div>
</section>
<!-- Section: Public Events -->
<section class="space-y-4">
<div class="flex justify-between items-center">
<h2 class="text-headline-md font-headline-md text-on-surface">Public Events</h2>
<button class="p-2 bg-surface-pure rounded-lg whisper-shadow border border-soft-border">
<span class="material-symbols-outlined text-primary" data-icon="tune">tune</span>
</button>
</div>
<div class="grid gap-6">
<!-- Event Card 1 -->
<div class="stagger-card bg-surface-pure rounded-2xl overflow-hidden whisper-shadow border border-soft-border group" style="animation-delay: 0.1s;">
<div class="relative h-48 overflow-hidden">
<img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="A vibrant outdoor evening event in a modern city plaza with festive string lighting and people gathered around a central stage. The atmosphere is energetic and social, with deep indigo and purple night sky tones contrasted by warm golden lights. The style is crisp and cinematic, focusing on the joy of a public gathering in a high-tech urban environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuARrweiqYzDvTPlvNOWUy4NmE6HEEU8FD4gJlOxrJgNW9pEObyivjGM6PzbEzhGTMNXakp01SMAU-lM7hTQhLcdTu9TISoHWX3NYz0v3BwP9NShd3p6kKN2q-rGh9E6OAZS3m9a9fHgez7V7yIHj7VxpATnXNMHaOEJPbF5cs1JzJaf44GBTLKgS62lyCyUqiJh81DovIdjFwB66PYH3taeXHcz2z-wv-urIdYZHnQJh9SNBA8YHhLxIf4bDYn0zE9zCLwCEuGpNFo">
<div class="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 rounded-lg text-technical-label font-technical-label shadow-lg">
                                AUG 12
                            </div>
<div class="absolute bottom-4 right-4 bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1">
<span class="material-symbols-outlined text-sm" data-icon="group">group</span> 24 Going
                            </div>
</div>
<div class="p-5 space-y-3">
<div class="flex justify-between items-start">
<div>
<h3 class="text-headline-md text-lg text-on-surface leading-tight">Urban Photography Workshop</h3>
<p class="text-body-md text-muted-zinc flex items-center gap-1 mt-1">
<span class="material-symbols-outlined text-xs" data-icon="location_on">location_on</span> Central District Square
                                    </p>
</div>
</div>
<div class="flex gap-3 pt-2">
<button class="flex-1 bg-primary text-on-primary py-2.5 rounded-xl font-bold text-sm hover:bg-primary-container transition-all active:-translate-y-px">
                                    Going
                                </button>
<button class="flex-1 border border-primary text-primary py-2.5 rounded-xl font-bold text-sm hover:bg-primary/5 transition-all">
                                    Interested
                                </button>
</div>
</div>
</div>
<!-- Event Card 2 -->
<div class="stagger-card bg-surface-pure rounded-2xl overflow-hidden whisper-shadow border border-soft-border group" style="animation-delay: 0.2s;">
<div class="relative h-48 overflow-hidden">
<img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="A clean, minimalist high-tech workspace interior with floor-to-ceiling windows showing a futuristic city skyline at dusk. Professional people are engaged in a technology meetup, illuminated by the soft glow of monitors and ambient purple LED lighting. The image captures a sophisticated, modern professional atmosphere with a focus on connection and innovation." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTet_v_nvxcXvju1ZzO5PzrccKqsCZ94vRpX6n6LTXlqX73vXcmrgz3dq6sPgBYPYRv5x2eUNYD2i9qYubkF87LV2e1_Aus2BnWqwFH-rWAVzBNAe16UOHCdVuCBbjL8EYykqwi05PIwHHl-Ejh7xtTCcrUkmil_VHV9NfBXBcEfqK-s2umNxcYGK1wEzl_OfKooFbrjKwv63h1bMVJF1b8yBeO9yEQAM9U3EEu2lQ_fTz8ZjOV6_mL4slA2Eg1IdW2Yah89IqQg8">
<div class="absolute top-4 left-4 bg-surface-container-highest text-on-surface px-3 py-1 rounded-lg text-technical-label font-technical-label shadow-lg">
                                AUG 15
                            </div>
<div class="absolute bottom-4 right-4 bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1">
<span class="material-symbols-outlined text-sm" data-icon="local_activity">local_activity</span> 12 Slots Left
                            </div>
</div>
<div class="p-5 space-y-3">
<div class="flex justify-between items-start">
<div>
<h3 class="text-headline-md text-lg text-on-surface leading-tight">Tech &amp; Chill: Networking Mixer</h3>
<p class="text-body-md text-muted-zinc flex items-center gap-1 mt-1">
<span class="material-symbols-outlined text-xs" data-icon="location_on">location_on</span> The Glass House Lounge
                                    </p>
</div>
</div>
<div class="flex gap-3 pt-2">
<button class="flex-1 bg-primary text-on-primary py-2.5 rounded-xl font-bold text-sm hover:bg-primary-container transition-all active:-translate-y-px">
                                    Going
                                </button>
<button class="flex-1 border border-primary text-primary py-2.5 rounded-xl font-bold text-sm hover:bg-primary/5 transition-all">
                                    Interested
                                </button>
</div>
</div>
</div>
<!-- Event Card 3 -->
<div class="stagger-card bg-surface-pure rounded-2xl overflow-hidden whisper-shadow border border-soft-border group" style="animation-delay: 0.3s;">
<div class="relative h-48 overflow-hidden">
<img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="A cozy, inviting community garden at sunset with lush greenery and small wooden tables. People are sitting in groups, participating in a casual community talk. The lighting is warm and natural, creating an organic and welcoming feel. The visual style balances modern urban living with nature-centric social activities." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc_SFUOpsuIvHKspYo6tdiLmW-wl6qZFOhFNU-Ialm8VUa5bIjc9EeF4HepPMoKIM0sstwSiyhfhIIhZwZ7OccoQhwDkmdjncax1mRneb_rOkqqdNyJf_VZegJhNuKvK5sA2OhQnQRVDYBEMYbS1IgC7mgTFfLA2ejMBSz4OSyO3jFgskbwOzRTkgPQqCNUXYqqkyFf9SnNhIWUIl7R2tb11yNOIrsjKnkAwC3p_y0hB4spAvA6mgS_hrJkHwKHVy96DjX9xVDfEE">
<div class="absolute top-4 left-4 bg-surface-container-highest text-on-surface px-3 py-1 rounded-lg text-technical-label font-technical-label shadow-lg">
                                AUG 18
                            </div>
</div>
<div class="p-5 space-y-3">
<div class="flex justify-between items-start">
<div>
<h3 class="text-headline-md text-lg text-on-surface leading-tight">Community Garden Meetup</h3>
<p class="text-body-md text-muted-zinc flex items-center gap-1 mt-1">
<span class="material-symbols-outlined text-xs" data-icon="location_on">location_on</span> Green Trails Park
                                    </p>
</div>
</div>
<div class="flex gap-3 pt-2">
<button class="flex-1 bg-primary text-on-primary py-2.5 rounded-xl font-bold text-sm hover:bg-primary-container transition-all active:-translate-y-px">
                                    Going
                                </button>
<button class="flex-1 border border-primary text-primary py-2.5 rounded-xl font-bold text-sm hover:bg-primary/5 transition-all">
                                    Interested
                                </button>
</div>
</div>
</div>
</div>
</section>
</div>
</main>
<!-- FAB: Post Something -->

<!-- Bottom Navigation Bar -->

<script>
        // Micro-interactions and staggering reveal logic
        document.addEventListener('DOMContentLoaded', () => {
            const cards = document.querySelectorAll('.stagger-card');
            cards.forEach((card, index) => {
                card.style.animationDelay = \`\${(index + 1) * 0.1}s\`;
            });

            // Smooth parallax effect for map background
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const map = document.querySelector('.map-canvas');
                if (map) {
                    map.style.transform = \`translateY(\${scrolled * 0.2}px)\`;
                }
            });
        });
    </script>


</body></html>`;

export default function NearbyEvents() {
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
