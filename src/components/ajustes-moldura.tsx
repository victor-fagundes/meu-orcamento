"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Botao, LinhaAjuste } from "@meu-orcamento/design-system";
import type { IconName } from "@meu-orcamento/design-system";
import { DialogoSair } from "@/components/dialogo-sair";

type Entrada = {
  rotulo: string;
  href: string;
  icone: IconName;
  atual: (caminho: string, aba: string | null) => boolean;
};

const DIA_A_DIA: Entrada[] = [
  {
    rotulo: "Conta",
    href: "/app/ajustes/conta",
    icone: "person",
    atual: (caminho) => caminho.startsWith("/app/ajustes/conta"),
  },
  {
    rotulo: "Categorias e itens",
    href: "/app/ajustes/categorias",
    icone: "category",
    atual: (caminho, aba) => caminho.startsWith("/app/ajustes/categorias") && aba !== "arquivados",
  },
  {
    rotulo: "Cartões",
    href: "/app/ajustes/cartoes",
    icone: "credit_card",
    atual: (caminho) => caminho.startsWith("/app/ajustes/cartoes"),
  },
  {
    rotulo: "Limites de alerta",
    href: "/app/ajustes/limites",
    icone: "notifications",
    atual: (caminho) => caminho.startsWith("/app/ajustes/limites"),
  },
  {
    rotulo: "Itens arquivados",
    href: "/app/ajustes/categorias?aba=arquivados",
    icone: "archive",
    atual: (caminho, aba) => caminho.startsWith("/app/ajustes/categorias") && aba === "arquivados",
  },
];

const DADOS: Entrada[] = [
  {
    rotulo: "Importar planilha",
    href: "/app/ajustes/importar-planilha",
    icone: "table_chart",
    atual: (caminho) => caminho.startsWith("/app/ajustes/importar-planilha"),
  },
  {
    rotulo: "Importar fatura",
    href: "/app/ajustes/importar-fatura",
    icone: "description",
    atual: (caminho) => caminho.startsWith("/app/ajustes/importar-fatura"),
  },
  {
    rotulo: "Exportar",
    href: "/app/ajustes/exportar",
    icone: "upload",
    atual: (caminho) => caminho.startsWith("/app/ajustes/exportar"),
  },
  {
    rotulo: "Simulador de competência",
    href: "/app/ajustes/simulador",
    icone: "event_available",
    atual: (caminho) => caminho.startsWith("/app/ajustes/simulador"),
  },
  {
    rotulo: "Dados de exemplo",
    href: "/app/ajustes/exemplo",
    icone: "science",
    atual: (caminho) => caminho.startsWith("/app/ajustes/exemplo"),
  },
];

export function AjustesMoldura({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const aba = useSearchParams().get("aba");
  const [soMenu, setSoMenu] = useState(false);
  const [sair, setSair] = useState(false);

  function abrir(href: string) {
    setSoMenu(false);
    router.push(href);
  }

  const classe = soMenu ? "mo-ajustes mo-ajustes--so-menu" : "mo-ajustes mo-ajustes--so-pagina";

  return (
    <div className={classe}>
      <nav className="mo-ajustes__menu" aria-label="Ajustes">
        <p className="mo-ajustes__titulo">Ajustes</p>
        <Grupo titulo="Dia a dia" entradas={DIA_A_DIA} caminho={pathname} aba={aba} onAbrir={abrir} />
        <Grupo titulo="Dados e arquivos" entradas={DADOS} caminho={pathname} aba={aba} onAbrir={abrir} />
        <LinhaAjuste
          icone="delete"
          rotulo="Excluir conta"
          destrutivo
          atual={pathname.startsWith("/app/ajustes/excluir")}
          onAbrir={() => abrir("/app/ajustes/excluir")}
        />
        <LinhaAjuste icone="logout" rotulo="Sair da conta" onAbrir={() => setSair(true)} />
      </nav>
      <div className="mo-ajustes__pagina">
        <div className="mo-ajustes__voltar">
          <Botao variante="texto" onPress={() => setSoMenu(true)}>
            Voltar
          </Botao>
        </div>
        {children}
      </div>
      <DialogoSair aberto={sair} onCancelar={() => setSair(false)} />
    </div>
  );
}

function Grupo({
  titulo,
  entradas,
  caminho,
  aba,
  onAbrir,
}: {
  titulo: string;
  entradas: Entrada[];
  caminho: string;
  aba: string | null;
  onAbrir: (href: string) => void;
}) {
  return (
    <div className="mo-ajustes__grupo">
      <p className="mo-ajustes__titulo">{titulo}</p>
      {entradas.map((entrada) => (
        <LinhaAjuste
          key={entrada.href}
          icone={entrada.icone}
          rotulo={entrada.rotulo}
          atual={entrada.atual(caminho, aba)}
          onAbrir={() => onAbrir(entrada.href)}
        />
      ))}
    </div>
  );
}
