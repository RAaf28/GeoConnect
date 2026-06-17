import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const htmlContent = `<!DOCTYPE html><html class="light" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>GeoConnect | Create Account</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet">
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
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
                    "inverse-on-surface": "#f2effb",
                    "on-secondary-fixed-variant": "#3f465c",
                    "primary-fixed": "#e1e0ff",
                    "on-primary-fixed": "#07006c",
                    "inverse-surface": "#303038",
                    "secondary": "#565e74",
                    "on-secondary-fixed": "#131b2e",
                    "on-primary-container": "#fffbff",
                    "outline": "#767586",
                    "surface-tint": "#494bd6",
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
                    "on-primary-fixed-variant": "#2f2ebe"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "margin-page": "24px",
                    "stack-gap": "12px",
                    "safe-area": "32px",
                    "gutter-grid": "16px"
            },
            "fontFamily": {
                    "technical-label": ["JetBrains Mono"],
                    "body-md": ["Plus Jakarta Sans"],
                    "headline-md": ["Plus Jakarta Sans"],
                    "headline-lg-mobile": ["Plus Jakarta Sans"],
                    "body-lg": ["Plus Jakarta Sans"],
                    "headline-lg": ["Plus Jakarta Sans"]
            },
            "fontSize": {
                    "technical-label": ["12px", {"lineHeight": "1.4", "fontWeight": "500"}],
                    "body-md": ["14px", {"lineHeight": "1.6", "fontWeight": "400"}],
                    "headline-md": ["24px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "700"}],
                    "headline-lg-mobile": ["28px", {"lineHeight": "1.2", "fontWeight": "700"}],
                    "body-lg": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
                    "headline-lg": ["32px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700"}]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;
        }
        
        /* Map-First Glassmorphism Background */
        .glass-panel {
            background: rgba(252, 248, 255, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .whisper-shadow {
            box-shadow: 0 10px 40px -10px rgba(70, 72, 212, 0.12);
        }

        .input-focus-ring:focus {
            ring: 2px;
            ring-color: #4648d4;
            border-color: #4648d4;
            outline: none;
        }

        .staggered-reveal {
            animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            opacity: 0;
            transform: translateY(20px);
        }

        @keyframes slideUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body class="bg-background text-on-background font-body-md min-h-screen flex flex-col overflow-x-hidden">
<!-- Background Map Layer (Atmospheric Context) -->
<div class="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40 grayscale-[0.5]">
<img class="w-full h-full object-cover" data-alt="A detailed, modern architectural map view of a vibrant coastal city with clean line-work and soft pastel tones. The map uses a sophisticated palette of light indigos and soft greys, emphasizing the geometric grid of the streets and the organic curves of the coastline. The lighting is bright and airy, reflecting a professional light-mode UI aesthetic that feels tech-forward yet accessible. Subdued topographical details provide depth without creating visual noise." data-location="San Francisco" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP6c_uYD_V786j3xB4eGfm30sC6_pBX_Ka81GBknBGm4ahmxiVqq7QGNJBEGcczT_fxxDYqC-m7-VfqPdNFIKnPL3KENK6HXTQJVJ3pEUaOut-J-MS5XZJgwBN5CWhxJ5o5aclVtfFzl7CZZZvHOWY3jpZ6FxfyDwjvTn6E2Bn81-NVYpiPBFP87E80ddEtL8PzGrFdGWH3ln0R7cBb24T6mDhUAvtLSNpGXE2qsN5sh63Px-flJjwkzo_QmItyZOxD0J6KB9P_BM">
</div>
<!-- Header / TopAppBar -->
<header class="flex justify-between items-center px-margin-page py-4 w-full fixed top-0 z-50 bg-transparent">
<div class="flex items-center gap-2 group cursor-pointer">
<div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary whisper-shadow transition-transform group-hover:-translate-y-1">
<span class="material-symbols-outlined">explore</span>
</div>
<span class="font-headline-md text-headline-md font-bold text-primary">GeoConnect</span>
</div>
<button class="text-on-surface-variant hover:opacity-80 transition-opacity flex items-center gap-2 font-technical-label text-technical-label">
<span class="material-symbols-outlined text-sm">help_outline</span>
            HELP
        </button>
</header>
<!-- Main Registration Canvas -->
<main class="flex-1 flex items-center justify-center px-6 py-24 relative z-10">
<div class="w-full max-w-md glass-panel p-8 md:p-10 rounded-[2rem] whisper-shadow staggered-reveal" style="animation-delay: 0.1s;">
<div class="mb-8">
<h1 class="font-headline-lg text-headline-lg text-on-surface mb-2">Create Account</h1>
<p class="text-on-surface-variant font-body-md">Join the global network of modern explorers and map your journey.</p>
</div>
<form class="space-y-5" onsubmit="event.preventDefault(); window.ReactNativeWebView.postMessage('performLogin');">
<!-- Full Name -->
<div class="space-y-1.5">
<label class="font-technical-label text-technical-label text-on-surface-variant block uppercase tracking-wider" for="name">Full Name</label>
<div class="relative group">
<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">person</span>
<input class="w-full bg-surface-container-lowest border-outline-variant rounded-xl py-3.5 pl-12 pr-4 font-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200" id="name" placeholder="John Doe" type="text">
</div>
</div>
<!-- Email -->
<div class="space-y-1.5">
<label class="font-technical-label text-technical-label text-on-surface-variant block uppercase tracking-wider" for="email">Email Address</label>
<div class="relative group">
<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">mail</span>
<input class="w-full bg-surface-container-lowest border-outline-variant rounded-xl py-3.5 pl-12 pr-4 font-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200" id="email" placeholder="explorer@geoconnect.com" type="email">
</div>
</div>
<!-- Password Row -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div class="space-y-1.5">
<label class="font-technical-label text-technical-label text-on-surface-variant block uppercase tracking-wider" for="password">Password</label>
<div class="relative group">
<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">lock</span>
<input class="w-full bg-surface-container-lowest border-outline-variant rounded-xl py-3.5 pl-12 pr-4 font-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200" id="password" placeholder="••••••••" type="password">
</div>
</div>
<div class="space-y-1.5">
<label class="font-technical-label text-technical-label text-on-surface-variant block uppercase tracking-wider" for="confirm-password">Confirm</label>
<div class="relative group">
<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">shield</span>
<input class="w-full bg-surface-container-lowest border-outline-variant rounded-xl py-3.5 pl-12 pr-4 font-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200" id="confirm-password" placeholder="••••••••" type="password">
</div>
</div>
</div>
<!-- Terms & Conditions -->
<div class="flex items-start gap-3 py-2 group cursor-pointer">
<div class="flex items-center h-6">
<input class="w-5 h-5 text-primary border-outline-variant rounded-md focus:ring-primary/20 cursor-pointer" id="terms" type="checkbox">
</div>
<label class="text-body-md text-on-surface-variant cursor-pointer select-none" for="terms">
                        I agree to the <a class="text-primary font-bold hover:underline" href="#">Terms of Service</a> and <a class="text-primary font-bold hover:underline" href="#">Privacy Policy</a>
</label>
</div>
<!-- Register Button -->
<button class="w-full bg-primary text-on-primary font-bold py-4 rounded-xl whisper-shadow hover:opacity-90 active:-translate-y-px transition-all duration-200 text-body-lg mt-4" type="submit">
                    Register Account
                </button>
</form>
<!-- Social Login Divider -->
<div class="relative my-8">
<div class="absolute inset-0 flex items-center">
<div class="w-full border-t border-outline-variant/50"></div>
</div>
<div class="relative flex justify-center text-xs uppercase tracking-widest">
<span class="bg-surface/10 backdrop-blur-sm px-4 text-outline font-technical-label">Or join with</span>
</div>
</div>
<div class="grid gap-4 mb-8 grid-cols-1">
<button class="w-full flex items-center justify-center gap-3 py-3 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors">
<img alt="Google" class="w-5 h-5" src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg">
<span class="font-body-md font-medium">Continue with Google</span>
</button>

</div>
<div class="text-center">
<p class="text-body-md text-on-surface-variant">
                    Already have an account? 
                    <a class="text-primary font-bold hover:underline inline-flex items-center gap-1" href="#" onclick="event.preventDefault(); window.ReactNativeWebView.postMessage('navigateLogin');">
                        Login
                        <span class="material-symbols-outlined text-sm">arrow_forward</span>
</a>
</p>
</div>
</div>
</main>
<!-- Bottom Navigation (Shell Rule: Suppressed for Transactional screen) -->
<!-- We skip BottomNavBar here as per "Shell Visibility & Relevance" mandate for transactional flows -->
<!-- Ambient Visual Elements -->
<div class="fixed bottom-12 right-12 opacity-20 pointer-events-none select-none">
<span class="material-symbols-outlined text-[120px] text-primary">public</span>
</div>
<script>
        // Micro-interactions for button tactile feedback
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('mousedown', () => {
                button.style.transform = 'scale(0.98) translateY(1px)';
            });
            button.addEventListener('mouseup', () => {
                button.style.transform = '';
            });
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });

        // Simple form validation visual hint
        const passwordInput = document.getElementById('password');
        const confirmInput = document.getElementById('confirm-password');
        
        const validatePasswords = () => {
            if (confirmInput.value === '') return;
            if (passwordInput.value === confirmInput.value) {
                confirmInput.classList.add('border-primary');
                confirmInput.classList.remove('border-error');
            } else {
                confirmInput.classList.remove('border-primary');
                confirmInput.classList.add('border-error');
            }
        };

        passwordInput.addEventListener('input', validatePasswords);
        confirmInput.addEventListener('input', validatePasswords);
    </script>


</body></html>`;

export default function Register({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <WebView 
        source={{ html: htmlContent }} 
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        // Add basic message handling for potential future navigation
        onMessage={(event) => {
          const action = event.nativeEvent.data;
          if (action === 'goBack') navigation.goBack();
          else if (action === 'navigateRegister') navigation.navigate('Register');
          else if (action === 'navigateLogin') navigation.navigate('Login');
          else if (action === 'navigateForgot') navigation.navigate('ForgotPassword');
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
