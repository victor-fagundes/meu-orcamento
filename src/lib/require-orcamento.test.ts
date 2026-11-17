import { describe, expect, it, vi } from "vitest";
import { NotFoundError, requireOrcamento } from "./require-orcamento";

describe("requireOrcamento — AC-102.1", () => {
  it("retorna orçamento do usuário da sessão", async () => {
    const load = vi.fn().mockResolvedValue({ id: "o1", userId: "u1" });
    const result = await requireOrcamento({ id: "u1" }, load);
    expect(result).toEqual({ id: "o1", userId: "u1" });
    expect(load).toHaveBeenCalledWith("u1");
  });

  it("sessão ausente → 404", async () => {
    await expect(requireOrcamento(null, vi.fn())).rejects.toBeInstanceOf(NotFoundError);
  });

  it("orçamento de outro user → 404", async () => {
    const load = vi.fn().mockResolvedValue({ id: "o2", userId: "u2" });
    await expect(requireOrcamento({ id: "u1" }, load)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("orçamento inexistente → 404", async () => {
    const load = vi.fn().mockResolvedValue(null);
    await expect(requireOrcamento({ id: "u1" }, load)).rejects.toBeInstanceOf(NotFoundError);
  });
});
