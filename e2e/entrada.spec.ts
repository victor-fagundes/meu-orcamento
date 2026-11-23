import { expect, test, type Page } from "@playwright/test";

test.describe.configure({ mode: "serial", timeout: 90_000 });

async function largura(page: Page, width: number) {
  await page.setViewportSize({ width, height: 800 });
}

test("marca em duas colunas no largo e uma no estreito", async ({ page }) => {
  await page.goto("/login");
  const frase = page.getByRole("heading", { name: "O que ainda cabe neste mês." });
  const titulo = page.getByRole("heading", { name: "Entrar" });
  const apoio = page.getByText("Entre para ver o que ainda cabe no mês.");

  for (const width of [1280, 720]) {
    await largura(page, width);
    await expect(frase).toBeVisible();
    await expect(apoio).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Principal" })).toHaveCount(0);
    const marca = await frase.boundingBox();
    const form = await titulo.boundingBox();
    expect(marca && form && marca.x < form.x).toBe(true);
  }

  for (const width of [719, 390]) {
    await largura(page, width);
    await expect(page.getByText("Meu Orçamento")).toBeVisible();
    await expect(titulo).toBeVisible();
    await expect(apoio).toBeHidden();
    await expect(page.getByRole("navigation", { name: "Principal" })).toHaveCount(0);
    const marca = await frase.boundingBox();
    const form = await titulo.boundingBox();
    expect(marca && form && marca.y < form.y).toBe(true);
  }
});

test("campo vazio, e-mail inválido e teclado", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByText("Informe o e-mail.")).toBeVisible();
  await expect(page.getByText("Informe a senha.")).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("E-mail").fill("sem-arroba");
  await page.getByLabel("Senha").fill("12345678");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByText("Informe um e-mail válido.")).toBeVisible();

  await page.getByLabel("E-mail").focus();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Senha")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Esqueci a senha" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Entrar" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Criar conta" })).toBeFocused();
  const contorno = await page.getByRole("link", { name: "Criar conta" }).evaluate((el) => getComputedStyle(el).outlineStyle);
  expect(contorno).not.toBe("none");
  await page.screenshot({ path: "tests/visual/out/entrada.png", fullPage: true });
});

test("credencial errada conserva os campos", async ({ page }) => {
  await page.goto("/login");
  await page.locator('input[name="email"]').fill("demo@local.test");
  await page.locator('input[name="password"]').fill("senha-errada");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByText("E-mail ou senha incorretos. Confira os dados e tente de novo.")).toBeVisible();
  await expect(page.getByText("Use pelo menos 8 caracteres.")).toHaveCount(0);
  await expect(page.locator('input[name="email"]')).toHaveValue("demo@local.test");
  await expect(page.locator('input[name="password"]')).toHaveValue("senha-errada");

  await page.locator('input[name="password"]').fill("1234567");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByText("E-mail ou senha incorretos. Confira os dados e tente de novo.")).toBeVisible();
  await expect(page.getByText("Use pelo menos 8 caracteres.")).toHaveCount(0);
});

test("cadastro recusa senha curta e e-mail da demo", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/cadastro");
  await expect(page.getByRole("heading", { name: "Criar conta" })).toBeVisible();
  await expect(page.getByText("Entre para ver o que ainda cabe no mês.")).toBeHidden();

  await page.getByLabel("Nome").fill("Teste");
  await page.getByLabel("E-mail").fill("novo@local.test");
  await page.getByLabel("Senha").fill("1234567");
  await page.getByRole("button", { name: "Cadastrar" }).click();
  await expect(page.getByText("Use pelo menos 8 caracteres.")).toBeVisible();
  await expect(page).toHaveURL(/\/cadastro$/);

  await page.getByLabel("E-mail").fill("demo@local.test");
  await page.getByLabel("Senha").fill("outrasenha");
  await page.getByRole("button", { name: "Cadastrar" }).click();
  await expect(page.getByText("Já existe uma conta com esse e-mail.")).toBeVisible();
  await expect(page.getByLabel("Nome")).toHaveValue("Teste");
  await expect(page.getByLabel("E-mail")).toHaveValue("demo@local.test");
  await expect(page.getByLabel("Senha")).toHaveValue("outrasenha");
});

test("esqueci a senha confirma sem dizer se a conta existe", async ({ page }) => {
  await page.goto("/esqueci-senha");
  await expect(page.getByRole("heading", { name: "Esqueci a senha" })).toBeVisible();
  await expect(page.getByText("Enviaremos um link para você criar uma nova senha.")).toBeVisible();
  await page.getByLabel("E-mail").fill("nao-existe@example.com");
  await page.getByRole("button", { name: "Enviar link" }).click();
  await expect(page.getByText("Enviamos o link para nao-existe@example.com. Confira também o spam.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Verifique seu e-mail" })).toBeVisible();
  await expect(page.getByText("O link vale por 30 minutos. Se não chegar, você pode pedir outro.")).toBeVisible();
  await expect(page.getByText("não existe")).toHaveCount(0);
  await expect(page.getByText("está cadastrado")).toHaveCount(0);
  await page.getByRole("button", { name: "Reenviar link" }).click();
  await expect(page.getByRole("heading", { name: "Verifique seu e-mail" })).toBeVisible();
});

test("sessão expirada só aparece com a query", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText("Sua sessão expirou")).toHaveCount(0);
  await page.goto("/login?sessao=expirada");
  await expect(page.getByText("Sua sessão expirou. Entre de novo para continuar. Nada do que você digitou foi perdido.")).toBeVisible();
  await expect(page.locator('input[name="password"]')).toHaveValue("");
});

test("conta demo entra e cancelar Sair mantém a sessão", async ({ page }) => {
  await page.goto("/login");
  await page.locator('input[name="email"]').fill("demo@local.test");
  await page.locator('input[name="password"]').fill("demo1234");
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL("**/app/resumo**");

  await page.goto("/login");
  await page.waitForURL("**/app/resumo**");

  await page.goto("/app/ajustes/conta");
  await page.locator("section").getByRole("button", { name: "Sair da conta" }).click();
  await page.getByRole("button", { name: "Cancelar" }).click();
  await expect(page.getByRole("heading", { name: "Conta" })).toBeVisible();
});
