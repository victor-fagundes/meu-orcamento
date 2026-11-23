'use client'
import type { ShellAppProps } from '../base/contratos.ts';
import { NavegacaoPrincipal } from './navegacao-principal.tsx';

/** Abaixo de 720 px a navegação é a barra inferior. A partir de 720 px, a lateral. `ativa` é o id recebido. */
export function ShellApp({ abas, ativa, onNavegar, cabecalho, children }: ShellAppProps) {
  return (
    <div className="mo-shell">
      <div className="mo-shell__nav">
        <NavegacaoPrincipal abas={abas} ativa={ativa} onNavegar={onNavegar} />
      </div>
      <div className="mo-shell__coluna">
        <header className="mo-shell__cabecalho">{cabecalho}</header>
        <div className="mo-shell__conteudo">{children}</div>
      </div>
    </div>
  );
}
