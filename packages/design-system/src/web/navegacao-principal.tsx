'use client'
import type { NavegacaoPrincipalProps } from '../base/contratos.ts';
import { iconPaths } from '../core/icons-paths.ts';

/** Barra lateral de 240 px no desktop. Ajustes continua ativa nas subtelas (MODULOS.md, módulo 15). */
export function NavegacaoPrincipal({ abas, ativa, onNavegar }: NavegacaoPrincipalProps) {
  return (
    <nav aria-label="Principal" className="mo-nav">
      <div className="mo-nav__marca">
        <svg viewBox="0 0 180 180" width="32" height="32" aria-hidden="true">
          <rect width="180" height="180" rx="44" fill="var(--md-brand-yellow)" />
          <rect x="46" y="46" width="88" height="18" rx="6" fill="#191c20" />
          <rect x="34" y="60" width="112" height="80" rx="16" fill="#191c20" />
          <rect x="100" y="86" width="46" height="28" rx="10" fill="#0058be" />
          <circle cx="118" cy="100" r="5" fill="var(--md-brand-yellow)" />
        </svg>
        Meu Orçamento
      </div>
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
