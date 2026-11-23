"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Botao, Chips } from "@meu-orcamento/design-system";
import { useTema } from "@meu-orcamento/design-system";
import { DialogoSair } from "@/components/dialogo-sair";
import { iniciaisDaConta } from "@/domain/iniciais";

export function ContaTela({ nome, email }: { nome: string; email: string }) {
  const router = useRouter();
  const { modo, definirModo } = useTema();
  const [sair, setSair] = useState(false);

  return (
    <section>
      <h2>Conta</h2>
      <Avatar iniciais={iniciaisDaConta(nome)} nome={nome} comNome />
      <p className="mo-ajustes__apoio">{email}</p>
      <p>
        <a href="/esqueci-senha">Esqueci a senha</a>
      </p>
      <p className="mo-ajustes__apoio">Dados da sua conta neste aparelho.</p>
      <p>Esta conta está ativa neste navegador.</p>
      <Chips
        rotuloGrupo="Tema"
        selecionado={modo}
        onSelecionar={definirModo}
        opcoes={[
          { valor: "light", rotulo: "Claro" },
          { valor: "dark", rotulo: "Escuro" },
          { valor: "system", rotulo: "Sistema" },
        ]}
      />
      <Botao variante="texto" onPress={() => setSair(true)}>
        Sair da conta
      </Botao>
      <p>Excluir a conta remove o orçamento, lançamentos, cartões e limites. Não há como desfazer.</p>
      <Botao variante="destrutivo" onPress={() => router.push("/app/ajustes/excluir")}>
        Excluir conta
      </Botao>
      <DialogoSair aberto={sair} onCancelar={() => setSair(false)} />
    </section>
  );
}
