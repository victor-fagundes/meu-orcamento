import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { MaterialRegistry } from "@/components/material/register";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

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
    <html lang="pt-BR">
      <body className={`${roboto.variable} antialiased`}>
        <MaterialRegistry>{children}</MaterialRegistry>
      </body>
    </html>
  );
}
