"use client";

import Link from "next/link";
import { Suspense, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { BrandLogo } from "@/components/brand-logo";
import { Icon } from "@/components/material/icon";
import { MdFilledButton } from "@/components/material/ui";
import { SignOutButton } from "@/components/sign-out-button";
import { NovoLancamentoSheet, type CartaoOpt, type ItemOpt } from "@/components/novo-lancamento-sheet";
import { parseCompetencia } from "@/lib/competencia-nav";

function mesAtual() {
  const h = new Date();
  return `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, "0")}`;
}

function ChromeBody({
  userName,
  itens,
  cartoes,
  children,
}: {
  userName: string;
  itens: ItemOpt[];
  cartoes: CartaoOpt[];
  children: ReactNode;
}) {
  const sp = useSearchParams();
  const raw = sp.get("mes") ?? "";
  const competencia = parseCompetencia(raw) ? raw : mesAtual();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="app-top">
        <div className="app-top-inner">
          <Link href="/app/resumo" className="app-brand-link">
            <BrandLogo />
          </Link>
          <div className="app-top-right">
            <span className="novo-desk">
              <MdFilledButton onClick={() => setOpen(true)}>
                <Icon name="add" slot="icon" />
                Novo lançamento
              </MdFilledButton>
            </span>
            <span className="app-avatar" title={userName}>
              {(userName.trim().charAt(0) || "M").toUpperCase()}
            </span>
            <SignOutButton />
          </div>
        </div>
        <AppNav />
      </header>
      <div className="app-content">{children}</div>
      <button type="button" className="fab" onClick={() => setOpen(true)}>
        <Icon name="add" />
        Novo lançamento
      </button>
      <NovoLancamentoSheet
        itens={itens}
        cartoes={cartoes}
        competencia={competencia}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export function AppChrome(props: {
  userName: string;
  itens: ItemOpt[];
  cartoes: CartaoOpt[];
  children: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <>
          <header className="app-top">
            <div className="app-top-inner">
              <BrandLogo />
              <AppNav />
            </div>
          </header>
          <div className="app-content">{props.children}</div>
        </>
      }
    >
      <ChromeBody {...props} />
    </Suspense>
  );
}
