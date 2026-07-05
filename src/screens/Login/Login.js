import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useThemeStore } from '../../store/stores';
import { signInWithEmail, signInWithGoogle } from '../../services/authService';
import { getUserProfile, createUserProfile } from '../../services/firestoreService';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const isDark = useThemeStore((state) => state.isDark);

  const colors = {
    background: isDark ? '#1b1b23' : '#fcf8ff',
    text: isDark ? '#f2effb' : '#1b1b23',
    textMuted: isDark ? '#9fa2b2' : '#64748B',
    card: isDark ? '#303038' : '#ffffff',
    border: isDark ? 'rgba(199, 196, 215, 0.15)' : 'rgba(226, 232, 240, 0.8)',
    inputBg: isDark ? '#23232c' : '#fcf8ff',
    primary: '#4648d4',
  };

  // Removed unused web-based Expo Google Sign-In hook and effect in favor of the native Google SDK.

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmail(email.trim(), password.trim());
    } catch (error) {
      Alert.alert("Login Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const webId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    if (!webId || webId === "your_web_client_id_here") {
      Alert.alert("Google Login Config Error", "Google Web Client ID is not configured in .env file.");
      return;
    }
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken || userInfo.idToken;
      if (!idToken) {
        throw new Error("No ID Token returned from Google Sign-In");
      }
      const authUser = await signInWithGoogle(idToken);
      const profile = await getUserProfile(authUser.uid);
      if (!profile) {
        await createUserProfile(authUser.uid, {
          displayName: authUser.displayName || 'Explorer',
          email: authUser.email || '',
          photoURL: authUser.photoURL || '',
          bio: '',
        });
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the login flow, do nothing
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Google Login", "Sign-in already in progress.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Google Play Services", "Google Play Services is not available or outdated.");
      } else {
        Alert.alert("Google Login Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header Brand Identity */}
          <View style={styles.header}>
            <MaterialIcons name="explore" size={32} color={colors.primary} />
            <Text style={[styles.brandName, { color: colors.primary }]}>GeoConnect</Text>
          </View>

          {/* Login Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                Log in to explore your neighborhood and connect with local adventurers.
              </Text>
            </View>

            {/* Email Field */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.textMuted }]}>EMAIL ADDRESS</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <MaterialIcons name="email" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="alex@example.com"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.textMuted }]}>PASSWORD</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <MaterialIcons name="lock" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={secureText}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.visibilityToggle}>
                  <MaterialIcons
                    name={secureText ? 'visibility' : 'visibility-off'}
                    size={20}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, { backgroundColor: colors.primary }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <View style={styles.btnContent}>
                  <Text style={styles.loginBtnText}>Login</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
                </View>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textMuted }]}>OR EXPLORE WITH</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Google Login Button */}
            <TouchableOpacity
              style={[styles.googleBtn, { borderColor: colors.border }]}
              onPress={handleGoogleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <View style={styles.googleContent}>
                <MaterialIcons name="account-circle" size={20} color={colors.text} />
                <Text style={[styles.googleBtnText, { color: colors.text }]}>Continue with Google</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Footer Navigation */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textMuted }]}>
              Don't have an account?{' '}
              <Text
                style={[styles.footerLink, { color: colors.primary }]}
                onPress={() => navigation.navigate('Register')}
              >
                Register
              </Text>
            </Text>
            <View style={styles.footerLinksRow}>
              <TouchableOpacity style={styles.footerIconLink}>
                <MaterialIcons name="help-outline" size={14} color={colors.textMuted} />
                <Text style={[styles.footerLinkText, { color: colors.textMuted }]}>Help</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerIconLink}>
                <MaterialIcons name="language" size={14} color={colors.textMuted} />
                <Text style={[styles.footerLinkText, { color: colors.textMuted }]}>English</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    alignSelf: 'flex-start',
  },
  brandName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#4648d4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    flex: 1,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
  },
  visibilityToggle: {
    padding: 4,
  },
  loginBtn: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4648d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 2,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: 'bold',
    marginHorizontal: 16,
    letterSpacing: 1,
  },
  googleBtn: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleBtnText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
    width: '100%',
  },
  footerText: {
    fontSize: 14,
    marginBottom: 16,
  },
  footerLink: {
    fontWeight: 'bold',
  },
  footerLinksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerIconLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  footerLinkText: {
    fontSize: 12,
    marginLeft: 4,
  },
});
