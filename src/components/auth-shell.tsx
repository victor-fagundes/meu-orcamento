import { BrandLogo } from "@/components/brand-logo";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="auth-page">
      <aside className="auth-brand" aria-hidden="false">
        <div className="auth-brand-inner">
          <BrandLogo className="auth-brand-logo" />
          <h2 className="auth-brand-title">Planeje. Lance. Acompanhe.</h2>
          <p className="auth-brand-copy">
            Controle receitas, despesas e cartão sem planilha quebrada — no celular e no desktop.
          </p>
          <ul className="auth-brand-list">
            <li>Orçamento por categoria</li>
            <li>Parcelas e competência de fatura</li>
            <li>Alertas antes do estouro</li>
          </ul>
        </div>
      </aside>

      <section className="auth-panel">
        <div className="auth-panel-mobile-logo">
          <BrandLogo />
        </div>
        <div className="auth-card">
          <h1 className="auth-title">{title}</h1>
          {subtitle ? <p className="auth-subtitle">{subtitle}</p> : null}
          <div className="auth-body">{children}</div>
        </div>
      </section>
    </div>
  );
}
