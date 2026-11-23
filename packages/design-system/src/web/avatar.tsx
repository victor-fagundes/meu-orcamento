import type { AvatarProps } from '../base/contratos.ts';

export function Avatar({ iniciais, nome, comNome = false }: AvatarProps) {
  const letras = iniciais.slice(0, 2);
  const nomeAcessivel = nome !== undefined && nome !== '' ? nome : letras;
  return (
    <span className="mo-avatar">
      <span
        className="mo-avatar__iniciais"
        aria-hidden={comNome ? true : undefined}
        aria-label={comNome ? undefined : nomeAcessivel}
      >
        {letras}
      </span>
      {comNome && nome !== undefined && nome !== '' ? <span className="mo-avatar__nome">{nome}</span> : null}
    </span>
  );
}
