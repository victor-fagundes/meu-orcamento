import { MdFilledButton, MdOutlinedButton } from "@/components/material/ui";
import { BrandLogo } from "@/components/brand-logo";

export default function HomePage() {
  return (
    <div className="home-page">
      <aside className="home-brand">
        <div className="auth-brand-inner">
          <BrandLogo className="auth-brand-logo" />
          <h2 className="auth-brand-title">Seu orçamento sob controle.</h2>
          <p className="auth-brand-copy">
            Substitua a planilha por um app feito para o dia a dia — no Windows e no celular.
          </p>
          <ul className="auth-brand-list">
            <li>Visão clara do que ainda pode gastar</li>
            <li>Cartão e parcelas sem surpresa</li>
            <li>Alertas antes de estourar o mês</li>
          </ul>
        </div>
      </aside>

      <main className="home-main">
        <div className="home-mobile-logo">
          <BrandLogo />
        </div>
        <div className="home-card">
          <p className="home-kicker">Meu Orçamento</p>
          <h1 className="home-title">Comece a planejar o mês em minutos.</h1>
          <p className="home-copy">
            Crie sua conta para registrar lançamentos, acompanhar categorias e fechar o mês com
            tranquilidade.
          </p>
          <div className="home-actions">
            <MdFilledButton href="/cadastro">Criar conta</MdFilledButton>
            <MdOutlinedButton href="/login">Entrar</MdOutlinedButton>
          </div>
        </div>
      </main>
    </div>
  );
}
