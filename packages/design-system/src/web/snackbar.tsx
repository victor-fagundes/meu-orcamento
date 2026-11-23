'use client'
import type { SnackbarProps } from '../base/contratos.ts';

export function Snackbar({ mensagem, onDesfazer, rotuloDesfazer = 'Desfazer' }: SnackbarProps) {
  return (
    <div role="status" className="mo-snackbar">
      <span>{mensagem}</span>
      {onDesfazer ? (
        <button type="button" className="mo-snackbar__acao" onClick={onDesfazer}>
          {rotuloDesfazer}
        </button>
      ) : null}
    </div>
  );
}
