import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore, useLocationStore } from '../../store/stores';
import { createPost } from '../../services/firestoreService';
import { uploadPostImage } from '../../services/storageService';
import { encodeGeoHash } from '../../utils/geoUtils';

const getHtmlContent = (isDark) => {
  return `<!DOCTYPE html><html class="${isDark ? 'dark' : 'light'}" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>GeoConnect | Create Post</title>
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
                    "surface":"#fcf8ff","tertiary":"#904900","on-error-container":"#93000a",
                    "error-container":"#ffdad6","inverse-primary":"#c0c1ff","primary-fixed":"#e1e0ff",
                    "outline":"#767586","surface-tint":"#494bd6","on-primary-container":"#fffbff",
                    "secondary":"#565e74","on-background":"#1b1b23"
            },
            "borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},
            "spacing":{"gutter-grid":"16px","margin-page":"24px","stack-gap":"12px","safe-area":"32px"},
            "fontFamily":{"technical-label":["JetBrains Mono"],"headline-lg":["Plus Jakarta Sans"],"headline-lg-mobile":["Plus Jakarta Sans"],"body-lg":["Plus Jakarta Sans"],"headline-md":["Plus Jakarta Sans"],"body-md":["Plus Jakarta Sans"]},
            "fontSize":{"technical-label":["12px",{"lineHeight":"1.4","fontWeight":"500"}],"headline-md":["24px",{"lineHeight":"1.2","letterSpacing":"-0.01em","fontWeight":"700"}],"body-md":["14px",{"lineHeight":"1.6","fontWeight":"400"}],"body-lg":["16px",{"lineHeight":"1.6","fontWeight":"400"}]}
          },
        },
      }
    </script>
<style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .whisper-shadow { box-shadow: 0 10px 30px -10px rgba(70, 72, 212, 0.08); }
    </style>
</head>
<body class="bg-background dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface font-body-md min-h-screen">
<!-- Header -->
<header class="fixed top-0 w-full z-50 bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-md shadow-sm h-16 flex justify-between items-center px-margin-page">
<button onclick="cancelPost()" class="p-2 rounded-full hover:bg-surface-variant/50 dark:hover:bg-white/10 transition-colors">
<span class="material-symbols-outlined text-on-surface dark:text-inverse-on-surface">close</span>
</button>
<h1 class="text-headline-md font-headline-md text-primary tracking-tight">New Post</h1>
<button id="postBtn" onclick="submitPost()" class="bg-primary text-on-primary px-5 py-2 rounded-full font-bold text-sm hover:-translate-y-px transition-all">Post</button>
</header>

<main class="mt-20 px-margin-page max-w-2xl mx-auto space-y-6 pb-8">
<!-- Image Upload Area -->
<div id="imageArea" onclick="pickImage()" class="bg-surface-pure dark:bg-white/5 rounded-2xl border-2 border-dashed border-outline-variant dark:border-white/20 p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 transition-colors min-h-[200px]">
    <span class="material-symbols-outlined text-4xl text-muted-zinc">add_photo_alternate</span>
    <p class="text-muted-zinc font-bold">Tap to add a photo</p>
    <p class="text-muted-zinc text-xs">Share your discovery with the world</p>
</div>

<!-- Caption Input -->
<div class="bg-surface-pure dark:bg-white/5 rounded-xl whisper-shadow border border-soft-border dark:border-white/10 p-4">
    <textarea id="captionInput" class="w-full bg-transparent border-none focus:ring-0 text-on-surface dark:text-inverse-on-surface placeholder-muted-zinc font-body-md resize-none outline-none" rows="4" placeholder="What did you discover? ✨"></textarea>
</div>

<!-- Location Tag -->
<div id="locationTag" class="bg-surface-pure dark:bg-white/5 rounded-xl whisper-shadow border border-soft-border dark:border-white/10 p-4 flex items-center gap-3">
    <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <span class="material-symbols-outlined text-primary">location_on</span>
    </div>
    <div class="flex-1">
        <p class="font-bold text-on-surface dark:text-inverse-on-surface text-sm">Add Location</p>
        <p id="locationLabel" class="text-muted-zinc text-xs">Your current location will be tagged</p>
    </div>
    <span class="material-symbols-outlined text-outline-variant">chevron_right</span>
</div>

<!-- Posting indicator (hidden by default) -->
<div id="postingOverlay" class="hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-center justify-center">
    <div class="bg-surface-pure dark:bg-inverse-surface rounded-2xl p-8 flex flex-col items-center gap-4 whisper-shadow">
        <span class="material-symbols-outlined text-primary animate-spin text-4xl">progress_activity</span>
        <p class="font-bold text-on-surface dark:text-inverse-on-surface">Creating your post...</p>
        <div id="uploadProgress" class="w-48 h-1.5 bg-surface-container rounded-full overflow-hidden">
            <div id="progressBar" class="h-full bg-primary rounded-full transition-all" style="width: 0%"></div>
        </div>
    </div>
</div>
</main>

<script>
        let hasImage = false;

        function cancelPost() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'cancelPost' }));
        }

        function pickImage() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'pickImage' }));
        }

        function setImagePreview(uri) {
            const area = document.getElementById('imageArea');
            area.innerHTML = '<img class="w-full rounded-xl object-cover max-h-[400px]" src="' + uri + '"><div class="absolute top-2 right-2 bg-black/50 backdrop-blur-md p-2 rounded-full cursor-pointer" onclick="event.stopPropagation(); pickImage();"><span class="material-symbols-outlined text-white text-sm">edit</span></div>';
            area.classList.remove('border-dashed', 'p-8');
            area.classList.add('relative', 'overflow-hidden', 'p-0');
            hasImage = true;
        }

        function setLocationLabel(label) {
            document.getElementById('locationLabel').textContent = label || 'Location tagged';
        }

        function submitPost() {
            const caption = document.getElementById('captionInput').value.trim();
            if (!hasImage && !caption) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'showError', message: 'Please add a photo or write a caption.' }));
                return;
            }
            document.getElementById('postingOverlay').classList.remove('hidden');
            document.getElementById('postBtn').disabled = true;
            window.ReactNativeWebView.postMessage(JSON.stringify({
                action: 'submitPost',
                caption: caption
            }));
        }

        function updateProgress(pct) {
            document.getElementById('progressBar').style.width = pct + '%';
        }

        function onPostComplete() {
            document.getElementById('postingOverlay').classList.add('hidden');
            document.getElementById('postBtn').disabled = false;
        }

        function onPostError() {
            document.getElementById('postingOverlay').classList.add('hidden');
            document.getElementById('postBtn').disabled = false;
        }
    </script>
</body></html>`;
};

export default function CreatePost({ navigation }) {
  const { user } = useAuth();
  const isDark = useThemeStore((state) => state.isDark);
  const { currentLocation } = useLocationStore();
  const webViewRef = useRef(null);
  const [selectedImageUri, setSelectedImageUri] = useState(null);

  useEffect(() => {
    webViewRef.current?.injectJavaScript(`
      document.documentElement.className = "${isDark ? 'dark' : 'light'}";
      true;
    `);
  }, [isDark]);

  const handleMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.action === 'cancelPost') {
        navigation.goBack();
      }
      else if (data.action === 'pickImage') {
        const permResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permResult.granted) {
          Alert.alert('Permission Needed', 'Please grant photo library access to upload images.');
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 5],
          quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const uri = result.assets[0].uri;
          setSelectedImageUri(uri);
          webViewRef.current?.injectJavaScript(`setImagePreview('${uri}'); true;`);
        }
      }
      else if (data.action === 'submitPost') {
        if (!user) {
          Alert.alert('Login Required', 'Please log in to create a post.');
          webViewRef.current?.injectJavaScript(`onPostError(); true;`);
          return;
        }

        // Create a promise that rejects after 15 seconds
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Post creation timeout')), 15000);
        });

        try {
          // Race the submission against the timeout
          await Promise.race([
            (async () => {
              let imageURL = '';
              if (selectedImageUri) {
                imageURL = await uploadPostImage(user.uid, selectedImageUri, (progress) => {
                  webViewRef.current?.injectJavaScript(`updateProgress(${progress}); true;`);
                });
              }

              const lat = currentLocation?.latitude || null;
              const lng = currentLocation?.longitude || null;
              const geoHash = (lat && lng) ? encodeGeoHash(lat, lng) : null;

              await createPost(user.uid, {
                caption: data.caption || '',
                imageURL,
                geoHash,
                lat,
                lng,
                locationLabel: currentLocation ? 'Current Location' : '',
              });
            })(),
            timeoutPromise
          ]);

          webViewRef.current?.injectJavaScript(`onPostComplete(); true;`);
          Alert.alert('Success', 'Your post has been shared!', [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
        } catch (error) {
          console.error('[CreatePost] Error creating post:', error);
          webViewRef.current?.injectJavaScript(`onPostError(); true;`);
          if (error.message === 'Post creation timeout') {
            Alert.alert('Timeout', 'Post creation took too long. Please check your connection and try again.');
          } else {
            Alert.alert('Error', 'Failed to create post. Please try again.');
          }
        }
      }
      else if (data.action === 'showError') {
        Alert.alert('Missing Content', data.message);
      }
    } catch (error) {
      console.error('[CreatePost] Error handling message:', error);
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
