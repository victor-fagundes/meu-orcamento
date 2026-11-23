import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { EntrarForm } from "@/components/entrar-form";
import { getAuth } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; sessao?: string }>;
}) {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/app/resumo");
  const params = await searchParams;
  return <EntrarForm sessaoExpirada={params.sessao === "expirada"} next={params.next ?? null} />;
}
