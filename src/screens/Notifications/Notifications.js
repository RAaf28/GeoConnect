import React, { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore, useNotificationStore } from '../../store/stores';
import { getNotifications, markAsRead, markAllAsRead, getUnreadCount } from '../../services/notificationService';

const getHtmlContent = (isDark) => {
  return `<!DOCTYPE html><html class="${isDark ? 'dark' : 'light'}" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>GeoConnect | Notifications</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
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
                    "surface":"#fcf8ff","tertiary":"#904900","tertiary-container":"#b55d00",
                    "on-error-container":"#93000a","error-container":"#ffdad6",
                    "inverse-primary":"#c0c1ff","primary-fixed":"#e1e0ff","outline":"#767586",
                    "surface-tint":"#494bd6","on-primary-container":"#fffbff",
                    "secondary":"#565e74","on-background":"#1b1b23"
            },
            "borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},
            "spacing":{"gutter-grid":"16px","margin-page":"24px","stack-gap":"12px","safe-area":"32px"},
            "fontFamily":{"technical-label":["JetBrains Mono"],"headline-lg":["Plus Jakarta Sans"],"headline-lg-mobile":["Plus Jakarta Sans"],"body-lg":["Plus Jakarta Sans"],"headline-md":["Plus Jakarta Sans"],"body-md":["Plus Jakarta Sans"]},
            "fontSize":{"technical-label":["12px",{"lineHeight":"1.4","fontWeight":"500"}],"headline-lg":["32px",{"lineHeight":"1.2","letterSpacing":"-0.02em","fontWeight":"700"}],"headline-lg-mobile":["28px",{"lineHeight":"1.2","fontWeight":"700"}],"body-lg":["16px",{"lineHeight":"1.6","fontWeight":"400"}],"headline-md":["24px",{"lineHeight":"1.2","letterSpacing":"-0.01em","fontWeight":"700"}],"body-md":["14px",{"lineHeight":"1.6","fontWeight":"400"}]}
          },
        },
      }
    </script>
<style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .whisper-shadow { box-shadow: 0 10px 30px -10px rgba(70, 72, 212, 0.08); }
        .stagger-reveal { animation: staggerReveal 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; transform: translateY(10px); }
        @keyframes staggerReveal { to { opacity: 1; transform: translateY(0); } }
        .glass-panel { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        @keyframes delayedFadeIn {
            0% { opacity: 0; }
            80% { opacity: 0; }
            100% { opacity: 1; }
        }
        .delayed-fade {
            animation: delayedFadeIn 1s forwards;
            opacity: 0;
        }
    </style>
</head>
<body class="bg-background dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface font-body-md min-h-screen pb-4">
<header class="fixed top-0 w-full z-50 bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-md shadow-sm h-16 flex justify-between items-center px-margin-page">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[28px]">explore</span>
<span class="text-headline-md font-headline-md text-primary tracking-tight">GeoConnect</span>
</div>
<div class="flex items-center gap-3">
<button onclick="markAllRead()" class="text-technical-label font-technical-label text-primary hover:underline">Mark all read</button>
</div>
</header>

<main class="pt-20 pb-4 max-w-2xl mx-auto px-margin-page min-h-screen">
<h2 class="text-headline-lg-mobile font-headline-lg-mobile mb-4 text-on-surface dark:text-inverse-on-surface">Notifications</h2>
<div id="notifContainer">
    <div id="loadingState" class="flex flex-col items-center justify-center py-20 gap-3 delayed-fade">
        <span class="material-symbols-outlined text-primary animate-spin text-3xl">progress_activity</span>
        <p class="text-muted-zinc">Loading notifications...</p>
    </div>
</div>
</main>

<script>
        function formatTimeAgo(dateStr) {
            if (!dateStr) return 'now';
            const date = dateStr.seconds ? new Date(dateStr.seconds * 1000) : new Date(dateStr);
            const now = new Date();
            const diffMs = now - date;
            const diffMin = Math.floor(diffMs / 60000);
            if (diffMin < 1) return 'now';
            if (diffMin < 60) return diffMin + 'm ago';
            const diffH = Math.floor(diffMin / 60);
            if (diffH < 24) return diffH + 'h ago';
            const diffD = Math.floor(diffH / 24);
            return diffD + 'd ago';
        }

        function getNotifIcon(type) {
            const icons = {
                'like': 'favorite', 'comment': 'chat_bubble', 'follow': 'person_add',
                'event': 'event', 'checkin': 'location_on', 'rsvp': 'calendar_today'
            };
            return icons[type] || 'notifications';
        }

        function getNotifColor(type) {
            const colors = {
                'like': 'bg-error/10 text-error', 'comment': 'bg-primary/10 text-primary',
                'follow': 'bg-primary/10 text-primary', 'event': 'bg-tertiary/10 text-tertiary',
                'checkin': 'bg-primary/10 text-primary', 'rsvp': 'bg-tertiary/10 text-tertiary'
            };
            return colors[type] || 'bg-primary/10 text-primary';
        }

        function renderNotifications(notifs) {
            const container = document.getElementById('notifContainer');
            if (!notifs || notifs.length === 0) {
                container.innerHTML = '<div class="flex flex-col items-center py-16 gap-3"><span class="material-symbols-outlined text-muted-zinc text-4xl">notifications_off</span><p class="text-on-surface-variant dark:text-inverse-on-surface font-bold text-lg">All caught up!</p><p class="text-muted-zinc text-sm">No notifications yet</p></div>';
                return;
            }

            container.innerHTML = '<div class="space-y-2">' + notifs.map((n, idx) => {
                const icon = getNotifIcon(n.type);
                const colorClass = getNotifColor(n.type);
                const time = formatTimeAgo(n.createdAt);
                const message = n.message || 'New notification';
                const photo = n.fromUserPhoto || '';
                const unreadDot = !n.read ? '<div class="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full"></div>' : '';
                const bgClass = !n.read ? 'bg-primary/5 dark:bg-primary/10' : 'bg-surface-pure dark:bg-white/5';
                const avatarHtml = photo ? '<img class="w-full h-full object-cover rounded-full" src="' + photo + '">' : '<div class="w-full h-full rounded-full ' + colorClass + ' flex items-center justify-center"><span class="material-symbols-outlined text-[18px]">' + icon + '</span></div>';

                let onClickAction = '';
                if (n.type === 'like' || n.type === 'comment') {
                    onClickAction = "window.ReactNativeWebView.postMessage(JSON.stringify({action:'openPost', postId:'" + (n.postId || '') + "', notifId:'" + n.id + "'}))";
                } else if (n.type === 'event' || n.type === 'rsvp') {
                    onClickAction = "window.ReactNativeWebView.postMessage(JSON.stringify({action:'openEvent', eventId:'" + (n.eventId || '') + "', notifId:'" + n.id + "'}))";
                } else {
                    onClickAction = "window.ReactNativeWebView.postMessage(JSON.stringify({action:'markAsRead', notifId:'" + n.id + "'}))";
                }

                return '<div class="stagger-reveal relative ' + bgClass + ' rounded-xl p-4 whisper-shadow border border-soft-border dark:border-white/10 flex items-center gap-3 cursor-pointer hover:bg-surface-container-low dark:hover:bg-white/10 transition-colors" style="animation-delay: ' + (idx * 0.05) + 's;" onclick="' + onClickAction + '">' +
                    unreadDot +
                    '<div class="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-soft-border dark:border-white/10">' + avatarHtml + '</div>' +
                    '<div class="flex-1 min-w-0">' +
                        '<p class="text-body-md text-on-surface dark:text-inverse-on-surface leading-snug">' + message + '</p>' +
                        '<p class="text-technical-label font-technical-label text-muted-zinc mt-1">' + time + '</p>' +
                    '</div>' +
                    '<div class="w-8 h-8 rounded-lg ' + colorClass + ' flex items-center justify-center flex-shrink-0"><span class="material-symbols-outlined text-[18px]">' + icon + '</span></div>' +
                '</div>';
            }).join('') + '</div>';
        }

        function markAllRead() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'markAllRead' }));
        }

        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'loadNotifications' }));
            }, 300);
        });
    </script>
</body></html>`;
};

export default function Notifications({ navigation }) {
  const { user } = useAuth();
  const isDark = useThemeStore((state) => state.isDark);
  const { setNotifications, setUnreadCount, markAsReadLocal, markAllReadLocal } = useNotificationStore();
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

      if (data.action === 'loadNotifications') {
        if (!user) return;
        const notifs = await getNotifications(user.uid, 50);
        const unread = await getUnreadCount(user.uid);
        setNotifications(notifs);
        setUnreadCount(unread);
        webViewRef.current?.injectJavaScript(`renderNotifications(${JSON.stringify(notifs)}); true;`);
      }
      else if (data.action === 'markAsRead') {
        if (data.notifId) {
          await markAsRead(data.notifId);
          markAsReadLocal(data.notifId);
        }
      }
      else if (data.action === 'markAllRead') {
        if (!user) return;
        await markAllAsRead(user.uid);
        markAllReadLocal();
        // Reload to update UI
        const notifs = await getNotifications(user.uid, 50);
        setNotifications(notifs);
        setUnreadCount(0);
        webViewRef.current?.injectJavaScript(`renderNotifications(${JSON.stringify(notifs)}); true;`);
      }
      else if (data.action === 'openPost') {
        if (data.notifId) {
          await markAsRead(data.notifId);
          markAsReadLocal(data.notifId);
        }
        if (data.postId) {
          navigation.navigate('PostDetail', { postId: data.postId });
        }
      }
      else if (data.action === 'openEvent') {
        if (data.notifId) {
          await markAsRead(data.notifId);
          markAsReadLocal(data.notifId);
        }
        if (data.eventId) {
          navigation.navigate('EventDetail', { eventId: data.eventId });
        }
      }
    } catch (error) {
      console.error('[Notifications] Error handling message:', error);
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
