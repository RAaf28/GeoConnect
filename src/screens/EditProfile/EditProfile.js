import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/stores';
import { updateUserProfile } from '../../services/authService';
import { getUserProfile, updateUserProfile as updateFirestoreProfile } from '../../services/firestoreService';
import { uploadProfilePhoto } from '../../services/storageService';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfile({ navigation }) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState(user?.photoURL || '');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.uid) {
        try {
          const profile = await getUserProfile(user.uid);
          if (profile?.bio) {
            setBio(profile.bio);
          }
        } catch (e) {
          console.error("Failed to load profile for edit", e);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const pickImage = async () => {
    // Request permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission denied', 'Permission to access camera roll is required to pick images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    try {
      let finalPhotoUrl = photoUrl || '';

      // If the photo is a local URI, upload it to Firebase Storage first
      // Local URIs (file://, content://, ph://) are only accessible on this device
      // and will break when accessed from a different IP or device.
      const isLocalUri = finalPhotoUrl && (
        finalPhotoUrl.startsWith('file://') ||
        finalPhotoUrl.startsWith('content://') ||
        finalPhotoUrl.startsWith('ph://') ||
        (finalPhotoUrl.startsWith('/') && !finalPhotoUrl.startsWith('//'))
      );

      if (isLocalUri) {
        console.log('[EditProfile] Uploading profile photo to Firebase Storage...');
        finalPhotoUrl = await uploadProfilePhoto(
          user.uid,
          finalPhotoUrl,
          (progress) => setUploadProgress(progress)
        );
        console.log('[EditProfile] Upload complete. Download URL:', finalPhotoUrl);
      }

      // Update Firebase Auth with the persistent download URL
      const updatedUser = await updateUserProfile(name.trim(), finalPhotoUrl || undefined);

      // Update Firestore with the persistent download URL
      await updateFirestoreProfile(user.uid, {
        displayName: name.trim(),
        bio: bio.trim(),
        photoURL: finalPhotoUrl || '',
      });

      // Update auth store so the app immediately reflects changes
      const store = useAuthStore.getState();
      store.setUser({
        ...updatedUser,
        displayName: name.trim(),
        photoURL: finalPhotoUrl || '',
      });

      // Update local state so UI reflects the new persistent URL
      setPhotoUrl(finalPhotoUrl);

      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile: ' + error.message);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Profile Information</Text>

            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={pickImage} style={styles.avatarButton}>
                {photoUrl ? (
                  <Image
                    source={{ uri: photoUrl }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>
                      {(name || 'U').charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.cameraIcon}>
                  <Text style={styles.cameraText}>📷</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.avatarLabel}>Tap to change photo</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Display Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your display name"
                autoCapitalize="words"
                placeholderTextColor="#64748B"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>About Me</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={bio}
                onChangeText={setBio}
                placeholder="Write a short bio about yourself..."
                multiline
                numberOfLines={3}
                placeholderTextColor="#64748B"
              />
            </View>
          </View>

          <View style={styles.actionSection}>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isLoading}
              style={[
                styles.button,
                isLoading && styles.buttonLoading,
                !name.trim() && styles.buttonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
              ) : null}
              <Text style={[
                styles.buttonText,
                !name.trim() && styles.buttonTextDisabled,
              ]}>
                {isLoading && uploadProgress > 0 && uploadProgress < 100
                  ? `Uploading... ${uploadProgress}%`
                  : 'Save Changes'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf8ff',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1b1b23',
    marginVertical: 16,
    marginHorizontal: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarButton: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e4e1ed',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4648d4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 6,
    borderRadius: 20,
  },
  cameraText: {
    fontSize: 18,
    color: '#fff',
  },
  avatarLabel: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
  },
  inputGroup: {
    marginHorizontal: 24,
    marginVertical: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1b1b23',
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1b1b23',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  actionSection: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
  },
  button: {
    backgroundColor: '#4648d4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLoading: {
    opacity: 0.8,
  },
  buttonDisabled: {
    backgroundColor: '#e2e8f0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#64748B',
  },
  cancelButton: {
    marginTop: 16,
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '500',
  },
});