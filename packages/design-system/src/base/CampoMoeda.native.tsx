import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { formatarBRL, lerBRL } from '../core/formatters';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { CampoMoedaProps } from '../core/types';
import { useTheme } from './ThemeProvider.native';

export function CampoMoeda({
  rotulo,
  valorCentavos,
  onChangeCentavos,
  placeholder = 'R$ 0,00',
  erro,
  ajuda,
  obrigatorio = false,
  disabled = false,
  permitirNegativo = false,
}: CampoMoedaProps): React.JSX.Element {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  const labelStyle = typography.scale.labelMd;
  const valorStyle = typography.scale.valorTabular;
  const smallStyle = typography.scale.bodySm;

  const textoFormatado = formatarBRL(valorCentavos);

  const handleChange = (raw: string): void => {
    const ehNegativo = permitirNegativo && raw.includes('-');
    const digitos = raw.replace(/\D/g, '');
    const novoCentavos = digitos === '' ? 0 : lerBRL(digitos);
    onChangeCentavos(ehNegativo && novoCentavos > 0 ? -novoCentavos : novoCentavos);
  };

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
        value={textoFormatado}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        editable={!disabled}
        keyboardType="number-pad"
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
            fontFamily: valorStyle.fontFamilyNative,
            fontSize: valorStyle.fontSize,
            fontVariant: ['tabular-nums'],
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
