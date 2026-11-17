import { describe, expect, it } from "vitest";
import { productionConfigError } from "./production-env";

const secret = "producao-segredo-com-32-caracteres-ok";

describe("productionConfigError", () => {
  it("libera o desenvolvimento sem banco na nuvem", () => {
    expect(productionConfigError({ NODE_ENV: "development" })).toBeNull();
  });

  it("recusa produção sem URL de banco", () => {
    expect(
      productionConfigError({
        NODE_ENV: "production",
        BETTER_AUTH_SECRET: secret,
        BETTER_AUTH_URL: "https://meu.vercel.app",
      }),
    ).toMatch(/DATABASE_URL/);
  });

  it("recusa o segredo fixo de desenvolvimento", () => {
    expect(
      productionConfigError({
        NODE_ENV: "production",
        DATABASE_URL: "postgresql://neon/db",
        BETTER_AUTH_SECRET: "dev-only-change-me-meu-orcamento-32chars",
        BETTER_AUTH_URL: "https://meu.vercel.app",
      }),
    ).toMatch(/BETTER_AUTH_SECRET/);
  });

  it("recusa URL local em produção", () => {
    expect(
      productionConfigError({
        NODE_ENV: "production",
        DATABASE_URL: "postgresql://neon/db",
        BETTER_AUTH_SECRET: secret,
        BETTER_AUTH_URL: "http://localhost:3000",
      }),
    ).toMatch(/HTTPS/);
  });

  it("aceita produção com banco, segredo e HTTPS", () => {
    expect(
      productionConfigError({
        NODE_ENV: "production",
        DATABASE_URL: "postgresql://neon/db",
        BETTER_AUTH_SECRET: secret,
        BETTER_AUTH_URL: "https://meu.vercel.app",
      }),
    ).toBeNull();
  });
});
