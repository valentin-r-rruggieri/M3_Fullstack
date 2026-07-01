import { describe, it } from "vitest";
import {
  appendUserMessage,
  appendAssistantMessage,
  getTrimmedHistory,
  resetHistory,
} from "../src/engine/history.js";

// ============================================================
// STARTER M3L8 — Tests de history.js
// ============================================================
// Objetivo:
//   Practicar unit tests sobre funciones puras.
//
// Estas funciones NO hacen fetch, NO tocan DOM y NO dependen de Gemini.
// Por eso son el mejor punto de partida para testing.
//
// Funcion a testear:
//   appendUserMessage(messages, text)
//   appendAssistantMessage(messages, text)
//   getTrimmedHistory(messages, maxTurns)
//   resetHistory()
// ============================================================

describe("history.js", () => {
  it.todo("appendUserMessage agrega { role: 'user', content: text } sin mutar el array original");

  // TODO 1:
  // Crear const original = []
  // Crear const next = appendUserMessage(original, "hola")
  // Esperar que original siga siendo []
  // Esperar que next tenga [{ role: "user", content: "hola" }]

  it.todo("appendAssistantMessage agrega { role: 'assistant', content: text }");

  // TODO 2:
  // Llamar appendAssistantMessage([], "respuesta")
  // Esperar que devuelva [{ role: "assistant", content: "respuesta" }]

  it.todo("getTrimmedHistory devuelve los ultimos N mensajes");

  // TODO 3:
  // Crear un array con 3 mensajes
  // Llamar getTrimmedHistory(messages, 2)
  // Esperar que devuelva messages.slice(-2)

  it.todo("resetHistory devuelve un array vacio");

  // TODO 4:
  // Llamar resetHistory()
  // Esperar []
});

// Nota para el alumno:
// Cuando completes los TODOs vas a necesitar importar expect desde Vitest:
//   import { describe, it, expect } from "vitest";
