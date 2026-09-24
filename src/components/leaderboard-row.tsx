import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Colors, Radii } from '@/constants/theme';

interface LeaderboardEntry {
  id: string;
  name: string;
  initials: string;
  kgSaved: number;
}

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  rank: number;
  isSelf?: boolean;
}

const medalColors: Record<number, string> = {
  1: Colors.gold,
  2: Colors.silver,
  3: Colors.bronze,
};

export function LeaderboardRow({ entry, rank, isSelf }: LeaderboardRowProps) {
  return (
    <View style={[styles.row, isSelf && styles.rowSelf]}>
      <View style={styles.rank}>
        {rank <= 3 ? (
          <Ionicons name="medal" size={20} color={medalColors[rank]} />
        ) : (
          <AppText variant="title" weight="semibold" tone="secondary">
            {rank}
          </AppText>
        )}
      </View>

      <View style={[styles.avatar, isSelf && styles.avatarSelf]}>
        <AppText variant="small" weight="bold" style={{ color: isSelf ? Colors.mintDeep : Colors.text }}>
          {entry.initials}
        </AppText>
      </View>

      <View style={styles.nameWrap}>
        <AppText variant="title" weight={isSelf ? 'bold' : 'medium'} numberOfLines={1}>
          {entry.name}
        </AppText>
        {isSelf ? (
          <AppText variant="caption" weight="semibold" tone="mint">
            you
          </AppText>
        ) : null}
      </View>

      <AppText variant="title" weight={isSelf ? 'bold' : 'semibold'} tone={isSelf ? 'mint' : undefined}>
        {entry.kgSaved} kg
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: Radii.card,
    gap: 12,
    backgroundColor: Colors.surface,
  },
  rowSelf: {
    backgroundColor: Colors.mintTint,
  },
  rank: {
    width: 26,
    alignItems: 'center',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSelf: {
    borderWidth: 2,
    borderColor: Colors.mint,
  },
  nameWrap: {
    flex: 1,
    gap: 1,
  },
});