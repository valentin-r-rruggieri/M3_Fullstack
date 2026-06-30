import { describe, it, expect } from "vitest";
import { buildPayload, getCharacter, isValidPayload } from "../src/engine/payload.js";

describe("payload.js", () => {
  it("construye un payload valido con system top-level e historial en messages[]", () => {
    const character = getCharacter("science");
    const messages = [{ role: "user", content: "hola" }];
    const payload = buildPayload(character, messages);

    expect(payload.system).toContain("Dr. Science");
    expect(payload.messages).toBe(messages);
    expect(isValidPayload(payload)).toBe(true);
  });

  it.todo("rechaza un payload que pone role system dentro de messages[]");
  it.todo("usa gemini-2.5-flash como modelo del contrato M3L7/M3L8");
});
