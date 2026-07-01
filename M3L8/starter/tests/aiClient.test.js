import { beforeEach, describe, it, vi } from "vitest";
import { callAI } from "../src/engine/aiClient.js";

// ============================================================
// STARTER M3L8 — Tests de aiClient.js
// ============================================================
// Mocking significa reemplazar una dependencia real por una falsa.
//
// En este archivo reemplazamos fetch.
// Asi el test no depende de:
// - internet;
// - Vercel;
// - Gemini;
// - una API key real.
//
// La lecture usa:
// - global.fetch = vi.fn()
// - fetch.mockClear()
// - fetch.mockResolvedValueOnce(...)
// - expect(fetch).toHaveBeenCalledWith(...)
// - await expect(...).rejects.toThrow(...)
// ============================================================

global.fetch = vi.fn();

describe("aiClient.js", () => {
  beforeEach(() => {
    // El mock guarda llamadas anteriores.
    // Lo limpiamos antes de cada test para que un test no contamine al otro.
    fetch.mockClear();
  });

  it.todo("callAI hace POST a /api/chat con el payload serializado");

  // Antes de escribir el test:
  // - importar expect desde Vitest.
  //
  // Pasos:
  // - crear payload:
  //   const payload = { messages: [{ role: "user", content: "hola" }] }
  //
  // - crear respuesta falsa:
  //   const response = { content: [{ type: "text", text: "ok" }] }
  //
  // - decirle al mock que fetch responda OK:
  //   fetch.mockResolvedValueOnce({
  //     ok: true,
  //     json: async () => response,
  //   })
  //
  // - ejecutar:
  //   await callAI(payload)
  //
  // - verificar que fetch se llamo con:
  //   "/api/chat"
  //   method POST
  //   header Content-Type application/json
  //   body JSON.stringify(payload)
  //
  // Usar:
  // - expect(fetch).toHaveBeenCalledWith(...)

  it.todo("callAI lanza Error cuando /api/chat responde con response.ok false");

  // Pasos:
  // - preparar fetch para simular error:
  //   fetch.mockResolvedValueOnce({
  //     ok: false,
  //     status: 429,
  //     json: async () => ({ error: "Rate limit", retryAfterSeconds: 8 }),
  //   })
  //
  // - verificar que callAI falla:
  //   await expect(callAI({ messages: [] })).rejects.toThrow("Rate limit")
  //
  // Usar:
  // - rejects.toThrow(...) para Promises que deben fallar.
});
