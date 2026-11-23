'use client'
import type { CabecalhoTelaProps } from '../../base/contratos.ts';

export function CabecalhoTela({ titulo, navegacaoMes, onVoltar, mostrarSetas = true }: CabecalhoTelaProps) {
  return (
    <header className="mo-cabecalho">
      {onVoltar ? <button type="button" className="mo-cabecalho__seta" aria-label="Voltar" onClick={onVoltar}>‹</button> : null}
      <h1 className="mo-cabecalho__titulo">{navegacaoMes ? `${titulo} · ${navegacaoMes.rotulo}` : titulo}</h1>
      {navegacaoMes && mostrarSetas ? (
        <div className="mo-cabecalho__meses">
          <button type="button" className="mo-cabecalho__seta" aria-label="Mês anterior" onClick={navegacaoMes.onAnterior}>‹</button>
          <button type="button" className="mo-cabecalho__seta" aria-label="Próximo mês" onClick={navegacaoMes.onProximo}>›</button>
        </div>
      ) : null}
    </header>
  );
}
