"use client";

import { useState } from "react";
import { Botao, Campo } from "@meu-orcamento/design-system";
import { excluirContaAction } from "@/app/actions/conta";
import { confirmarFraseExclusao } from "@/domain/exclusao-conta";
import { limparMarcaSessao } from "@/lib/marca-sessao";

export function ExcluirTela() {
  const [passo, setPasso] = useState<1 | 2>(1);
  const [frase, setFrase] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, setPendente] = useState(false);
  const confirmacao = confirmarFraseExclusao(frase);
  const fraseDiferente = !confirmacao.ok && confirmacao.motivo === "diferente";

  async function excluir() {
    if (!confirmacao.ok) return;
    setPendente(true);
    const res = await excluirContaAction(frase);
    setPendente(false);
    if (!res.ok) {
      setErro("Não foi possível excluir a conta.");
      return;
    }
    limparMarcaSessao();
    window.location.assign("/login");
  }

  if (passo === 1) {
    return (
      <section>
        <h2>Excluir conta</h2>
        <p>Excluir a conta remove o orçamento, lançamentos, cartões e limites. Não há como desfazer.</p>
        <Botao variante="destrutivo" onPress={() => setPasso(2)}>
          Excluir conta
        </Botao>
      </section>
    );
  }

  return (
    <section>
      <h2>Excluir conta</h2>
      <p>Digite a frase para liberar a exclusão definitiva.</p>
      <Campo
        id="frase-excluir"
        rotulo="Digite EXCLUIR para confirmar"
        valor={frase}
        onMudar={setFrase}
        erro={fraseDiferente ? "Frase diferente não apaga. Digite EXCLUIR para confirmar." : undefined}
      />
      {erro ? <p role="alert">{erro}</p> : null}
      <Botao
        variante="texto"
        onPress={() => {
          setPasso(1);
          setFrase("");
          setErro(null);
        }}
      >
        Cancelar
      </Botao>
      <Botao variante="destrutivo" disabled={!confirmacao.ok || pendente} onPress={() => void excluir()}>
        Excluir definitivamente
      </Botao>
    </section>
  );
}
