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

  it("lanza Error cuando /api/chat responde con response.ok false", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({ error: "Rate limit", retryAfterSeconds: 8 }),
    }));

    await expect(callAI({ messages: [] })).rejects.toMatchObject({
      message: "Rate limit",
      status: 429,
      retryAfterSeconds: 8,
    });
  });
});
