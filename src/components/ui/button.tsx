import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Colors, Radii } from '@/constants/theme';

interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'quiet';
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

function labelColor(variant: NonNullable<ButtonProps['variant']>): string {
  if (variant === 'quiet') return Colors.text;
  return variant === 'primary' ? Colors.green : Colors.textOnDark;
}

export function Button({ label, variant = 'primary', onPress, disabled, loading }: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'quiet' && styles.quiet,
        (pressed || isDisabled) && styles.pressed,
      ]}>
      {loading ? (
        <ActivityIndicator color={labelColor(variant)} />
      ) : (
        <AppText weight="semibold" style={{ color: labelColor(variant) }}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radii.button,
    height: 54,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Colors.mint,
  },
  secondary: {
    backgroundColor: Colors.green,
  },
  quiet: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
});