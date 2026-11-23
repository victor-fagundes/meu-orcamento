'use client'
import type { LinhaLancamentoProps } from '../../base/contratos.ts';
import { formatarBRL, formatarDataBR } from '../../core/formatters.ts';

/** Linha de lançamento. Toque abre a edição. Excluir não fica aqui (ficha de componentes, cartão e linha). */
export function LinhaLancamento({ descricao, valorCentavos, dataIso, item, meio, badgeFatura, onAbrir }: LinhaLancamentoProps) {
  return (
    <button type="button" className="mo-linha" onClick={onAbrir}>
      <span className="mo-linha__topo">
        <span className="mo-linha__descricao">{descricao}</span>
        <span className="mo-linha__valor">{formatarBRL(valorCentavos)}</span>
      </span>
      <span className="mo-linha__apoio">
        {formatarDataBR(dataIso)} · {item} · {meio}
        {badgeFatura ? <span className="mo-linha__badge">{badgeFatura}</span> : null}
      </span>
    </button>
  );
}
