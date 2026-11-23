import { describe, expect, it } from "vitest";
import {
  ERRO_NOME_CATEGORIA_DUPLICADO,
  ERRO_NOME_CATEGORIA_LINHA,
  ERRO_NOME_CATEGORIA_LONGO,
  ERRO_NOME_CATEGORIA_VAZIO,
  chaveNome,
  nomeCanonico,
  validarNomeCategoria,
  validarNomeUnicoNoTipo,
} from "./categorias";

function erro(raw: string): string {
  const res = validarNomeCategoria(raw);
  if (res.ok) throw new Error(`esperado erro para ${JSON.stringify(raw)}`);
  return res.error;
}

describe("validarNomeCategoria", () => {
  it("recusa vazio, espaços, 41 caracteres e quebra de linha", () => {
    expect(erro("")).toBe(ERRO_NOME_CATEGORIA_VAZIO);
    expect(erro("   ")).toBe(ERRO_NOME_CATEGORIA_VAZIO);
    expect(erro("a".repeat(41))).toBe(ERRO_NOME_CATEGORIA_LONGO);
    expect(erro("Lazer\n")).toBe(ERRO_NOME_CATEGORIA_LINHA);
    expect(erro("La\nzer")).toBe(ERRO_NOME_CATEGORIA_LINHA);
  });

  it("guarda o nome sem espaços nas pontas, inclusive com 40 caracteres", () => {
    expect(validarNomeCategoria("  Lazer  ")).toEqual({ ok: true, nome: "Lazer" });
    const quarenta = "b".repeat(40);
    expect(validarNomeCategoria(`  ${quarenta}  `)).toEqual({ ok: true, nome: quarenta });
  });
});

describe("chave e unicidade", () => {
  it("trata caixa e acento como o mesmo nome", () => {
    expect(chaveNome("Lazer")).toBe(chaveNome("lazer"));
    expect(chaveNome("Ação")).toBe(chaveNome("acao"));
    expect(chaveNome("NET")).not.toBe(chaveNome("Internet"));
  });

  it("recusa duplicata ativa no tipo e aceita outro tipo ou só arquivada", () => {
    const ativos = [{ nome: "Lazer" }];
    expect(validarNomeUnicoNoTipo("lazer", ativos)).toEqual({
      ok: false,
      error: ERRO_NOME_CATEGORIA_DUPLICADO,
    });
    expect(validarNomeUnicoNoTipo("Ação", [{ nome: "acao" }]).ok).toBe(false);
    expect(validarNomeUnicoNoTipo("Lazer", []).ok).toBe(true);
  });
});

describe("nomeCanonico", () => {
  it("prefere o grupo que ainda tem item ativo", () => {
    expect(
      nomeCanonico([
        { grupo: "lazer", arquivado: 0 },
        { grupo: "Lazer", arquivado: 1 },
      ]),
    ).toBe("lazer");
  });
});
