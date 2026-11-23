import React, { useEffect } from 'react';
import { radius, spacing, typography } from '../core/tokens';
import type { DialogoProps } from '../core/types';
import { Botao } from './Botao.web';

export function Dialogo({
  aberto,
  titulo,
  descricao,
  rotuloConfirmar,
  rotuloCancelar = 'Cancelar',
  destrutivo = true,
  carregando = false,
  onConfirmar,
  onCancelar,
}: DialogoProps): React.JSX.Element | null {
  useEffect(() => {
    if (!aberto || typeof window === 'undefined') return;
    const handleKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && !carregando) {
        onCancelar();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [aberto, carregando, onCancelar]);

  if (!aberto) {
    return null;
  }

  const titleStyle = typography.scale.titleMd;
  const bodyStyle = typography.scale.bodyMd;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="mo-dialogo-titulo"
      aria-describedby="mo-dialogo-desc"
      onClick={carregando ? undefined : onCancelar}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'var(--md-overlay)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: 'var(--md-surface)',
          borderRadius: radius.lg,
          padding: spacing.xl,
          boxShadow: 'var(--md-shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.lg,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
          <h2
            id="mo-dialogo-titulo"
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
          <p
            id="mo-dialogo-desc"
            style={{
              margin: 0,
              fontFamily: 'var(--md-font-family)',
              fontSize: bodyStyle.fontSize,
              lineHeight: `${bodyStyle.lineHeight}px`,
              color: 'var(--md-text-secondary)',
            }}
          >
            {descricao}
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing.md,
          }}
        >
          <Botao variante="secundario" onPress={onCancelar} disabled={carregando}>
            {rotuloCancelar}
          </Botao>
          <Botao
            variante={destrutivo ? 'destrutivo' : 'primario'}
            onPress={onConfirmar}
            loading={carregando}
          >
            {rotuloConfirmar}
          </Botao>
        </div>
      </div>
    </div>
  );
}
