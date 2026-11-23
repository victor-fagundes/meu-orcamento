import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { CabecalhoTelaProps } from '../core/types';
import { useTheme } from '../base/ThemeProvider.native';

export function CabecalhoTela({
  titulo,
  modoNavegacao = 'nenhum',
  onMesAnterior,
  onProximoMes,
  onVoltar,
  acaoDireita,
}: CabecalhoTelaProps): React.JSX.Element {
  const { colors } = useTheme();
  const titleStyle = typography.scale.titleLg;

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.left}>
        {modoNavegacao === 'voltar' && (
          <Pressable
            onPress={onVoltar}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={styles.iconBtn}
          >
            <Text style={{ fontSize: 24, color: colors.textPrimary }}>‹</Text>
          </Pressable>
        )}

        {modoNavegacao === 'mes' ? (
          <View style={styles.monthNav}>
            <Pressable
              onPress={onMesAnterior}
              accessibilityRole="button"
              accessibilityLabel="Mês anterior"
              style={styles.iconBtn}
            >
              <Text style={{ fontSize: 24, color: colors.textPrimary }}>‹</Text>
            </Pressable>
            <Text
              style={{
                fontFamily: titleStyle.fontFamilyNative,
                fontSize: titleStyle.fontSize,
                lineHeight: titleStyle.lineHeight,
                color: colors.textPrimary,
                minWidth: 148,
                textAlign: 'center',
              }}
            >
              {titulo}
            </Text>
            <Pressable
              onPress={onProximoMes}
              accessibilityRole="button"
              accessibilityLabel="Próximo mês"
              style={styles.iconBtn}
            >
              <Text style={{ fontSize: 24, color: colors.textPrimary }}>›</Text>
            </Pressable>
          </View>
        ) : (
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
        )}
      </View>

      {acaoDireita && <View>{acaoDireita}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: grid.headerHeight,
    minHeight: grid.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: grid.touchTargetMin,
    height: grid.touchTargetMin,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
