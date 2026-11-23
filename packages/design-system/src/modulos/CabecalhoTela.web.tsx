import React from 'react';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { CabecalhoTelaProps } from '../core/types';

export function CabecalhoTela({
  titulo,
  modoNavegacao = 'nenhum',
  onMesAnterior,
  onProximoMes,
  onVoltar,
  acaoDireita,
}: CabecalhoTelaProps): React.JSX.Element {
  const titleStyle = typography.scale.titleLg;

  return (
    <header
      style={{
        height: grid.headerHeight,
        minHeight: grid.headerHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
        paddingInline: spacing.lg,
        backgroundColor: 'var(--md-surface)',
        borderBottom: '1px solid var(--md-border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
        {modoNavegacao === 'voltar' && (
          <button
            type="button"
            onClick={onVoltar}
            aria-label="Voltar"
            style={{
              width: grid.touchTargetMin,
              height: grid.touchTargetMin,
              borderRadius: radius.full,
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--md-text-primary)',
              fontSize: 22,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ‹
          </button>
        )}

        {modoNavegacao === 'mes' ? (
          <nav aria-label="Navegação de mês" style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
            <button
              type="button"
              onClick={onMesAnterior}
              aria-label="Mês anterior"
              style={{
                width: grid.touchTargetMin,
                height: grid.touchTargetMin,
                borderRadius: radius.full,
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--md-text-primary)',
                fontSize: 22,
                cursor: 'pointer',
              }}
            >
              ‹
            </button>
            <h1
              style={{
                margin: 0,
                fontFamily: 'var(--md-font-family)',
                fontSize: titleStyle.fontSize,
                lineHeight: `${titleStyle.lineHeight}px`,
                fontWeight: Number(titleStyle.fontWeight),
                color: 'var(--md-text-primary)',
                minWidth: 156,
                textAlign: 'center',
              }}
            >
              {titulo}
            </h1>
            <button
              type="button"
              onClick={onProximoMes}
              aria-label="Próximo mês"
              style={{
                width: grid.touchTargetMin,
                height: grid.touchTargetMin,
                borderRadius: radius.full,
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--md-text-primary)',
                fontSize: 22,
                cursor: 'pointer',
              }}
            >
              ›
            </button>
          </nav>
        ) : (
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--md-font-family)',
              fontSize: titleStyle.fontSize,
              lineHeight: `${titleStyle.lineHeight}px`,
              fontWeight: Number(titleStyle.fontWeight),
              color: 'var(--md-text-primary)',
            }}
          >
            {titulo}
          </h1>
        )}
      </div>

      {acaoDireita && <div>{acaoDireita}</div>}
    </header>
  );
}
