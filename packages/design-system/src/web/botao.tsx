'use client'
import type { BotaoProps } from '../base/contratos.ts';

export function Botao({ variante, children, onPress, disabled = false, loading = false, largura = 'conteudo', acessibilidade }: BotaoProps) {
  const bloqueado = disabled || loading;
  const classes = ['mo-botao', `mo-botao--${variante}`, largura === 'total' ? 'mo-botao--largura-total' : ''].filter(Boolean).join(' ');
  return (
    <button
      type="button"
      className={classes}
      onClick={onPress}
      disabled={bloqueado}
      aria-busy={loading || undefined}
      aria-label={acessibilidade}
    >
      {loading ? 'Carregando…' : children}
    </button>
  );
}
