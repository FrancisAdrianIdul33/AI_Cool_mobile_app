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
import { Colors, Shadows, Spacing } from '@/constants/theme';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not sign in.');
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
                <Ionicons name="leaf" size={28} color={Colors.textOnDark} />
              </View>
              <AppText variant="heading" weight="bold">
                CarbonTrail
              </AppText>
              <AppText variant="small" tone="muted" style={styles.tagline}>
                Walk the planet back to green.
              </AppText>
            </View>

            <View style={styles.card}>
              <AppText variant="subtitle" weight="semibold">
                Welcome back
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
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                placeholder="••••••••"
              />
              {error ? (
                <AppText variant="small" weight="medium" style={{ color: Colors.coral }}>
                  {error}
                </AppText>
              ) : null}
              <Button label="Sign In" onPress={submit} loading={busy} />
              <Link href="/forgot-password" asChild>
                <Pressable style={styles.link}>
                  <AppText variant="small" weight="semibold" tone="mint">
                    Forgot password?
                  </AppText>
                </Pressable>
              </Link>
            </View>

            <View style={styles.switchRow}>
              <AppText variant="small" tone="secondary">
                New to CarbonTrail?
              </AppText>
              <Link href="/sign-up" asChild>
                <Pressable>
                  <AppText variant="small" weight="bold" style={{ color: Colors.mintDeep }}>
                    Create account
                  </AppText>
                </Pressable>
              </Link>
            </View>
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
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: {
    marginTop: 2,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.card,
  },
  link: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
});