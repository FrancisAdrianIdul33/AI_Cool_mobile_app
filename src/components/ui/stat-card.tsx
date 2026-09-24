import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Colors, Radii, Shadows } from '@/constants/theme';

interface StatCardProps {
  label: string;
  value: string;
  icon?: string;
  iconTintMint?: boolean;
}

export function StatCard({ label, value, icon, iconTintMint = false }: StatCardProps) {
  return (
    <View style={styles.card}>
      {icon ? (
        <View style={[styles.iconWrap, { backgroundColor: iconTintMint ? Colors.mintTint : Colors.iconTint }]}>
          <Ionicons name={icon as never} size={16} color={iconTintMint ? Colors.mintDeep : Colors.green} />
        </View>
      ) : null}
      <AppText variant="heading" weight="semibold" numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </AppText>
      <AppText variant="small" tone="muted" numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Radii.card,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'flex-start',
    gap: 4,
    ...Shadows.card,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
});