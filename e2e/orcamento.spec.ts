import { expect, test, type Page } from "@playwright/test";

test.describe.configure({ mode: "serial", timeout: 120_000 });

async function entrar(page: Page) {
  await page.goto("/login");
  await page.locator('input[name="email"]').fill("demo@local.test");
  await page.locator('input[name="password"]').fill("demo1234");
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL("**/app/**");
}

function conteudo(page: Page) {
  return page.locator("main#conteudo");
}

test("Fixas marcada, categorias fechadas e sem setas na página", async ({ page }) => {
  await entrar(page);
  await page.goto("/app/orcamento");
  const grupo = page.getByRole("group", { name: "Tipo" });
  await expect(grupo.getByRole("button")).toHaveText(["Receitas", "Fixas", "Variáveis", "Anuais"]);
  await expect(grupo.getByRole("button", { name: "Fixas" })).toHaveAttribute("aria-pressed", "true");
  const cabecalhos = conteudo(page).locator(".mo-grupo__cabecalho");
  await expect(cabecalhos.first()).toBeVisible();
  const quantidade = await cabecalhos.count();
  for (let i = 0; i < quantidade; i += 1) {
    await expect(cabecalhos.nth(i)).toHaveAttribute("aria-expanded", "false");
  }
  await expect(conteudo(page).getByRole("button", { name: "Mês anterior" })).toHaveCount(0);
  await expect(conteudo(page).getByRole("button", { name: "Próximo mês" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Mês anterior" })).toHaveCount(1);
});

test("criar categoria e item no tipo, cancelar não grava", async ({ page }) => {
  await entrar(page);
  await page.goto("/app/orcamento");
  await page.getByRole("group", { name: "Tipo" }).getByRole("button", { name: "Variáveis" }).click();
  await expect(page).toHaveURL(/tipo=V/);
  const nova = conteudo(page).getByRole("button", { name: "Nova categoria" });
  const novo = conteudo(page).getByRole("button", { name: "Novo item" });
  await expect(nova).toBeVisible();
  expect(await nova.evaluate((el) => getComputedStyle(el).position)).not.toBe("fixed");
  expect(await novo.evaluate((el) => getComputedStyle(el).position)).not.toBe("fixed");

  await nova.click();
  const cancelar = page.getByRole("dialog", { name: "Nova categoria" });
  await cancelar.getByLabel("Nome").fill("  NaoSalvarCategoria  ");
  await cancelar.getByRole("button", { name: "Cancelar" }).click();
  await expect(conteudo(page).getByText("NaoSalvarCategoria")).toHaveCount(0);

  const streaming = conteudo(page)
    .locator(".mo-grupo")
    .filter({ has: page.locator(".mo-grupo__nome", { hasText: /^Streaming$/ }) })
    .locator(".mo-grupo__cabecalho");
  if ((await streaming.count()) === 0) {
    await nova.click();
    const dialog = page.getByRole("dialog", { name: "Nova categoria" });
    await dialog.getByLabel("Nome").fill("  Streaming  ");
    await dialog.getByRole("button", { name: "Salvar" }).click();
    await expect(dialog).toBeHidden();
  }
  await expect(streaming).toHaveAttribute("aria-expanded", "false");

  const lazer = conteudo(page).getByRole("button", { name: /Lazer/ });
  await lazer.click();
  await expect(lazer).toHaveAttribute("aria-expanded", "true");
  await streaming.click();
  await expect(streaming).toHaveAttribute("aria-expanded", "true");

  const netflix = conteudo(page).getByRole("button", { name: /^Netflix/ });
  if ((await netflix.count()) === 0) {
    await novo.click();
    const dialog = page.getByRole("dialog", { name: "Novo item" });
    await dialog.getByLabel("Nome").fill("  Netflix  ");
    await dialog.getByLabel("Categoria").fill("Streaming");
    await dialog.getByRole("button", { name: "Salvar" }).click();
    await expect(dialog).toBeHidden();
  }
  await expect(netflix.first()).toBeVisible();
  await expect(lazer).toHaveAttribute("aria-expanded", "true");
  await expect(conteudo(page).getByRole("button", { name: "Renomear" })).toHaveCount(0);
  await expect(conteudo(page).getByRole("button", { name: "Arquivar categoria" })).toHaveCount(0);
});

test("arquivar pede o nome e Esc devolve o item", async ({ page }) => {
  await entrar(page);
  await page.goto("/app/orcamento?tipo=F&aberta=Moradia");
  const arquivar = conteudo(page).getByRole("button", { name: "Arquivar Aluguel" });
  await arquivar.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Arquivar Aluguel?" })).toBeVisible();
  await expect(dialog).toContainText("Ele sai do Orçamento e de novos lançamentos. Os lançamentos antigos continuam.");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(conteudo(page).getByRole("button", { name: /^Aluguel/ })).toBeVisible();
  await expect(arquivar).toBeFocused();
});

test("Gerenciar abre as categorias ativas de Fixas", async ({ page }) => {
  await entrar(page);
  await page.goto("/app/orcamento?tipo=F");
  await conteudo(page).getByRole("link", { name: "Gerenciar" }).click();
  await expect(page).toHaveURL(/\/app\/ajustes\/categorias\?tipo=F/);
  await expect(page.getByRole("heading", { name: "Despesas fixas" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Receitas" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Despesas variáveis" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Anuais", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Renomear" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Arquivar categoria" })).toHaveCount(0);
});

test("teclado alcança a tela, sem intervalo e sem flutuante, no escuro", async ({ page }) => {
  await entrar(page);
  await page.goto("/app/orcamento");
  const grupo = page.getByRole("group", { name: "Tipo" });
  await grupo.getByRole("button", { name: "Receitas" }).focus();
  await page.keyboard.press("Tab");
  await expect(grupo.getByRole("button", { name: "Fixas" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(grupo.getByRole("button", { name: "Variáveis" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(grupo.getByRole("button", { name: "Anuais" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Gerenciar" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Nova categoria" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Novo item" })).toBeFocused();
  await expect(page.locator('input[type="date"]')).toHaveCount(0);
  await expect(page.locator(".mo-fab")).toHaveCount(0);

  await page.emulateMedia({ colorScheme: "dark" });
  await page.reload();
  await expect(grupo.getByRole("button", { name: "Fixas" })).toBeVisible();
  await grupo.getByRole("button", { name: "Fixas" }).focus();
  await expect(grupo.getByRole("button", { name: "Fixas" })).toBeFocused();

  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await expect(page.locator('input[type="date"]')).toHaveCount(0);
    await expect(page.locator(".mo-fab")).toHaveCount(0);
    await page.screenshot({ path: `tests/visual/out/orcamento-${width}.png`, fullPage: true });
  }
});
