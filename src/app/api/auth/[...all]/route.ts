import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export async function GET(request: Request) {
  try {
    const auth = await getAuth();
    return toNextJsHandler(auth).GET(request);
  } catch (e) {
    console.error("[auth GET]", e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuth();
    return toNextJsHandler(auth).POST(request);
  } catch (e) {
    console.error("[auth POST]", e);
    return new Response(JSON.stringify({ error: String(e), stack: (e as Error).stack }), {
      status: 500,
    });
  }
}
