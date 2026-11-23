"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Botao, CabecalhoTela, ShellApp } from "@meu-orcamento/design-system";
import type { IconName } from "@meu-orcamento/design-system";
import { authClient } from "@/lib/auth-client";
import { AREAS, abaAtiva, caminhoComMes, navegacaoMesDaArea } from "@/components/casca-abas";

function mesDaQuery(raw: string | null): string {
  if (raw && /^\d{4}-\d{2}$/.test(raw)) return raw;
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
}

export function CascaApp({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const ativa = abaAtiva(pathname);
  const area = AREAS.find((item) => item.id === ativa);
  const mes = navegacaoMesDaArea(area ?? { pedeMes: false }, mesDaQuery(params.get("mes")));

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <ShellApp
        abas={AREAS.map((item) => ({
          id: item.id,
          rotulo: item.rotulo,
          icone: item.icone as IconName,
        }))}
        ativa={ativa}
        onNavegar={(id) => {
          const destino = AREAS.find((item) => item.id === id);
          if (destino) router.push(destino.endereco);
        }}
        cabecalho={
          <>
            <CabecalhoTela
              titulo={area?.rotulo ?? ""}
              navegacaoMes={
                mes && area
                  ? {
                      rotulo: mes.rotulo,
                      onAnterior: () => router.push(caminhoComMes(area.endereco, params.toString(), mes.anterior)),
                      onProximo: () => router.push(caminhoComMes(area.endereco, params.toString(), mes.proximo)),
                    }
                  : undefined
              }
            />
            <Botao
              variante="texto"
              onPress={() => {
                void authClient.signOut().then(() => {
                  window.location.assign("/login");
                });
              }}
            >
              Sair
            </Botao>
          </>
        }
      >
        <div id="conteudo">{children}</div>
      </ShellApp>
    </>
  );
}
