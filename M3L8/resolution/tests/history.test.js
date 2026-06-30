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

  it("agrega un mensaje assistant con role assistant", () => {
    const next = appendAssistantMessage([], "respuesta");

    expect(next).toEqual([{ role: "assistant", content: "respuesta" }]);
  });

  it("recorta el historial con slice(-maxTurns)", () => {
    const messages = [
      { role: "user", content: "1" },
      { role: "assistant", content: "2" },
      { role: "user", content: "3" },
    ];

    expect(getTrimmedHistory(messages, 2)).toEqual(messages.slice(-2));
  });

  it("resetHistory devuelve un array vacio", () => {
    expect(resetHistory()).toEqual([]);
  });
});
