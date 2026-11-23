import { Skeleton } from "@meu-orcamento/design-system";

export default function ResumoLoading() {
  return (
    <main id="conteudo" className="mo-resumo">
      <Skeleton altura={24} largura="40%" forma="linha" />
      <Skeleton altura={96} forma="cartao" />
      <Skeleton altura={72} forma="cartao" />
      <Skeleton altura={72} forma="cartao" />
    </main>
  );
}
