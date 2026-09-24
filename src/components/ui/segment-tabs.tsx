import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Colors, Radii } from '@/constants/theme';

interface SegmentTabsProps {
  options: string[];
  active: number;
  onChange: (index: number) => void;
}

export function SegmentTabs({ options, active, onChange }: SegmentTabsProps) {
  return (
    <View style={styles.container}>
      {options.map((option, index) => {
        const selected = index === active;
        return (
          <Pressable
            key={option}
            accessibilityRole="tab"
            onPress={() => onChange(index)}
            style={[styles.tab, selected && styles.tabActive]}>
            <AppText
              variant="label"
              weight="semibold"
              style={{ color: selected ? Colors.textOnDark : Colors.textMuted }}>
              {option}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radii.small,
    padding: 4,
  },
  tab: {
    flex: 1,
    height: 36,
    borderRadius: Radii.small - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: Colors.green,
  },
});