import { Suspense } from "react";
import { AjustesMoldura } from "@/components/ajustes-moldura";

export default function AjustesLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AjustesMoldura>{children}</AjustesMoldura>
    </Suspense>
  );
}
