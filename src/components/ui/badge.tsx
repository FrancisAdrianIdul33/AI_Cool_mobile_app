import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Colors, Radii } from '@/constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'mint' | 'white' | 'green' | 'muted' | 'amber' | 'coral';
}

export function Badge({ label, variant = 'white' }: BadgeProps) {
  return (
    <View style={[styles.base, variants[variant]]}>
      <AppText variant="small" weight="semibold" style={textStyles[variant]}>
        {label}
      </AppText>
    </View>
  );
}

const variants = StyleSheet.create({
  mint: { backgroundColor: Colors.mint },
  white: { backgroundColor: Colors.surfaceAlt },
  green: { backgroundColor: Colors.green },
  muted: { backgroundColor: Colors.surfaceAlt },
  amber: { backgroundColor: 'rgba(245, 158, 11, 0.16)' },
  coral: { backgroundColor: 'rgba(249, 115, 22, 0.16)' },
});

const textStyles = StyleSheet.create({
  mint: { color: Colors.green },
  white: { color: Colors.text },
  green: { color: Colors.textOnDark },
  muted: { color: Colors.textMuted },
  amber: { color: Colors.amber },
  coral: { color: Colors.coral },
});

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
  },
});