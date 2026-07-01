import { describe, it } from "vitest";
import { buildPayload, getCharacter, isValidPayload } from "../src/engine/payload.js";

// ============================================================
// STARTER M3L8 — Tests de payload.js
// ============================================================
// Un test debe verificar el resultado que nos importa.
//
// En este archivo queremos cuidar el contrato del payload:
// - model;
// - system;
// - messages[];
// - max_tokens;
// - temperature.
//
// messages[] es importante porque ahi viaja el historial del chat.
// Si eso se rompe, Gemini recibe mal la conversacion.
// ============================================================

describe("payload.js", () => {
  it.todo("buildPayload arma un payload valido con system separado y messages[]");

  // Antes de escribir el test:
  // - importar expect desde Vitest.
  //
  // Pasos:
  // - const character = getCharacter("science")
  // - const messages = [{ role: "user", content: "hola" }]
  // - const payload = buildPayload(character, messages)
  //
  // Verificar:
  // - payload.model es "gemini-2.5-flash"
  // - payload.system contiene "Dr. Science"
  // - payload.messages es el mismo array messages
  // - isValidPayload(payload) devuelve true
  //
  // Usar:
  // - toBe(...) para strings, booleanos o misma referencia.
  // - toContain(...) para verificar parte de un string.

  it.todo("isValidPayload rechaza role system dentro de messages[]");

  // system va separado del historial.
  // Dentro de messages[] solo aceptamos user o assistant.
  //
  // Pasos:
  // - crear un payload con messages: [{ role: "system", content: "mal" }]
  // - verificar que isValidPayload(payload) devuelve false

  it.todo("getCharacter devuelve science si la key no existe");

  // Pasos:
  // - ejecutar getCharacter("no-existe")
  // - verificar que character.name es "Dr. Science"
});
