import { Skeleton } from "@meu-orcamento/design-system";

export default function OrcamentoLoading() {
  return (
    <main id="conteudo">
      <Skeleton altura={40} largura="60%" forma="linha" />
      <Skeleton altura={96} forma="cartao" />
      <Skeleton altura={72} forma="cartao" />
    </main>
  );
}
