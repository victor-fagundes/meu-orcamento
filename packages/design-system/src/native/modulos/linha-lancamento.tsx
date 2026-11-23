import { Pressable, Text, View } from 'react-native';
import type { LinhaLancamentoProps } from '../../base/contratos.ts';
import { formatarBRL, formatarDataBR } from '../../core/formatters.ts';
import { radius, spacing, typography } from '../../core/tokens.ts';
import { useCores } from '../tema.tsx';

/** Toque abre a edição. Excluir fica dentro da tela de edição, não na linha. */
export function LinhaLancamento({ descricao, valorCentavos, dataIso, item, meio, badgeFatura, onAbrir }: LinhaLancamentoProps) {
  const cores = useCores();
  return (
    <Pressable onPress={onAbrir} accessibilityRole="button" accessibilityLabel={`${descricao}, ${formatarBRL(valorCentavos)}`} style={{ minHeight: 48, paddingVertical: spacing[3], paddingHorizontal: spacing[4], borderTopWidth: 1, borderTopColor: cores.line, backgroundColor: cores.card, gap: spacing[1] }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: typography.family, fontSize: typography.body.size, fontWeight: '700', color: cores.text }}>{descricao}</Text>
        <Text style={{ fontFamily: typography.family, fontSize: typography.body.size, color: cores.text }}>{formatarBRL(valorCentavos)}</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing[2] }}>
        <Text style={{ fontFamily: typography.family, fontSize: typography.caption.size, color: cores.textMuted }}>{formatarDataBR(dataIso)} · {item} · {meio}</Text>
        {badgeFatura ? (
          <Text style={{ fontFamily: typography.family, fontSize: typography.caption.size, fontWeight: '700', color: cores.onSelected, backgroundColor: cores.selected, paddingHorizontal: spacing[2], borderRadius: radius.md }}>{badgeFatura}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}
