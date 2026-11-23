import { Suspense } from "react";
import { CascaApp } from "@/components/casca-app";
import { SessionTelemetry } from "@/components/session-telemetry";
import { requireSessionOrcamento } from "@/lib/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireSessionOrcamento();

  return (
    <>
      <SessionTelemetry />
      <Suspense fallback={children}>
        <CascaApp>{children}</CascaApp>
      </Suspense>
    </>
  );
}
