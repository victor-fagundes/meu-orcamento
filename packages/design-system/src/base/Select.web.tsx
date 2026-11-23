import React, { useId, useMemo, useState } from 'react';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { SelectOpcao, SelectProps } from '../core/types';

export function Select({
  id,
  rotulo,
  valor,
  onChangeValor,
  opcoes,
  placeholder = 'Selecione...',
  erro,
  obrigatorio = false,
  disabled = false,
}: SelectProps): React.JSX.Element {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-erro`;
  const [focused, setFocused] = useState(false);

  const labelStyle = typography.scale.labelMd;
  const bodyStyle = typography.scale.bodyMd;
  const smallStyle = typography.scale.bodySm;

  const { semGrupo, grupos } = useMemo(() => {
    const ungrouped: SelectOpcao[] = [];
    const grouped = new Map<string, SelectOpcao[]>();
    for (const op of opcoes) {
      if (!op.grupo) {
        ungrouped.push(op);
      } else {
        const list = grouped.get(op.grupo) ?? [];
        list.push(op);
        grouped.set(op.grupo, list);
      }
    }
    return { semGrupo: ungrouped, grupos: Array.from(grouped.entries()) };
  }, [opcoes]);

  const borderColor = erro
    ? 'var(--md-error)'
    : focused
      ? 'var(--md-action)'
      : 'var(--md-border-strong)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, width: '100%' }}>
      <label
        htmlFor={selectId}
        style={{
          fontFamily: 'var(--md-font-family)',
          fontSize: labelStyle.fontSize,
          lineHeight: `${labelStyle.lineHeight}px`,
          fontWeight: Number(labelStyle.fontWeight),
          color: 'var(--md-text-primary)',
        }}
      >
        {rotulo}
        {obrigatorio ? ' *' : ''}
      </label>
      <select
        id={selectId}
        value={valor}
        disabled={disabled}
        required={obrigatorio}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? errorId : undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChangeValor(e.target.value)}
        style={{
          height: grid.touchTargetMin,
          minHeight: grid.touchTargetMin,
          paddingInline: spacing.md,
          borderRadius: radius.sm,
          borderStyle: 'solid',
          borderWidth: focused || erro ? 2 : 1,
          borderColor,
          backgroundColor: disabled ? 'var(--md-surface-muted)' : 'var(--md-surface)',
          color: 'var(--md-text-primary)',
          fontFamily: 'var(--md-font-family)',
          fontSize: bodyStyle.fontSize,
          lineHeight: `${bodyStyle.lineHeight}px`,
          outline: 'none',
          width: '100%',
        }}
      >
        <option value="" disabled={obrigatorio}>
          {placeholder}
        </option>
        {semGrupo.map((op) => (
          <option key={op.valor} value={op.valor} disabled={op.disabled}>
            {op.rotulo}
          </option>
        ))}
        {grupos.map(([nomeGrupo, itens]) => (
          <optgroup key={nomeGrupo} label={nomeGrupo}>
            {itens.map((op) => (
              <option key={op.valor} value={op.valor} disabled={op.disabled}>
                {op.rotulo}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {erro && (
        <span
          id={errorId}
          role="alert"
          style={{
            fontFamily: 'var(--md-font-family)',
            fontSize: smallStyle.fontSize,
            lineHeight: `${smallStyle.lineHeight}px`,
            color: 'var(--md-error)',
          }}
        >
          {erro}
        </span>
      )}
    </div>
  );
}
