import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MissionCard } from '@/components/mission-card';
import { StreakTracker } from '@/components/streak-tracker';
import { AppText } from '@/components/ui/app-text';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ScreenState } from '@/components/ui/screen-state';
import { SegmentTabs } from '@/components/ui/segment-tabs';
import { BottomTabInset, Colors, MaxContentWidth, Radii, Shadows, Spacing } from '@/constants/theme';
import { useMissions } from '@/hooks/use-missions';
import type { BadgeRow } from '@/lib/types';

const TABS = ['Weekly', 'Special'];

const rarityTint: Record<BadgeRow['rarity'], string> = {
  common: Colors.textMuted,
  rare: Colors.mintDeep,
  epic: Colors.amber,
  legendary: Colors.coral,
};

function BadgeTile({ badge }: { badge: BadgeRow }) {
  return (
    <View style={[styles.badgeTile, !badge.unlocked && styles.badgeLocked]}>
      <View style={[styles.badgeIcon, badge.unlocked && { backgroundColor: Colors.mintTint }]}>
        {badge.unlocked ? (
          <AppText variant="title">{badge.icon}</AppText>
        ) : (
          <Ionicons name="lock-closed" size={20} color={Colors.textMuted} />
        )}
      </View>
      <AppText variant="caption" weight="medium" numberOfLines={2} style={{ textAlign: 'center' }}>
        {badge.name}
      </AppText>
      <AppText
        variant="caption"
        weight="semibold"
        style={{ color: badge.unlocked ? rarityTint[badge.rarity] : Colors.textMuted }}>
        {badge.rarity}
      </AppText>
    </View>
  );
}

export default function MissionsScreen() {
  const missions = useMissions();
  const [tab, setTab] = useState(0);

  const list = missions.data?.missions.filter((mission) =>
    tab === 0 ? mission.period !== 'special' : mission.period === 'special',
  ) ?? [];

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

          <StreakTracker streak={missions.streak} />

          <View style={styles.xpCard}>
            <View style={styles.xpRow}>
              <View style={styles.level}>
                <Ionicons name="shield-checkmark" size={20} color={Colors.mint} />
                <AppText variant="title" weight="bold">
                  Lv {missions.level}
                </AppText>
              </View>
              <AppText variant="small" weight="semibold" tone="mint">
                {missions.xp}/{missions.xpTotal} XP
              </AppText>
            </View>
            <ProgressBar
              value={missions.xpTotal > 0 ? missions.xp / missions.xpTotal : 0}
              color={Colors.mint}
            />
          </View>

          {missions.actionError ? (
            <AppText
              variant="small"
              weight="medium"
              style={[styles.actionError, { color: Colors.coral }]}>
              {missions.actionError}
            </AppText>
          ) : null}

          <View style={styles.tabs}>
            <SegmentTabs options={TABS} active={tab} onChange={setTab} />
          </View>

          {missions.loading ? (
            <ScreenState loading />
          ) : missions.error ? (
            <ScreenState error={missions.error} onRetry={missions.refetch} />
          ) : (
            <View style={styles.missionList}>
              {list.length > 0 ? (
                list.map((mission) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    onClaim={() => missions.claim(mission.id)}
                    claiming={missions.claimingId === mission.id}
                  />
                ))
              ) : (
                <AppText variant="small" tone="muted" style={styles.emptyList}>
                  No missions in this tab right now.
                </AppText>
              )}
            </View>
          )}

          <AppText variant="label" weight="semibold" style={styles.sectionTitle}>
            Badges
          </AppText>
          {missions.loading ? (
            <ScreenState loading />
          ) : missions.error ? (
            <ScreenState error={missions.error} />
          ) : (
            <View style={styles.badgeGrid}>
              {missions.data && missions.data.badges.length > 0 ? (
                missions.data.badges.map((badge) => <BadgeTile key={badge.badge_id} badge={badge} />)
              ) : (
                <AppText variant="small" tone="muted">
                  No badges yet — complete missions to unlock some.
                </AppText>
              )}
            </View>
          )}
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
  actionError: {
    marginTop: Spacing.md,
  },
  tabs: {
    marginTop: Spacing.lg,
  },
  missionList: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  emptyList: {
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
    gap: 4,
  },
  badgeLocked: {
    opacity: 0.55,
  },
  badgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
});