import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CommunityHero } from '@/components/community-hero';
import { FeedRow } from '@/components/feed-row';
import { LeaderboardRow } from '@/components/leaderboard-row';
import { AppText } from '@/components/ui/app-text';
import { StatCard } from '@/components/ui/stat-card';
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { community, communityFeed, communityStats, leaderboard } from '@/data/mock';

export default function CommunityScreen() {
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

          <CommunityHero
            goal={community.goal}
            completed={community.completed}
            current={community.current}
            total={community.total}
            unit={community.unit}
          />

          <View style={styles.statsGrid}>
            {communityStats.map((stat) => (
              <StatCard key={stat.id} label={stat.label} value={stat.value} icon={stat.icon} />
            ))}
          </View>

          <AppText variant="label" weight="semibold" style={styles.sectionTitle}>
            Impact Leaderboard
          </AppText>
          <View style={styles.list}>
            {leaderboard.map((entry, index) => (
              <LeaderboardRow
                key={entry.id}
                entry={entry}
                rank={index + 1}
                isSelf={entry.name === 'Jambert'}
              />
            ))}
          </View>

          <AppText variant="label" weight="semibold" style={styles.sectionTitle}>
            Live activity
          </AppText>
          <View style={styles.list}>
            {communityFeed.map((item) => (
              <FeedRow key={item.id} item={item} />
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