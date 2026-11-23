import { expect, test, type Page } from "@playwright/test";

test.describe.configure({ mode: "serial", timeout: 90_000 });

async function entrar(page: Page) {
  await page.goto("/login");
  await page.locator('input[name="email"]').fill("demo@local.test");
  await page.locator('input[name="password"]').fill("demo1234");
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL("**/app/resumo**");
  const saldo = page.getByRole("region", { name: "Disponível neste mês" });
  if (await saldo.count()) return;
  await page.goto("/app/ajustes");
  await page.getByRole("button", { name: /Dados de exemplo/ }).click();
  await page.getByRole("button", { name: "Carregar exemplo" }).click();
  await page.getByRole("button", { name: "Confirmar exemplo?" }).click();
  await expect(page.getByText(/itens atualizados/)).toBeVisible();
  await page.goto("/app/resumo");
  await expect(saldo).toBeVisible();
}

test("um bloco de disponível", async ({ page }) => {
  await entrar(page);
  await expect(page.getByRole("region", { name: "Disponível neste mês" })).toHaveCount(1);
  await expect(page.getByText("Ainda pode gastar")).toHaveCount(0);
});

test("quatro cartões e Fixas abre o orçamento do mês", async ({ page }) => {
  await entrar(page);
  await expect(page.locator(".mo-total__rotulo")).toHaveText(["Receitas", "Fixas", "Variáveis", "Anuais"]);
  await page.getByRole("button", { name: /Fixas/ }).filter({ hasText: "planejados" }).click();
  await expect(page).toHaveURL(/\/app\/orcamento\?mes=\d{4}-\d{2}&tipo=F/);
});

test("pagamento diferente de Todas mostra traço e limpar volta às Todas", async ({ page }) => {
  await entrar(page);
  await page.getByRole("button", { name: "PIX", exact: true }).click();
  await expect(page).toHaveURL(/pagamento=pix/);
  const saldo = page.getByRole("region", { name: "Disponível neste mês" });
  await expect(saldo).toContainText("—");
  await expect(page.locator(".mo-total__apoio").first()).toHaveText("—");
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(page).toHaveURL(/\/app\/resumo\?mes=\d{4}-\d{2}$/);
  await expect(page.getByRole("group", { name: "Tipo" }).getByRole("button", { name: "Todas", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("group", { name: "Pagamento" }).getByRole("button", { name: "Todas", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByLabel("Categoria")).toHaveValue("todas");
});

test("ocultar valores mascara e sobrevive ao recarregar", async ({ page }) => {
  await entrar(page);
  await page.getByRole("button", { name: "Ocultar valores" }).click();
  const mostrar = page.getByRole("button", { name: "Mostrar valores" });
  await expect(mostrar).toHaveAttribute("aria-pressed", "true");
  const saldo = page.getByRole("region", { name: "Disponível neste mês" });
  await expect(saldo).toContainText("R$ •••••");
  await expect(saldo).toContainText("do planejado");
  await expect(page.locator(".mo-total__valor")).toHaveText(["R$ •••••", "R$ •••••", "R$ •••••", "R$ •••••"]);
  await page.reload();
  await expect(page.getByRole("button", { name: "Mostrar valores" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Disponível neste mês" })).toContainText("R$ •••••");
  await page.getByRole("button", { name: "Mostrar valores" }).click();
  await expect(page.getByRole("region", { name: "Disponível neste mês" })).not.toContainText("R$ •••••");
  await expect(page.getByRole("region", { name: "Disponível neste mês" })).toContainText("do planejado");
});

test("semana, média e foco ao fechar o detalhe", async ({ page }) => {
  await entrar(page);
  await expect(page.getByText("Semana 1").first()).toBeVisible();
  await expect(page.getByText(/Média diária/)).toBeVisible();
  const ver = page.getByRole("button", { name: "Ver detalhes da semana 1" });
  await ver.click();
  const dialogo = page.getByRole("dialog");
  await expect(dialogo).toBeVisible();
  await page.getByRole("button", { name: "Fechar" }).click();
  await expect(dialogo).toHaveCount(0);
  await expect(ver).toBeFocused();
});

test("sininho sem faixa e alerta do mês sem forçar tipo", async ({ page }) => {
  await entrar(page);
  await expect(page.locator(".alert-banner")).toHaveCount(0);
  await page.getByRole("button", { name: /^Alertas/ }).click();
  const dialogo = page.getByRole("dialog");
  const vazio = dialogo.getByText("Nenhum alerta neste mês.");
  if (await vazio.count()) {
    await expect(page.getByRole("button", { name: "Alertas", exact: true })).toBeVisible();
  } else {
    const href = await dialogo.getByRole("link").first().getAttribute("href");
    expect(href).toMatch(/\/app\/orcamento\?mes=\d{4}-\d{2}$/);
    await dialogo.getByRole("link").first().click();
    await expect(page).toHaveURL(/\/app\/orcamento\?mes=\d{4}-\d{2}$/);
  }
});

test("mês no cabeçalho, teclado e sem intervalo nem flutuante", async ({ page }) => {
  await entrar(page);
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 800 });
    await expect(page.getByRole("button", { name: "Mês anterior" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Próximo mês" })).toBeVisible();
    await expect(page.locator("main#conteudo").getByRole("button", { name: "Mês anterior" })).toHaveCount(0);
    await expect(page.locator('input[type="date"]')).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Novo lançamento" })).toHaveCount(0);
    await expect(page.locator(".fab")).toHaveCount(0);

    const alvos = [
      page.getByRole("button", { name: /Receitas/ }).filter({ hasText: "planejados" }),
      page.getByRole("button", { name: /Fixas/ }).filter({ hasText: "planejados" }),
      page.getByRole("button", { name: /Variáveis/ }).filter({ hasText: "planejados" }),
      page.getByRole("button", { name: /Anuais/ }).filter({ hasText: "planejados" }),
      page.getByRole("group", { name: "Tipo" }).getByRole("button", { name: "Receitas", exact: true }),
      page.getByRole("button", { name: "Limpar filtros" }),
      page.getByRole("button", { name: "Ocultar valores" }),
      page.getByRole("button", { name: /^Alertas/ }),
      page.getByRole("button", { name: "Ver detalhes da semana 1" }),
    ];
    for (const alvo of alvos) {
      await alvo.focus();
      await expect(alvo).toBeFocused();
    }
    await page.screenshot({ path: `tests/visual/out/resumo-${width}.png`, fullPage: true });
  }
});
