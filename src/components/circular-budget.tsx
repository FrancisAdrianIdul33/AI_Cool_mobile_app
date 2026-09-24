import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { AppText } from '@/components/ui/app-text';
import { Colors } from '@/constants/theme';

interface CircularBudgetProps {
  used: number;
  total: number;
  unit?: string;
}

function riskColor(ratio: number): string {
  if (ratio <= 0.6) return Colors.mint;
  if (ratio <= 0.85) return Colors.amber;
  return Colors.coral;
}

export function CircularBudget({ used, total, unit = 'kg CO₂' }: CircularBudgetProps) {
  const ratio = used / total;
  const color = riskColor(ratio);
  const remaining = Math.max(0, total - used);
  const size = 172;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * (1 - ratio);

  return (
    <View style={styles.wrap}>
      <View style={styles.gauge}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={Colors.surfaceAlt}
            strokeWidth={stroke}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dash}
            fill="none"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.center}>
          <AppText variant="display" weight="bold" tone="mint">
            {used.toFixed(1)}
          </AppText>
          <AppText variant="caption" tone="muted">
            {unit} used
          </AppText>
          <AppText variant="small" tone="muted">
            of {total} {unit}
          </AppText>
        </View>
      </View>
      <AppText variant="label" weight="semibold">
        Remaining this week
      </AppText>
      <AppText variant="body" weight="semibold" tone="mint">
        {remaining.toFixed(1)} {unit}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 4,
  },
  gauge: {
    width: 172,
    height: 172,
    marginBottom: 8,
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});