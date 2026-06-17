import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WebView } from 'react-native-webview';

const htmlContent = `<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Sasha K. | GeoConnect Profile</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
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
        body {
            background-color: #fcf8ff;
            -webkit-tap-highlight-color: transparent;
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }
        .whisper-shadow {
            box-shadow: 0 10px 30px -5px rgba(70, 72, 212, 0.08);
        }
        .stagger-item {
            opacity: 0;
            transform: translateY(10px);
            animation: fadeInScale 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes fadeInScale {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .marker-pulse {
            position: relative;
        }
        .marker-pulse::after {
            content: '';
            position: absolute;
            inset: -4px;
            border: 2px solid #4648d4;
            border-radius: 9999px;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(1.4); opacity: 0; }
        }
    </style>

  </head>
<body class="font-body-md text-on-surface">
<!-- Top Navigation Bar -->
<header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm flex justify-between items-center px-margin-page h-16 w-full">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary" data-icon="explore">explore</span>
<h1 class="text-headline-md font-headline-md text-primary tracking-tight">GeoConnect</h1>
</div>
<div class="flex items-center gap-4">
<button class="material-symbols-outlined p-2 rounded-full hover:bg-surface-variant/50 transition-colors" data-icon="search">search</button>
<button class="material-symbols-outlined p-2 rounded-full hover:bg-surface-variant/50 transition-colors" data-icon="settings" onclick="window.ReactNativeWebView.postMessage('openSettings')">settings</button>
</div>
</header>
<main class="pt-20 pb-4 max-w-4xl mx-auto px-margin-page">
<!-- Profile Header Section -->
<section class="stagger-item mb-8">
<div class="flex flex-col md:flex-row items-center md:items-end gap-6">
<div class="relative">
<div class="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white whisper-shadow marker-pulse">
<img alt="Sasha K." class="w-full h-full object-cover" data-alt="A professional and warm portrait of a young woman with a friendly expression, captured in soft, natural golden hour lighting. She is positioned against a blurry outdoor backdrop of majestic red rock canyons, reflecting the GeoConnect brand's adventurous spirit. The aesthetic is clean, high-contrast, and modern, with a focus on her expressive eyes and the vibrant, sun-kissed atmosphere." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8lI4vakjo6rO7TNQ0mlKdbt_CpOMsAmZyLiEyXTjwnh9IfEmc7ZVe6pSG9ic_FAy5I0sFK_45ygucvpVV9R3X8zIA63tWYb4-_bUHmOCaOeHiZl82JSWbKpzE1nn1OWZTtQFdc2yc2IGEVLzCCrGgxltoh4jmjADp5buV70wg3SC77ADhHn7udO3-pE6ggh5I4DK5miKcKyXhAFOdaTaLVvNpuAPLszzf3c07yqAEnY_bMqXj1AU0SRVaTRms7VfzBLAgAJcCS6A"/>
</div>
</div>
<div class="flex-1 text-center md:text-left">
<h2 class="text-headline-lg-mobile md:text-headline-lg font-headline-lg mb-1">Sasha K.</h2>
<div class="flex items-center justify-center md:justify-start gap-1 text-muted-zinc mb-4">
<span class="material-symbols-outlined text-[18px]" data-icon="location_on">location_on</span>
<span class="font-body-md">Zion National Park, UT</span>
</div>
<div class="flex flex-wrap justify-center md:justify-start gap-8 mb-6">
<div class="flex flex-col">
<span class="font-bold text-headline-md leading-none">1.2k</span>
<span class="text-technical-label font-technical-label text-muted-zinc uppercase tracking-wider">Followers</span>
</div>
<div class="flex flex-col">
<span class="font-bold text-headline-md leading-none">842</span>
<span class="text-technical-label font-technical-label text-muted-zinc uppercase tracking-wider">Following</span>
</div>
<div class="flex flex-col">
<span class="font-bold text-headline-md leading-none">42</span>
<span class="text-technical-label font-technical-label text-muted-zinc uppercase tracking-wider">Posts</span>
</div>
</div>
</div>
<div class="flex gap-3 w-full md:w-auto">
<button class="flex-1 md:flex-none px-6 py-2.5 bg-primary text-on-primary rounded-xl font-bold whisper-shadow hover:-translate-y-px transition-transform active:scale-95">
                        Edit Profile
                    </button>
<button class="px-3 py-2.5 bg-surface-container text-on-surface rounded-xl hover:bg-surface-variant transition-colors active:scale-95">
<span class="material-symbols-outlined align-middle" data-icon="share">share</span>
</button>
</div>
</div>
</section>
<!-- Profile Bio/Tabs Area -->
<section class="stagger-item" style="animation-delay: 0.1s">
<div class="flex border-b border-soft-border mb-6">
<button class="px-6 py-3 border-b-2 border-primary text-primary font-bold transition-all">Posts</button>
<button class="px-6 py-3 text-muted-zinc hover:text-on-surface transition-all">Maps</button>
<button class="px-6 py-3 text-muted-zinc hover:text-on-surface transition-all">Saved</button>
</div>
<!-- Bento Grid of Posts -->
<div class="grid grid-cols-2 md:grid-cols-3 gap-3">
<!-- Post 1 (Large) -->
<div class="col-span-2 row-span-2 relative group overflow-hidden rounded-2xl aspect-square md:aspect-auto md:h-full">
<img alt="Scenic View" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="A breathtaking wide-angle shot of a winding river at the bottom of a deep canyon with massive red sandstone walls under a clear blue sky. The lighting is dramatic, with deep shadows and brilliant highlights, creating a powerful sense of depth and scale. The overall style is professional landscape photography that feels adventurous and expansive, perfectly aligned with a high-end exploration app." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlMcgwGQ416AXT04s2yjzNUlLmDb5wzd8du1sicFXqUsAHOjldoQ78QEqVk7PmPtdwT1RGl1N2-t7G2YuNRSCRwyqrFUmkjRqMNE4Jp_aFYI1aa09lun58C9NMAuNzveHcAL-OGksPoQ4AdvpQV6brUoOZZL2n4K-pStjP3R5DyAsO4sIjtvT3rNOyyEiwFqK0RYG8nHl-Rwg94tnxvtKdBxMq5n4nNivqDpgUKRS46FqHJ0wNejocnVAgCxg8Ft4fcsFwzFMdKKY"/>
<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
<div class="text-white flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]" data-icon="favorite" data-weight="fill">favorite</span>
<span class="font-bold">2.4k</span>
</div>
</div>
</div>
<!-- Post 2 -->
<div class="relative group overflow-hidden rounded-2xl aspect-square">
<img alt="Mountain Peak" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="A vertical composition featuring jagged mountain peaks partially shrouded in soft, swirling white clouds. The early morning light casts a cool, ethereal blue and grey tone over the landscape. This image captures a serene and high-altitude atmosphere, maintaining the clean and focused aesthetic of the GeoConnect brand through sharp details and minimalist color harmony." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlwL3_gii4fSTHV15H4b-tdyQScpcImb86RVAR11inDAWZM9XEemeEG5mtBP452Cw2Rj5-ykMJFSg-YdA0M6G51nwMnY9dbhqND9NeZ8CORFlIqecBADU1v3azDwCd1nFdXdz8wxhEr3Uin22qDCWgFBzlRJYVDboAJDpDmHkz0B8eQaayOOVrpj284Jn2ddq2smhPh5bjH4IgAVOhghptWT9g5wvFQygU6lHOgj1u2uRqMT7KrQpERcszYHNhuhiwYrsQpiTh7Z0"/>
<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
<div class="text-white flex items-center gap-2">
<span class="material-symbols-outlined text-[16px]" data-icon="favorite" data-weight="fill">favorite</span>
<span class="text-sm font-bold">842</span>
</div>
</div>
</div>
<!-- Post 3 -->
<div class="relative group overflow-hidden rounded-2xl aspect-square">
<img alt="Forest Path" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="An atmospheric shot of a lush, misty forest trail leading through ancient evergreen trees. The lighting is diffused and soft, with rays of sunlight filtering through the dense canopy to create a mystical, layered depth. The color palette is rich in deep greens and earthy browns, embodying a quiet, introspective moment of discovery in a premium nature-focused application." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfNj1W8QhUBTOqKammNI7SUWnIBZ_sNF3pBEK6VsalPPS4knU6ShCcIcdInXjBypuYzmqZ_lcqnlIJvTPbcHMdXXl9sqLekO_tB29uU1eMVRJn7oFBh8YLwYdjO9ETVvoWS8uNa7Nit5EseVS4vMpu4866wtPEEUQ0BB_glCqosqS7ZUPRGknAf9_tjbSzr4CXJDGs1tvIVgba5NPlnG9h3MsU43UognZpCWEWYyS2Elhh4DaAGZjOMhEgGskqfmDPDeH2o0XVLN4"/>
<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
<div class="text-white flex items-center gap-2">
<span class="material-symbols-outlined text-[16px]" data-icon="favorite" data-weight="fill">favorite</span>
<span class="text-sm font-bold">1.1k</span>
</div>
</div>
</div>
<!-- Post 4 -->
<div class="relative group overflow-hidden rounded-2xl aspect-square">
<img alt="Canyon Layers" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="A close-up architectural study of natural rock formations, showcasing the intricate horizontal layers of orange and red sandstone. The sunlight creates sharp geological textures and a vibrant, warm color palette. The shot is composed with an artistic, minimalist perspective, emphasizing patterns and natural geometry in a way that feels modern, technical, and visually striking for a geography-centric UI." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMUrxUgFq6WKhMSjtXZ9J2Rdkjd-hGvHhzHZboSifxa2_klMDzWp3ECHUQbhuHiws7QDbqInIiiOLN6NjNfTItnpFgIe7wDh63-bB7Q80ibJKfTpSByB2K5e7xT5wsqGk0iM3KUmvyi45KvFWdO8lQHizbNNEWkKhP85sq8RP4ME4oD0fM819apVsrrURs0HsMVRLO9qUrR-jOm21vddsWDoDPA1ZEte4GszNBOTd3A9TjwHgoqCRlPqk_6ABBoT-Mg5ACFu8igVs"/>
<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
<div class="text-white flex items-center gap-2">
<span class="material-symbols-outlined text-[16px]" data-icon="favorite" data-weight="fill">favorite</span>
<span class="text-sm font-bold">530</span>
</div>
</div>
</div>
<!-- Post 5 -->
<div class="relative group overflow-hidden rounded-2xl aspect-square">
<img alt="Snowy Peaks" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="A pristine, wide-angle shot of snow-covered mountain ridges against a deep navy twilight sky. A few distant stars are visible, adding to the quiet, majestic evening mood. The image is clean and high-contrast, using a cool-toned palette of whites and deep blues to convey a sense of peaceful exploration and the premium, quiet luxury of the GeoConnect aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnZ88vyJXPpbbcPERHtWS0wtPV9Qd0shEHoBBMKGvHIKAwQHCgCHJRoinka2MkBizHUP12tzAkKjZMaUMnWUuq79gNm_8Gn2MQbGa8fMZs0kwyGQMT0rmUmQB6A9KbDcMflQFlgvK5VGESBM7-1Oj5aNwez7oh9hEU_G9cGC4w9t0aiayjbvLPhsLySyErB_KB-DDLlGlWJC3JPF7Y7hEIJO_VisnYsz49CVW35HCRzJKeiF87aOT4CF0cRc0n7uPhNdoovBXBo_c"/>
<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
<div class="text-white flex items-center gap-2">
<span class="material-symbols-outlined text-[16px]" data-icon="favorite" data-weight="fill">favorite</span>
<span class="text-sm font-bold">967</span>
</div>
</div>
</div>
<!-- Post 6 -->
<div class="relative group overflow-hidden rounded-2xl aspect-square">
<img alt="Desert Horizon" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="A vast desert landscape during the blue hour, featuring rolling sand dunes with sharp, clean ridges and soft silhouettes of distant mountains. The lighting is gentle and uniform, creating a serene, minimalist atmosphere. The color scheme is a sophisticated blend of muted sandy yellows and dusky purples, representing the organic yet precise design language of the Modern Discovery system." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdNipgt8JwFWPnB0CyLf-BEo_EfHpaoqHDppwLpKhOuBr4mEo6U4DF-KOH53NIgcLrNm3Af8O3VekMHBOmVEaUzJGSx6CCVDaYJenqOYSUhZBE_YzNoiJcdeSqtXrgolbudRuwJ_TuFbFhMUAjzzdtOmYfBjJtd3itBiUtOyYTyu1RKmWXIT9wxoHWxDDT6wQrcYPdGapu0XADvGarbA_wLkO7iPOrnHX3nNjv3fn4GCSztZyOP_36oFmh_hNCwUZC4_EVHmiXYtU"/>
<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
<div class="text-white flex items-center gap-2">
<span class="material-symbols-outlined text-[16px]" data-icon="favorite" data-weight="fill">favorite</span>
<span class="text-sm font-bold">2.1k</span>
</div>
</div>
</div>
</div>
</section>
</main>
<!-- Bottom Navigation Bar -->

<script>
        // Simple micro-interaction for post grid
        document.querySelectorAll('.group').forEach(item => {
            item.addEventListener('touchstart', function() {
                this.classList.add('scale-95');
            });
            item.addEventListener('touchend', function() {
                this.classList.remove('scale-95');
            });
        });

        // Staggered reveal effect
        document.addEventListener('DOMContentLoaded', () => {
            const items = document.querySelectorAll('.stagger-item');
            items.forEach((item, index) => {
                item.style.animationDelay = \`\${index * 0.1}s\`;
            });
        });
    </script>
</body></html>`;

export default function Profile({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <WebView 
        source={{ html: htmlContent }} 
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'openSettings') {
            navigation.navigate('Settings');
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
