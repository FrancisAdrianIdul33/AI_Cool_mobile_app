import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Colors, Radii } from '@/constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'mint' | 'white' | 'green' | 'muted';
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
});

const textStyles = StyleSheet.create({
  mint: { color: Colors.green },
  white: { color: Colors.text },
  green: { color: Colors.textOnDark },
  muted: { color: Colors.textMuted },
});

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
  },
});