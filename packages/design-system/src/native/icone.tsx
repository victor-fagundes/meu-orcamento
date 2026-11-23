import Svg, { Path } from 'react-native-svg';
import type { IconeProps } from '../base/contratos.ts';
import { iconPaths } from '../core/icons-paths.ts';
import { useCores } from './tema.tsx';

export function Icone({ nome, tamanho = 24, rotulo }: IconeProps) {
  const cores = useCores();
  const acessivel = rotulo !== undefined && rotulo !== '';
  return (
    <Svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      accessible={acessivel}
      {...(acessivel ? { accessibilityLabel: rotulo } : {})}
      importantForAccessibility={acessivel ? 'yes' : 'no-hide-descendants'}
    >
      <Path d={iconPaths[nome]} fill={cores.text} />
    </Svg>
  );
}
