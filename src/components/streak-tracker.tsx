import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Colors, Radii, Shadows } from '@/constants/theme';

const DOTS = 20;

export function StreakTracker({ streak }: { streak: number }) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.streakLabel}>
          <Ionicons name="flame" size={18} color={Colors.coral} />
          <AppText variant="title" weight="bold">
            Day {streak}
          </AppText>
        </View>
        <Badge label={`${streak}-day streak`} variant="green" />
      </View>
      <View style={styles.dots}>
        {Array.from({ length: DOTS }).map((_, index) => {
          const filled = index < streak % (DOTS + 1);
          return (
            <View
              key={index}
              style={[
                styles.dot,
                filled ? styles.dotFilled : styles.dotEmpty,
                index < streak && !filled && styles.dotMaybe,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radii.card,
    padding: 14,
    gap: 12,
    ...Shadows.card,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotFilled: {
    backgroundColor: Colors.mint,
  },
  dotEmpty: {
    backgroundColor: Colors.surfaceAlt,
  },
  dotMaybe: {
    backgroundColor: Colors.mintTint,
  },
});