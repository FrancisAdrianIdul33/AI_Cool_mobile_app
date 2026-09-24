import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth';
import { Colors, Radii, Shadows, Spacing } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim()) {
      setError('Enter your account email.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send the reset link.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.width}>
            <View style={styles.brand}>
              <View style={styles.logo}>
                <Ionicons name="refresh" size={22} color={Colors.textOnDark} />
              </View>
              <AppText variant="subtitle" weight="bold">
                Reset password
              </AppText>
            </View>

            <View style={styles.card}>
              {sent ? (
                <View style={styles.sent}>
                  <Ionicons name="mail-open" size={22} color={Colors.mintDeep} />
                  <AppText variant="body" tone="secondary" style={styles.centerText}>
                    If that email exists, a reset link is on its way. Follow it to choose a new
                    password.
                  </AppText>
                </View>
              ) : (
                <>
                  <AppText variant="small" tone="secondary" style={styles.centerText}>
                    We&apos;ll email you a secure link to reset your password.
                  </AppText>
                  <Input
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    placeholder="you@school.edu"
                  />
                  {error ? (
                    <AppText variant="small" weight="medium" style={{ color: Colors.coral }}>
                      {error}
                    </AppText>
                  ) : null}
                  <Button label="Send reset link" onPress={submit} loading={busy} />
                </>
              )}
            </View>

            <Link href="/sign-in" asChild>
              <Pressable style={styles.link}>
                <AppText variant="small" weight="bold" style={{ color: Colors.mintDeep }}>
                  Back to sign in
                </AppText>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.shell,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  width: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    gap: Spacing.lg,
  },
  brand: {
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.card,
  },
  sent: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  centerText: {
    textAlign: 'center',
  },
  link: {
    alignItems: 'center',
    paddingVertical: 4,
  },
});