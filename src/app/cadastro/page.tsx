import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CriarContaForm } from "@/components/criar-conta-form";
import { getAuth } from "@/lib/auth";

export default async function CadastroPage() {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/app/resumo");
  return <CriarContaForm />;
}
