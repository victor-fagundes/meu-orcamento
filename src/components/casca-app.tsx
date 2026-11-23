"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CabecalhoTela, ShellApp } from "@meu-orcamento/design-system";
import type { IconName } from "@meu-orcamento/design-system";
import { AREAS, abaAtiva, caminhoComMes, navegacaoMesDaArea } from "@/components/casca-abas";
import { AncoraCabecalho, ProvedorSlotCabecalho } from "@/components/slot-cabecalho";

function mesDaQuery(raw: string | null): string {
  if (raw && /^\d{4}-\d{2}$/.test(raw)) return raw;
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
}

export function CascaApp({ children }: { children: React.ReactNode }) {
  return (
    <ProvedorSlotCabecalho>
      <CascaMiolo>{children}</CascaMiolo>
    </ProvedorSlotCabecalho>
  );
}

function CascaMiolo({ children }: { children: React.ReactNode }) {
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
          if (!destino) return;
          if (destino.pedeMes) {
            const pedido = params.get("mes");
            const mes = pedido && /^\d{4}-\d{2}$/.test(pedido) ? pedido : mesDaQuery(null);
            router.push(`${destino.endereco}?mes=${mes}`);
            return;
          }
          router.push(destino.endereco);
        }}
        cabecalho={
          ativa === "ano" || ativa === "ajustes" ? null : (
            <>
              <CabecalhoTela
                titulo={area?.rotulo ?? ""}
                mostrarSetas={ativa === "resumo"}
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
              <AncoraCabecalho />
            </>
          )
        }
      >
        <div id="conteudo" tabIndex={-1}>{children}</div>
      </ShellApp>
    </>
  );
}
