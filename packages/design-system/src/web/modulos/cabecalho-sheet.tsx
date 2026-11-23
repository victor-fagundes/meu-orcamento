import type { CabecalhoSheetProps } from '../../base/contratos.ts';

/** No web, o cabeçalho de formulário é o título do painel. O puxador só existe no celular. */
export function CabecalhoSheet({ titulo, subtitulo }: CabecalhoSheetProps) {
  return (
    <header className="mo-cabecalho-sheet">
      <h2 className="mo-cabecalho-sheet__titulo">{titulo}</h2>
      {subtitulo ? <p className="mo-cabecalho-sheet__subtitulo">{subtitulo}</p> : null}
    </header>
  );
}
