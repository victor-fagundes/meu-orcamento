import React from 'react';
import { Icone } from '../base/Icone.web';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { LinhaAjusteProps } from '../core/types';

export function LinhaAjuste({
  icone,
  titulo,
  subtitulo,
  onPress,
  badge,
}: LinhaAjusteProps): React.JSX.Element {
  const titleStyle = typography.scale.titleMd;
  const smallStyle = typography.scale.bodySm;
  const labelSm = typography.scale.labelSm;

  return (
    <button
      type="button"
      onClick={onPress}
      style={{
        width: '100%',
        minHeight: grid.touchTargetMin,
        paddingBlock: spacing.md,
        paddingInline: spacing.lg,
        border: 'none',
        borderBottom: '1px solid var(--md-border)',
        backgroundColor: 'var(--md-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
        textAlign: 'left',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
        <Icone nome={icone} tamanho={20} cor="var(--md-text-secondary)" decorativo />
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
          <span
            style={{
              fontFamily: 'var(--md-font-family)',
              fontSize: titleStyle.fontSize,
              lineHeight: `${titleStyle.lineHeight}px`,
              fontWeight: Number(titleStyle.fontWeight),
              color: 'var(--md-text-primary)',
            }}
          >
            {titulo}
          </span>
          <span
            style={{
              fontFamily: 'var(--md-font-family)',
              fontSize: smallStyle.fontSize,
              lineHeight: `${smallStyle.lineHeight}px`,
              color: 'var(--md-text-secondary)',
            }}
          >
            {subtitulo}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
        {badge && (
          <span
            style={{
              paddingInline: spacing.sm,
              paddingBlock: 2,
              borderRadius: radius.full,
              backgroundColor: 'var(--md-selected)',
              color: 'var(--md-on-selected)',
              fontFamily: 'var(--md-font-family)',
              fontSize: labelSm.fontSize,
              fontWeight: Number(labelSm.fontWeight),
            }}
          >
            {badge}
          </span>
        )}
        <span aria-hidden="true" style={{ fontSize: 20, color: 'var(--md-text-muted)' }}>
          ›
        </span>
      </div>
    </button>
  );
}
