"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Botao,
  Campo,
  Chips,
  Dialogo,
  FormularioContainer,
  Select,
} from "@meu-orcamento/design-system";
import {
  arquivarCategoriaAction,
  criarCategoriaAction,
  renomearCategoriaAction,
} from "@/app/actions/categorias";
import { focarLinha } from "@/components/focar-linha";

const TIPOS = [
  { valor: "R", rotulo: "Receitas" },
  { valor: "F", rotulo: "Despesas fixas" },
  { valor: "V", rotulo: "Despesas variáveis" },
  { valor: "E", rotulo: "Anuais" },
] as const;

type Tipo = (typeof TIPOS)[number]["valor"];

export type LinhaCategoria = { id: string; tipo: string; nome: string; itens: number };
export type LinhaArquivada = { id: string; nome: string; tipo: string; grupo: string; historico: boolean };

const ERRO_SALVAR = "Não foi possível salvar. Os campos continuam preenchidos.";

function rotuloTipo(tipo: string): string {
  return TIPOS.find((item) => item.valor === tipo)?.rotulo ?? tipo;
}

function textoItens(n: number): string {
  return n === 1 ? "1 item" : `${n} itens`;
}

function hrefAba(aba: "categorias" | "arquivados", tipo: string | null): string {
  const query = new URLSearchParams();
  if (tipo) query.set("tipo", tipo);
  if (aba === "arquivados") query.set("aba", "arquivados");
  const texto = query.toString();
  return texto ? `/app/ajustes/categorias?${texto}` : "/app/ajustes/categorias";
}

export function CategoriasTela({
  categorias,
  arquivados,
  tipoMarcado,
  aba,
}: {
  categorias: LinhaCategoria[];
  arquivados: LinhaArquivada[];
  tipoMarcado: string | null;
  aba: "categorias" | "arquivados";
}) {
  const router = useRouter();
  const [criar, setCriar] = useState(false);
  const [renomear, setRenomear] = useState<LinhaCategoria | null>(null);
  const [arquivar, setArquivar] = useState<LinhaCategoria | null>(null);
  const [tipoNovo, setTipoNovo] = useState<Tipo>((tipoMarcado as Tipo) || "R");
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [abertos, setAbertos] = useState<string[]>(() => (tipoMarcado ? [tipoMarcado] : []));

  useEffect(() => {
    if (!tipoMarcado) return;
    setAbertos((atual) => (atual.includes(tipoMarcado) ? atual : [...atual, tipoMarcado]));
  }, [tipoMarcado]);

  function alternarTipo(tipo: string) {
    setAbertos((atual) => (atual.includes(tipo) ? atual.filter((item) => item !== tipo) : [...atual, tipo]));
  }

  function fecharFormulario() {
    setCriar(false);
    setRenomear(null);
    setErro(null);
    setNome("");
  }

  async function salvar() {
    setErro(null);
    const res = renomear
      ? await renomearCategoriaAction(renomear.id, nome)
      : await criarCategoriaAction({ tipo: tipoNovo, nome });
    if (!res.ok) {
      setErro(res.error || ERRO_SALVAR);
      return;
    }
    const id = res.id;
    const tipoAberto = renomear?.tipo ?? tipoNovo;
    setAbertos((atual) => (atual.includes(tipoAberto) ? atual : [...atual, tipoAberto]));
    fecharFormulario();
    router.refresh();
    focarLinha(`categoria:${id}`);
  }

  async function confirmarArquivar() {
    if (!arquivar) return;
    const alvo = arquivar;
    const res = await arquivarCategoriaAction(alvo.id);
    if (!res.ok) {
      setErro(res.error || ERRO_SALVAR);
      return;
    }
    setArquivar(null);
    setAviso("Categoria arquivada.");
    router.refresh();
  }

  return (
    <section>
      <h2>Categorias e itens</h2>
      <Chips
        rotuloGrupo="Categorias"
        selecionado={aba}
        onSelecionar={(valor) => router.push(hrefAba(valor, tipoMarcado))}
        opcoes={[
          { valor: "categorias", rotulo: "Categorias" },
          { valor: "arquivados", rotulo: "Itens arquivados" },
        ]}
      />
      {aba === "arquivados" ? (
        <Arquivados linhas={arquivados} />
      ) : (
        <>
          <p className="mo-ajustes__apoio">
            Renomear atualiza o nome em todos os itens da categoria. Arquivar tira a categoria do Orçamento; os
            lançamentos antigos continuam.
          </p>
          {aviso ? <p role="status">{aviso}</p> : null}
          {TIPOS.map((tipo) => {
            const aberto = abertos.includes(tipo.valor);
            const linhas = categorias.filter((categoria) => categoria.tipo === tipo.valor);
            return (
              <section key={tipo.valor}>
                <h3 className="mo-categorias__tipo" aria-current={tipoMarcado === tipo.valor ? "true" : undefined}>
                  <button
                    type="button"
                    aria-expanded={aberto}
                    aria-controls={`tipo-${tipo.valor}`}
                    onClick={() => alternarTipo(tipo.valor)}
                  >
                    {tipo.rotulo}
                  </button>
                </h3>
                {aberto ? (
                  <ul id={`tipo-${tipo.valor}`} className="mo-ajustes__lista">
                    {linhas.map((categoria) => (
                      <li key={categoria.id} className="mo-ajustes__linha">
                        <div id={`categoria:${categoria.id}`} className="mo-ajustes__linha-texto" tabIndex={-1}>
                          <strong>{categoria.nome}</strong>
                          <span>
                            {tipo.rotulo} · {textoItens(categoria.itens)}
                          </span>
                        </div>
                        <div className="mo-categorias__acoes">
                          <button
                            type="button"
                            className="mo-botao mo-botao--texto"
                            onClick={() => {
                              setNome(categoria.nome);
                              setErro(null);
                              setRenomear(categoria);
                            }}
                          >
                            Renomear
                          </button>
                          <button type="button" className="mo-botao mo-botao--texto" onClick={() => setArquivar(categoria)}>
                            Arquivar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            );
          })}
          <Botao
            variante="secundario"
            onPress={() => {
              setNome("");
              setErro(null);
              setTipoNovo((tipoMarcado as Tipo) || "R");
              setCriar(true);
            }}
          >
            + Nova categoria
          </Botao>
        </>
      )}
      <FormularioContainer
        aberto={criar || renomear !== null}
        titulo={renomear ? "Renomear" : "Nova categoria"}
        textoSalvar="Salvar"
        folhaNaEstreita
        onCancelar={fecharFormulario}
        onSalvar={() => {
          void salvar();
        }}
      >
        <Select
          id="tipo-categoria"
          rotulo="Tipo"
          valor={renomear ? renomear.tipo : tipoNovo}
          desabilitado={renomear !== null}
          onMudar={(valor) => setTipoNovo(valor as Tipo)}
          grupos={[{ rotulo: "Tipo", opcoes: TIPOS.map((tipo) => ({ valor: tipo.valor, rotulo: tipo.rotulo })) }]}
        />
        <Campo id="nome-categoria" rotulo="Nome" valor={nome} onMudar={setNome} erro={erro ?? undefined} />
      </FormularioContainer>
      <Dialogo
        aberto={arquivar !== null}
        titulo={arquivar ? `Arquivar ${arquivar.nome}?` : "Arquivar?"}
        descricao="Os itens saem do Orçamento. Os lançamentos antigos continuam."
        textoConfirmar="Arquivar"
        tipoConfirmar="destrutivo"
        onCancelar={() => setArquivar(null)}
        onConfirmar={() => {
          void confirmarArquivar();
        }}
      />
    </section>
  );
}

function Arquivados({ linhas }: { linhas: LinhaArquivada[] }) {
  return (
    <>
      <p className="mo-ajustes__apoio">
        Somente leitura. Arquivados não entram em novos lançamentos nem na lista ativa do Orçamento.
      </p>
      {linhas.length === 0 ? (
        <p>Nenhum item arquivado.</p>
      ) : (
        <table className="mo-ajustes__tabela">
          <thead>
            <tr>
              <th>Item</th>
              <th>Tipo · grupo</th>
              <th>Lançamentos</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha) => (
              <tr key={linha.id}>
                <td>{linha.nome}</td>
                <td>
                  {rotuloTipo(linha.tipo)} · {linha.grupo}
                </td>
                <td>{linha.historico ? "Histórico mantido" : "Nenhum lançamento"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
