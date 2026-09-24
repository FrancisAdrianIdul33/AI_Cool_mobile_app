import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';
import { BottomTabInset, Colors, MaxContentWidth, Radii, Spacing } from '@/constants/theme';
import { profile, settingsRows, stats } from '@/data/mock';

export default function ProfileScreen() {
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
              <AppText variant="subtitle" weight="bold">
                {profile.initials}
              </AppText>
            </View>
            <View style={styles.identity}>
              <AppText variant="heading" weight="semibold">
                {profile.name}
              </AppText>
              <AppText variant="small" tone="muted">
                {profile.handle}
              </AppText>
            </View>
            <View style={styles.chips}>
              <Badge label={`Lv ${profile.level} ${profile.levelTitle}`} variant="green" />
              <Badge label={`${profile.streak}-day streak`} variant="mint" />
            </View>
          </View>

          <View style={styles.statsGrid}>
            <StatCard label="Trees" value={`${profile.trees}`} icon="leaf" />
            <StatCard label="Day streak" value={`${profile.streak}`} icon="flame" />
            <StatCard label="Friends" value={`${profile.friends}`} icon="people" />
            <StatCard label="CO₂ saved" value={profile.co2Saved} icon="cloud-outline" iconTintMint />
          </View>

          <View style={styles.menu}>
            {settingsRows.map((row) => (
              <View key={row.id} style={styles.menuRow}>
                <View style={styles.menuIcon}>
                  <Ionicons name={row.icon as never} size={18} color={Colors.green} />
                </View>
                <AppText variant="title" weight="medium" style={styles.menuLabel}>
                  {row.label}
                </AppText>
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              </View>
            ))}
          </View>

          <AppText variant="caption" tone="muted" style={styles.footer}>
            CarbonTrail · Lv {stats.level} · made for SDG 13
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