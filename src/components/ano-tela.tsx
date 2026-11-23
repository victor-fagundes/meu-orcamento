"use client";

import { useEffect, useState } from "react";
import { carregarAnoAction } from "@/app/actions/ano";
import type { GradeAno, LinhaGrade } from "@/domain/ano-grade";
import { Banner, Chips, EstadoErro, TabelaMeses } from "@meu-orcamento/design-system";

const CHAVE_OCULTAR = "mo-ocultar-valores";
const AVISO_SOBRA =
  'Sobra no ano = receitas − despesas. Não é o mesmo que "Disponível neste mês", que compara o planejado com o gasto do mês.';

type Modo = "realizado" | "planejado";

function paraTabela(linhas: LinhaGrade[]) {
  return linhas.map((linha) => ({
    id: linha.id,
    nivel: linha.nivel,
    rotulo: linha.rotulo,
    valoresPorMes: linha.valores,
  }));
}

export function AnoTela({ grade }: { grade: GradeAno }) {
  const [confirmado, setConfirmado] = useState(grade);
  const [modo, setModo] = useState<Modo>("realizado");
  const [erro, setErro] = useState(false);
  const [anoPedido, setAnoPedido] = useState<string | null>(null);
  const [pendente, setPendente] = useState(false);
  const [ocultado, setOcultado] = useState(false);

  useEffect(() => {
    setOcultado(window.localStorage.getItem(CHAVE_OCULTAR) === "1");
  }, []);

  const linhas = modo === "realizado" ? confirmado.realizado : confirmado.planejado;
  const titulo = confirmado.vazio
    ? `Ano · ${confirmado.ano}`
    : modo === "realizado"
      ? "Ano · realizado"
      : "Ano · planejado";
  const legenda = `${modo === "realizado" ? "Realizado" : "Planejado"} de ${confirmado.ano}`;
  const aviso = confirmado.vazio
    ? `Nenhum planejamento nem lançamento em ${confirmado.ano}.`
    : AVISO_SOBRA;

  async function pedir(ano: string) {
    if (pendente) return;
    setPendente(true);
    setErro(false);
    setAnoPedido(ano);
    const resposta = await carregarAnoAction(ano);
    setPendente(false);
    if (!resposta.ok) {
      setErro(true);
      return;
    }
    setConfirmado(resposta.grade);
    setErro(false);
    window.history.replaceState(null, "", `/app/ano?ano=${resposta.grade.ano}`);
  }

  const anoNumero = Number(confirmado.ano);

  return (
    <div className="mo-ano">
      <div className="mo-ano__topo">
        <h2 className="mo-ano__titulo">{titulo}</h2>
        <div className="mo-ano__ano">
          <button type="button" className="mo-cabecalho__seta" aria-label="Ano anterior" onClick={() => void pedir(String(anoNumero - 1))}>
            ‹
          </button>
          <span>{confirmado.ano}</span>
          <button type="button" className="mo-cabecalho__seta" aria-label="Próximo ano" onClick={() => void pedir(String(anoNumero + 1))}>
            ›
          </button>
        </div>
      </div>
      <Chips
        rotuloGrupo="Modo do ano"
        opcoes={[
          { valor: "realizado", rotulo: "Realizado" },
          { valor: "planejado", rotulo: "Planejado" },
        ]}
        selecionado={modo}
        onSelecionar={setModo}
      />
      <p className="mo-ano__dica">Valores em R$. Nível: tipo › grupo › item. Lançamentos ficam em Lançamentos.</p>
      <Banner tipo="info">{aviso}</Banner>
      {erro ? (
        <EstadoErro
          mensagem="Não foi possível carregar o ano."
          onTentarNovamente={() => {
            if (anoPedido) void pedir(anoPedido);
          }}
        />
      ) : null}
      <TabelaMeses
        legenda={legenda}
        linhas={paraTabela(linhas)}
        mesAtivo={confirmado.mesAtual}
        ocultado={ocultado}
      />
    </div>
  );
}
