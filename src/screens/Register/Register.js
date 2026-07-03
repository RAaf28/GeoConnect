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
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import Constants from 'expo-constants';
import { useThemeStore } from '../../store/stores';
import { createAccount, signInWithGoogle } from '../../services/authService';
import { getUserProfile, createUserProfile } from '../../services/firestoreService';

WebBrowser.maybeCompleteAuthSession();

export default function Register({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);
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

  // Detect if running in Expo Go client vs standalone/development builds.
  // In Expo Go, native client IDs will cause Google OAuth policy block because the package name (host.exp.exponent) mismatches the custom package name.
  const isExpoGo = Constants.appOwnership === 'expo' || Constants.executionEnvironment === 'storeClient';

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: isExpoGo ? undefined : process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: isExpoGo ? undefined : process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });

  useEffect(() => {
    if (response) {
      if (response.type === 'success') {
        const { id_token } = response.authentication;
        (async () => {
          setLoading(true);
          try {
            const authUser = await signInWithGoogle(id_token);
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
            Alert.alert("Google Login Error", error.message);
          } finally {
            setLoading(false);
          }
        })();
      } else {
        setLoading(false);
        if (response.type === 'error') {
          Alert.alert("Google Login Error", response.error?.message || "Authentication failed");
        }
      }
    }
  }, [response]);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match.");
      return;
    }
    if (!terms) {
      Alert.alert("Validation Error", "You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);
    try {
      const authUser = await createAccount(email.trim(), password, name.trim());
      await createUserProfile(authUser.uid, {
        displayName: name.trim(),
        email: email.trim(),
        photoURL: '',
        bio: '',
      });
      Alert.alert("Success", "Account created successfully!");
    } catch (error) {
      Alert.alert("Registration Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const webId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    if (!webId || webId === "your_web_client_id_here") {
      Alert.alert("Google Login Config Error", "Google Web Client ID is not configured in .env file.");
      return;
    }
    setLoading(true);
    promptAsync().catch((error) => {
      Alert.alert("Google Login Error", error.message);
      setLoading(false);
    });
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

          {/* Registration Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                Join the global network of modern explorers and map your journey.
              </Text>
            </View>

            {/* Full Name */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.textMuted }]}>FULL NAME</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <MaterialIcons name="person" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="John Doe"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Email Field */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.textMuted }]}>EMAIL ADDRESS</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <MaterialIcons name="email" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="explorer@geoconnect.com"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Row */}
            <View style={styles.passwordRow}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.label, { color: colors.textMuted }]}>PASSWORD</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                  <MaterialIcons name="lock" size={20} color={colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="••••••••"
                    placeholderTextColor={colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.label, { color: colors.textMuted }]}>CONFIRM</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                  <MaterialIcons name="security" size={20} color={colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="••••••••"
                    placeholderTextColor={colors.textMuted}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>
            </View>

            {/* Terms and Conditions Checkbox */}
            <TouchableOpacity
              style={styles.termsWrapper}
              onPress={() => setTerms(!terms)}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name={terms ? 'check-box' : 'check-box-outline-blank'}
                size={22}
                color={terms ? colors.primary : colors.textMuted}
              />
              <Text style={[styles.termsText, { color: colors.textMuted }]}>
                I agree to the{' '}
                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Terms of Service</Text> and{' '}
                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerBtn, { backgroundColor: colors.primary }]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.registerBtnText}>Register Account</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Social login divider and Google Login button */}
          <View style={{ width: '100%', maxWidth: 440 }}>
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textMuted }]}>OR JOIN WITH</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            <TouchableOpacity
              style={[styles.googleBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
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
              Already have an account?{' '}
              <Text
                style={[styles.footerLink, { color: colors.primary }]}
                onPress={() => navigation.navigate('Login')}
              >
                Login{' '}
                <MaterialIcons name="arrow-forward" size={14} color={colors.primary} />
              </Text>
            </Text>
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
    paddingVertical: 24,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
    marginBottom: 20,
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
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
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
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  termsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 12,
  },
  termsText: {
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  registerBtn: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#4648d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 2,
  },
  registerBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
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
    marginTop: 24,
    alignItems: 'center',
    width: '100%',
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontWeight: 'bold',
  },
});
