import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityCard } from '@/components/activity-card';
import { CircularBudget } from '@/components/circular-budget';
import { QuickActions } from '@/components/quick-actions';
import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { ScreenState } from '@/components/ui/screen-state';
import { StatCard } from '@/components/ui/stat-card';
import { useAuth } from '@/context/auth';
import { BottomTabInset, Colors, MaxContentWidth, Shadows, Spacing } from '@/constants/theme';
import { useDashboard } from '@/hooks/use-dashboard';
import { formatActivityTime, humanize } from '@/lib/format';
import { CATEGORY_ICONS, initialsOf, type FeedActivity, type QuickAction } from '@/lib/types';

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'commute',
    label: 'Commute',
    icon: 'car',
    category: 'transport',
    activityType: 'car',
    description: 'Car commute',
  },
  {
    id: 'meals',
    label: 'Meals',
    icon: 'restaurant',
    category: 'food',
    activityType: 'vegetarian',
    description: 'Vegetarian meal',
  },
  {
    id: 'energy',
    label: 'Home Energy',
    icon: 'flash',
    category: 'home',
    activityType: 'LED',
    description: 'LED lights swap',
  },
  {
    id: 'bike',
    label: 'Bike',
    icon: 'bicycle',
    category: 'transport',
    activityType: 'bicycle',
    description: 'Bike ride',
  },
];

function toFeedActivity(log: {
  id?: string;
  category: string;
  activity_type: string;
  description: string | null;
  carbon_kg: number;
  carbon_saved_kg: number;
  activity_date: string;
  created_at?: string;
}): FeedActivity {
  const saved = Number(log.carbon_saved_kg) > 0;
  const timestamp = log.activity_date ?? log.created_at ?? '';
  return {
    id: `${log.id ?? ''}-${timestamp}`,
    icon: CATEGORY_ICONS[log.category] ?? CATEGORY_ICONS.default,
    title: log.description ?? humanize(log.activity_type),
    time: formatActivityTime(timestamp),
    impact: saved ? Number(log.carbon_saved_kg) : Number(log.carbon_kg),
    kind: saved ? 'saved' : 'emitted',
  };
}

function statusFor(ratio: number): { label: string; variant: 'mint' | 'amber' | 'coral' } {
  if (ratio <= 0.6) return { label: 'On Track', variant: 'mint' };
  if (ratio <= 0.85) return { label: 'Approaching limit', variant: 'amber' };
  return { label: 'High usage', variant: 'coral' };
}

export default function HomeScreen() {
  const { profile } = useAuth();
  const dashboard = useDashboard();
  const [logging, setLogging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [logError, setLogError] = useState<string | null>(null);

  const data = dashboard.data;
  const ratio = data && data.total > 0 ? data.used / data.total : 0;
  const status = statusFor(ratio);
  const savedToday = data?.today.reduce((sum, log) => sum + Number(log.carbon_saved_kg || 0), 0) ?? 0;

  const pressQuick = async (action: QuickAction) => {
    setLogging(true);
    setLogError(null);
    try {
      await dashboard.logFastAction({
        category: action.category,
        activity_type: action.activityType,
        description: action.description,
      });
      setNotice(`Logged: ${action.label}`);
      setTimeout(() => setNotice(null), 2600);
    } catch (e) {
      setLogError(e instanceof Error ? e.message : 'Could not log that activity.');
    } finally {
      setLogging(false);
    }
  };

  const displayName = profile?.username ?? profile?.full_name ?? 'Explorer';

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
                {displayName}
              </AppText>
            </View>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <AppText variant="label" weight="bold" style={{ color: Colors.textOnDark }}>
                  {initialsOf(displayName)}
                </AppText>
              </View>
              <View style={styles.notifBadge}>
                <Ionicons name="notifications" size={12} color={Colors.textOnDark} />
              </View>
            </View>
          </View>

          {notice ? (
            <View style={styles.notice}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.mintDeep} />
              <AppText variant="small" weight="semibold" style={{ color: Colors.mintDeep }}>
                {notice}
              </AppText>
            </View>
          ) : null}

          {dashboard.loading ? (
            <ScreenState loading />
          ) : dashboard.error ? (
            <ScreenState error={dashboard.error} onRetry={dashboard.refetch} />
          ) : data ? (
            <>
              <View style={styles.budgetCard}>
                <CircularBudget used={data.used} total={data.total} unit="kg CO₂" />
                <Badge label={status.label} variant={status.variant} />
              </View>

              <View style={styles.statsRow}>
                <StatCard label="Day streak" value={`${dashboard.streak}`} icon="flame" />
                <StatCard
                  label="CO₂ saved today"
                  value={`${savedToday.toFixed(1)} kg`}
                  icon="leaf"
                  iconTintMint
                />
                <StatCard label="Level" value={`Lv ${dashboard.level}`} icon="shield-checkmark" />
              </View>
            </>
          ) : null}

          <AppText variant="label" weight="semibold" style={styles.sectionTitle}>
            Quick Log
          </AppText>
          <QuickActions actions={QUICK_ACTIONS} onPress={pressQuick} busy={logging} />

          {logError ? (
            <AppText variant="small" weight="medium" style={[styles.logError, { color: Colors.coral }]}>
              {logError}
            </AppText>
          ) : null}

          <View style={styles.feedHeader}>
            <AppText variant="label" weight="semibold">
              Today&apos;s footprint
            </AppText>
            <AppText variant="small" weight="semibold" tone="mint">
              See all
            </AppText>
          </View>
          <View style={styles.feed}>
            {data && data.today.length > 0 ? (
              data.today.map((log) => (
                <ActivityCard key={toFeedActivity(log).id} activity={toFeedActivity(log)} />
              ))
            ) : (
              <View style={styles.emptyFeed}>
                <AppText variant="small" tone="muted">
                  Nothing logged yet today — tap a quick log above to start trailing.
                </AppText>
              </View>
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
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(52, 211, 153, 0.14)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: Spacing.md,
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
  logError: {
    marginTop: Spacing.sm,
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
  emptyFeed: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
  },
});