import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { LinhaLancamentoProps } from '../../base/contratos.ts';
import { formatarBRL, formatarDataBR } from '../../core/formatters.ts';
import { radius, spacing, typography } from '../../core/tokens.ts';
import { useCores } from '../tema.tsx';

/** Toque abre a edição quando há onAbrir. Sem ele, a linha só é lida. */
export function LinhaLancamento({ descricao, valorCentavos, dataIso, item, meio, badgeFatura, onAbrir, ocultado = false }: LinhaLancamentoProps) {
  const cores = useCores();
  const valor = ocultado ? 'R$ •••••' : formatarBRL(valorCentavos);
  const miolo: ReactNode = (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: typography.family, fontSize: typography.body.size, fontWeight: '700', color: cores.text }}>{descricao}</Text>
        <Text style={{ fontFamily: typography.family, fontSize: typography.body.size, color: cores.text }}>{valor}</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing[2] }}>
        <Text style={{ fontFamily: typography.family, fontSize: typography.caption.size, color: cores.textMuted }}>{formatarDataBR(dataIso)} · {item} · {meio}</Text>
        {badgeFatura ? (
          <Text style={{ fontFamily: typography.family, fontSize: typography.caption.size, fontWeight: '700', color: cores.onSelected, backgroundColor: cores.selected, paddingHorizontal: spacing[2], borderRadius: radius.md }}>{badgeFatura}</Text>
        ) : null}
      </View>
    </>
  );
  const caixa = { minHeight: 48, paddingVertical: spacing[3], paddingHorizontal: spacing[4], borderTopWidth: 1, borderTopColor: cores.line, backgroundColor: cores.card, gap: spacing[1] };
  if (!onAbrir) return <View style={caixa}>{miolo}</View>;
  return (
    <Pressable onPress={onAbrir} accessibilityRole="button" accessibilityLabel={`${descricao}, ${valor}`} style={caixa}>
      {miolo}
    </Pressable>
  );
}
