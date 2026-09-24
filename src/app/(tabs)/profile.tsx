import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScreenState } from '@/components/ui/screen-state';
import { StatCard } from '@/components/ui/stat-card';
import { useAuth } from '@/context/auth';
import { BottomTabInset, Colors, MaxContentWidth, Radii, Spacing } from '@/constants/theme';
import { useProfile } from '@/hooks/use-profile';
import { initialsOf } from '@/lib/types';

export default function ProfileScreen() {
  const { session, signOut } = useAuth();
  const { profile, profileReady, saving, error, save } = useProfile();

  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');

  const name = profile?.username ?? profile?.full_name ?? 'Explorer';
  const handle = profile?.username ? `@${profile.username}` : profile?.full_name ?? '';

  const openEditor = () => {
    setUsername(profile?.username ?? '');
    setFullName(profile?.full_name ?? '');
    setBio(profile?.bio ?? '');
    setEditing(true);
  };

  const submitEdit = async () => {
    await save({ username, full_name: fullName, bio });
    setEditing(false);
  };

  const logout = async () => {
    try {
      await signOut();
    } catch {
      // No-op: keep the session state driven by supabase onAuthStateChange.
    }
  };

  if (!profileReady) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.width}>
          <ScreenState loading />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.width}>
          <AppText variant="caption" weight="semibold" tone="muted">
            PROFILE
          </AppText>

          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <AppText variant="subtitle" weight="bold" style={{ color: Colors.textOnDark }}>
                {initialsOf(name)}
              </AppText>
            </View>
            <View style={styles.identity}>
              <AppText variant="heading" weight="semibold">
                {name}
              </AppText>
              {handle ? (
                <AppText variant="small" tone="muted">
                  {handle}
                </AppText>
              ) : null}
              {profile?.bio ? (
                <AppText variant="small" tone="secondary" style={styles.bio}>
                  {profile.bio}
                </AppText>
              ) : null}
            </View>
            <View style={styles.chips}>
              <Badge label={`Lv ${profile?.level ?? 1}`} variant="green" />
              <Badge label={`${profile?.streak ?? 0}-day streak`} variant="mint" />
            </View>
          </View>

          <View style={styles.statsGrid}>
            <StatCard label="Level" value={`Lv ${profile?.level ?? 1}`} icon="shield-checkmark" />
            <StatCard label="Day streak" value={`${profile?.streak ?? 0}`} icon="flame" />
            <StatCard
              label="Longest streak"
              value={`${profile?.longest_streak ?? 0}`}
              icon="trophy"
            />
            <StatCard
              label="Weekly budget"
              value={`${profile?.weekly_carbon_budget ?? 30} kg`}
              icon="cloud-outline"
              iconTintMint
            />
          </View>

          {editing ? (
            <View style={styles.editor}>
              <View style={styles.editorHeader}>
                <AppText variant="label" weight="semibold">
                  Edit profile
                </AppText>
                <Pressable onPress={() => setEditing(false)} accessibilityRole="button">
                  <Ionicons name="close" size={20} color={Colors.textMuted} />
                </Pressable>
              </View>
              <Input
                label="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholder="jambert"
              />
              <Input
                label="Full name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                placeholder="Jambert Reyes"
              />
              <Input
                label="Bio"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
                placeholder="Small steps, big impact…"
              />
              {error ? (
                <AppText variant="small" weight="medium" style={{ color: Colors.coral }}>
                  {error}
                </AppText>
              ) : null}
              <Button label="Save changes" onPress={submitEdit} loading={saving} />
            </View>
          ) : (
            <View style={styles.menu}>
              <Pressable
                accessibilityRole="button"
                onPress={openEditor}
                style={({ pressed }) => [styles.menuRow, pressed && { opacity: 0.7 }]}>
                <View style={styles.menuIcon}>
                  <Ionicons name="person-circle-outline" size={18} color={Colors.green} />
                </View>
                <AppText variant="title" weight="medium" style={styles.menuLabel}>
                  Edit profile
                </AppText>
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              </Pressable>
              <View style={styles.menuRow}>
                <View style={styles.menuIcon}>
                  <Ionicons name="people-outline" size={18} color={Colors.green} />
                </View>
                <AppText variant="title" weight="medium" style={styles.menuLabel}>
                  My community
                </AppText>
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              </View>
              <View style={styles.menuRow}>
                <View style={styles.menuIcon}>
                  <Ionicons name="notifications-outline" size={18} color={Colors.green} />
                </View>
                <AppText variant="title" weight="medium" style={styles.menuLabel}>
                  Notifications
                </AppText>
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={logout}
                style={({ pressed }) => [styles.menuRow, pressed && { opacity: 0.7 }]}>
                <View style={styles.menuIcon}>
                  <Ionicons name="log-out-outline" size={18} color={Colors.coral} />
                </View>
                <AppText variant="title" weight="medium" style={styles.menuLabel}>
                  Log out
                </AppText>
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              </Pressable>
            </View>
          )}

          <AppText variant="caption" tone="muted" style={styles.footer}>
            CarbonTrail{session?.user?.email ? ` · ${session.user.email}` : ''} · made for SDG 13
          </AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.shell,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: BottomTabInset + Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  width: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  profileCard: {
    backgroundColor: Colors.background,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: 10,
    marginTop: Spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identity: {
    alignItems: 'center',
    gap: 2,
  },
  bio: {
    marginTop: 2,
    textAlign: 'center',
  },
  chips: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  editor: {
    backgroundColor: Colors.background,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menu: {
    backgroundColor: Colors.background,
    borderRadius: Radii.card,
    marginTop: Spacing.xl,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
  },
  footer: {
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});