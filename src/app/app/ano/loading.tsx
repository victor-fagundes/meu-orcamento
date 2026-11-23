import { Skeleton } from "@meu-orcamento/design-system";

export default function AnoLoading() {
  return (
    <div className="mo-ano">
      <Skeleton altura={24} largura="40%" forma="linha" />
      <Skeleton altura={160} forma="cartao" />
    </div>
  );
}
