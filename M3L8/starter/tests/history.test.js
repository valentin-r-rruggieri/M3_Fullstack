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
// Un unit test prueba una parte chica del codigo.
//
// Este archivo es buen punto de partida porque history.js:
// - no toca el DOM;
// - no hace fetch;
// - no usa Gemini;
// - recibe datos y devuelve datos.
//
// En Vitest usamos:
// - describe(...) para agrupar tests;
// - it(...) para escribir un caso;
// - expect(...) para verificar el resultado.
//
// En el starter dejamos it.todo(...) para marcar lo que falta.
// El alumno reemplaza cada it.todo(...) por it(..., () => { ... }).
// ============================================================

describe("history.js", () => {
  it.todo("appendUserMessage agrega un mensaje con role user");

  // Antes de escribir el test:
  // - importar expect desde Vitest.
  //
  // Pasos:
  // - crear const original = []
  // - crear const next = appendUserMessage(original, "hola")
  // - verificar que original sigue siendo []
  // - verificar que next tiene [{ role: "user", content: "hola" }]
  //
  // Usar:
  // - expect(...).toEqual(...) para comparar arrays u objetos.

  it.todo("appendAssistantMessage agrega un mensaje con role assistant");

  // Pasos:
  // - ejecutar appendAssistantMessage([], "respuesta")
  // - verificar que devuelve:
  //   [{ role: "assistant", content: "respuesta" }]

  it.todo("getTrimmedHistory devuelve los ultimos N mensajes");

  // Un chat no manda historial infinito.
  // getTrimmedHistory deja solo los mensajes mas recientes.
  //
  // Pasos:
  // - crear un array con 3 mensajes
  // - ejecutar getTrimmedHistory(messages, 2)
  // - verificar que devuelve messages.slice(-2)

  it.todo("resetHistory devuelve un array vacio");

  // Pasos:
  // - ejecutar resetHistory()
  // - verificar que devuelve []
});
