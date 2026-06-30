// ============================================================
// aiClient.js — Cliente frontend hacia la Serverless Function
// ============================================================
// STARTER M3L7
//
// En M3L6 el chat llamaba a mockApi.js directamente desde el browser.
// En M3L7 el browser NO debe llamar a Gemini ni tener API keys.
//
// Nuevo flujo:
//   frontend -> fetch("/api/chat") -> api/chat.js -> process.env -> Gemini
//
// Tu tarea:
//   1. Implementar callAI(payload).
//   2. Hacer POST a "/api/chat".
//   3. Enviar el payload del engine como JSON.
//   4. Parsear la respuesta JSON.
//   5. Si response.ok es false, lanzar Error.
//   6. Si response.ok es true, devolver el raw response.
//
// Cuando este archivo funcione, cambiar en views/chat.js:
//   import { callAI } from "../engine/mockApi.js";
// por:
//   import { callAI } from "../engine/aiClient.js";
// ============================================================

export async function callAI(payload) {
  // TODO 1:
  // Reemplazar este error por un fetch real:
  //
  // const response = await fetch("/api/chat", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  //
  // const data = await response.json();
  //
  // if (!response.ok) {
  //   const err = new Error(data.error || `HTTP ${response.status}`);
  //   err.status = response.status;
  //   err.retryAfterSeconds = data.retryAfterSeconds;
  //   throw err;
  // }
  //
  // return data;

  throw new Error("TODO: implementar fetch('/api/chat') en aiClient.js");
}
