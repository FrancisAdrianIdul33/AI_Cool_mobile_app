import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CommunityHero } from '@/components/community-hero';
import { FeedRow } from '@/components/feed-row';
import { LeaderboardRow } from '@/components/leaderboard-row';
import { AppText } from '@/components/ui/app-text';
import { ScreenState } from '@/components/ui/screen-state';
import { StatCard } from '@/components/ui/stat-card';
import { useAuth } from '@/context/auth';
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useCommunity } from '@/hooks/use-community';
import { formatRelativeTime, humanize } from '@/lib/format';
import { initialsOf } from '@/lib/types';

function formatMass(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} t`;
  if (kg >= 10) return `${Math.round(kg)} kg`;
  return `${kg.toFixed(1)} kg`;
}

export default function CommunityScreen() {
  const { profile } = useAuth();
  const community = useCommunity();

  const data = community.data;
  const goal = data?.goals.find((g) => g.is_active) ?? data?.goals[0] ?? null;

  const members = data?.leaderboard.length ?? 0;
  const totalSaved = data?.leaderboard.reduce((sum, entry) => sum + entry.carbon_saved_kg, 0) ?? 0;

  const stats = [
    {
      id: 'cs1',
      label: goal ? goal.unit : 'Goal',
      value: goal ? goal.current_value.toLocaleString() : '—',
      icon: 'leaf',
    },
    {
      id: 'cs2',
      label: 'CO₂ saved',
      value: formatMass(totalSaved),
      icon: 'cloud-outline',
    },
    {
      id: 'cs3',
      label: 'Members',
      value: `${members}`,
      icon: 'people',
    },
    {
      id: 'cs4',
      label: 'Actions logged',
      value: `${data?.feed.length ?? 0}`,
      icon: 'stats-chart',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.width}>
          <AppText variant="caption" weight="semibold" tone="muted">
            COMMUNITY
          </AppText>
          <AppText variant="heading" weight="semibold" style={styles.heading}>
            Together
          </AppText>

          {community.loading ? (
            <ScreenState loading />
          ) : community.error ? (
            <ScreenState error={community.error} onRetry={community.refetch} />
          ) : goal ? (
            <CommunityHero
              goal={goal.title}
              completed={goal.target_value > 0 ? goal.current_value / goal.target_value : 0}
              current={goal.current_value}
              total={goal.target_value}
              unit={goal.unit}
            />
          ) : null}

          {goal ? (
            <View style={styles.statsGrid}>
              {stats.map((stat) => (
                <StatCard key={stat.id} label={stat.label} value={stat.value} icon={stat.icon} />
              ))}
            </View>
          ) : null}

          <AppText variant="label" weight="semibold" style={styles.sectionTitle}>
            Impact Leaderboard
          </AppText>
          <View style={styles.list}>
            {data && data.leaderboard.length > 0 ? (
              data.leaderboard.map((entry, index) => {
                const name = entry.username ?? entry.full_name ?? 'Explorer';
                return (
                  <LeaderboardRow
                    key={entry.id}
                    entry={{
                      id: entry.id,
                      name,
                      initials: initialsOf(name),
                      kgSaved: Math.round(entry.carbon_saved_kg * 10) / 10,
                    }}
                    rank={index + 1}
                    isSelf={entry.id === profile?.id}
                  />
                );
              })
            ) : community.error ? null : (
              <AppText variant="small" tone="muted">
                No leaderboard data yet.
              </AppText>
            )}
          </View>

          <AppText variant="label" weight="semibold" style={styles.sectionTitle}>
            Live activity
          </AppText>
          <View style={styles.list}>
            {data && data.feed.length > 0 ? (
              data.feed.map((item) => {
                const name = item.username ?? item.full_name ?? 'Explorer';
                const saved = Number(item.carbon_saved_kg) > 0;
                const impact = saved
                  ? `${Number(item.carbon_saved_kg).toFixed(1)} kg saved`
                  : `${Number(item.carbon_kg).toFixed(1)} kg emitted`;
                return (
                  <FeedRow
                    key={item.id}
                    item={{
                      id: item.id,
                      name,
                      action: `logged ${item.description ?? humanize(item.activity_type)} (${impact})`,
                      time: formatRelativeTime(item.created_at),
                    }}
                  />
                );
              })
            ) : community.error ? null : (
              <AppText variant="small" tone="muted">
                No activity yet — be the first to log today.
              </AppText>
            )}
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  list: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
});