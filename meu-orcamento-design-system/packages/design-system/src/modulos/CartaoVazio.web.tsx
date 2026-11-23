import React from 'react';
import { Botao } from '../base/Botao.web';
import { Icone } from '../base/Icone.web';
import { radius, spacing, typography } from '../core/tokens';
import type { CartaoVazioProps } from '../core/types';

export function CartaoVazio({
  icone,
  titulo,
  descricao,
  rotuloAcao,
  onAcao,
}: CartaoVazioProps): React.JSX.Element {
  const titleStyle = typography.scale.titleMd;
  const bodyStyle = typography.scale.bodyMd;

  return (
    <div
      style={{
        backgroundColor: 'var(--md-surface)',
        border: '1px dashed var(--md-border-strong)',
        borderRadius: radius.lg,
        padding: spacing.xxl,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: spacing.md,
      }}
    >
      {icone && <Icone nome={icone} tamanho={32} cor="var(--md-text-muted)" decorativo />}
      <h3
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
      </h3>
      <p
        style={{
          margin: 0,
          maxWidth: 420,
          fontFamily: 'var(--md-font-family)',
          fontSize: bodyStyle.fontSize,
          lineHeight: `${bodyStyle.lineHeight}px`,
          color: 'var(--md-text-secondary)',
        }}
      >
        {descricao}
      </p>
      {rotuloAcao && onAcao && (
        <div style={{ marginTop: spacing.xs }}>
          <Botao variante="primario" onPress={onAcao}>
            {rotuloAcao}
          </Botao>
        </div>
      )}
    </div>
  );
}
