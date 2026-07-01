import { beforeEach, describe, it, expect, vi } from "vitest";
import { callAI } from "../src/engine/aiClient.js";

global.fetch = vi.fn();

describe("aiClient.js", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("hace POST a /api/chat con el payload serializado", async () => {
    const payload = { messages: [{ role: "user", content: "hola" }] };
    const response = { content: [{ type: "text", text: "ok" }] };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => response,
    });

    await callAI(payload);

    expect(fetch).toHaveBeenCalledWith("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  });

  it("lanza Error cuando /api/chat responde con response.ok false", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ error: "Rate limit", retryAfterSeconds: 8 }),
    });

    await expect(callAI({ messages: [] })).rejects.toThrow("Rate limit");
  });
});
