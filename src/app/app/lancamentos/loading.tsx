import { Skeleton } from "@meu-orcamento/design-system";

export default function LancamentosLoading() {
  return (
    <main id="conteudo">
      <Skeleton altura={40} largura="40%" forma="linha" />
      <Skeleton altura={48} forma="linha" />
      <Skeleton altura={48} forma="linha" />
      <Skeleton altura={72} forma="cartao" />
    </main>
  );
}
