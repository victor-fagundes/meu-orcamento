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

async function registrarVista(page: Page, descricao: string) {
  await page.locator("#registrar").click();
  const painel = page.getByRole("dialog", { name: "Registrar lançamento" });
  await painel.getByLabel("Item").selectOption({ label: "Supermercado · Alimentação" });
  await painel.getByLabel("Valor (R$)").fill("186,40");
  await painel.getByLabel("Data").fill("2026-11-12");
  if (descricao) await painel.getByLabel("Descrição").fill(descricao);
  await painel.getByLabel("Pagamento").selectOption({ label: "Débito" });
  await painel.getByRole("button", { name: "Salvar" }).click();
  await expect(painel).toHaveCount(0);
}

test("mês na casca e tabela com linha Editar", async ({ page }) => {
  await entrar(page);
  await page.goto("/app/lancamentos?mes=2026-11");
  await expect(page.getByRole("button", { name: "Mês anterior" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Próximo mês" })).toHaveCount(1);
  await expect(conteudo(page).getByRole("button", { name: "Mês anterior" })).toHaveCount(0);
  await registrarVista(page, "Cafe lista 045");
  const tabela = conteudo(page).getByRole("table", { name: /Lançamentos de/ });
  await expect(tabela).toBeVisible();
  for (const header of ["Data", "Descrição", "Item", "Pagamento", "Valor"]) {
    await expect(tabela.getByRole("columnheader", { name: header })).toBeVisible();
  }
  await expect(tabela.getByRole("row", { name: /^Editar Cafe lista 045/ })).toBeVisible();
  await expect(tabela.getByRole("button", { name: /Excluir/ })).toHaveCount(0);
  await expect(page.locator(".mo-fab, .fab")).toHaveCount(0);
});

test("busca vazia não muda o mês e o valor vazio não grava", async ({ page }) => {
  await entrar(page);
  await page.goto("/app/lancamentos?mes=2026-11");
  await conteudo(page).getByLabel("Buscar por descrição").fill("uber99");
  await expect(page).toHaveURL(/mes=2026-11/);
  await expect(page).toHaveURL(/q=uber99/);
  await expect(conteudo(page).getByText('Nenhum resultado para "uber99"')).toBeVisible();
  await expect(conteudo(page).getByText("Confira a descrição ou limpe a busca para ver todos os lançamentos.")).toBeVisible();
  await conteudo(page).getByRole("button", { name: "Limpar busca" }).click();
  await expect(page).toHaveURL(/mes=2026-11/);
  await expect(page).not.toHaveURL(/q=/);

  await page.locator("#registrar").click();
  const painel = page.getByRole("dialog", { name: "Registrar lançamento" });
  await painel.getByLabel("Pagamento").selectOption({ label: "Pix" });
  await expect(painel.getByRole("switch", { name: "Parcelar" })).toHaveCount(0);
  await expect(painel.getByLabel("Cartão")).toHaveCount(0);
  const antes = await conteudo(page).getByRole("row").count();
  await painel.getByRole("button", { name: "Salvar" }).click();
  await expect(painel.getByText("Informe um valor maior que zero.")).toBeVisible();
  await expect(conteudo(page).getByRole("row")).toHaveCount(antes);
  await painel.getByRole("button", { name: "Cancelar" }).click();
  await expect(page.locator("#registrar")).toBeFocused();
});

test("descrição vazia grava o nome do item e o aviso não desfaz", async ({ page }) => {
  await entrar(page);
  await page.goto("/app/lancamentos?mes=2026-11");
  const nome = conteudo(page).getByRole("row", { name: "Editar Supermercado" });
  const antes = await nome.count();
  await page.locator("#registrar").click();
  const painel = page.getByRole("dialog", { name: "Registrar lançamento" });
  await painel.getByLabel("Item").selectOption({ label: "Supermercado · Alimentação" });
  await painel.getByLabel("Valor (R$)").fill("186,40");
  await painel.getByLabel("Data").fill("2026-11-12");
  await painel.getByLabel("Pagamento").selectOption({ label: "Débito" });
  await painel.getByRole("button", { name: "Salvar" }).click();
  await expect(painel).toHaveCount(0);
  await expect(page.locator("#registrar")).toBeFocused();
  await expect(conteudo(page).getByText("Lançamento salvo.")).toBeVisible();
  await expect(conteudo(page).getByRole("button", { name: "Desfazer" })).toHaveCount(0);
  await expect(nome).toHaveCount(antes + 1);
});

test("parcela no cartão pede alcance e cancelar não grava", async ({ page }) => {
  await entrar(page);
  const apelido = `Nubank ${Date.now()}`;
  const criado = await page.request.post("/api/v1/cartoes", {
    data: { apelido, diaFechamento: 25, diaVencimento: 5, instituicao: "Nubank", ultimos4: "0451" },
  });
  expect(criado.ok()).toBeTruthy();

  await page.goto("/app/lancamentos?mes=2026-11");
  await page.locator("#registrar").click();
  const painel = page.getByRole("dialog", { name: "Registrar lançamento" });
  await painel.getByLabel("Item").selectOption({ label: "Supermercado · Alimentação" });
  await painel.getByLabel("Valor (R$)").fill("100,00");
  await painel.getByLabel("Data").fill("2026-05-26");
  await painel.getByLabel("Descrição").fill("Notebook 045");
  await painel.getByLabel("Pagamento").selectOption({ label: "Crédito" });
  await painel.getByLabel("Cartão").selectOption({ label: apelido });
  await painel.getByRole("switch", { name: "Parcelar" }).click();
  await painel.getByLabel("Parcelas").fill("3");
  await expect(painel.getByText("Prévia: 3 parcelas")).toBeVisible();
  await expect(painel.getByText("Jun/2026 · R$ 33,34")).toBeVisible();
  await painel.getByRole("button", { name: "Salvar" }).click();
  await expect(painel).toHaveCount(0);

  await page.goto("/app/lancamentos?mes=2026-06");
  const linha = conteudo(page).getByRole("row", { name: "Editar Notebook 045" });
  await expect(linha).toContainText("26/05/2026");
  await expect(linha).toContainText("Fatura 06/2026");
  await expect(linha).toContainText("Parcela 1 de 3 · restam 2");
  await linha.click();
  const edicao = page.getByRole("dialog", { name: "Editar lançamento" });
  await edicao.getByLabel("Descrição").fill("Notebook 045 editado");
  await edicao.getByRole("button", { name: "Salvar" }).click();
  const correcao = page.getByRole("dialog", { name: "Corrigir parcelamento" });
  await expect(correcao.getByText("Só esta parcela")).toBeVisible();
  await expect(correcao.getByText("Esta e as próximas")).toBeVisible();
  await expect(correcao.getByText("Todas do parcelamento")).toHaveCount(0);
  await expect(correcao.getByRole("button", { name: "Salvar" })).toBeDisabled();
  await correcao.getByRole("button", { name: "Cancelar" }).click();
  await expect(correcao).toHaveCount(0);
  await expect(linha).toContainText("Notebook 045");
  await expect(linha).not.toContainText("editado");
});

test("editar à vista fecha o painel e excluir desfaz sem reabrir", async ({ page }) => {
  await entrar(page);
  await page.goto("/app/lancamentos?mes=2026-11");
  const descricao = `Cafe undo ${Date.now()}`;
  await registrarVista(page, descricao);
  const linha = conteudo(page).getByRole("row", { name: `Editar ${descricao}` });
  await linha.click();
  const edicao = page.getByRole("dialog", { name: "Editar lançamento" });
  const nova = `${descricao} ok`;
  await edicao.getByLabel("Descrição").fill(nova);
  await edicao.getByRole("button", { name: "Salvar" }).click();
  await expect(edicao).toHaveCount(0);
  await expect(conteudo(page).getByText("Lançamento salvo.")).toBeVisible();
  await expect(conteudo(page).getByRole("button", { name: "Desfazer" })).toHaveCount(0);
  const linhaNova = conteudo(page).getByRole("row", { name: `Editar ${nova}` });
  await expect(linhaNova).toBeVisible();

  await linhaNova.click();
  const deNovo = page.getByRole("dialog", { name: "Editar lançamento" });
  await deNovo.getByRole("button", { name: "Excluir lançamento" }).click();
  const exclusao = page.getByRole("dialog", { name: "Excluir lançamento?" });
  await expect(exclusao.getByText("1 lançamento sai da lista.")).toBeVisible();
  await expect(exclusao.getByText("Você pode desfazer por 10 segundos.")).toBeVisible();
  await exclusao.getByRole("button", { name: "Excluir lançamento" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("#registrar")).toBeFocused();
  await expect(conteudo(page).getByRole("button", { name: "Desfazer" })).toBeVisible();
  await conteudo(page).getByRole("button", { name: "Desfazer" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(conteudo(page).getByRole("row", { name: `Editar ${nova}` })).toBeVisible();
  await expect(conteudo(page).getByRole("table").getByRole("button", { name: "Excluir" })).toHaveCount(0);
});

test("mês vazio, claro e escuro, sem botão flutuante", async ({ page }) => {
  await entrar(page);
  await page.goto("/app/lancamentos?mes=2010-01");
  await expect(conteudo(page).getByText("Nenhum lançamento em janeiro")).toBeVisible();
  await expect(conteudo(page).getByRole("button", { name: "Registrar lançamento" })).toBeVisible();
  await expect(conteudo(page).getByLabel("Buscar por descrição")).toHaveCount(0);
  await conteudo(page).getByRole("button", { name: "Registrar lançamento" }).click();
  await expect(page.getByRole("dialog", { name: "Registrar lançamento" })).toBeVisible();
  await expect(page.locator(".mo-fab, .fab")).toHaveCount(0);
  await page.setViewportSize({ width: 1280, height: 800 });
  const caixa = await page.locator(".mo-formulario").boundingBox();
  expect(caixa?.width).toBe(460);

  await page.emulateMedia({ colorScheme: "light" });
  await page.evaluate(() => window.localStorage.setItem("mo-tema", "light"));
  await page.reload();
  await page.screenshot({ path: "tests/visual/out/lancamentos-claro.png", fullPage: true });

  await page.emulateMedia({ colorScheme: "dark" });
  await page.evaluate(() => window.localStorage.setItem("mo-tema", "dark"));
  await page.reload();
  await expect(page.locator("#registrar")).toBeVisible();
  await page.screenshot({ path: "tests/visual/out/lancamentos-escuro.png", fullPage: true });
});
