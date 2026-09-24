import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Colors, Radii, Shadows } from '@/constants/theme';
import { MISSION_ICONS, type MissionRow } from '@/lib/types';

interface MissionCardProps {
  mission: MissionRow;
  onClaim?: () => void;
  claiming?: boolean;
}

function metricFor(type: MissionRow['mission_type']): string {
  if (type === 'streak') return 'days';
  if (type === 'activity_count') return 'actions';
  return 'kg CO₂';
}

export function MissionCard({ mission, onClaim, claiming }: MissionCardProps) {
  const ratio = mission.target_value > 0 ? Math.min(1, mission.progress / mission.target_value) : 0;
  const metric = metricFor(mission.mission_type);
  const canClaim = mission.completed && !mission.xp_claimed;
  const claimed = mission.xp_claimed;
  const shown = Math.min(mission.progress, mission.target_value);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons name={(MISSION_ICONS[mission.icon] ?? MISSION_ICONS.default) as never} size={18} color={Colors.mintDeep} />
        </View>
        <View style={styles.headerBody}>
          <AppText variant="title" weight="semibold" numberOfLines={1}>
            {mission.title}
          </AppText>
          <AppText variant="small" tone="muted" numberOfLines={1}>
            {mission.description}
          </AppText>
        </View>
        {claimed ? (
          <Badge label="Claimed" variant="muted" />
        ) : (
          <Badge label={`+${mission.xp_reward} XP`} variant="mint" />
        )}
      </View>

      <View style={styles.progress}>
        <ProgressBar value={ratio} color={canClaim ? Colors.mintDeep : Colors.mint} />
      </View>

      <View style={styles.footer}>
        <AppText variant="small" weight="semibold">
          {shown}/{mission.target_value} {metric}
        </AppText>
        {canClaim ? (
          <Pressable
            accessibilityRole="button"
            onPress={onClaim}
            disabled={claiming}
            style={({ pressed }) => [styles.claim, (pressed || claiming) && { opacity: 0.7 }]}>
            {claiming ? (
              <ActivityIndicator size="small" color={Colors.green} />
            ) : (
              <>
                <Ionicons name="sparkles" size={14} color={Colors.green} />
                <AppText variant="small" weight="bold" style={{ color: Colors.green }}>
                  Claim XP
                </AppText>
              </>
            )}
          </Pressable>
        ) : null}
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
    backgroundColor: Colors.mintTint,
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
  claim: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.mint,
    borderRadius: Radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
});