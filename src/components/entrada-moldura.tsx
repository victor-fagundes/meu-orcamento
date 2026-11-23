export function EntradaMoldura({ children }: { children: React.ReactNode }) {
  return (
    <main className="mo-entrada">
      <div className="mo-entrada__marca-bloco">
        <svg className="mo-entrada__marca" viewBox="0 0 180 180" aria-hidden="true">
          <rect width="180" height="180" rx="44" className="mo-entrada__marca-fundo" />
          <rect x="46" y="46" width="88" height="18" rx="6" className="mo-entrada__marca-tinta" />
          <rect x="34" y="60" width="112" height="80" rx="16" className="mo-entrada__marca-tinta" />
          <rect x="100" y="86" width="46" height="28" rx="10" className="mo-entrada__marca-acao" />
          <circle cx="118" cy="100" r="5" className="mo-entrada__marca-fundo" />
        </svg>
        <p className="mo-entrada__nome">Meu Orçamento</p>
        <h2 className="mo-entrada__frase">O que ainda cabe neste mês.</h2>
        <p className="mo-entrada__apoio">Entre para ver o que ainda cabe no mês.</p>
      </div>
      <section className="mo-entrada__formulario">{children}</section>
    </main>
  );
}
