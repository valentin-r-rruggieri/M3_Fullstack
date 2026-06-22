import { describe, it, expect, vi, beforeEach } from "vitest";
import { getJoke } from "./apiClient.js";

global.fetch = vi.fn();

describe("getJoke", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("llama a /api/joke con POST", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ joke: "Chiste mock" }),
    });

    await getJoke();

    expect(fetch).toHaveBeenCalledWith("/api/joke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: "anything" }),
    });
  });

  it("devuelve el chiste cuando la respuesta es exitosa", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ joke: "Chiste mock" }),
    });

    await expect(getJoke()).resolves.toBe("Chiste mock");
  });

  it("lanza error si response.ok es false", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Error del servidor" }),
    });

    await expect(getJoke()).rejects.toThrow("Error del servidor");
  });
});
