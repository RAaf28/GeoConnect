import React, { useRef, useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore } from '../../store/stores';
import {
  changePassword,
  getAuthSecurityInfo,
  sendPasswordReset,
} from '../../services/authService';
import {
  getSecuritySettings,
  updateSecuritySettings,
} from '../../services/firestoreService';

const getHtmlContent = (isDark) => {
  return `<!DOCTYPE html><html class="${isDark ? 'dark' : 'light'}" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>GeoConnect | Login & Security</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<style>
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .whisper-shadow { box-shadow: 0 10px 30px -5px rgba(70, 72, 212, 0.08); }
        .stagger-reveal { animation: staggerReveal 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; transform: translateY(10px); }
        @keyframes staggerReveal { to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    </style>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "muted-zinc":"#64748B","surface-bright":"#fcf8ff","on-secondary":"#ffffff",
                    "on-surface":"#1b1b23","surface-variant":"#e4e1ed","error":"#ba1a1a",
                    "primary":"#4648d4","primary-container":"#6063ee","on-primary":"#ffffff",
                    "on-surface-variant":"#464554","surface-container":"#efecf8",
                    "surface-pure":"#FFFFFF","surface-dim":"#dbd8e4",
                    "surface-container-highest":"#e4e1ed","soft-border":"rgba(226, 232, 240, 0.8)",
                    "background":"#fcf8ff","inverse-on-surface":"#f2effb",
                    "inverse-surface":"#303038","outline-variant":"#c7c4d7",
                    "surface-container-low":"#f5f2fe","surface-container-high":"#e9e6f3",
                    "surface":"#fcf8ff","tertiary":"#904900","on-error-container":"#93000a",
                    "error-container":"#ffdad6","inverse-primary":"#c0c1ff","primary-fixed":"#e1e0ff",
                    "outline":"#767586","surface-tint":"#494bd6","on-primary-container":"#fffbff",
                    "secondary":"#565e74","on-background":"#1b1b23","secondary-container":"#dae2fd"
            },
            "borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},
            "spacing":{"gutter-grid":"16px","margin-page":"24px","stack-gap":"12px","safe-area":"32px"},
            "fontFamily":{"technical-label":["JetBrains Mono"],"headline-lg":["Plus Jakarta Sans"],"headline-lg-mobile":["Plus Jakarta Sans"],"body-lg":["Plus Jakarta Sans"],"headline-md":["Plus Jakarta Sans"],"body-md":["Plus Jakarta Sans"]},
            "fontSize":{"technical-label":["12px",{"lineHeight":"1.4","fontWeight":"500"}],"headline-lg-mobile":["28px",{"lineHeight":"1.2","fontWeight":"700"}],"headline-md":["24px",{"lineHeight":"1.2","letterSpacing":"-0.01em","fontWeight":"700"}],"body-md":["14px",{"lineHeight":"1.6","fontWeight":"400"}],"body-lg":["16px",{"lineHeight":"1.6","fontWeight":"400"}]}
          },
        },
      }
    </script>
</head>
<body class="bg-background dark:bg-inverse-surface font-body-md text-on-surface dark:text-inverse-on-surface antialiased min-h-screen overflow-x-hidden pb-4">
<header class="fixed top-0 w-full z-50 bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-md shadow-sm">
<div class="flex justify-between items-center px-margin-page h-16 w-full">
<div class="flex items-center gap-3">
<button class="flex items-center justify-center p-2 rounded-full hover:bg-surface-variant/50 dark:hover:bg-white/10 transition-colors" onclick="sendMsg('goBack')">
<span class="material-symbols-outlined text-primary">arrow_back</span>
</button>
<h1 class="text-headline-md font-headline-md text-primary tracking-tight">Security</h1>
</div>
</div>
</header>
<main class="mt-20 px-margin-page max-w-2xl mx-auto space-y-6">
<!-- Header Section -->
<section class="stagger-reveal" style="animation-delay: 0.1s;">
<h2 class="text-headline-lg-mobile font-headline-lg-mobile text-on-surface dark:text-inverse-on-surface">Login &amp; Security</h2>
<p class="text-on-surface-variant dark:text-inverse-on-surface/70 mt-2 font-body-md">Manage your sign-in methods, password, and account protection.</p>
</section>

<!-- Account Overview -->
<section class="stagger-reveal" style="animation-delay: 0.15s;">
<h3 class="font-technical-label text-technical-label text-muted-zinc uppercase tracking-widest px-1 mb-3">Account</h3>
<div class="bg-surface-pure dark:bg-white/5 rounded-xl p-5 whisper-shadow border border-soft-border dark:border-white/10">
<div class="flex items-start gap-4">
<div class="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-primary">account_circle</span>
</div>
<div class="flex-1 min-w-0">
<p id="accountEmail" class="font-bold text-on-surface dark:text-inverse-on-surface truncate">Loading...</p>
<div id="providerBadges" class="flex flex-wrap gap-2 mt-2"></div>
<div class="mt-3 grid grid-cols-2 gap-3">
<div>
<p class="text-technical-label text-muted-zinc uppercase tracking-wider text-[10px]">Member Since</p>
<p id="memberSince" class="text-body-md font-medium mt-0.5">—</p>
</div>
<div>
<p class="text-technical-label text-muted-zinc uppercase tracking-wider text-[10px]">Last Active</p>
<p id="lastActive" class="text-body-md font-medium mt-0.5">—</p>
</div>
</div>
</div>
</div>
<div id="emailVerifiedBanner" class="hidden mt-4 p-3 rounded-lg bg-tertiary/10 border border-tertiary/20 flex items-center gap-2">
<span class="material-symbols-outlined text-tertiary text-[18px]">warning</span>
<p class="text-body-md text-on-surface-variant dark:text-inverse-on-surface/70">Your email is not verified. Check your inbox for a verification link.</p>
</div>
</div>
</section>

<!-- Password Section -->
<section id="passwordSection" class="stagger-reveal space-y-3" style="animation-delay: 0.2s;">
<h3 class="font-technical-label text-technical-label text-muted-zinc uppercase tracking-widest px-1">Password</h3>
<div id="passwordActions" class="bg-surface-pure dark:bg-white/5 rounded-xl whisper-shadow border border-soft-border dark:border-white/10 divide-y divide-soft-border dark:divide-white/10 overflow-hidden">
<button onclick="openChangePasswordModal()" id="changePasswordBtn" class="w-full p-4 flex items-center justify-between hover:bg-surface-container-low dark:hover:bg-white/10 transition-colors group">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
<span class="material-symbols-outlined">lock_reset</span>
</div>
<div class="text-left">
<p class="font-bold text-on-surface dark:text-inverse-on-surface">Change Password</p>
<p class="text-on-surface-variant dark:text-inverse-on-surface/70 text-[12px]">Update your account password</p>
</div>
</div>
<span class="material-symbols-outlined text-outline-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
</button>
<button onclick="sendMsg('sendResetLink')" id="resetLinkBtn" class="w-full p-4 flex items-center justify-between hover:bg-surface-container-low dark:hover:bg-white/10 transition-colors group">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-lg bg-secondary-container/30 flex items-center justify-center text-secondary">
<span class="material-symbols-outlined">mail</span>
</div>
<div class="text-left">
<p class="font-bold text-on-surface dark:text-inverse-on-surface">Send Reset Link</p>
<p class="text-on-surface-variant dark:text-inverse-on-surface/70 text-[12px]">Email a password reset link</p>
</div>
</div>
<span class="material-symbols-outlined text-outline-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
</button>
</div>
<div id="googlePasswordInfo" class="hidden bg-surface-pure dark:bg-white/5 rounded-xl p-5 whisper-shadow border border-soft-border dark:border-white/10">
<div class="flex items-start gap-4">
<div class="w-10 h-10 rounded-lg bg-secondary-container/30 flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-secondary">info</span>
</div>
<div>
<p class="font-bold text-on-surface dark:text-inverse-on-surface">Google Sign-In</p>
<p class="text-body-md text-on-surface-variant dark:text-inverse-on-surface/70 mt-1">Your password is managed by Google. To change it, visit your Google Account settings.</p>
</div>
</div>
</div>
</section>

<!-- Two-Factor & Alerts -->
<section class="stagger-reveal space-y-3" style="animation-delay: 0.3s;">
<h3 class="font-technical-label text-technical-label text-muted-zinc uppercase tracking-widest px-1">Protection</h3>
<div class="bg-surface-pure dark:bg-white/5 rounded-xl whisper-shadow border border-soft-border dark:border-white/10 divide-y divide-soft-border dark:divide-white/10 overflow-hidden">
<div class="p-4 flex items-center justify-between">
<div class="flex items-center gap-4 flex-1 pr-4">
<div class="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
<span class="material-symbols-outlined">phonelink_lock</span>
</div>
<div>
<p class="font-bold text-on-surface dark:text-inverse-on-surface">Two-Factor Authentication</p>
<p class="text-on-surface-variant dark:text-inverse-on-surface/70 text-[12px]">Extra layer of security on sign-in</p>
</div>
</div>
<label class="relative inline-flex items-center cursor-pointer shrink-0">
<input type="checkbox" id="twoFactorToggle" class="sr-only peer" onchange="toggleTwoFactor(this.checked)">
<div class="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
<div class="p-4 flex items-center justify-between">
<div class="flex items-center gap-4 flex-1 pr-4">
<div class="w-10 h-10 rounded-lg bg-tertiary-fixed/30 flex items-center justify-center text-tertiary">
<span class="material-symbols-outlined">notifications_active</span>
</div>
<div>
<p class="font-bold text-on-surface dark:text-inverse-on-surface">Login Alerts</p>
<p class="text-on-surface-variant dark:text-inverse-on-surface/70 text-[12px]">Notify on new device sign-in</p>
</div>
</div>
<label class="relative inline-flex items-center cursor-pointer shrink-0">
<input type="checkbox" id="loginAlertsToggle" class="sr-only peer" onchange="toggleLoginAlerts(this.checked)">
<div class="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
</div>
<div id="twoFactorInfo" class="hidden bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/20 flex items-start gap-3">
<span class="material-symbols-outlined text-primary mt-0.5">verified_user</span>
<p class="text-body-md text-on-surface-variant dark:text-inverse-on-surface/70">Two-factor authentication is enabled. You'll be asked for a verification code when signing in from a new device.</p>
</div>
</section>

<!-- Active Session -->
<section class="stagger-reveal space-y-3" style="animation-delay: 0.4s;">
<h3 class="font-technical-label text-technical-label text-muted-zinc uppercase tracking-widest px-1">Active Session</h3>
<div class="bg-surface-pure dark:bg-white/5 rounded-xl p-5 whisper-shadow border border-soft-border dark:border-white/10">
<div class="flex items-center justify-between">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
<span class="material-symbols-outlined text-primary">smartphone</span>
</div>
<div>
<p class="font-bold text-on-surface dark:text-inverse-on-surface">This Device</p>
<p class="text-body-md text-muted-zinc">Currently signed in</p>
</div>
</div>
<span class="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary-fixed px-2.5 py-1 rounded-full uppercase tracking-wide">
<span class="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span> Active
</span>
</div>
</div>
</section>
</main>

<!-- Change Password Modal -->
<div id="changePasswordModal" class="fixed inset-0 z-[100] flex items-end justify-center" style="display:none;">
<div class="absolute inset-0 bg-black/40" onclick="closeChangePasswordModal()"></div>
<div class="relative w-full max-w-2xl bg-surface-pure dark:bg-inverse-surface rounded-t-2xl p-6 shadow-2xl" style="animation: slideUp 0.3s ease-out;">
<div class="w-12 h-1 bg-outline-variant rounded-full mx-auto mb-4"></div>
<h3 class="font-bold text-lg text-on-surface dark:text-inverse-on-surface mb-1">Change Password</h3>
<p class="text-body-md text-muted-zinc mb-5">Enter your current password and choose a new one.</p>
<div class="space-y-4">
<div class="space-y-1">
<label class="block text-sm text-on-surface-variant dark:text-inverse-on-surface/70 ml-1">Current Password</label>
<div class="relative">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">lock</span>
<input id="currentPassword" type="password" class="w-full bg-surface-container-low dark:bg-white/5 border border-outline-variant dark:border-white/10 rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Enter current password"/>
</div>
</div>
<div class="space-y-1">
<label class="block text-sm text-on-surface-variant dark:text-inverse-on-surface/70 ml-1">New Password</label>
<div class="relative">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">key</span>
<input id="newPassword" type="password" class="w-full bg-surface-container-low dark:bg-white/5 border border-outline-variant dark:border-white/10 rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="At least 6 characters"/>
</div>
</div>
<div class="space-y-1">
<label class="block text-sm text-on-surface-variant dark:text-inverse-on-surface/70 ml-1">Confirm New Password</label>
<div class="relative">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">key</span>
<input id="confirmPassword" type="password" class="w-full bg-surface-container-low dark:bg-white/5 border border-outline-variant dark:border-white/10 rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Repeat new password"/>
</div>
</div>
<p id="passwordError" class="hidden text-error text-body-md"></p>
</div>
<button onclick="submitChangePassword()" id="submitPasswordBtn" class="w-full mt-5 py-3.5 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-container transition-all active:scale-[0.98]">Update Password</button>
<button onclick="closeChangePasswordModal()" class="w-full mt-2 py-3 text-on-surface-variant font-bold rounded-xl hover:bg-surface-container-low transition-all">Cancel</button>
</div>
</div>

<script>
        function sendMsg(action, data = {}) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action, ...data }));
        }

        function formatDate(isoString) {
            if (!isoString) return '—';
            try {
                return new Date(isoString).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                });
            } catch (e) { return '—'; }
        }

        function applyAuthInfo(info) {
            document.getElementById('accountEmail').textContent = info.email || 'No email';
            document.getElementById('memberSince').textContent = formatDate(info.createdAt);
            document.getElementById('lastActive').textContent = formatDate(info.lastSignIn);

            const badges = document.getElementById('providerBadges');
            badges.innerHTML = '';
            if (info.hasPassword) {
                badges.innerHTML += '<span class="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-primary uppercase tracking-wide"><span class="material-symbols-outlined text-[12px]">mail</span> Email</span>';
            }
            if (info.hasGoogle) {
                badges.innerHTML += '<span class="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-secondary-container text-secondary uppercase tracking-wide"><span class="material-symbols-outlined text-[12px]">account_circle</span> Google</span>';
            }

            if (!info.emailVerified) {
                document.getElementById('emailVerifiedBanner').classList.remove('hidden');
            }

            if (info.hasPassword) {
                document.getElementById('passwordActions').classList.remove('hidden');
                document.getElementById('googlePasswordInfo').classList.add('hidden');
            } else if (info.hasGoogle) {
                document.getElementById('passwordActions').classList.add('hidden');
                document.getElementById('googlePasswordInfo').classList.remove('hidden');
            }
        }

        function applySecuritySettings(settings) {
            document.getElementById('twoFactorToggle').checked = settings.twoFactorEnabled || false;
            document.getElementById('loginAlertsToggle').checked = settings.loginAlerts !== false;
            updateTwoFactorInfo(settings.twoFactorEnabled);
        }

        function updateTwoFactorInfo(enabled) {
            const el = document.getElementById('twoFactorInfo');
            if (enabled) el.classList.remove('hidden');
            else el.classList.add('hidden');
        }

        function toggleTwoFactor(checked) {
            updateTwoFactorInfo(checked);
            sendMsg('updateSecurity', { twoFactorEnabled: checked });
        }

        function toggleLoginAlerts(checked) {
            sendMsg('updateSecurity', { loginAlerts: checked });
        }

        function openChangePasswordModal() {
            document.getElementById('changePasswordModal').style.display = 'flex';
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
            document.getElementById('passwordError').classList.add('hidden');
        }

        function closeChangePasswordModal() {
            document.getElementById('changePasswordModal').style.display = 'none';
        }

        function submitChangePassword() {
            const current = document.getElementById('currentPassword').value;
            const newPass = document.getElementById('newPassword').value;
            const confirm = document.getElementById('confirmPassword').value;
            const errorEl = document.getElementById('passwordError');

            if (!current || !newPass || !confirm) {
                errorEl.textContent = 'Please fill in all fields.';
                errorEl.classList.remove('hidden');
                return;
            }
            if (newPass.length < 6) {
                errorEl.textContent = 'New password must be at least 6 characters.';
                errorEl.classList.remove('hidden');
                return;
            }
            if (newPass !== confirm) {
                errorEl.textContent = 'New passwords do not match.';
                errorEl.classList.remove('hidden');
                return;
            }

            const btn = document.getElementById('submitPasswordBtn');
            btn.textContent = 'Updating...';
            btn.classList.add('opacity-80', 'pointer-events-none');
            errorEl.classList.add('hidden');

            sendMsg('changePassword', { currentPassword: current, newPassword: newPass });
        }

        function onPasswordChanged() {
            closeChangePasswordModal();
            const btn = document.getElementById('submitPasswordBtn');
            btn.textContent = 'Update Password';
            btn.classList.remove('opacity-80', 'pointer-events-none');
        }

        function onPasswordError(message) {
            const errorEl = document.getElementById('passwordError');
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
            const btn = document.getElementById('submitPasswordBtn');
            btn.textContent = 'Update Password';
            btn.classList.remove('opacity-80', 'pointer-events-none');
        }

        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => sendMsg('loadSecurity'), 300);
        });
    </script>
</body></html>`;
};

const getAuthErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Current password is incorrect.';
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters.';
    case 'auth/requires-recent-login':
      return 'Please sign out and sign in again, then retry.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return error.message || 'Something went wrong. Please try again.';
  }
};

export default function LoginSecurity({ navigation }) {
  const { user } = useAuth();
  const isDark = useThemeStore((state) => state.isDark);
  const webViewRef = useRef(null);
  const securitySettingsRef = useRef({ twoFactorEnabled: false, loginAlerts: true });

  useEffect(() => {
    webViewRef.current?.injectJavaScript(`
      document.documentElement.className = "${isDark ? 'dark' : 'light'}";
      true;
    `);
  }, [isDark]);

  const handleMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.action === 'goBack') {
        navigation.goBack();
      } else if (data.action === 'loadSecurity') {
        if (!user) return;

        const authInfo = getAuthSecurityInfo();
        if (authInfo) {
          webViewRef.current?.injectJavaScript(
            `applyAuthInfo(${JSON.stringify(authInfo)}); true;`,
          );
        }

        try {
          const settings = await getSecuritySettings(user.uid);
          securitySettingsRef.current = settings;
          webViewRef.current?.injectJavaScript(
            `applySecuritySettings(${JSON.stringify(settings)}); true;`,
          );
        } catch (e) {
          console.error('[LoginSecurity] Error loading settings:', e);
        }
      } else if (data.action === 'changePassword') {
        try {
          await changePassword(data.currentPassword, data.newPassword);
          webViewRef.current?.injectJavaScript(`onPasswordChanged(); true;`);
          Alert.alert('Success', 'Your password has been updated.');
        } catch (error) {
          const message = getAuthErrorMessage(error);
          webViewRef.current?.injectJavaScript(
            `onPasswordError(${JSON.stringify(message)}); true;`,
          );
        }
      } else if (data.action === 'sendResetLink') {
        const email = user?.email;
        if (!email) {
          Alert.alert('Error', 'No email address found for this account.');
          return;
        }
        Alert.alert(
          'Send Reset Link',
          `A password reset link will be sent to ${email}.`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Send',
              onPress: async () => {
                try {
                  await sendPasswordReset(email);
                  Alert.alert('Email Sent', 'Check your inbox for the password reset link.');
                } catch (error) {
                  Alert.alert('Error', getAuthErrorMessage(error));
                }
              },
            },
          ],
        );
      } else if (data.action === 'updateSecurity') {
        if (!user) return;
        const updated = {
          ...securitySettingsRef.current,
          ...(data.twoFactorEnabled !== undefined && {
            twoFactorEnabled: data.twoFactorEnabled,
          }),
          ...(data.loginAlerts !== undefined && { loginAlerts: data.loginAlerts }),
        };
        securitySettingsRef.current = updated;
        try {
          await updateSecuritySettings(user.uid, updated);
        } catch (error) {
          console.error('[LoginSecurity] Error saving settings:', error);
          Alert.alert('Error', 'Failed to save security settings.');
        }
      }
    } catch (error) {
      console.error('[LoginSecurity] Error handling message:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: getHtmlContent(isDark) }}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleMessage}
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
