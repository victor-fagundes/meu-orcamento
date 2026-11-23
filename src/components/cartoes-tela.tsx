"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Botao, Campo, Dialogo, FormularioContainer } from "@meu-orcamento/design-system";
import { atualizarCartaoAction, criarCartaoAction, inativarCartaoAction } from "@/app/actions/cartoes";
import { focarLinha } from "@/components/focar-linha";
import { textoLinhaCartao } from "@/domain/cartoes";

export type CartaoLinha = {
  id: string;
  apelido: string;
  diaFechamento: number | null;
  diaVencimento: number | null;
  instituicao: string | null;
  ultimos4: string | null;
  ativo: boolean;
};

const ERRO_SALVAR = "Não foi possível salvar. Os campos continuam preenchidos.";
const AVISO_SEM = "Sem dia de fechamento, a competência é o mês da compra.";
const AVISO_DIA =
  "Compra no dia do fechamento entra na fatura do mês seguinte. Alguns bancos tratam esse dia de outro jeito.";
const AVISO_NOVAS = "Vale para compras novas. As que já estão lançadas permanecem no mês em que foram gravadas.";

type Rascunho = {
  id: string | null;
  apelido: string;
  fechamento: string;
  vencimento: string;
  instituicao: string;
  ultimos4: string;
};

const vazio: Rascunho = { id: null, apelido: "", fechamento: "", vencimento: "", instituicao: "", ultimos4: "" };

function diaInvalido(valor: string, max: number, rotulo: string): string | null {
  const texto = valor.trim();
  if (!texto) return null;
  if (!/^\d+$/.test(texto)) return `${rotulo} deve ser entre 1 e ${max}.`;
  const n = Number(texto);
  if (n < 1 || n > max) return `${rotulo} deve ser entre 1 e ${max}.`;
  return null;
}

export function CartoesTela({ cartoes }: { cartoes: CartaoLinha[] }) {
  const router = useRouter();
  const [rascunho, setRascunho] = useState<Rascunho | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [desativar, setDesativar] = useState<CartaoLinha | null>(null);
  const ativos = cartoes.filter((cartao) => cartao.ativo).sort((a, b) => a.apelido.localeCompare(b.apelido, "pt-BR"));
  const inativos = cartoes.filter((cartao) => !cartao.ativo).sort((a, b) => a.apelido.localeCompare(b.apelido, "pt-BR"));
  const fechamentoPreenchido = (rascunho?.fechamento.trim() ?? "") !== "";

  function abrirNovo() {
    setErro(null);
    setRascunho(vazio);
  }

  function abrirEdicao(cartao: CartaoLinha) {
    setErro(null);
    setRascunho({
      id: cartao.id,
      apelido: cartao.apelido,
      fechamento: cartao.diaFechamento == null ? "" : String(cartao.diaFechamento),
      vencimento: cartao.diaVencimento == null ? "" : String(cartao.diaVencimento),
      instituicao: cartao.instituicao ?? "",
      ultimos4: cartao.ultimos4 ?? "",
    });
  }

  async function salvar() {
    if (!rascunho) return;
    if (!rascunho.apelido.trim()) {
      setErro("Informe o apelido do cartão.");
      return;
    }
    const fech = diaInvalido(rascunho.fechamento, 28, "Dia de fechamento");
    if (fech) {
      setErro(fech);
      return;
    }
    const venc = diaInvalido(rascunho.vencimento, 31, "Dia de vencimento");
    if (venc) {
      setErro(venc);
      return;
    }
    const ultimos = rascunho.ultimos4.trim();
    if (ultimos && !/^\d{4}$/.test(ultimos)) {
      setErro("Últimos 4 dígitos: informe exatamente 4 números.");
      return;
    }
    const input = {
      apelido: rascunho.apelido,
      diaFechamento: rascunho.fechamento,
      diaVencimento: rascunho.vencimento,
      instituicao: rascunho.instituicao,
      ultimos4: rascunho.ultimos4,
    };
    const res = rascunho.id ? await atualizarCartaoAction(rascunho.id, input) : await criarCartaoAction(input);
    if (!res.ok) {
      setErro(res.error || ERRO_SALVAR);
      return;
    }
    setRascunho(null);
    setErro(null);
    router.refresh();
    focarLinha(`cartao:${res.id}`);
  }

  async function confirmarDesativar() {
    if (!desativar) return;
    const res = await inativarCartaoAction(desativar.id);
    if (!res.ok) {
      setErro(res.error || ERRO_SALVAR);
      return;
    }
    setDesativar(null);
    router.refresh();
  }

  return (
    <section>
      <h2>Cartões</h2>
      <p className="mo-ajustes__apoio">Use o dia de fechamento para definir em qual fatura cada compra entra.</p>
      {ativos.length === 0 ? <p>Nenhum cartão ativo.</p> : null}
      <ul className="mo-ajustes__lista">
        {ativos.map((cartao) => (
          <li key={cartao.id} className="mo-ajustes__linha">
            <div id={`cartao:${cartao.id}`} className="mo-ajustes__linha-texto" tabIndex={-1}>
              <strong>{cartao.apelido}</strong>
              <span>{textoLinhaCartao(cartao)}</span>
            </div>
            <Botao variante="texto" onPress={() => abrirEdicao(cartao)}>
              Editar
            </Botao>
            <Botao variante="texto" onPress={() => setDesativar(cartao)}>
              Desativar
            </Botao>
          </li>
        ))}
      </ul>
      <Botao variante="secundario" onPress={abrirNovo}>
        Adicionar cartão
      </Botao>
      {inativos.length > 0 ? (
        <section>
          <h3>Inativos</h3>
          <ul className="mo-ajustes__lista">
            {inativos.map((cartao) => (
              <li key={cartao.id}>
                <strong>{cartao.apelido}</strong>
                <span className="mo-ajustes__apoio"> não aparece em novos lançamentos</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <FormularioContainer
        aberto={rascunho !== null}
        titulo={rascunho?.id ? "Editar cartão" : "Adicionar cartão"}
        textoSalvar="Salvar"
        folhaNaEstreita
        onCancelar={() => {
          setRascunho(null);
          setErro(null);
        }}
        onSalvar={() => {
          void salvar();
        }}
      >
        {rascunho ? (
          <>
            <Campo
              id="apelido-cartao"
              rotulo="Apelido"
              valor={rascunho.apelido}
              onMudar={(valor) => setRascunho({ ...rascunho, apelido: valor })}
            />
            <Campo
              id="fechamento-cartao"
              rotulo="Dia de fechamento"
              teclado="numerico"
              valor={rascunho.fechamento}
              onMudar={(valor) => setRascunho({ ...rascunho, fechamento: valor })}
            />
            <Campo
              id="vencimento-cartao"
              rotulo="Dia de vencimento"
              teclado="numerico"
              valor={rascunho.vencimento}
              onMudar={(valor) => setRascunho({ ...rascunho, vencimento: valor })}
            />
            <Campo
              id="instituicao-cartao"
              rotulo="Instituição"
              valor={rascunho.instituicao}
              onMudar={(valor) => setRascunho({ ...rascunho, instituicao: valor })}
            />
            <Campo
              id="ultimos-cartao"
              rotulo="Últimos 4"
              teclado="numerico"
              valor={rascunho.ultimos4}
              onMudar={(valor) => setRascunho({ ...rascunho, ultimos4: valor })}
            />
            <p className="mo-ajustes__apoio">{fechamentoPreenchido ? AVISO_DIA : AVISO_SEM}</p>
            {fechamentoPreenchido ? <p className="mo-ajustes__apoio">{AVISO_NOVAS}</p> : null}
            {erro ? <p role="alert">{erro}</p> : null}
          </>
        ) : null}
      </FormularioContainer>
      <Dialogo
        aberto={desativar !== null}
        titulo={desativar ? `Desativar ${desativar.apelido}?` : "Desativar?"}
        descricao="O cartão sai dos pagamentos novos. Lançamentos antigos permanecem."
        textoConfirmar="Desativar"
        tipoConfirmar="destrutivo"
        onCancelar={() => setDesativar(null)}
        onConfirmar={() => {
          void confirmarDesativar();
        }}
      />
    </section>
  );
}
