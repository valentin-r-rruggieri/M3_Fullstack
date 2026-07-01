import { afterEach, describe, it, vi } from "vitest";
import { callAI } from "../src/engine/aiClient.js";

// ============================================================
// STARTER M3L8 — Tests de aiClient.js
// ============================================================
// Objetivo:
//   Mockear fetch para probar nuestro cliente HTTP sin hacer requests reales.
//
// NO testeamos Gemini real.
// NO testeamos Vercel real.
// SI testeamos que nuestro frontend llama bien a /api/chat.
// ============================================================

describe("aiClient.js", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.todo("callAI hace POST a /api/chat con el payload serializado");

  // TODO 1:
  // Importar expect desde Vitest.
  //
  // Crear:
  // const payload = { messages: [{ role: "user", content: "hola" }] }
  // const response = { content: [{ type: "text", text: "ok" }] }
  //
  // Mockear fetch:
  // vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
  //   ok: true,
  //   json: async () => response,
  // }))
  //
  // await callAI(payload)
  //
  // Esperar que fetch haya sido llamado con:
  // "/api/chat"
  // method POST
  // Content-Type application/json
  // body JSON.stringify(payload)

  it.todo("callAI lanza Error cuando /api/chat responde con response.ok false");

  // TODO 2:
  // Mockear fetch con:
  // ok: false
  // status: 429
  // json: async () => ({ error: "Rate limit", retryAfterSeconds: 8 })
  //
  // Esperar que callAI(...) rechace con:
  // message "Rate limit"
  // status 429
  // retryAfterSeconds 8
});
