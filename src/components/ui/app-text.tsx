import { StyleSheet, Text, type TextProps } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';

type AppTextProps = TextProps & {
  variant?: 'display' | 'heading' | 'subtitle' | 'title' | 'label' | 'body' | 'small' | 'caption';
  tone?: 'text' | 'secondary' | 'muted' | 'onDark' | 'mint' | 'inverse';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
};

const variantStyles = StyleSheet.create({
  display: { fontSize: 34, lineHeight: 40 },
  heading: { fontSize: 24, lineHeight: 30 },
  subtitle: { fontSize: 20, lineHeight: 26 },
  title: { fontSize: 17, lineHeight: 22 },
  label: { fontSize: 14, lineHeight: 20 },
  body: { fontSize: 15, lineHeight: 22 },
  small: { fontSize: 13, lineHeight: 18 },
  caption: { fontSize: 11, lineHeight: 14, letterSpacing: 0.4 },
});

const boldVariants: (keyof typeof variantStyles)[] = ['display', 'heading', 'subtitle'];
const weightFaces = {
  regular: Fonts.regular,
  medium: Fonts.medium,
  semibold: Fonts.semibold,
  bold: Fonts.bold,
};
const toneColors = {
  text: Colors.text,
  secondary: Colors.textSecondary,
  muted: Colors.textMuted,
  onDark: Colors.textOnDark,
  mint: Colors.mint,
  inverse: Colors.green,
};

export function AppText({ variant = 'body', tone = 'text', weight, style, ...rest }: AppTextProps) {
  const face = (weight ?? (boldVariants.includes(variant) ? 'semibold' : 'regular')) as keyof typeof weightFaces;

  return (
    <Text
      style={[variantStyles[variant], { fontFamily: weightFaces[face], color: toneColors[tone] }, style]}
      {...rest}
    />
  );
}