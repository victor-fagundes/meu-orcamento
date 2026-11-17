import { eq } from "drizzle-orm";
import { user } from "@/db/schema";
import { isApiError, requireApiSession } from "@/lib/api-session";
import { jsonError, jsonOk } from "@/lib/api-v1";
import { getAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;

  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: request.headers });
  return jsonOk({
    email: session?.user?.email ?? null,
    resetPasswordUrl: `${process.env.BETTER_AUTH_URL ?? ""}/esqueci-senha`,
  });
}

/** Delete account — confirmPhrase must be EXCLUIR (parity with web). */
export async function DELETE(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;

  let body: { confirmPhrase?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "JSON inválido");
  }
  if ((body.confirmPhrase ?? "").trim().toUpperCase() !== "EXCLUIR") {
    return jsonError(400, "Digite EXCLUIR para confirmar.");
  }

  await ctx.db.delete(user).where(eq(user.id, ctx.userId));
  try {
    const auth = await getAuth();
    await auth.api.signOut({ headers: request.headers });
  } catch {
    /* session already invalid */
  }
  return jsonOk({ ok: true });
}
