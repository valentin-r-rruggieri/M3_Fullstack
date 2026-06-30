import { describe, it, expect } from "vitest";
import { toGeminiContents } from "../api/utils/gemini.js";

describe("api/utils/gemini.js", () => {
  it("convierte role assistant a role model", () => {
    const result = toGeminiContents([{ role: "assistant", content: "respuesta" }]);

    expect(result).toEqual([
      { role: "model", parts: [{ text: "respuesta" }] },
    ]);
  });

  it("preserva todo el historial, no solo el ultimo mensaje", () => {
    const messages = [
      { role: "user", content: "mi nombre es Ana" },
      { role: "assistant", content: "Hola Ana" },
      { role: "user", content: "como me llamo?" },
    ];

    expect(toGeminiContents(messages)).toHaveLength(3);
  });
});
