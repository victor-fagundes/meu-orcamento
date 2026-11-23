'use client'
import type { ReactNode } from 'react';
import type { LinhaLancamentoProps } from '../../base/contratos.ts';
import { formatarBRL, formatarDataBR } from '../../core/formatters.ts';

/** Linha de lançamento. Toque abre a edição quando há onAbrir. Excluir não fica aqui. */
export function LinhaLancamento({ descricao, valorCentavos, dataIso, item, meio, badgeFatura, onAbrir, ocultado = false }: LinhaLancamentoProps) {
  const corpo: ReactNode = (
    <>
      <span className="mo-linha__topo">
        <span className="mo-linha__descricao">{descricao}</span>
        <span className="mo-linha__valor">{ocultado ? 'R$ •••••' : formatarBRL(valorCentavos)}</span>
      </span>
      <span className="mo-linha__apoio">
        {formatarDataBR(dataIso)} · {item} · {meio}
        {badgeFatura ? <span className="mo-linha__badge">{badgeFatura}</span> : null}
      </span>
    </>
  );
  if (!onAbrir) return <div className="mo-linha">{corpo}</div>;
  return (
    <button type="button" className="mo-linha" onClick={onAbrir}>
      {corpo}
    </button>
  );
}
