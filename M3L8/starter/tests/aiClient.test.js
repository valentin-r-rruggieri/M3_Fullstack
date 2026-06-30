import { afterEach, describe, it, expect, vi } from "vitest";
import { callAI } from "../src/engine/aiClient.js";

describe("aiClient.js", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("hace POST a /api/chat con el payload serializado", async () => {
    const payload = { messages: [{ role: "user", content: "hola" }] };
    const response = { content: [{ type: "text", text: "ok" }] };

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => response,
    }));

    await callAI(payload);

    expect(fetch).toHaveBeenCalledWith("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  });

  it.todo("lanza Error cuando /api/chat responde con response.ok false");
});
