import { describe, it } from "vitest";
import { buildPayload, getCharacter, isValidPayload } from "../src/engine/payload.js";

// ============================================================
// STARTER M3L8 — Tests de payload.js
// ============================================================
// Objetivo:
//   Verificar que el payload conserva el contrato del chat.
//
// Lo importante para esta clase:
//   - system va separado del historial
//   - messages[] contiene el historial recortado
//   - no debe aparecer { role: "system" } dentro de messages[]
//   - el modelo usado por este ejercicio es gemini-2.5-flash
// ============================================================

describe("payload.js", () => {
  it.todo("buildPayload construye un payload valido con system top-level e historial en messages[]");

  // TODO 1:
  // const character = getCharacter("science")
  // const messages = [{ role: "user", content: "hola" }]
  // const payload = buildPayload(character, messages)
  //
  // Esperar:
  // - payload.model === "gemini-2.5-flash"
  // - payload.system contiene "Dr. Science"
  // - payload.messages es el MISMO array messages
  // - isValidPayload(payload) === true

  it.todo("isValidPayload rechaza role system dentro de messages[]");

  // TODO 2:
  // Crear un payload con:
  // messages: [{ role: "system", content: "esto esta mal" }]
  // Esperar isValidPayload(payload) === false

  it.todo("getCharacter devuelve science como fallback si la key no existe");

  // TODO 3:
  // Llamar getCharacter("no-existe")
  // Esperar que devuelva el personaje por defecto Dr. Science
});

// Nota para el alumno:
// Cuando completes los TODOs vas a necesitar importar expect desde Vitest:
//   import { describe, it, expect } from "vitest";
