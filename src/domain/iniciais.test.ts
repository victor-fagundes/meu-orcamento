import { describe, expect, it } from "vitest";
import { iniciaisDaConta } from "./iniciais";

describe("iniciaisDaConta", () => {
  it("usa a primeira e a última palavra", () => {
    expect(iniciaisDaConta("Victor Fagundes")).toBe("VF");
    expect(iniciaisDaConta("Ana")).toBe("A");
    expect(iniciaisDaConta("   ")).toBe("");
  });
});
