import { describe, it, expect } from "vitest";
import {
  appendUserMessage,
  appendAssistantMessage,
  getTrimmedHistory,
  resetHistory,
} from "../src/engine/history.js";

describe("history.js", () => {
  it("agrega un mensaje user sin mutar el array original", () => {
    const original = [];
    const next = appendUserMessage(original, "hola");

    expect(original).toEqual([]);
    expect(next).toEqual([{ role: "user", content: "hola" }]);
  });

  it.todo("agrega un mensaje assistant con role assistant");
  it.todo("recorta el historial con slice(-maxTurns)");
  it.todo("resetHistory devuelve un array vacio");
});
