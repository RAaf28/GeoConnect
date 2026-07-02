import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore } from '../../store/stores';
import { getUserProfile, updateUserProfile as updateFirestoreProfile } from '../../services/firestoreService';
import { updateUserProfile as updateAuthProfile } from '../../services/authService';
import { useAuthStore } from '../../store/stores';

const getHtmlContent = (isDark, user, profile) => {
  const displayName = user?.displayName || profile?.displayName || 'Explorer';
  const email = user?.email || profile?.email || '';
  const phone = profile?.phone || '';
  const address = profile?.address || '';
  const bio = profile?.bio || '';
  const photoURL = user?.photoURL || profile?.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName) + '&background=4648d4&color=fff&size=128';

  return `<!DOCTYPE html>
<html class="${isDark ? 'dark' : 'light'}" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>GeoConnect - Personal Information</title>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
              "primary": "#4648d4",
              "primary-container": "#6063ee",
              "on-primary": "#ffffff",
              "surface": "#fcf8ff",
              "on-surface": "#1b1b23",
              "surface-variant": "#e4e1ed",
              "on-surface-variant": "#464554",
              "outline-variant": "#c7c4d7",
              "surface-container-low": "#f5f2fe",
              "surface-glass": "rgba(252, 248, 255, 0.7)",
              "border-glass": "rgba(226, 232, 240, 0.3)",
            },
            "fontFamily": {
              "headline-md": ["Plus Jakarta Sans"],
              "body-md": ["Plus Jakarta Sans"],
              "label-md": ["Plus Jakarta Sans"],
              "label-sm": ["Plus Jakarta Sans"]
            }
          }
        }
      }
    </script>
<style>
        body {
            background: #fcf8ff;
            min-height: 100vh;
        }
        .dark body { background: #1b1b23; color: #f2effb; }
        .glass-panel {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(226, 232, 240, 0.8);
        }
        .dark .glass-panel {
            background: rgba(48, 48, 56, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
</head>
<body class="font-body-md text-on-surface dark:text-gray-100">
<header class="fixed top-0 w-full z-50 bg-surface/80 dark:bg-[#1b1b23]/80 backdrop-blur-lg border-b border-border-glass shadow-sm">
<div class="flex justify-between items-center px-4 h-16 w-full max-w-2xl mx-auto">
<div class="flex items-center gap-4">
<button class="p-2 rounded-full hover:bg-surface-container-low dark:hover:bg-white/10 transition-colors active:scale-95" onclick="sendMsg('goBack')">
<span class="material-symbols-outlined text-primary">arrow_back</span>
</button>
<h1 class="font-headline-md text-xl font-bold">Personal Info</h1>
</div>
</div>
</header>

<main class="pt-24 pb-12 px-4 max-w-2xl mx-auto">
<!-- User Profile Section -->
<section class="glass-panel rounded-xl p-8 mb-6 relative overflow-hidden">
<div class="flex flex-col items-center">
<div class="relative">
<div class="w-32 h-32 rounded-full border-4 border-white dark:border-gray-700 shadow-xl overflow-hidden bg-surface-variant">
<img id="profileImage" class="w-full h-full object-cover" src="${photoURL}"/>
</div>
<button onclick="sendMsg('editPhoto')" class="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-container transition-all active:scale-90 border-2 border-white dark:border-gray-700 flex items-center justify-center">
<span class="material-symbols-outlined text-[20px]">edit</span>
</button>
</div>
<div class="mt-4 text-center">
<h2 id="displayTitle" class="font-headline-md text-2xl font-bold">${displayName}</h2>
<p class="text-on-surface-variant dark:text-gray-400 font-body-md">${email}</p>
</div>
</div>
</section>

<!-- Form Fields Section -->
<section class="glass-panel rounded-xl p-6 space-y-6">
<h3 class="font-headline-md text-xl font-bold mb-4 border-b border-border-glass pb-4">Contact Details</h3>
<div class="space-y-4">
<!-- Full Name -->
<div class="space-y-1">
<label class="block font-label-md text-sm text-on-surface-variant dark:text-gray-400 ml-1">Full Name</label>
<div class="relative group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-gray-400 group-focus-within:text-primary transition-colors">person</span>
<input id="inputName" class="w-full bg-white dark:bg-gray-800 border border-outline-variant dark:border-gray-700 rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-md" type="text" value="${displayName}"/>
</div>
</div>

<!-- About Me (Bio) -->
<div class="space-y-1">
<label class="block font-label-md text-sm text-on-surface-variant dark:text-gray-400 ml-1">About Me</label>
<div class="relative group">
<span class="material-symbols-outlined absolute left-3 top-4 text-on-surface-variant dark:text-gray-400 group-focus-within:text-primary transition-colors">notes</span>
<textarea id="inputBio" rows="3" class="w-full bg-white dark:bg-gray-800 border border-outline-variant dark:border-gray-700 rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-md resize-none" placeholder="Write a short bio about yourself...">${bio}</textarea>
</div>
</div>

<!-- Phone Number -->
<div class="space-y-1">
<label class="block font-label-md text-sm text-on-surface-variant dark:text-gray-400 ml-1">Phone Number</label>
<div class="relative group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-gray-400 group-focus-within:text-primary transition-colors">call</span>
<input id="inputPhone" class="w-full bg-white dark:bg-gray-800 border border-outline-variant dark:border-gray-700 rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-md" type="tel" value="${phone}" placeholder="Add phone number"/>
</div>
</div>

<!-- Location -->
<div class="space-y-1">
<label class="block font-label-md text-sm text-on-surface-variant dark:text-gray-400 ml-1">Home Address</label>
<div class="relative group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-gray-400 group-focus-within:text-primary transition-colors">location_on</span>
<input id="inputAddress" class="w-full bg-white dark:bg-gray-800 border border-outline-variant dark:border-gray-700 rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-md" type="text" value="${address}" placeholder="Add home address"/>
</div>
</div>
</div>
</section>

<!-- Actions -->
<div class="mt-8 flex flex-col sm:flex-row justify-end gap-3">
<button onclick="sendMsg('goBack')" class="px-6 py-3 rounded-xl border border-outline-variant dark:border-gray-700 text-on-surface dark:text-gray-300 font-bold hover:bg-surface-variant/50 dark:hover:bg-gray-800 transition-all text-center">Cancel</button>
<button onclick="saveChanges()" id="saveBtn" class="px-6 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-2">
<span>Save Changes</span>
<span class="material-symbols-outlined text-[18px]">check_circle</span>
</button>
</div>
</main>

<script>
    let currentPhotoUrl = "${photoURL}";

    function sendMsg(action, data = {}) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ action, ...data }));
    }

    function saveChanges() {
        const name = document.getElementById('inputName').value.trim();
        const bio = document.getElementById('inputBio').value.trim();
        const phone = document.getElementById('inputPhone').value.trim();
        const address = document.getElementById('inputAddress').value.trim();

        if (!name) {
            alert("Name cannot be empty");
            return;
        }

        const btn = document.getElementById('saveBtn');
        btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span><span>Saving...</span>';
        btn.classList.add('opacity-80', 'pointer-events-none');

        sendMsg('saveChanges', { name, bio, phone, address, photoURL: currentPhotoUrl });
    }

    function updatePhotoPreview(url) {
        currentPhotoUrl = url;
        document.getElementById('profileImage').src = url;
    }

    // Update title dynamically as name is typed
    document.getElementById('inputName').addEventListener('input', function(e) {
        document.getElementById('displayTitle').textContent = e.target.value || 'Explorer';
    });
</script>
</body></html>`;
};

export default function PersonalInformation({ navigation }) {
  const { user } = useAuth();
  const isDark = useThemeStore((state) => state.isDark);
  const [profile, setProfile] = useState(null);
  const webViewRef = useRef(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          const userProfile = await getUserProfile(user.uid);
          setProfile(userProfile);
        } catch (error) {
          console.error("Error loading profile:", error);
        }
      }
    };
    loadProfile();
  }, [user]);

  // Inject dark mode class if needed
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
      } else if (data.action === 'editPhoto') {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert('Permission required', 'We need camera roll permissions to change your photo.');
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

        if (!result.canceled) {
          // Send back to webview to update preview instantly
          webViewRef.current?.injectJavaScript(`updatePhotoPreview('${result.assets[0].uri}'); true;`);
        }
      } else if (data.action === 'saveChanges') {
        if (!user) return;
        
        try {
          // Update Firebase Auth (Display Name & Photo URL)
          const updatedUser = await updateAuthProfile(data.name, data.photoURL);

          // Update Firestore Profile (Phone, Address, and mirrors for display)
          await updateFirestoreProfile(user.uid, {
            displayName: data.name,
            bio: data.bio,
            photoURL: data.photoURL,
            phone: data.phone,
            address: data.address,
          });

          // Update Zustand Auth Store to reflect globally
          const store = useAuthStore.getState();
          store.setUser({
            ...updatedUser,
            displayName: data.name,
            photoURL: data.photoURL,
          });

          Alert.alert("Success", "Personal information updated successfully.");
          navigation.goBack();
        } catch (error) {
          console.error("Error updating personal information:", error);
          Alert.alert("Error", "Failed to update information. Please try again.");
          // Reset button state in WebView on error
          webViewRef.current?.injectJavaScript(`
            const btn = document.getElementById('saveBtn');
            btn.innerHTML = '<span>Save Changes</span><span class="material-symbols-outlined text-[18px]">check_circle</span>';
            btn.classList.remove('opacity-80', 'pointer-events-none');
            true;
          `);
        }
      }
    } catch (error) {
      console.error('[PersonalInformation] Error handling message:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: getHtmlContent(isDark, user, profile) }}
        style={styles.webview}
        originWhitelist={['*']}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
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