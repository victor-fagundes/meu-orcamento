import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { createElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { test } from "@playwright/test";
import { Avatar } from "../../packages/design-system/src/web/avatar.tsx";
import { BotaoIcone } from "../../packages/design-system/src/web/botao-icone.tsx";
import { CampoBusca } from "../../packages/design-system/src/web/campo-busca.tsx";
import { CampoData } from "../../packages/design-system/src/web/campo-data.tsx";
import { MenuAcoes } from "../../packages/design-system/src/web/menu-acoes.tsx";
import { ShellApp } from "../../packages/design-system/src/web/shell-app.tsx";
import { Switch } from "../../packages/design-system/src/web/switch.tsx";
import { Tabela } from "../../packages/design-system/src/web/tabela.tsx";

const raiz = path.resolve("tests/visual/out");
const css = [
  readFileSync("packages/design-system/src/core/tokens.css", "utf8"),
  readFileSync("packages/design-system/src/web/base.css", "utf8"),
].join("\n");

const noop = () => undefined;

const pecas: ReadonlyArray<readonly [string, ReactElement]> = [
  [
    "shell-app",
    createElement(
      ShellApp,
      {
        abas: [
          { id: "resumo", rotulo: "Resumo", icone: "dashboard" },
          { id: "ajustes", rotulo: "Ajustes", icone: "settings" },
        ],
        ativa: "ajustes",
        onNavegar: noop,
        cabecalho: "Novembro",
        children: "Conteúdo do mês",
      },
    ),
  ],
  [
    "tabela",
    createElement(Tabela, {
      caption: "Gastos",
      colunas: [
        { id: "nome", rotulo: "Nome", tipo: "texto" },
        { id: "valor", rotulo: "Valor", tipo: "numero" },
      ],
      linhas: [{ id: "1", celulas: { nome: "Café", valor: "R$ 10,00" } }],
      selecionadaId: "1",
    }),
  ],
  [
    "campo-busca",
    createElement(CampoBusca, {
      id: "q",
      rotulo: "Busca",
      valor: "café",
      onMudar: noop,
      controlesId: "lista",
    }),
  ],
  [
    "campo-data",
    createElement(CampoData, {
      id: "vencimento",
      rotulo: "Vencimento",
      valor: "2026-11-22",
      onMudar: noop,
    }),
  ],
  [
    "switch",
    createElement(Switch, {
      id: "alertas",
      rotulo: "Alertas",
      marcado: true,
      onMudar: noop,
    }),
  ],
  [
    "menu-acoes",
    createElement(MenuAcoes, {
      rotulo: "Ações",
      acoes: [{ id: "editar", rotulo: "Editar", onEscolher: noop }],
    }),
  ],
  ["botao-icone", createElement(BotaoIcone, { nome: "edit", rotulo: "Editar", onPress: noop })],
  ["avatar", createElement(Avatar, { iniciais: "MO", nome: "Maria", comNome: true })],
];

test("grava cada componente novo em claro e escuro, a 390 e a 1280", async ({ page }) => {
  mkdirSync(raiz, { recursive: true });
  for (const tema of ["light", "dark"] as const) {
    for (const largura of [390, 1280] as const) {
      await page.setViewportSize({ width: largura, height: 800 });
      for (const [nome, elemento] of pecas) {
        const corpo = renderToStaticMarkup(elemento);
        await page.setContent(
          `<!doctype html><html lang="pt-BR" data-theme="${tema}"><head><style>${css}</style></head><body>${corpo}</body></html>`,
        );
        await page.screenshot({
          path: path.join(raiz, `${nome}-${tema}-${largura}.png`),
        });
      }
    }
  }
});
