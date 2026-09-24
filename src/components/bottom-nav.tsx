import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { Colors, Radii, Shadows } from '@/constants/theme';

const items = [
  { route: '/', label: 'Home', icon: 'home-outline', iconActive: 'home' },
  { route: '/missions', label: 'Missions', icon: 'trophy-outline', iconActive: 'trophy' },
  { route: '/community', label: 'Community', icon: 'people-outline', iconActive: 'people' },
  { route: '/profile', label: 'Profile', icon: 'person-outline', iconActive: 'person' },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.dock, { paddingBottom: insets.bottom + 12 }]}>
      <View style={styles.bar}>
        {items.map((item) => {
          const active = pathname === item.route;
          return (
            <Pressable
              key={item.route}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => router.navigate(item.route)}
              style={styles.item}>
              <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                <Ionicons
                  name={(active ? item.iconActive : item.icon) as never}
                  size={22}
                  color={active ? Colors.mintDeep : Colors.textMuted}
                />
              </View>
              <AppText
                variant="caption"
                weight={active ? 'semibold' : 'regular'}
                style={{ color: active ? Colors.text : Colors.textMuted }}>
                {item.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Radii.card,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.nav,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  iconWrap: {
    width: 40,
    height: 30,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: Colors.mintTint,
  },
});