"use client";

import { useState } from "react";
import { Botao } from "@meu-orcamento/design-system";
import { carregarExemploAction } from "@/app/actions/catalog";

export function ExemploTela() {
  const [armado, setArmado] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [pendente, setPendente] = useState(false);

  async function tocar() {
    if (!armado) {
      setArmado(true);
      setMensagem(null);
      return;
    }
    setPendente(true);
    const res = await carregarExemploAction();
    setPendente(false);
    setArmado(false);
    if (!res.ok) {
      setMensagem("Não foi possível aplicar o exemplo.");
      return;
    }
    setMensagem(
      `Exemplo aplicado: ${res.updated} itens tiveram o plano preenchido. Nenhum lançamento foi criado.`,
    );
  }

  return (
    <section>
      <h2>Dados de exemplo</h2>
      <p>Preenche o planejamento de alguns itens com valores ilustrativos. Não cria lançamentos e só roda se você confirmar.</p>
      {armado ? (
        <>
          <p>Confirmar exemplo?</p>
          <p>Toque de novo para confirmar. Seus planos atuais serão substituídos nos itens do exemplo.</p>
        </>
      ) : null}
      <Botao variante="secundario" disabled={pendente} onPress={() => void tocar()}>
        {armado ? "Confirmar exemplo" : "Carregar exemplo"}
      </Botao>
      {mensagem ? <p role="status">{mensagem}</p> : null}
    </section>
  );
}
