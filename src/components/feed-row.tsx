import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Colors, Radii } from '@/constants/theme';
import type { FeedItem } from '@/data/mock';

export function FeedRow({ item }: { item: FeedItem }) {
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <AppText variant="small" weight="bold">
          {item.name.slice(0, 2).toUpperCase()}
        </AppText>
      </View>
      <View style={styles.body}>
        <AppText variant="body" numberOfLines={2}>
          <AppText weight="semibold">{item.name}</AppText> {item.action}
        </AppText>
      </View>
      <AppText variant="caption" tone="muted">
        {item.time}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    paddingHorizontal: 12,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.mintTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
});