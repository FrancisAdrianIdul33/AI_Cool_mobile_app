import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Colors, Radii, Shadows } from '@/constants/theme';
import type { FeedActivity } from '@/lib/types';

export function ActivityCard({ activity }: { activity: FeedActivity }) {
  const saved = activity.kind === 'saved';
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: saved ? Colors.mintTint : Colors.iconTint }]}>
        <Ionicons
          name={activity.icon as never}
          size={18}
          color={saved ? Colors.mintDeep : Colors.green}
        />
      </View>
      <View style={styles.body}>
        <AppText variant="title" weight="semibold" numberOfLines={1}>
          {activity.title}
        </AppText>
        <AppText variant="small" tone="muted">
          {activity.time}
        </AppText>
      </View>
      <View style={styles.impact}>
        <AppText variant="title" weight="bold" style={{ color: saved ? Colors.mintDeep : Colors.coral }}>
          {saved ? '−' : '+'}
          {activity.impact.toFixed(1)} kg
        </AppText>
        <AppText variant="caption" tone="muted">
          CO₂ {saved ? 'saved' : 'emitted'}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: 12,
    gap: 12,
    ...Shadows.card,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  impact: {
    alignItems: 'flex-end',
  },
});