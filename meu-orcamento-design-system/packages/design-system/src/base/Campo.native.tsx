import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { CampoProps } from '../core/types';
import { useTheme } from './ThemeProvider.native';

export function Campo({
  rotulo,
  valor,
  onChangeValor,
  placeholder,
  erro,
  ajuda,
  obrigatorio = false,
  disabled = false,
  tipo = 'text',
  autoFocus = false,
}: CampoProps): React.JSX.Element {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  const labelStyle = typography.scale.labelMd;
  const bodyStyle = typography.scale.bodyMd;
  const smallStyle = typography.scale.bodySm;

  const borderColor = erro ? colors.error : focused ? colors.action : colors.borderStrong;

  return (
    <View style={styles.wrapper}>
      <Text
        style={{
          fontFamily: labelStyle.fontFamilyNative,
          fontSize: labelStyle.fontSize,
          lineHeight: labelStyle.lineHeight,
          color: colors.textPrimary,
        }}
      >
        {rotulo}
        {obrigatorio ? ' *' : ''}
      </Text>
      <TextInput
        value={valor}
        onChangeText={onChangeValor}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        editable={!disabled}
        autoFocus={autoFocus}
        keyboardType={
          tipo === 'email' ? 'email-address' : tipo === 'number' ? 'numeric' : 'default'
        }
        accessibilityLabel={rotulo}
        accessibilityState={{ disabled }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          {
            borderWidth: focused || erro ? 2 : 1,
            borderColor,
            backgroundColor: disabled ? colors.surfaceMuted : colors.surface,
            color: colors.textPrimary,
            fontFamily: bodyStyle.fontFamilyNative,
            fontSize: bodyStyle.fontSize,
          },
        ]}
      />
      {erro ? (
        <Text
          accessibilityLiveRegion="polite"
          style={{
            fontFamily: smallStyle.fontFamilyNative,
            fontSize: smallStyle.fontSize,
            lineHeight: smallStyle.lineHeight,
            color: colors.error,
          }}
        >
          {erro}
        </Text>
      ) : (
        ajuda && (
          <Text
            style={{
              fontFamily: smallStyle.fontFamilyNative,
              fontSize: smallStyle.fontSize,
              lineHeight: smallStyle.lineHeight,
              color: colors.textSecondary,
            }}
          >
            {ajuda}
          </Text>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: spacing.xs,
  },
  input: {
    height: grid.touchTargetMin,
    minHeight: grid.touchTargetMin,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
  },
});
