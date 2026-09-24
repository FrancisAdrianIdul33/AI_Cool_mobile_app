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

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signUp(email.trim(), password, username.trim() || undefined, fullName.trim() || undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create the account.');
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
                <Ionicons name="leaf" size={24} color={Colors.textOnDark} />
              </View>
              <AppText variant="subtitle" weight="bold">
                Join CarbonTrail
              </AppText>
            </View>

            <View style={styles.card}>
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
                label="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoComplete="username"
                placeholder="jambert"
              />
              <Input
                label="Full name (optional)"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                placeholder="Jambert Reyes"
              />
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                placeholder="At least 6 characters"
              />
              <Input
                label="Confirm password"
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry
                autoCapitalize="none"
                placeholder="Repeat your password"
              />
              {error ? (
                <AppText variant="small" weight="medium" style={{ color: Colors.coral }}>
                  {error}
                </AppText>
              ) : null}
              <Button label="Create account" onPress={submit} loading={busy} />
            </View>

            <View style={styles.switchRow}>
              <AppText variant="small" tone="secondary">
                Already have an account?
              </AppText>
              <Link href="/sign-in" asChild>
                <Pressable>
                  <AppText variant="small" weight="bold" style={{ color: Colors.mintDeep }}>
                    Sign in
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
});