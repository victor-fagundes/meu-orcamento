import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icone } from '../base/Icone.native';
import { useTheme } from '../base/ThemeProvider.native';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { LinhaAjusteProps } from '../core/types';

export function LinhaAjuste({
  icone,
  titulo,
  subtitulo,
  onPress,
  badge,
}: LinhaAjusteProps): React.JSX.Element {
  const { colors } = useTheme();
  const titleStyle = typography.scale.titleMd;
  const smallStyle = typography.scale.bodySm;
  const labelSm = typography.scale.labelSm;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${titulo}. ${subtitulo}`}
      style={[
        styles.row,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.left}>
        <Icone nome={icone} tamanho={20} cor={colors.textSecondary} decorativo />
        <View style={styles.texts}>
          <Text
            style={{
              fontFamily: titleStyle.fontFamilyNative,
              fontSize: titleStyle.fontSize,
              lineHeight: titleStyle.lineHeight,
              color: colors.textPrimary,
            }}
          >
            {titulo}
          </Text>
          <Text
            style={{
              fontFamily: smallStyle.fontFamilyNative,
              fontSize: smallStyle.fontSize,
              lineHeight: smallStyle.lineHeight,
              color: colors.textSecondary,
            }}
          >
            {subtitulo}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        {badge && (
          <View style={[styles.badge, { backgroundColor: colors.selected }]}>
            <Text
              style={{
                fontFamily: labelSm.fontFamilyNative,
                fontSize: labelSm.fontSize,
                color: colors.onSelected,
              }}
            >
              {badge}
            </Text>
          </View>
        )}
        <Text style={{ fontSize: 20, color: colors.textMuted }}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: grid.touchTargetMin,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  texts: {
    flex: 1,
    gap: spacing.xs,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
});
