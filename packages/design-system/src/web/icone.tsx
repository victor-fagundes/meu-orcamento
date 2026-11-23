import type { IconeProps } from '../base/contratos.ts';
import { iconPaths } from '../core/icons-paths.ts';

export function Icone({ nome, tamanho = 24, rotulo }: IconeProps) {
  const acessivel = rotulo !== undefined && rotulo !== '';
  return (
    <svg
      className="mo-icone"
      viewBox="0 0 24 24"
      width={tamanho}
      height={tamanho}
      role={acessivel ? 'img' : undefined}
      aria-label={acessivel ? rotulo : undefined}
      aria-hidden={acessivel ? undefined : true}
      focusable="false"
    >
      <path d={iconPaths[nome]} />
    </svg>
  );
}
