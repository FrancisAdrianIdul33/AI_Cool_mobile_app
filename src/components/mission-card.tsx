import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Colors, Radii, Shadows } from '@/constants/theme';
import type { Mission } from '@/data/mock';

export function MissionCard({ mission }: { mission: Mission }) {
  const locked = mission.state === 'locked';
  const ratio = mission.xp / mission.xpTotal;

  return (
    <View style={[styles.card, locked && { opacity: 0.72 }]}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: locked ? Colors.surfaceAlt : Colors.mintTint }]}>
          {locked ? (
            <Ionicons name="lock-closed" size={18} color={Colors.textMuted} />
          ) : (
            <Ionicons name={mission.icon as never} size={18} color={Colors.mintDeep} />
          )}
        </View>
        <View style={styles.headerBody}>
          <AppText variant="title" weight="semibold" numberOfLines={1}>
            {mission.title}
          </AppText>
          <AppText variant="small" tone="muted" numberOfLines={1}>
            {mission.description}
          </AppText>
        </View>
        <Badge label={locked ? 'Locked' : 'Active'} variant={locked ? 'muted' : 'mint'} />
      </View>

      <View style={styles.progress}>
        <ProgressBar value={ratio} color={locked ? Colors.borderStrong : Colors.mint} />
      </View>

      <View style={styles.footer}>
        <AppText variant="small" weight="semibold">
          {mission.xp}/{mission.xpTotal} XP
        </AppText>
        <View style={styles.points}>
          <Ionicons name="star" size={14} color={Colors.amber} />
          <AppText variant="small" weight="semibold">
            {mission.points} pts
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: 14,
    gap: 12,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerBody: {
    flex: 1,
    gap: 2,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: {
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  points: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});