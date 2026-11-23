import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { MARCA_SESSAO } from "@/lib/marca-sessao";

function gravarMarca(response: NextResponse) {
  response.cookies.set(MARCA_SESSAO, "1", {
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
    sameSite: "lax",
    httpOnly: false,
  });
  return response;
}

function apagarMarca(response: NextResponse) {
  response.cookies.set(MARCA_SESSAO, "", { path: "/", maxAge: 0 });
  return response;
}

export function middleware(request: NextRequest) {
  const session = getSessionCookie(request);
  const { pathname } = request.nextUrl;
  const marca = request.cookies.get(MARCA_SESSAO)?.value === "1";

  if (pathname.startsWith("/app") && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    if (marca) url.searchParams.set("sessao", "expirada");
    const response = NextResponse.redirect(url);
    return marca ? apagarMarca(response) : response;
  }

  if (pathname === "/app/ajustes") {
    const url = request.nextUrl.clone();
    url.pathname = "/app/ajustes/categorias";
    const response = NextResponse.redirect(url);
    return session && !marca ? gravarMarca(response) : response;
  }

  if (pathname.startsWith("/app") && session && !marca) return gravarMarca(NextResponse.next());
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/login", "/cadastro"],
};
