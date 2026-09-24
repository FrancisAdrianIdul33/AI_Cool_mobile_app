import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Colors, Radii, Shadows } from '@/constants/theme';

interface CommunityHeroProps {
  goal: string;
  completed: number;
  current: number;
  total: number;
  unit: string;
}

export function CommunityHero({ goal, completed, current, total, unit }: CommunityHeroProps) {
  const percent = Math.round(completed * 100);
  return (
    <View style={styles.hero}>
      <View style={styles.eyebrow}>
        <View style={styles.eyebrowIcon}>
          <Ionicons name="people" size={16} color={Colors.mint} />
        </View>
        <AppText variant="caption" weight="semibold" tone="muted">
          COMMUNITY GOAL
        </AppText>
      </View>

      <AppText variant="subtitle" weight="semibold" tone="onDark">
        {goal}
      </AppText>

      <View style={styles.progressRow}>
        <Badge label={`${percent}% completed`} variant="mint" />
        <AppText variant="small" tone="muted">
          {current.toLocaleString()} / {total.toLocaleString()} {unit}
        </AppText>
      </View>

      <ProgressBar
        value={completed}
        color={Colors.mint}
        trackColor="rgba(244,246,245,0.16)"
        height={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: Colors.green,
    borderRadius: Radii.card,
    padding: 18,
    gap: 10,
    ...Shadows.card,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eyebrowIcon: {
    width: 26,
    height: 26,
    borderRadius: 9,
    backgroundColor: Colors.mintTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});