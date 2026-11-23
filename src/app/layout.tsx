import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@meu-orcamento/design-system";
import { MaterialRegistry } from "@/components/material/register";
import "@meu-orcamento/design-system/tokens.css";
import "@meu-orcamento/design-system/web.css";
import "./globals.css";

const manrope = localFont({
  src: "../../packages/design-system/fonts/Manrope-VariableFont_wght.ttf",
  weight: "200 800",
  display: "swap",
  variable: "--font-manrope",
});

const scriptTema = `(function(){try{var t=localStorage.getItem("mo-tema");var escuro=window.matchMedia("(prefers-color-scheme: dark)").matches;var tema=(t==="dark"||(t!=="light"&&escuro))?"dark":"light";document.documentElement.setAttribute("data-theme",tema);}catch(e){}})();`;

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
      <body className="antialiased">
        <MaterialRegistry>
          <ThemeProvider>{<>{children}</>}</ThemeProvider>
        </MaterialRegistry>
      </body>
    </html>
  );
}
