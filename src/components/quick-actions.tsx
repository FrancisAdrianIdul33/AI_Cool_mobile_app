import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Colors, Radii } from '@/constants/theme';
import type { QuickAction } from '@/data/mock';

interface QuickActionsProps {
  actions: QuickAction[];
  onPress?: (action: QuickAction) => void;
}

export function QuickActions({ actions, onPress }: QuickActionsProps) {
  return (
    <View style={styles.row}>
      {actions.map((action) => (
        <Pressable
          key={action.id}
          accessibilityRole="button"
          onPress={() => onPress?.(action)}
          style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}>
          <View style={styles.iconWrap}>
            <Ionicons name={action.icon as never} size={22} color={Colors.green} />
          </View>
          <AppText variant="caption" weight="medium" numberOfLines={1} style={styles.label}>
            {action.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: Radii.card,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
  },
});