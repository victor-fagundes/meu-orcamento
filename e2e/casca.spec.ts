import { expect, test, type Page } from "@playwright/test";

test.describe.configure({ mode: "serial", timeout: 90_000 });

const AREAS = [
  ["Resumo", "/app/resumo"],
  ["Orçamento", "/app/orcamento"],
  ["Lançamentos", "/app/lancamentos"],
  ["Ano", "/app/ano"],
  ["Ajustes", "/app/ajustes"],
] as const;

async function entrar(page: Page) {
  await page.goto("/login");
  await page.locator('input[name="email"]').fill("demo@local.test");
  await page.locator('input[name="password"]').fill("demo1234");
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL("**/app/resumo");
}

function nav(page: Page) {
  return page.getByRole("navigation", { name: "Principal" });
}

async function abrir(page: Page, endereco: string) {
  if (endereco !== "/app/ajustes") {
    await page.goto(endereco);
    return;
  }
  try {
    await page.goto(endereco);
  } catch (erro) {
    if (!(erro instanceof Error) || !erro.message.includes("ERR_ABORTED")) throw erro;
  }
  await page.waitForURL(/\/app\/ajustes\/categorias/);
}

test("cinco áreas e sessão anônima", async ({ page, browser }) => {
  await entrar(page);
  const barra = nav(page);
  await expect(barra.getByRole("button")).toHaveCount(5);
  await expect(barra.getByRole("button")).toHaveText(AREAS.map(([nome]) => nome));
  for (const [nome, endereco] of AREAS) {
    await barra.getByRole("button", { name: nome }).click();
    const destino = nome === "Ajustes" ? /\/app\/ajustes\/categorias$/ : new RegExp(`${endereco}$`);
    await expect(page).toHaveURL(destino, { timeout: 20_000 });
    await expect(barra.getByRole("button", { name: nome })).toHaveAttribute("aria-current", "page");
    await expect(barra.locator('[aria-current="page"]')).toHaveCount(1);
  }

  const anon = await browser.newContext();
  const semSessao = await anon.newPage();
  await semSessao.goto("/app/resumo");
  await expect(semSessao).toHaveURL(/\/login/);
  await expect(semSessao.getByRole("navigation", { name: "Principal" })).toHaveCount(0);
  await anon.close();
});

test("lateral no largo e inferior no estreito", async ({ page }) => {
  await entrar(page);
  const barra = nav(page);

  for (const width of [1280, 720]) {
    await page.setViewportSize({ width, height: 800 });
    const box = await barra.boundingBox();
    expect(box?.width).toBeCloseTo(240, 0);
    await expect(barra).toHaveCSS("position", "sticky");
  }

  for (const width of [719, 390]) {
    await page.setViewportSize({ width, height: 800 });
    const box = await barra.boundingBox();
    expect(Math.round(box?.height ?? 0)).toBe(76);
    expect(Math.round(box?.width ?? 0)).toBe(width);
    await expect(barra).toHaveCSS("position", "fixed");
  }

  await expect(page.getByRole("navigation", { name: "Principal" })).toHaveCount(1);
  await page.setViewportSize({ width: 1280, height: 800 });
  await barra.getByRole("button", { name: "Orçamento" }).click();
  await expect(page).toHaveURL(/\/app\/orcamento$/);
  await page.setViewportSize({ width: 390, height: 800 });
  await expect(barra.getByRole("button", { name: "Orçamento" })).toHaveAttribute("aria-current", "page");
});

test("Ajustes continua a única aba marcada", async ({ page }) => {
  await entrar(page);
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 800 });
    await abrir(page, "/app/ajustes");
    const barra = nav(page);
    await expect(barra.getByRole("button")).toHaveCount(5);
    await expect(barra.locator('[aria-current="page"]')).toHaveCount(1);
    await expect(barra.getByRole("button", { name: "Ajustes" })).toHaveAttribute("aria-current", "page");
  }
});

test("título sem mês, sem flutuante, e Sair", async ({ page }) => {
  await entrar(page);
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 800 });
    for (const [nome, endereco] of AREAS) {
      await abrir(page, endereco);
      if (nome === "Resumo" || nome === "Orçamento" || nome === "Lançamentos") {
        await expect(page.locator(".mo-cabecalho__titulo")).toContainText(nome);
        await expect(page.getByRole("button", { name: "Mês anterior" })).toHaveCount(1);
        await expect(page.getByRole("button", { name: "Próximo mês" })).toHaveCount(1);
      } else {
        await expect(page.locator(".mo-cabecalho__titulo")).toHaveText(nome);
        await expect(page.getByRole("button", { name: "Mês anterior" })).toHaveCount(0);
        await expect(page.getByRole("button", { name: "Próximo mês" })).toHaveCount(0);
      }
      await expect(page.getByRole("button", { name: "Novo lançamento" })).toHaveCount(0);
      await expect(page.locator(".fab")).toHaveCount(0);
      await expect(page.locator(".mo-shell__cabecalho").getByRole("button", { name: "Sair", exact: true })).toHaveCount(0);
    }
  }
});

test("teclado, skip link e menos movimento", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await entrar(page);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Ir para o conteúdo" })).toBeFocused();
  const barra = nav(page);
  for (const [nome] of AREAS) {
    await barra.getByRole("button", { name: nome }).focus();
    await expect(barra.getByRole("button", { name: nome })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(barra.getByRole("button", { name: nome })).toHaveAttribute("aria-current", "page");
  }
  const motion = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--motion-fast").trim(),
  );
  expect(motion).toBe("0ms");
});

test("grade do conteúdo", async ({ page }) => {
  await entrar(page);
  const conteudo = page.locator(".mo-shell__conteudo");

  await page.setViewportSize({ width: 1280, height: 800 });
  const largo = await conteudo.evaluate((el) => {
    const estilo = getComputedStyle(el);
    const esquerda = parseFloat(estilo.paddingLeft);
    const direita = parseFloat(estilo.paddingRight);
    const filho = el.firstElementChild;
    return {
      esquerda,
      direita,
      miolo: el.clientWidth - esquerda - direita,
      coluna: filho ? getComputedStyle(filho).gridColumn : "",
    };
  });
  expect(largo.esquerda).toBe(40);
  expect(largo.direita).toBe(40);
  expect(largo.miolo).toBeLessThanOrEqual(960);
  expect(largo.coluna).toContain("1");

  await page.setViewportSize({ width: 390, height: 800 });
  const estreito = await conteudo.evaluate((el) => {
    const estilo = getComputedStyle(el);
    return {
      esquerda: parseFloat(estilo.paddingLeft),
      baixo: parseFloat(estilo.paddingBottom),
    };
  });
  expect(estreito.esquerda).toBe(16);
  expect(estreito.baixo).toBeGreaterThanOrEqual(76);
});
