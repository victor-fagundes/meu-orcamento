import { expect, test, type Page } from "@playwright/test";

test.describe.configure({ mode: "serial", timeout: 120_000 });

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

async function entrar(page: Page) {
  await page.goto("/login");
  await page.locator('input[name="email"]').fill("demo@local.test");
  await page.locator('input[name="password"]').fill("demo1234");
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL("**/app/**");
}

test("doze meses em realizado, sem seta de mês", async ({ page }) => {
  await entrar(page);
  await page.goto("/app/ano");
  await expect(page.getByRole("heading", { level: 1, name: "Ano" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Mês anterior" })).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 2, name: "Ano · realizado" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ano anterior" })).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Próximo ano" })).toHaveCount(1);
  await expect(
    page.getByText("Valores em R$. Nível: tipo › grupo › item. Lançamentos ficam em Lançamentos."),
  ).toBeVisible();
  const tabela = page.getByRole("table", { name: /Realizado de/ });
  await expect(tabela).toBeVisible();
  for (const header of ["Categoria · item", "Jan", "Dez", "Total"]) {
    await expect(tabela.getByRole("columnheader", { name: header, exact: header !== "Jan" && header !== "Dez" ? true : false })).toBeVisible();
  }
  const mes = MESES[new Date().getMonth()] ?? "Jan";
  await expect(tabela.getByRole("columnheader", { name: new RegExp(`${mes}.*mês atual`) })).toBeVisible();
  await expect(tabela.getByRole("button")).toHaveCount(0);
});

test("planejado troca o título e mantém o ano", async ({ page }) => {
  await entrar(page);
  await page.goto("/app/ano");
  const ano = page.locator(".mo-ano__ano");
  const antes = await ano.textContent();
  await page.getByRole("button", { name: "Planejado", exact: true }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Ano · planejado" })).toBeVisible();
  await expect(page.getByRole("table", { name: /Planejado de/ })).toBeVisible();
  await expect(ano).toHaveText(antes ?? "");
  await expect(page.getByRole("row", { name: /Sobra no ano \(receitas − despesas\)/ })).toBeVisible();
  await expect(page.getByText("Saldo final")).toHaveCount(0);
  await expect(page.getByText("Total despesas")).toHaveCount(0);
});

test("próximo ano só troca depois da resposta", async ({ page }) => {
  await entrar(page);
  await page.goto("/app/ano");
  const ano = page.locator(".mo-ano__ano");
  const antes = (await ano.textContent()) ?? "";
  await page.getByRole("button", { name: "Próximo ano" }).click();
  await expect(ano).not.toHaveText(antes);
  await expect(page.getByText("Não foi possível carregar o ano.")).toHaveCount(0);
});

test("em 390 px a grade alcança dezembro e não há botão flutuante", async ({ page }) => {
  await entrar(page);
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/app/ano");
  const dez = page.getByRole("columnheader", { name: "Dez", exact: true });
  await dez.scrollIntoViewIfNeeded();
  await expect(dez).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Total", exact: true })).toBeVisible();
  await expect(page.locator(".mo-fab, .fab")).toHaveCount(0);
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator(".mo-fab, .fab")).toHaveCount(0);
  await expect(page.getByRole("table").getByRole("button")).toHaveCount(0);
});

test("captura claro e escuro", async ({ page }) => {
  await entrar(page);
  await page.goto("/app/ano");
  await page.emulateMedia({ colorScheme: "light" });
  await page.screenshot({ path: "tests/visual/out/ano-claro.png", fullPage: true });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.screenshot({ path: "tests/visual/out/ano-escuro.png", fullPage: true });
});
