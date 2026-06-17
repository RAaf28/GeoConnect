import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useAuthStore } from '../../store/stores';

const htmlContent = `<!DOCTYPE html><html class="light" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>GeoConnect - Login</title>
<!-- Google Fonts: Plus Jakarta Sans & JetBrains Mono -->
<link href="https://fonts.googleapis.com" rel="preconnect">
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect">
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
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #fcf8ff;
            overflow-x: hidden;
        }
        .glass-panel {
            backdrop-filter: blur(12px);
            background: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(226, 232, 240, 0.8);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
        .whisper-shadow {
            box-shadow: 0 10px 30px -10px rgba(70, 72, 212, 0.1);
        }
        .map-mesh {
            background-image: radial-gradient(#4648d4 0.5px, transparent 0.5px);
            background-size: 24px 24px;
            opacity: 0.05;
        }
    </style>
</head>
<body class="flex min-h-screen items-center justify-center p-4">
<!-- Ambient Background -->
<div class="fixed inset-0 -z-10 bg-background overflow-hidden">
<div class="map-mesh absolute inset-0"></div>
<!-- Decorative subtle blurred shapes for "Modern Discovery" vibe -->
<div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]"></div>
<div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px]"></div>
</div>
<!-- Main Container -->
<main class="w-full max-auto max-w-[440px] flex flex-col items-center">
<!-- Top App Bar - Brand Identity (From JSON) -->
<header class="flex justify-between items-center px-margin-page py-4 w-full mb-8">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-3xl" data-icon="explore">explore</span>
<h1 class="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim tracking-tight">GeoConnect</h1>
</div>
</header>
<!-- Login Card -->
<div class="glass-panel w-full rounded-2xl p-8 whisper-shadow border border-soft-border">
<!-- Headlines -->
<div class="mb-8">
<h2 class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">Welcome back</h2>
<p class="font-body-md text-body-md text-on-surface-variant">Log in to explore your neighborhood and connect with local adventurers.</p>
</div>
<!-- Login Form -->
<form class="space-y-6" id="loginForm" onsubmit="event.preventDefault(); window.ReactNativeWebView.postMessage('performLogin');">
<!-- Email Input -->
<div class="space-y-2">
<label class="font-technical-label text-technical-label text-outline uppercase tracking-wider" for="email">Email Address</label>
<div class="relative group">
<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors" data-icon="mail">mail</span>
<input class="w-full h-14 pl-12 pr-4 bg-surface-container-lowest border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl font-body-md text-body-md transition-all outline-none" id="email" placeholder="alex@example.com" required="" type="email">
</div>
</div>
<!-- Password Input -->
<div class="space-y-2">
<div class="flex justify-between items-center">
<label class="font-technical-label text-technical-label text-outline uppercase tracking-wider" for="password">Password</label>
<a class="font-technical-label text-technical-label text-primary hover:underline transition-all" href="#" onclick="event.preventDefault(); window.ReactNativeWebView.postMessage('navigateForgot');">Forgot Password?</a>
</div>
<div class="relative group">
<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors" data-icon="lock">lock</span>
<input class="w-full h-14 pl-12 pr-12 bg-surface-container-lowest border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl font-body-md text-body-md transition-all outline-none" id="password" placeholder="••••••••" required="" type="password">
<button class="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline hover:text-on-surface-variant transition-colors" data-icon="visibility" id="togglePassword" type="button">
                            visibility
                        </button>
</div>
</div>
<!-- Remember Me (Discovery Detail) -->
<div class="flex items-center gap-3 py-2">
<input class="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary-container cursor-pointer" id="remember" type="checkbox">
<label class="font-body-md text-body-md text-on-surface-variant select-none cursor-pointer" for="remember">Stay logged in for discovery</label>
</div>
<!-- Primary Action -->
<button class="w-full h-14 bg-primary text-on-primary font-headline-md text-[16px] rounded-xl whisper-shadow hover:opacity-90 active:-translate-y-px transition-all duration-200 flex items-center justify-center gap-2" type="submit">
                    Login
                    <span class="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
</button>
</form>
<!-- Social Login Divider -->
<div class="relative my-8 flex items-center">
<div class="flex-grow border-t border-outline-variant"></div>
<span class="px-4 font-technical-label text-technical-label text-outline">OR EXPLORE WITH</span>
<div class="flex-grow border-t border-outline-variant"></div>
</div>
<!-- Social Buttons -->
<div class="grid gap-4">
<button class="flex items-center justify-center gap-2 h-12 rounded-xl border border-outline-variant font-body-md text-body-md text-on-surface hover:bg-surface-container-high transition-colors"><img alt="Google" class="w-5 h-5" src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg">Google</button>

</div>
</div>
<!-- Secondary Navigation (From JSON Intent) -->
<footer class="mt-8 text-center space-y-4">
<p class="font-body-md text-body-md text-on-surface-variant">
                Don't have an account? 
                <a class="text-primary font-bold hover:underline transition-all" href="#" onclick="event.preventDefault(); window.ReactNativeWebView.postMessage('navigateRegister');">Register</a>
</p>
<div class="flex items-center justify-center gap-6">
<a class="font-technical-label text-technical-label text-outline hover:text-primary transition-colors flex items-center gap-1" href="#">
<span class="material-symbols-outlined text-[14px]" data-icon="help_outline">help_outline</span>
                    Help
                </a>
<a class="font-technical-label text-technical-label text-outline hover:text-primary transition-colors flex items-center gap-1" href="#">
<span class="material-symbols-outlined text-[14px]" data-icon="language">language</span>
                    English
                </a>
</div>
</footer>
</main>
<!-- Micro-interactions Script -->
<script>
        document.addEventListener('DOMContentLoaded', () => {
            const passwordInput = document.getElementById('password');
            const toggleButton = document.getElementById('togglePassword');

            toggleButton.addEventListener('click', () => {
                const isPassword = passwordInput.type === 'password';
                passwordInput.type = isPassword ? 'text' : 'password';
                toggleButton.textContent = isPassword ? 'visibility_off' : 'visibility';
                toggleButton.setAttribute('data-icon', isPassword ? 'visibility_off' : 'visibility');
            });

            // Button spring effect simulator
            const mainBtn = document.querySelector('button[type="submit"]');
            mainBtn.addEventListener('mousedown', () => {
                mainBtn.style.transform = 'scale(0.98)';
            });
            mainBtn.addEventListener('mouseup', () => {
                mainBtn.style.transform = 'scale(1)';
            });
            mainBtn.addEventListener('mouseleave', () => {
                mainBtn.style.transform = 'scale(1)';
            });
        });
    </script>


</body></html>`;

export default function Login({ navigation }) {
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
          else if (action === 'performLogin') {
            useAuthStore.getState().setUser({ uid: 'mock-user-123', email: 'test@example.com' });
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
