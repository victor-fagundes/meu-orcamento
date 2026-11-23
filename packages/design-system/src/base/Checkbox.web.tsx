import React, { useId } from 'react';
import { grid, spacing, typography } from '../core/tokens';
import type { CheckboxProps } from '../core/types';

export function Checkbox({
  id,
  rotulo,
  descricao,
  marcado,
  onChangeMarcado,
  disabled = false,
}: CheckboxProps): React.JSX.Element {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const bodyStyle = typography.scale.bodyMd;
  const smallStyle = typography.scale.bodySm;

  return (
    <label
      htmlFor={inputId}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.md,
        minHeight: grid.touchTargetMin,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.56 : 1,
      }}
    >
      <input
        id={inputId}
        type="checkbox"
        checked={marcado}
        disabled={disabled}
        onChange={(e) => onChangeMarcado(e.target.checked)}
        style={{
          width: 20,
          height: 20,
          accentColor: 'var(--md-action)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          flexShrink: 0,
        }}
      />
      <span style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        <span
          style={{
            fontFamily: 'var(--md-font-family)',
            fontSize: bodyStyle.fontSize,
            lineHeight: `${bodyStyle.lineHeight}px`,
            color: 'var(--md-text-primary)',
          }}
        >
          {rotulo}
        </span>
        {descricao && (
          <span
            style={{
              fontFamily: 'var(--md-font-family)',
              fontSize: smallStyle.fontSize,
              lineHeight: `${smallStyle.lineHeight}px`,
              color: 'var(--md-text-secondary)',
            }}
          >
            {descricao}
          </span>
        )}
      </span>
    </label>
  );
}
