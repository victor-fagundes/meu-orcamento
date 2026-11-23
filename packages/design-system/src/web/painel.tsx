'use client'
import { useEffect, useRef, type ReactNode } from 'react';
import { prenderFoco } from './foco.ts';

export interface PainelProps {
  readonly aberto: boolean;
  readonly titulo: string;
  readonly onFechar: () => void;
  readonly children: ReactNode;
}

/** Painel lateral. Fechado não desenha. Escape e Fechar devolvem o foco a quem abriu. */
export function Painel({ aberto, titulo, onFechar, children }: PainelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fechar = useRef(onFechar);
  fechar.current = onFechar;

  useEffect(() => {
    if (!aberto || !ref.current) return;
    return prenderFoco(ref.current, () => fechar.current());
  }, [aberto]);

  if (!aberto) return null;
  return (
    <div className="mo-dialogo-fundo mo-painel-fundo" onClick={() => fechar.current()}>
      <div
        ref={ref}
        className="mo-painel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mo-painel-titulo"
        tabIndex={-1}
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="mo-painel__topo">
          <h2 id="mo-painel-titulo" className="mo-painel__titulo">{titulo}</h2>
          <button type="button" className="mo-painel__fechar" onClick={() => fechar.current()}>Fechar</button>
        </div>
        {children}
      </div>
    </div>
  );
}
