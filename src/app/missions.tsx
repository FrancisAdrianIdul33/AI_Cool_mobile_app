import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MissionCard } from '@/components/mission-card';
import { StreakTracker } from '@/components/streak-tracker';
import { AppText } from '@/components/ui/app-text';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SegmentTabs } from '@/components/ui/segment-tabs';
import { BottomTabInset, Colors, MaxContentWidth, Radii, Shadows, Spacing } from '@/constants/theme';
import { badges, missions, profile, specialMissions, weeklyMissions } from '@/data/mock';

const TABS = ['Weekly', 'Special'];

export default function MissionsScreen() {
  const [tab, setTab] = useState(0);
  const list = tab === 0 ? weeklyMissions : specialMissions;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.width}>
          <AppText variant="caption" weight="semibold" tone="muted">
            ECO MISSIONS
          </AppText>
          <AppText variant="heading" weight="semibold" style={styles.heading}>
            Missions
          </AppText>

          <StreakTracker streak={profile.streak} />

          <View style={styles.xpCard}>
            <View style={styles.xpRow}>
              <View style={styles.level}>
                <Ionicons name="shield-checkmark" size={20} color={Colors.mint} />
                <AppText variant="title" weight="bold">
                  Lv {missions.level} {missions.levelTitle}
                </AppText>
              </View>
              <AppText variant="small" weight="semibold" tone="mint">
                {missions.xp}/{missions.xpTotal} XP
              </AppText>
            </View>
            <ProgressBar value={missions.xp / missions.xpTotal} color={Colors.mint} />
          </View>

          <View style={styles.tabs}>
            <SegmentTabs options={TABS} active={tab} onChange={setTab} />
          </View>

          <View style={styles.missionList}>
            {list.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </View>

          <AppText variant="label" weight="semibold" style={styles.sectionTitle}>
            Badges
          </AppText>
          <View style={styles.badgeGrid}>
            {badges.map((badge) => (
              <View key={badge.id} style={[styles.badgeTile, !badge.unlocked && styles.badgeLocked]}>
                <View style={[styles.badgeIcon, badge.unlocked && { backgroundColor: Colors.mintTint }]}>
                  {badge.unlocked ? (
                    <Ionicons name={badge.icon as never} size={20} color={Colors.mintDeep} />
                  ) : (
                    <Ionicons name="lock-closed" size={20} color={Colors.textMuted} />
                  )}
                </View>
                <AppText
                  variant="caption"
                  weight="medium"
                  numberOfLines={2}
                  style={{ textAlign: 'center' }}>
                  {badge.label}
                </AppText>
              </View>
            ))}
          </View>
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
  heading: {
    marginBottom: Spacing.md,
  },
  xpCard: {
    backgroundColor: Colors.background,
    borderRadius: Radii.card,
    padding: 16,
    gap: 12,
    marginTop: Spacing.sm,
    ...Shadows.card,
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  level: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabs: {
    marginTop: Spacing.lg,
  },
  missionList: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  sectionTitle: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  badgeTile: {
    width: '30.8%',
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 6,
  },
  badgeLocked: {
    opacity: 0.6,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
});