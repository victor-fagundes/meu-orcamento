import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@meu-orcamento/design-system";
import "@meu-orcamento/design-system/tokens.css";
import "@meu-orcamento/design-system/web.css";
import "./globals.css";

const manrope = localFont({
  src: "../../packages/design-system/fonts/Manrope-VariableFont_wght.ttf",
  weight: "200 800",
  display: "swap",
  variable: "--font-manrope",
});

const scriptTema = `(function(){var tema="light";try{var t=localStorage.getItem("mo-tema");var escuro=window.matchMedia("(prefers-color-scheme: dark)").matches;if(t==="dark"||(t==="system"&&escuro))tema="dark";}catch(e){}document.documentElement.setAttribute("data-theme",tema);})();`;

export const metadata: Metadata = {
  title: "Meu Orçamento",
  description: "Planejamento e controle orçamentário pessoal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={manrope.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body>
        <ThemeProvider>{<>{children}</>}</ThemeProvider>
      </body>
    </html>
  );
}
