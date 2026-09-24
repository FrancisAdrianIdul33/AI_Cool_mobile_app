import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityCard } from '@/components/activity-card';
import { CircularBudget } from '@/components/circular-budget';
import { QuickActions } from '@/components/quick-actions';
import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';
import { BottomTabInset, Colors, MaxContentWidth, Shadows, Spacing } from '@/constants/theme';
import { activities, budget, profile, quickActions, stats } from '@/data/mock';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.width}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <AppText variant="caption" weight="semibold" tone="muted">
                GOOD MORNING
              </AppText>
              <AppText variant="heading" weight="semibold">
                {profile.name}
              </AppText>
            </View>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <AppText variant="label" weight="bold">
                  {profile.initials}
                </AppText>
              </View>
              <View style={styles.notifBadge}>
                <Ionicons name="notifications" size={12} color={Colors.textOnDark} />
              </View>
            </View>
          </View>

          <View style={styles.budgetCard}>
            <CircularBudget used={budget.used} total={budget.total} unit={budget.unit} />
            <Badge label="On Track" variant="mint" />
          </View>

          <View style={styles.statsRow}>
            <StatCard label="Day streak" value={`${stats.streak}`} icon="flame" />
            <StatCard label="Trees" value={`${stats.trees}`} icon="leaf" />
            <StatCard label="Level" value={stats.level} icon="shield-checkmark" />
          </View>

          <AppText variant="label" weight="semibold" style={styles.sectionTitle}>
            Quick Log
          </AppText>
          <QuickActions actions={quickActions} />

          <View style={styles.feedHeader}>
            <AppText variant="label" weight="semibold">
              Today&apos;s footprint
            </AppText>
            <AppText variant="small" weight="semibold" tone="mint">
              See all
            </AppText>
          </View>
          <View style={styles.feed}>
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  headerText: {
    gap: 2,
  },
  avatarWrap: {
    width: 52,
    height: 52,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.shell,
  },
  budgetCard: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingVertical: Spacing.xl - 8,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadows.card,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  sectionTitle: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  feed: {
    gap: Spacing.sm,
  },
});