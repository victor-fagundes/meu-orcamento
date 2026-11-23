import React from 'react';
import { Icone } from '../base/Icone.web';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { AbaPrincipalItem, NavegacaoPrincipalProps } from '../core/types';

const ABAS_PADRAO: readonly AbaPrincipalItem[] = [
  { id: 'resumo', rotulo: 'Resumo', icone: 'dashboard' },
  { id: 'orcamento', rotulo: 'Orçamento', icone: 'assignment' },
  { id: 'lancamentos', rotulo: 'Lançamentos', icone: 'list' },
  { id: 'ano', rotulo: 'Ano', icone: 'calendar_month' },
  { id: 'ajustes', rotulo: 'Ajustes', icone: 'settings' },
];

export function NavegacaoPrincipal({
  abaAtiva,
  emSubtelaAjustes = false,
  onSelecionarAba,
  abas = ABAS_PADRAO,
}: NavegacaoPrincipalProps): React.JSX.Element {
  const labelStyle = typography.scale.labelMd;
  const abaEfetiva = emSubtelaAjustes ? 'ajustes' : abaAtiva;

  return (
    <aside
      aria-label="Navegação principal"
      style={{
        width: grid.sidebarWidth,
        minWidth: grid.sidebarWidth,
        height: '100vh',
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--md-surface)',
        borderRight: '1px solid var(--md-border)',
        padding: spacing.md,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.xs,
        boxSizing: 'border-box',
      }}
    >
      {abas.map((aba) => {
        const ativa = aba.id === abaEfetiva;
        return (
          <button
            key={aba.id}
            type="button"
            onClick={() => onSelecionarAba(aba.id)}
            aria-current={ativa ? 'page' : undefined}
            style={{
              width: '100%',
              minHeight: grid.touchTargetMin,
              paddingInline: spacing.md,
              borderRadius: radius.full,
              border: 'none',
              backgroundColor: ativa ? 'var(--md-selected)' : 'transparent',
              color: ativa ? 'var(--md-on-selected)' : 'var(--md-text-secondary)',
              fontFamily: 'var(--md-font-family)',
              fontSize: labelStyle.fontSize,
              lineHeight: `${labelStyle.lineHeight}px`,
              fontWeight: Number(labelStyle.fontWeight),
              display: 'flex',
              alignItems: 'center',
              gap: spacing.md,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <Icone
              nome={aba.icone}
              tamanho={20}
              cor={ativa ? 'var(--md-on-selected)' : 'var(--md-text-secondary)'}
              decorativo
            />
            <span>{aba.rotulo}</span>
          </button>
        );
      })}
    </aside>
  );
}
