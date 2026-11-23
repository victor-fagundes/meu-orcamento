import { describe, expect, it } from "vitest";
import { confirmarFraseExclusao } from "./exclusao-conta";

describe("confirmarFraseExclusao", () => {
  it("só aceita EXCLUIR", () => {
    expect(confirmarFraseExclusao("EXCLUIR")).toEqual({ ok: true });
    expect(confirmarFraseExclusao(" EXCLUIR ")).toEqual({ ok: true });
    expect(confirmarFraseExclusao("")).toEqual({ ok: false, motivo: "vazia" });
    expect(confirmarFraseExclusao("excluir")).toEqual({ ok: false, motivo: "diferente" });
    expect(confirmarFraseExclusao("Excluir")).toEqual({ ok: false, motivo: "diferente" });
    expect(confirmarFraseExclusao("EXCLUIR agora")).toEqual({ ok: false, motivo: "diferente" });
  });
});
