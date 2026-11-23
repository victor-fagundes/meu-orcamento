import React, { useEffect } from 'react';
import { grid, spacing, typography } from '../core/tokens';
import type { FormularioContainerProps } from '../core/types';
import { Botao } from './Botao.web';

export function FormularioContainer({
  aberto,
  titulo,
  subtitulo,
  onFechar,
  onConfirmar,
  rotuloConfirmar = 'Salvar',
  rotuloCancelar = 'Cancelar',
  carregando = false,
  confirmarDesabilitado = false,
  children,
}: FormularioContainerProps): React.JSX.Element | null {
  useEffect(() => {
    if (!aberto || typeof window === 'undefined') return;
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && !carregando) {
        onFechar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aberto, carregando, onFechar]);

  if (!aberto) {
    return null;
  }

  const titleStyle = typography.scale.titleLg;
  const subStyle = typography.scale.bodySm;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      onClick={carregando ? undefined : onFechar}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 900,
        backgroundColor: 'var(--md-overlay)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: grid.drawerWidth,
          height: '100%',
          backgroundColor: 'var(--md-surface)',
          boxShadow: 'var(--md-shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <header
          style={{
            padding: spacing.xl,
            borderBottom: '1px solid var(--md-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.xs,
          }}
        >
          <h2
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
          </h2>
          {subtitulo && (
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--md-font-family)',
                fontSize: subStyle.fontSize,
                lineHeight: `${subStyle.lineHeight}px`,
                color: 'var(--md-text-secondary)',
              }}
            >
              {subtitulo}
            </p>
          )}
        </header>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: spacing.xl,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.lg,
          }}
        >
          {children}
        </div>

        <footer
          style={{
            padding: spacing.lg,
            borderTop: '1px solid var(--md-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing.md,
          }}
        >
          <Botao variante="secundario" onPress={onFechar} disabled={carregando}>
            {rotuloCancelar}
          </Botao>
          <Botao
            variante="primario"
            onPress={onConfirmar}
            loading={carregando}
            disabled={confirmarDesabilitado}
          >
            {rotuloConfirmar}
          </Botao>
        </footer>
      </div>
    </div>
  );
}
