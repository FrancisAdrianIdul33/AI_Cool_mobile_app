import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { AppText } from '@/components/ui/app-text';
import { Colors, Radii, Spacing } from '@/constants/theme';

interface ScreenStateProps {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  children?: ReactNode;
}

export function ScreenState({ loading = false, error, onRetry, children }: ScreenStateProps) {
  if (loading) {
    return (
      <View style={styles.state}>
        <View style={styles.spinnerCard}>
          <ActivityIndicator size="large" color={Colors.mintDeep} />
          <AppText variant="body" tone="muted">
            Loading your trail…
          </AppText>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.state}>
        <View style={styles.errorCard}>
          <AppText variant="subtitle" weight="semibold" style={styles.errorTitle}>
            Couldn&apos;t load
          </AppText>
          <AppText variant="small" tone="secondary" style={styles.errorBody}>
            {error}
          </AppText>
          {onRetry ? <Button label="Retry" onPress={onRetry} /> : null}
        </View>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  state: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  spinnerCard: {
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.background,
    borderRadius: Radii.card,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    minWidth: 200,
  },
  errorCard: {
    backgroundColor: Colors.background,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    gap: Spacing.sm,
    width: '100%',
    alignItems: 'stretch',
  },
  errorTitle: {
    textAlign: 'center',
  },
  errorBody: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
});