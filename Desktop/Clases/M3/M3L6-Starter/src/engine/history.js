// ============================================================
// history.js — Gestión del historial de conversación
// ============================================================
// Tu tarea: implementar funciones puras para manejar el historial.
// La AI no recuerda nada entre requests: nosotros reenviamos el
// historial necesario en cada payload.
// ============================================================

// TODO 1: Implementar appendUserMessage(messages, text)
//
// Debe devolver un NUEVO array con el mensaje del usuario agregado.
//
// Forma esperada del mensaje:
//   { role: "user", content: text }
//
// Importante:
//   - No usar messages.push(...)
//   - Usar spread para no mutar el array original
//
// export function appendUserMessage(messages, text) { ... }
export function appendUserMessage(messages, text) {
  // TODO: reemplazar por return [...messages, { role: "user", content: text }]
  return messages;
}

// TODO 2: Implementar appendAssistantMessage(messages, text)
//
// Debe devolver un NUEVO array con la respuesta del asistente agregada.
//
// Forma esperada del mensaje:
//   { role: "assistant", content: text }
//
// export function appendAssistantMessage(messages, text) { ... }
export function appendAssistantMessage(messages, text) {
  // TODO: reemplazar por return [...messages, { role: "assistant", content: text }]
  return messages;
}

// TODO 3: Implementar getTrimmedHistory(messages, maxTurns = 10)
//
// Debe devolver solo los últimos maxTurns mensajes.
//
// Por qué:
//   Cada mensaje suma input_tokens al request.
//   Más tokens = más costo + más riesgo de rate limit.
//
// Tip:
//   messages.slice(-maxTurns)
//
// export function getTrimmedHistory(messages, maxTurns = 10) { ... }
export function getTrimmedHistory(messages, maxTurns = 10) {
  // TODO: reemplazar por messages.slice(-maxTurns)
  return messages;
}

// TODO 4: Implementar resetHistory()
//
// Debe devolver un array vacío.
//
// Cuándo se usa:
//   - botón "Nueva conversación"
//   - cambio de personaje
//
// export function resetHistory() { ... }
export function resetHistory() {
  // TODO: reemplazar por return []
  return [];
}
