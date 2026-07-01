import { describe, it } from "vitest";
import { toGeminiContents } from "../api/utils/gemini.js";

// ============================================================
// STARTER M3L8 — Tests de api/utils/gemini.js
// ============================================================
// Objetivo:
//   Testear un adaptador de datos.
//
// Nuestra app guarda historial como:
//   { role: "user" | "assistant", content: string }
//
// Gemini espera:
//   { role: "user" | "model", parts: [{ text }] }
//
// Este archivo prueba que NO perdemos historial al adaptar el payload.
// ============================================================

describe("api/utils/gemini.js", () => {
  it.todo("convierte role assistant a role model");

  // TODO 1:
  // const result = toGeminiContents([{ role: "assistant", content: "respuesta" }])
  // Esperar:
  // [{ role: "model", parts: [{ text: "respuesta" }] }]

  it.todo("preserva todo el historial, no solo el ultimo mensaje");

  // TODO 2:
  // Crear 3 mensajes: user, assistant, user
  // Llamar toGeminiContents(messages)
  // Esperar que result tenga length 3

  it.todo("convierte role user a role user");

  // TODO 3:
  // const result = toGeminiContents([{ role: "user", content: "hola" }])
  // Esperar que result[0].role sea "user"
});

// Nota para el alumno:
// Cuando completes los TODOs vas a necesitar importar expect desde Vitest:
//   import { describe, it, expect } from "vitest";
