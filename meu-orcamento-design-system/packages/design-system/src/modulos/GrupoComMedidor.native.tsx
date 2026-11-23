import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Medidor } from '../base/Medidor.native';
import { useTheme } from '../base/ThemeProvider.native';
import { formatarBRL } from '../core/formatters';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { GrupoComMedidorProps } from '../core/types';
import { LinhaItem } from './LinhaItem.native';

export function GrupoComMedidor({
  titulo,
  tipo,
  previstoCentavos,
  realizadoCentavos,
  fraseEstado,
  itens,
  expandidoInicial = true,
  onSelecionarItem,
}: GrupoComMedidorProps): React.JSX.Element {
  const { colors } = useTheme();
  const [expandido, setExpandido] = useState(expandidoInicial);
  const titleStyle = typography.scale.titleMd;
  const valorStyle = typography.scale.valorTabular;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Pressable
        onPress={() => setExpandido((prev) => !prev)}
        accessibilityRole="button"
        accessibilityState={{ expanded: expandido }}
        style={styles.header}
      >
        <View style={styles.topRow}>
          <Text
            style={{
              fontFamily: titleStyle.fontFamilyNative,
              fontSize: titleStyle.fontSize,
              lineHeight: titleStyle.lineHeight,
              color: colors.textPrimary,
            }}
          >
            {titulo} {expandido ? '▴' : '▾'}
          </Text>
          <Text
            style={{
              fontFamily: valorStyle.fontFamilyNative,
              fontSize: valorStyle.fontSize,
              lineHeight: valorStyle.lineHeight,
              fontVariant: ['tabular-nums'],
              color: colors.textPrimary,
            }}
          >
            {formatarBRL(realizadoCentavos)} / {formatarBRL(previstoCentavos)}
          </Text>
        </View>

        <Medidor
          realizadoCentavos={realizadoCentavos}
          previstoCentavos={previstoCentavos}
          fraseEstado={fraseEstado}
          status={tipo === 'Receitas' && realizadoCentavos >= previstoCentavos ? 'positivo' : undefined}
        />
      </Pressable>

      {expandido &&
        itens.map((item) => (
          <LinhaItem key={item.id} item={item} onPress={onSelecionarItem} />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  header: {
    minHeight: grid.touchTargetMin,
    padding: spacing.lg,
    gap: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});
