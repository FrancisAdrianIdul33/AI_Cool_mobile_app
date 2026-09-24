import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Colors, Fonts, Radii } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string | null;
}

export function Input({ label, error, style, ...rest }: InputProps) {
  return (
    <View style={styles.container}>
      {label ? (
        <AppText variant="label" weight="medium" tone="secondary">
          {label}
        </AppText>
      ) : null}
      <TextInput
        placeholderTextColor={Colors.textMuted}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...rest}
      />
      {error ? (
        <AppText variant="small" weight="medium" style={{ color: Colors.coral }}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  input: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.small,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.text,
  },
  inputError: {
    borderColor: Colors.coral,
  },
});