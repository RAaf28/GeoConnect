import React, { useState } from 'react';
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
import { useThemeStore } from '../../store/stores';
import { sendPasswordReset } from '../../services/authService';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const isDark = useThemeStore((state) => state.isDark);

  const colors = {
    background: isDark ? '#1b1b23' : '#fcf8ff',
    text: isDark ? '#f2effb' : '#1b1b23',
    textMuted: isDark ? '#9fa2b2' : '#64748B',
    card: isDark ? '#303038' : '#ffffff',
    border: isDark ? 'rgba(199, 196, 215, 0.15)' : 'rgba(226, 232, 240, 0.8)',
    inputBg: isDark ? '#23232c' : '#fcf8ff',
    primary: '#4648d4',
    successBg: isDark ? 'rgba(74, 222, 128, 0.1)' : '#f0fdf4',
    successText: isDark ? '#4ade80' : '#16a34a',
  };

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordReset(email.trim());
      setSuccess(true);
    } catch (error) {
      Alert.alert("Reset Error", error.message);
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
          {/* Header Back Button & Brand Title */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <MaterialIcons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.brandContainer}>
              <MaterialIcons name="explore" size={24} color={colors.primary} />
              <Text style={[styles.brandName, { color: colors.primary }]}>GeoConnect</Text>
            </View>
          </View>

          {/* Reset Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {!success ? (
              <>
                <View style={styles.cardHeader}>
                  <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
                  <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                    Enter your email address and we'll send you a link to reset your password.
                  </Text>
                </View>

                {/* Email Input */}
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

                {/* CTA Button */}
                <TouchableOpacity
                  style={[styles.ctaBtn, { backgroundColor: colors.primary }]}
                  onPress={handleReset}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <View style={styles.btnContent}>
                      <Text style={styles.ctaBtnText}>Send Reset Link</Text>
                      <MaterialIcons name="send" size={18} color="#ffffff" />
                    </View>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              /* Success State */
              <View style={styles.successState}>
                <View style={[styles.successIconWrapper, { backgroundColor: colors.successBg }]}>
                  <MaterialIcons name="check-circle" size={48} color={colors.successText} />
                </View>
                <Text style={[styles.title, { color: colors.text, textAlign: 'center' }]}>Check your inbox</Text>
                <Text style={[styles.subtitle, { color: colors.textMuted, textAlign: 'center' }]}>
                  We've sent a recovery link to your email address. It may take a few minutes to arrive.
                </Text>
                <TouchableOpacity
                  style={[styles.retryBtn, { borderColor: colors.primary }]}
                  onPress={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                >
                  <Text style={[styles.retryBtnText, { color: colors.primary }]}>
                    TRY ANOTHER EMAIL
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Back to Sign In Link */}
            <View style={[styles.footerDivider, { borderTopColor: colors.border }]}>
              <Text style={[styles.footerText, { color: colors.textMuted }]}>
                Remember your password?{' '}
                <Text
                  style={[styles.footerLink, { color: colors.primary }]}
                  onPress={() => navigation.navigate('Login')}
                >
                  Sign in
                </Text>
              </Text>
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
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 440,
    marginBottom: 32,
  },
  backBtn: {
    padding: 8,
    borderRadius: 8,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 6,
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
    marginBottom: 24,
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
  ctaBtn: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  ctaBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  successState: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  successIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  retryBtn: {
    marginTop: 24,
    borderWidth: 1,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  footerDivider: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontWeight: 'bold',
  },
});
