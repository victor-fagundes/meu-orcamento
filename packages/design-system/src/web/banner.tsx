import type { BannerProps } from '../base/contratos.ts';

export function Banner({ tipo, children }: BannerProps) {
  const papel = tipo === 'erro' ? 'alert' : 'status';
  return (
    <div role={papel} className={`mo-banner mo-banner--${tipo}`}>
      {children}
    </div>
  );
}
