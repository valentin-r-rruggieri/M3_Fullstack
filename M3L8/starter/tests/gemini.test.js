import { describe, it } from "vitest";
import { toGeminiContents } from "../api/utils/gemini.js";

// ============================================================
// STARTER M3L8 — Tests de api/utils/gemini.js
// ============================================================
// Este archivo prueba una transformacion de datos.
//
// Nuestra app guarda mensajes asi:
//   { role: "user" | "assistant", content: string }
//
// Gemini espera mensajes asi:
//   { role: "user" | "model", parts: [{ text }] }
//
// No hace falta llamar a Gemini real para probar esto.
// Solo probamos que la funcion transforma bien los datos.
// ============================================================

describe("api/utils/gemini.js", () => {
  it.todo("convierte role assistant a role model");

  // Antes de escribir el test:
  // - importar expect desde Vitest.
  //
  // Pasos:
  // - ejecutar toGeminiContents([{ role: "assistant", content: "respuesta" }])
  // - verificar que devuelve:
  //   [{ role: "model", parts: [{ text: "respuesta" }] }]
  //
  // Usar:
  // - toEqual(...) para comparar arrays u objetos.

  it.todo("mantiene todos los mensajes del historial");

  // Las APIs de AI no recuerdan por si solas.
  // Si queremos contexto, mandamos el historial en cada request.
  //
  // Pasos:
  // - crear 3 mensajes: user, assistant, user
  // - ejecutar toGeminiContents(messages)
  // - verificar que el resultado tiene length 3
  //
  // Usar:
  // - toHaveLength(3)

  it.todo("convierte role user a role user y usa parts");

  // Pasos:
  // - ejecutar toGeminiContents([{ role: "user", content: "hola" }])
  // - verificar que result[0].role es "user"
  // - verificar que result[0].parts es [{ text: "hola" }]
});
