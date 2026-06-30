import { describe, it, expect } from "vitest";
import { buildPayload, getCharacter, isValidPayload } from "../src/engine/payload.js";

describe("payload.js", () => {
  it("construye un payload valido con system top-level e historial en messages[]", () => {
    const character = getCharacter("science");
    const messages = [{ role: "user", content: "hola" }];
    const payload = buildPayload(character, messages);

    expect(payload.model).toBe("gemini-2.5-flash");
    expect(payload.system).toContain("Dr. Science");
    expect(payload.messages).toBe(messages);
    expect(isValidPayload(payload)).toBe(true);
  });

  it("rechaza un payload que pone role system dentro de messages[]", () => {
    const payload = {
      model: "gemini-2.5-flash",
      system: "Prompt correcto",
      messages: [{ role: "system", content: "Prompt incorrecto" }],
    };

    expect(isValidPayload(payload)).toBe(false);
  });
});
