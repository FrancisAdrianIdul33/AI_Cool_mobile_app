import '@/global.css';

import { Platform } from 'react-native';

/**
 * CarbonTrail design tokens.
 *
 * 60 / 30 / 10 rule:
 * - 60% white (#ffffff, #f7f9f8) surfaces on a soft sage (#e8ede9) shell
 * - 30% forest green (#0f2e23) for text, structure, icons, borders
 * - 10% mint (#34d399) for the few accents that must earn the color
 *
 * One deliberate exception: the Community Goal hero is a full-bleed
 * deep forest green banner so the mint progress bar pops against it.
 */
export const Colors = {
  shell: '#E8EDE9',
  background: '#FFFFFF',
  surface: '#F7F9F8',
  surfaceAlt: '#EFF4F1',
  green: '#0F2E23',
  greenSoft: '#1C3D2E',
  mint: '#34D399',
  mintDeep: '#10B981',
  amber: '#F59E0B',
  coral: '#F97316',
  text: '#0F2E23',
  textSecondary: 'rgba(15, 46, 35, 0.62)',
  textMuted: 'rgba(15, 46, 35, 0.45)',
  textOnDark: '#FFFFFF',
  border: 'rgba(15, 46, 35, 0.10)',
  borderStrong: 'rgba(15, 46, 35, 0.16)',
  iconTint: 'rgba(15, 46, 35, 0.08)',
  mintTint: 'rgba(52, 211, 153, 0.14)',
  gold: '#F5B301',
  silver: '#A6B0AB',
  bronze: '#C98A5B',
} as const;

export const Fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  mono: Platform.select({ ios: 'ui-monospace', default: 'monospace' }) ?? 'monospace',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const Radii = {
  small: 12,
  card: 16,
  button: 24,
  pill: 999,
} as const;

export const Shadows = {
  card: {
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  nav: {
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 64 }) ?? 64;
export const MaxContentWidth = 800;