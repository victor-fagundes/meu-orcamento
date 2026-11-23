'use client'
import type { NavegacaoPrincipalProps } from '../base/contratos.ts';
import { iconPaths } from '../core/icons-paths.ts';

/** Barra lateral de 240 px no desktop. Ajustes continua ativa nas subtelas (MODULOS.md, módulo 15). */
export function NavegacaoPrincipal({ abas, ativa, onNavegar }: NavegacaoPrincipalProps) {
  return (
    <nav aria-label="Principal" className="mo-nav">
      {abas.map((aba) => (
        <button
          key={aba.id}
          type="button"
          className="mo-nav__item"
          aria-current={aba.id === ativa ? 'page' : undefined}
          onClick={() => onNavegar(aba.id)}
        >
          <svg className="mo-nav__icone" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d={iconPaths[aba.icone]} />
          </svg>
          <span>{aba.rotulo}</span>
        </button>
      ))}
    </nav>
  );
}
