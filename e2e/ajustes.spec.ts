import { expect, test, type Page } from "@playwright/test";

test.describe.configure({ mode: "serial", timeout: 90_000 });

const MENU = [
  "Categorias e itens",
  "Conta",
  "Cartões",
  "Limites de alerta",
  "Itens arquivados",
  "Exportar",
  "Dados de exemplo",
  "Excluir conta",
  "Sair da conta",
];

async function abrir(page: Page, endereco: string) {
  try {
    await page.goto(endereco, { waitUntil: "load" });
  } catch (erro) {
    if (!(erro instanceof Error) || !erro.message.includes("ERR_ABORTED")) throw erro;
    await page.waitForURL(/\/app\/ajustes/);
    await page.waitForLoadState("load");
  }
}

async function entrar(page: Page) {
  await page.goto("/login");
  await page.locator('input[name="email"]').fill("demo@local.test");
  await page.locator('input[name="password"]').fill("demo1234");
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL("**/app/resumo**");
}

test("menu, aba e saída só no diálogo", async ({ page }) => {
  await entrar(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await abrir(page, "/app/ajustes");
  await expect(page.getByRole("heading", { name: "Categorias e itens" })).toBeVisible();
  const menu = page.getByRole("navigation", { name: "Ajustes" });
  await expect(menu.getByRole("button")).toHaveText(MENU.map((nome) => new RegExp(`^${nome}`)));
  await expect(page.getByText("Importar planilha")).toHaveCount(0);
  await expect(page.getByText("Importar fatura")).toHaveCount(0);
  await expect(page.getByText("Simulador de competência")).toHaveCount(0);
  const principal = page.getByRole("navigation", { name: "Principal" });
  await expect(principal.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(principal.getByRole("button", { name: "Ajustes" })).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".mo-shell__cabecalho").getByRole("button", { name: "Sair", exact: true })).toHaveCount(0);
  await expect(menu.getByRole("button", { name: "Conta", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Categorias e itens" })).toBeVisible();
  await expect(page.locator(".mo-fab")).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 800 });
  await abrir(page, "/app/ajustes");
  await expect(page.getByRole("heading", { name: "Categorias e itens" })).toBeVisible();
  await page.getByRole("button", { name: "Voltar" }).click();
  await expect(page.getByRole("heading", { name: "Categorias e itens" })).toBeHidden();
  await menu.getByRole("button", { name: "Conta", exact: true }).click();
  await expect(page).toHaveURL(/\/app\/ajustes\/conta/, { timeout: 20_000 });
  await expect(page.getByRole("heading", { name: "Conta" })).toBeVisible();
  await page.getByRole("button", { name: "Voltar" }).click();
  await expect(page.getByRole("heading", { name: "Conta" })).toBeHidden();
  await expect(menu.getByRole("button", { name: "Categorias e itens" })).toBeVisible();
});

test("vencimento 32 não grava e o formulário continua aberto", async ({ page }) => {
  await entrar(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await abrir(page, "/app/ajustes/cartoes");
  await page.getByRole("button", { name: "Adicionar cartão" }).click();
  const dialogo = page.getByRole("dialog", { name: "Adicionar cartão" });
  await dialogo.getByLabel("Apelido").fill("Teste");
  await dialogo.getByLabel("Dia de vencimento").fill("32");
  await dialogo.getByRole("button", { name: "Salvar" }).click();
  await expect(dialogo.getByText("Dia de vencimento deve ser entre 1 e 31.")).toBeVisible();
  await expect(dialogo).toBeVisible();
});

test("teclado abre e cancela sair da conta", async ({ page }) => {
  await entrar(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await abrir(page, "/app/ajustes/categorias");
  const sair = page.getByRole("navigation", { name: "Ajustes" }).getByRole("button", { name: "Sair da conta" });
  await sair.focus();
  await page.keyboard.press("Enter");
  const dialogo = page.getByRole("dialog", { name: "Sair da conta" });
  await expect(dialogo).toBeVisible();
  await expect(dialogo.locator(":focus")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(dialogo).toBeHidden();
  await expect(sair).toBeFocused();
});
