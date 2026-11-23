import { Skeleton } from "@meu-orcamento/design-system";

export default function AjustesLoading() {
  return (
    <div className="mo-ajustes__pagina">
      <Skeleton altura={24} largura="40%" forma="linha" />
      <Skeleton altura={120} forma="cartao" />
    </div>
  );
}
