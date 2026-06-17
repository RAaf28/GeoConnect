import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const htmlContent = `<!DOCTYPE html><html class="light" lang="en" style=""><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&amp;family=JetBrains+Mono:wght@500&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@100..900&amp;display=swap" rel="stylesheet">
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
            shadow: 0 10px 40px -10px rgba(70, 72, 212, 0.1);
        }
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
    </style>
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
</head>
<body class="bg-background text-on-background min-h-screen flex flex-col font-body-md">
<!-- Top Navigation Bar (Simplified for transactional page) -->
<header class="flex items-center px-margin-page py-4 w-full bg-transparent fixed top-0 z-50"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-[#6366f1] text-3xl">explore</span><div class="font-headline-md text-headline-md font-extrabold text-[#6366f1] tracking-tight">GeoConnect</div></div></header>
<!-- Main Content Canvas -->
<main class="flex-grow flex justify-center p-margin-page relative overflow-hidden pt-24">
<!-- Animated Background Element -->

<!-- Ambient Decorative Elements -->
<div class="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float"></div>
<div class="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl animate-float" style="animation-delay: -2s"></div>
<!-- Central Transactional Card -->
<div class="w-full max-w-md relative z-10">
<div class="glass-panel border border-white/40 rounded-3xl p-8 shadow-[0_20px_50px_rgba(70,72,212,0.1)] stagger-reveal" style="opacity: 1; transform: translateY(0px); transition: 0.8s cubic-bezier(0.16, 1, 0.3, 1);">
<!-- Icon Header -->

<!-- Headline & Description -->
<div class="space-y-3 mb-8 text-center">
<h1 class="font-headline-lg text-3xl font-extrabold text-on-surface tracking-tight">Reset Password</h1>
<p class="font-body-lg text-on-surface-variant leading-relaxed">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
</div>
<!-- Reset Form -->
<form class="space-y-6" id="resetForm" onsubmit="handleReset(event)">
<div class="space-y-2">
<label class="font-technical-label text-technical-label text-outline ml-1" for="email">EMAIL ADDRESS</label>
<div class="relative group">
<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">mail</span>
<input class="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] outline-none transition-all font-body-md text-on-surface" id="email" name="email" placeholder="jane@example.com" required="" type="email">
</div>
</div>
<!-- CTA Button -->
<button class="w-full py-4 bg-[#6366f1] text-white font-bold rounded-xl shadow-lg shadow-indigo-200/50 hover:opacity-90 active:-translate-y-px transition-all flex items-center justify-center gap-2" id="submitBtn" type="submit">
<span class="">Send Reset Link</span>
<span class="material-symbols-outlined text-[20px]">send</span>
</button>
</form>
<!-- Success State (Hidden by default) -->
<div class="hidden text-center space-y-6 py-4" id="successState">
<div class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
<span class="material-symbols-outlined text-5xl" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</div>
<div class="space-y-2">
<h3 class="font-headline-md text-headline-md text-on-surface">Check your inbox</h3>
<p class="text-on-surface-variant font-body-md">We've sent a recovery link to your email address. It may take a few minutes to arrive.</p>
</div>
<button class="text-primary font-technical-label text-technical-label hover:underline" onclick="location.reload()">
                        DIDN'T RECEIVE THE EMAIL? TRY AGAIN
                    </button>
</div>
<!-- Footer Links -->
<div class="mt-8 pt-6 border-t border-outline-variant/30 text-center">
<p class="font-body-md text-on-surface-variant">Remember your password? <a class="text-[#6366f1] font-bold hover:underline ml-1" href="#" onclick="event.preventDefault(); window.ReactNativeWebView.postMessage('navigateLogin');">Sign in</a></p>
</div>
</div>
<!-- Supporting Brand Image (Bento style hint) -->

</div>
</main>
<!-- Footer Space -->
<footer class="py-8 text-center px-margin-page">
<p class="font-technical-label text-technical-label text-outline opacity-60 uppercase tracking-widest">
            © 2024 GEOCONNECT WORLDWIDE • SECURE ACCESS PORTAL
        </p>
</footer>
<script>
        function handleReset(event) {
            event.preventDefault();
            const btn = document.getElementById('submitBtn');
            const form = document.getElementById('resetForm');
            const success = document.getElementById('successState');
            const email = document.getElementById('email').value;

            // Loading state
            btn.disabled = true;
            btn.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span> Sending...';

            // Simulate API call
            setTimeout(() => {
                form.classList.add('hidden');
                success.classList.remove('hidden');
                
                // Add entry animation to success state
                success.classList.add('animate-in', 'fade-in', 'slide-in-from-bottom-4', 'duration-500');
            }, 1500);
        }

        // Simple entrance animation for the card
        document.addEventListener('DOMContentLoaded', () => {
            const card = document.querySelector('.stagger-reveal');
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        });
    </script>


</body></html>`;

export default function ForgotPassword({ navigation }) {
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
