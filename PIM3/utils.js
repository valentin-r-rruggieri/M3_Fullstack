/**
 * utils.js — Funciones puras de utilidad
 *
 * ¿Por qué separar la lógica en funciones puras? (L8 — Unit Testing)
 * Una función pura:
 *   ✅ Siempre retorna el mismo output para el mismo input
 *   ✅ No tiene efectos secundarios (no toca el DOM, no hace fetch)
 *   ✅ No depende de variables externas ni de estado global
 *
 * Esta propiedad las hace PERFECTAS para unit testing con Vitest.
 * Si la lógica estuviera mezclada con el DOM en app.js, habría que
 * simular el navegador completo para testearla.
 *
 * Todas las funciones de este archivo están testeadas en tests/utils.test.js
 */

// ─────────────────────────────────────────────────────────────────────────────
// VALIDACIÓN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Valida que un mensaje del usuario sea apto para enviar.
 *
 * Reglas:
 *   - No puede ser null, undefined o falsy
 *   - Después de trim(), debe tener entre 1 y 500 caracteres
 *   - 500 caracteres: límite razonable para evitar prompts gigantes
 *
 * @param {string} text - Texto del mensaje
 * @returns {boolean} true si el mensaje es válido
 */
export function isValidMessage(text) {
  if (!text) return false
  const trimmed = text.trim()
  return trimmed.length >= 1 && trimmed.length <= 500
}

// ─────────────────────────────────────────────────────────────────────────────
// PARSEO DE RESPUESTA DE LA API (L4 — Estructuras de Datos)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parsea y normaliza la respuesta de texto que llega de la Serverless Function.
 *
 * La serverless function retorna: { reply: "texto del personaje" }
 * Esta función extrae ese texto y lo limpia.
 *
 * ¿Por qué no usar apiResponse.reply directamente en chat.js?
 * Porque la API podría devolver null, undefined, o un formato inesperado.
 * Esta función centraliza el manejo defensivo (L4 — defensive access con ?. y ??)
 *
 * @param {Object} apiResponse - Objeto JSON de la respuesta
 * @returns {string} Texto limpio del personaje, o fallback si hay error
 */
export function parseAIResponse(apiResponse) {
  // Optional chaining (?.) evita crash si apiResponse es null/undefined
  // Nullish coalescing (??) provee el fallback en lugar de || (que pisa "")
  if (!apiResponse || !apiResponse.reply) {
    return 'No pude procesar la respuesta del personaje.'
  }

  const text = apiResponse.reply

  // Verificar que es un string no vacío
  if (typeof text !== 'string' || text.trim().length === 0) {
    return 'No pude procesar la respuesta del personaje.'
  }

  return text.trim()
}

// ─────────────────────────────────────────────────────────────────────────────
// FORMATO DE TIEMPO (extra credit — timestamps en mensajes)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formatea un timestamp a hora legible (HH:MM).
 *
 * Usamos Intl.DateTimeFormat para localización correcta.
 * Muestra la hora en formato de 24 horas (Argentina/LATAM).
 *
 * @param {Date} date - Objeto Date a formatear
 * @returns {string} Hora en formato "HH:MM" o "--:--" si date es inválida
 */
export function formatTimestamp(date) {
  // Validar que el argumento es un Date válido
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '--:--'
  }

  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// GESTIÓN DE HISTORIAL (L6 — Integración con AI API)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Recorta el historial de mensajes a los últimos N turnos.
 *
 * ¿Por qué recortar el historial? (L6 — Tokens y Rate Limiting)
 * Cada mensaje en el historial suma input tokens a la petición.
 * Más tokens = mayor costo + mayor riesgo de rate limiting (429).
 * Recortar a los últimos N mensajes mantiene contexto útil sin inflarlo.
 *
 * @param {Array} messages - Array de mensajes { role, content }
 * @param {number} maxMessages - Máximo de mensajes a conservar (default: 20)
 * @returns {Array} Últimos maxMessages mensajes del historial
 */
export function truncateHistory(messages, maxMessages = 20) {
  if (!Array.isArray(messages)) return []
  return messages.slice(-maxMessages)
}

/**
 * Construye el payload de mensajes para enviar a la Serverless Function.
 *
 * La API de Gemini necesita el historial completo en cada petición
 * porque NO tiene memoria entre requests (L6 — Historial de conversación).
 * Sin el historial, el personaje respondería sin recordar lo que habló antes.
 *
 * IMPORTANTE: el system prompt va separado del array messages[] (L6).
 * En Anthropic/Gemini, el role "system" no va dentro del array messages.
 *
 * @param {Array}  history      - Historial de mensajes de la sesión
 * @param {number} maxMessages  - Limite de mensajes a incluir
 * @returns {Array} Array formateado para la API
 */
export function buildMessagesPayload(history, maxMessages = 20) {
  if (!Array.isArray(history)) return []

  const trimmed = truncateHistory(history, maxMessages)

  // Filtrar y asegurar que todos los mensajes tienen role y content válidos
  return trimmed.filter(
    (msg) =>
      msg &&
      (msg.role === 'user' || msg.role === 'model') &&
      typeof msg.content === 'string' &&
      msg.content.trim().length > 0
  )
}

/**
 * Capitaliza la primera letra de un string.
 * Función de utilidad para asegurar que las respuestas empiecen con mayúscula.
 *
 * @param {string} text
 * @returns {string}
 */
export function capitalize(text) {
  if (!text || text.length === 0) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}
