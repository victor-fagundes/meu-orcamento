import type { SkeletonProps } from '../base/contratos.ts';

/** Bloco cinza de carregamento. Sem animação em loop (IMPLEMENTACAO.md, seção 6). */
export function Skeleton({ altura, largura = '100%', forma = 'bloco' }: SkeletonProps) {
  const classe = forma === 'bloco' ? 'mo-skeleton' : `mo-skeleton mo-skeleton--${forma}`;
  const largurar = typeof largura === 'number' ? `${largura}px` : largura;
  return <div aria-hidden="true" className={classe} style={{ height: altura, width: largurar }} />;
}
