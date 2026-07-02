import React, { useRef, useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore, usePrivacyStore } from '../../store/stores';
import { getLocationPrivacy, updateLocationPrivacy, getLocationHistory, deleteLocationHistory } from '../../services/firestoreService';

const getHtmlContent = (isDark) => {
  return `<!DOCTYPE html><html class="${isDark ? 'dark' : 'light'}" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>GeoConnect | Location Privacy Settings</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<style>
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .glass-panel { background: rgba(252, 248, 255, 0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .dark .glass-panel { background: rgba(27, 27, 35, 0.7); }
        .whisper-shadow { box-shadow: 0 10px 30px -5px rgba(70, 72, 212, 0.08); }
        .stagger-reveal { animation: staggerReveal 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; transform: translateY(10px); }
        @keyframes staggerReveal { to { opacity: 1; transform: translateY(0); } }
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
<button class="flex items-center justify-center p-2 rounded-full hover:bg-surface-variant/50 dark:hover:bg-white/10 transition-colors" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action:'goBack'}))">
<span class="material-symbols-outlined text-primary">arrow_back</span>
</button>
<h1 class="text-headline-md font-headline-md text-primary tracking-tight">Privacy</h1>
</div>
</div>
</header>
<main class="mt-20 px-margin-page max-w-2xl mx-auto space-y-6">
<!-- Header Section -->
<section class="stagger-reveal" style="animation-delay: 0.1s;">
<h2 class="text-headline-lg-mobile font-headline-lg-mobile text-on-surface dark:text-inverse-on-surface">Location Privacy</h2>
<p class="text-on-surface-variant dark:text-inverse-on-surface/70 mt-2 font-body-md">Control how GeoConnect uses your coordinates and who can see your digital footprint.</p>
</section>
<!-- Master Toggle Card -->
<section class="stagger-reveal" style="animation-delay: 0.2s;">
<div class="bg-surface-pure dark:bg-white/5 rounded-xl p-5 whisper-shadow border border-soft-border dark:border-white/10 flex items-center justify-between">
<div class="flex-1 pr-4">
<h3 class="font-headline-md text-headline-md text-primary-container dark:text-inverse-primary text-lg">Master Location Toggle</h3>
<p class="text-body-md text-muted-zinc mt-1 leading-snug">Globally enable or disable location services.</p>
</div>
<label class="relative inline-flex items-center cursor-pointer">
<input type="checkbox" id="masterToggle" class="sr-only peer" onchange="toggleMaster(this.checked)">
<div class="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
</section>
<!-- Location Mode Selection -->
<section id="modesSection" class="stagger-reveal space-y-3" style="animation-delay: 0.3s;">
<h3 class="font-technical-label text-technical-label text-muted-zinc uppercase tracking-widest px-1">Location Mode</h3>
<div class="grid grid-cols-1 gap-3">
<label class="group relative bg-surface-pure dark:bg-white/5 rounded-xl p-4 whisper-shadow border border-soft-border dark:border-white/10 flex items-start gap-4 cursor-pointer hover:bg-surface-container-low dark:hover:bg-white/10 transition-all">
<input type="radio" name="loc_mode" value="exact" class="hidden peer" onchange="setMode('exact')">
<div class="w-5 h-5 rounded-full border-2 border-outline mt-1 flex items-center justify-center peer-checked:border-primary peer-checked:bg-primary transition-all"><div class="w-2 h-2 bg-white rounded-full"></div></div>
<div><span class="font-bold text-on-surface dark:text-inverse-on-surface block">Exact</span><p class="text-body-md text-on-surface-variant dark:text-inverse-on-surface/70 mt-1">High-precision GPS. Best for navigation and finding friends within 1-3 meters.</p></div>
<span class="material-symbols-outlined absolute top-4 right-4 text-primary opacity-20 group-hover:opacity-100 transition-opacity">my_location</span>
</label>
<label class="group relative bg-surface-pure dark:bg-white/5 rounded-xl p-4 whisper-shadow border border-soft-border dark:border-white/10 flex items-start gap-4 cursor-pointer hover:bg-surface-container-low dark:hover:bg-white/10 transition-all">
<input type="radio" name="loc_mode" value="blurred" class="hidden peer" onchange="setMode('blurred')">
<div class="w-5 h-5 rounded-full border-2 border-outline mt-1 flex items-center justify-center peer-checked:border-primary peer-checked:bg-primary transition-all"><div class="w-2 h-2 bg-white rounded-full"></div></div>
<div><span class="font-bold text-on-surface dark:text-inverse-on-surface block">Blurred</span><p class="text-body-md text-on-surface-variant dark:text-inverse-on-surface/70 mt-1">Shows your general neighborhood (approx. 500m radius).</p></div>
<span class="material-symbols-outlined absolute top-4 right-4 text-primary opacity-20 group-hover:opacity-100 transition-opacity">blur_on</span>
</label>
<label class="group relative bg-surface-pure dark:bg-white/5 rounded-xl p-4 whisper-shadow border border-soft-border dark:border-white/10 flex items-start gap-4 cursor-pointer hover:bg-surface-container-low dark:hover:bg-white/10 transition-all">
<input type="radio" name="loc_mode" value="hidden" class="hidden peer" onchange="setMode('hidden')">
<div class="w-5 h-5 rounded-full border-2 border-outline mt-1 flex items-center justify-center peer-checked:border-primary peer-checked:bg-primary transition-all"><div class="w-2 h-2 bg-white rounded-full"></div></div>
<div><span class="font-bold text-on-surface dark:text-inverse-on-surface block">Hidden</span><p class="text-body-md text-on-surface-variant dark:text-inverse-on-surface/70 mt-1">Hides your marker from public discovery but allows you to see others.</p></div>
<span class="material-symbols-outlined absolute top-4 right-4 text-primary opacity-20 group-hover:opacity-100 transition-opacity">visibility_off</span>
</label>
</div>
</section>
<!-- Invisible Mode -->
<section id="invisibleSection" class="stagger-reveal" style="animation-delay: 0.4s;">
<div class="bg-primary/5 dark:bg-primary/10 rounded-xl p-5 border border-primary/20 flex items-center justify-between">
<div class="flex-1 pr-4">
<div class="flex items-center gap-2">
<h3 class="font-bold text-primary">Invisible Mode</h3>
<span class="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Premium</span>
</div>
<p class="text-body-md text-on-surface-variant dark:text-inverse-on-surface/70 mt-1">Browse the map without leaving any trace.</p>
</div>
<label class="relative inline-flex items-center cursor-pointer">
<input type="checkbox" id="invisibleToggle" class="sr-only peer" onchange="toggleInvisible(this.checked)">
<div class="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
</section>
<!-- Location History -->
<section id="historySection" class="stagger-reveal space-y-3" style="animation-delay: 0.5s;">
<h3 class="font-technical-label text-technical-label text-muted-zinc uppercase tracking-widest px-1">Location History</h3>
<div class="bg-surface-pure dark:bg-white/5 rounded-xl p-5 whisper-shadow border border-soft-border dark:border-white/10">
<div class="flex items-center justify-between mb-4">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-lg bg-secondary-container/30 dark:bg-white/10 flex items-center justify-center">
<span class="material-symbols-outlined text-secondary">history</span>
</div>
<div>
<p class="font-bold text-on-surface dark:text-inverse-on-surface">Stored History</p>
<p id="historyCount" class="text-technical-label text-muted-zinc">Loading...</p>
</div>
</div>
<button id="clearBtn" onclick="clearHistory()" class="text-error font-bold text-body-md px-3 py-1.5 rounded-lg hover:bg-error-container/20 transition-colors active:-translate-y-px">Clear History</button>
</div>
<p class="text-body-md text-muted-zinc">History is used for personalized discovery. Clearing it will reset your algorithm.</p>
</div>
</section>
</main>

<script>
        function applySettings(settings) {
            const master = settings.mode !== 'hidden' || settings.mode === 'exact' || settings.mode === 'blurred';
            document.getElementById('masterToggle').checked = settings.mode !== 'hidden';
            document.getElementById('invisibleToggle').checked = settings.invisibleMode || false;
            
            const radios = document.querySelectorAll('input[name="loc_mode"]');
            radios.forEach(r => { r.checked = r.value === settings.mode; });

            updateSectionsState(settings.mode !== 'hidden');
        }

        function updateSectionsState(enabled) {
            const sections = [document.getElementById('modesSection'), document.getElementById('invisibleSection'), document.getElementById('historySection')];
            sections.forEach(s => {
                if (s) {
                    s.style.opacity = enabled ? '1' : '0.4';
                    s.style.pointerEvents = enabled ? 'auto' : 'none';
                }
            });
        }

        function toggleMaster(checked) {
            if (!checked) {
                setMode('hidden');
            } else {
                setMode('blurred');
            }
            updateSectionsState(checked);
        }

        function setMode(mode) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'updateMode', mode: mode }));
        }

        function toggleInvisible(checked) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'toggleInvisible', invisibleMode: checked }));
        }

        function clearHistory() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'clearHistory' }));
        }

        function setHistoryCount(count) {
            document.getElementById('historyCount').textContent = count + ' locations recorded';
        }

        function onHistoryCleared() {
            document.getElementById('historyCount').textContent = '0 locations recorded';
            const btn = document.getElementById('clearBtn');
            btn.textContent = 'Cleared';
            btn.classList.replace('text-error', 'text-muted-zinc');
            btn.disabled = true;
        }

        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'loadPrivacy' }));
            }, 300);
        });
    </script>
</body></html>`;
};

export default function PrivacySettings({ navigation }) {
  const { user } = useAuth();
  const isDark = useThemeStore((state) => state.isDark);
  const { setLocationPrivacy, updatePrivacyMode, toggleInvisibleMode } = usePrivacyStore();
  const webViewRef = useRef(null);

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
      }
      else if (data.action === 'loadPrivacy') {
        if (!user) return;
        const privacy = await getLocationPrivacy(user.uid);
        setLocationPrivacy(privacy);
        webViewRef.current?.injectJavaScript(`applySettings(${JSON.stringify(privacy)}); true;`);

        // Load history count
        try {
          const history = await getLocationHistory(user.uid);
          webViewRef.current?.injectJavaScript(`setHistoryCount(${history.length}); true;`);
        } catch (e) {
          webViewRef.current?.injectJavaScript(`setHistoryCount(0); true;`);
        }
      }
      else if (data.action === 'updateMode') {
        if (!user) return;
        const newPrivacy = { mode: data.mode, invisibleMode: usePrivacyStore.getState().locationPrivacy.invisibleMode };
        await updateLocationPrivacy(user.uid, newPrivacy);
        updatePrivacyMode(data.mode);
      }
      else if (data.action === 'toggleInvisible') {
        if (!user) return;
        const newPrivacy = { mode: usePrivacyStore.getState().locationPrivacy.mode, invisibleMode: data.invisibleMode };
        await updateLocationPrivacy(user.uid, newPrivacy);
        toggleInvisibleMode();
      }
      else if (data.action === 'clearHistory') {
        if (!user) return;
        Alert.alert(
          'Clear Location History',
          'This will permanently delete all your location history. This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Clear',
              style: 'destructive',
              onPress: async () => {
                try {
                  await deleteLocationHistory(user.uid);
                  webViewRef.current?.injectJavaScript(`onHistoryCleared(); true;`);
                } catch (error) {
                  console.error('[PrivacySettings] Error clearing history:', error);
                  Alert.alert('Error', 'Failed to clear history.');
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('[PrivacySettings] Error handling message:', error);
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
