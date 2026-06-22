/**
 * chat.js — Lógica del chat con Sherlock Holmes
 *
 * Responsabilidades de este módulo:
 *   1. Mantener el historial de conversación en memoria (y localStorage)
 *   2. Enviar mensajes a la Serverless Function (/api/functions)
 *   3. Renderizar burbujas de mensajes en el DOM
 *   4. Manejar estados de UI: loading, error, normal
 *   5. Auto-scroll al último mensaje
 *
 * El flujo completo de un mensaje (L6 — Integración con AI API):
 *   Usuario escribe → isValidMessage() → appendUserMessage() → sendToAI()
 *   → Serverless Function → Gemini → parseAIResponse() → appendAIMessage()
 *
 * SEGURIDAD (L7):
 *   Esta función NUNCA llama a Gemini directamente.
 *   Siempre llama a /api/functions que es la serverless function de Vercel.
 *   La API key vive solo en el servidor (process.env).
 */

import { isValidMessage, parseAIResponse, formatTimestamp, buildMessagesPayload } from './utils.js'

/**
 * El system prompt de Sherlock Holmes está definido en api/functions.js
 * (server-side). No se envía desde el frontend por seguridad.
 */

// ─────────────────────────────────────────────────────────────────────────────
// ESTADO INTERNO DEL CHAT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * conversationHistory: array de mensajes de la sesión actual.
 * Formato que espera Gemini:
 *   [
 *     { role: 'user',  content: '¿Quién eres?' },
 *     { role: 'model', content: 'Soy Sherlock Holmes...' },
 *     { role: 'user',  content: '¿Dónde vivís?' },
 *   ]
 *
 * CRÍTICO: enviamos el historial completo en CADA request (L6).
 * Gemini no recuerda conversaciones anteriores por sí solo.
 * Sin historial, el personaje pierde contexto entre mensajes.
 */
let conversationHistory = []

// Flag: evita que el usuario envíe múltiples mensajes mientras espera respuesta
let isWaiting = false

// Clave para localStorage (extra credit — persistencia)
const LS_KEY = 'sherlock-chat-history'

// ─────────────────────────────────────────────────────────────────────────────
// PERSISTENCIA CON LOCALSTORAGE (extra credit)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Guarda el historial de conversación en localStorage.
 * Así el historial persiste aunque el usuario recargue la página.
 */
export function saveHistoryToStorage() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(conversationHistory))
  } catch (e) {
    // localStorage puede fallar en modo privado o si está lleno
    console.warn('[chat] No se pudo guardar el historial en localStorage:', e.message)
  }
}

/**
 * Carga el historial guardado de localStorage.
 * Retorna el historial o [] si no hay nada guardado.
 */
export function loadHistoryFromStorage() {
  try {
    const stored = localStorage.getItem(LS_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.warn('[chat] Error al leer localStorage:', e.message)
    return []
  }
}

/**
 * Borra el historial de localStorage y reinicia la conversación.
 * Llama a renderChat() en app.js para re-renderizar la vista vacía.
 */
export function clearHistory() {
  conversationHistory = []
  try {
    localStorage.removeItem(LS_KEY)
  } catch (e) {
    // ignorar errores de localStorage
  }
}

/**
 * Retorna si hay historial guardado en localStorage (para el badge UI).
 */
export function hasStoredHistory() {
  try {
    return !!localStorage.getItem(LS_KEY)
  } catch {
    return false
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDERIZADO DE MENSAJES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Agrega un mensaje al área de mensajes del DOM.
 *
 * @param {'user'|'ai'} role    - Quién envía el mensaje
 * @param {string}      content - Texto del mensaje
 * @param {Date}        time    - Timestamp del mensaje (opcional)
 * @param {HTMLElement} container - Elemento #messages-area
 */
export function appendMessageToDOM(role, content, time, container) {
  // Ocultar el mensaje vacío inicial si existe
  const empty = container.querySelector('.messages-empty')
  if (empty) empty.style.display = 'none'

  const div = document.createElement('div')
  div.className = `message message--${role}`

  const author = role === 'user' ? 'Vos' : 'Sherlock Holmes'
  const timeStr = formatTimestamp(time || new Date())

  div.innerHTML = `
    <span class="message__author">${author}</span>
    <div class="message__bubble">${escapeHTML(content)}</div>
    <span class="message__time">${timeStr}</span>
  `

  container.appendChild(div)
  scrollToBottom(container)
}

/**
 * Muestra el indicador de "Sherlock está escribiendo..." animado.
 * Se usa mientras esperamos la respuesta de la API.
 *
 * @param {HTMLElement} container - El área de mensajes
 * @returns {HTMLElement} El elemento creado (para poder eliminarlo después)
 */
export function showTypingIndicator(container) {
  const div = document.createElement('div')
  div.className = 'message message--ai'
  div.id = 'typing-indicator'
  div.innerHTML = `
    <span class="message__author">Sherlock Holmes</span>
    <div class="typing-indicator">
      <span></span><span></span><span></span>
    </div>
  `
  container.appendChild(div)
  scrollToBottom(container)
  return div
}

/**
 * Elimina el indicador de "escribiendo...".
 */
export function hideTypingIndicator() {
  const indicator = document.getElementById('typing-indicator')
  if (indicator) indicator.remove()
}

/**
 * Scroll automático al último mensaje (requisito funcional).
 * Después de agregar cada mensaje, el área scrollea hacia abajo.
 *
 * @param {HTMLElement} container
 */
export function scrollToBottom(container) {
  if (container) {
    container.scrollTop = container.scrollHeight
  }
}

/**
 * Muestra un mensaje de error inline en el chat.
 *
 * @param {string}      errorText - Descripción del error
 * @param {HTMLElement} container - El área de mensajes
 */
export function showErrorMessage(errorText, container) {
  hideTypingIndicator()
  const div = document.createElement('div')
  div.className = 'error-message'
  div.textContent = `⚠️ ${errorText}`
  container.appendChild(div)
  scrollToBottom(container)
}

// ─────────────────────────────────────────────────────────────────────────────
// COMUNICACIÓN CON LA SERVERLESS FUNCTION (L7 — API Keys y Vercel)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Envía el historial de mensajes a la Serverless Function y retorna la respuesta.
 *
 * FLUJO SEGURO (L7):
 *   frontend → fetch('/api/functions') → Serverless Function → Gemini
 *   La API key vive en process.env (servidor), NUNCA en el frontend.
 *
 * Se usa async/await con try/catch para manejo de errores (L3 — Fetch API).
 * fetch() NO rechaza la promesa ante errores HTTP (404, 500) —
 * hay que verificar response.ok manualmente.
 *
 * @param {Array} messages - Historial de mensajes del usuario/modelo
 * @returns {Object} { reply: string } o lanza Error
 */
export async function sendToAI(messages) {
  // response: primera espera — headers + status (no el body todavía)
  const response = await fetch('/api/functions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // El body lleva el historial de mensajes y el system prompt
    body: JSON.stringify({
      messages: buildMessagesPayload(messages),
    }),
  })

  // data: segunda espera — deserializar el body JSON (L3 — doble await)
  const data = await response.json()

  // Verificar errores HTTP (L3 — gotcha de fetch + response.ok)
  if (!response.ok) {
    throw new Error(data.error || `Error HTTP ${response.status}`)
  }

  return data
}

// ─────────────────────────────────────────────────────────────────────────────
// HANDLER PRINCIPAL DE ENVÍO DE MENSAJE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Maneja el ciclo completo de envío y recepción de un mensaje.
 * Esta función es llamada desde el event listener del botón en app.js.
 *
 * Pipeline completo:
 *   1. Validar el mensaje (isValidMessage)
 *   2. Agregar al DOM y al historial
 *   3. Mostrar typing indicator
 *   4. Llamar a sendToAI()
 *   5. Parsear respuesta (parseAIResponse)
 *   6. Agregar respuesta al DOM y al historial
 *   7. Guardar en localStorage
 *   8. Habilitar el input de nuevo
 *
 * @param {string}      text        - Texto del mensaje del usuario
 * @param {HTMLElement} messagesEl  - Elemento del área de mensajes
 * @param {HTMLElement} inputEl     - El textarea/input del composer
 * @param {HTMLElement} sendBtnEl   - El botón de enviar
 */
export async function handleSendMessage(text, messagesEl, inputEl, sendBtnEl) {
  // PASO 1: Validación (L8 — isValidMessage desde utils.js)
  if (!isValidMessage(text) || isWaiting) return

  // Limpiar input inmediatamente (UX: el usuario ve que "salió el mensaje")
  inputEl.value = ''
  inputEl.style.height = 'auto' // resetear altura del textarea

  // PASO 2: Bloquear UI y agregar mensaje del usuario
  isWaiting = true
  sendBtnEl.disabled = true
  inputEl.disabled = true

  const userTime = new Date()
  conversationHistory.push({ role: 'user', content: text.trim() })
  appendMessageToDOM('user', text.trim(), userTime, messagesEl)

  // PASO 3: Mostrar typing indicator mientras espera la AI
  showTypingIndicator(messagesEl)

  try {
    // PASO 4: Llamar a la Serverless Function (L7)
    const rawResponse = await sendToAI(conversationHistory)

    // PASO 5: Parsear respuesta (parseAIResponse desde utils.js)
    const aiText = parseAIResponse(rawResponse)

    // PASO 6: Agregar respuesta al historial y al DOM
    hideTypingIndicator()
    conversationHistory.push({ role: 'model', content: aiText })
    appendMessageToDOM('ai', aiText, new Date(), messagesEl)

    // PASO 7: Persistir en localStorage (extra credit)
    saveHistoryToStorage()

  } catch (error) {
    // Manejo de errores: no crashear la app, mostrar mensaje amigable (L3)
    console.error('[chat] Error al enviar mensaje:', error.message)
    showErrorMessage(
      error.message.includes('429')
        ? 'Demasiadas peticiones. Esperá unos segundos e intentá de nuevo.'
        : 'No se pudo contactar al detective. Verificá tu conexión.',
      messagesEl
    )
    // Si hubo error, sacamos el mensaje del usuario del historial
    // para que el usuario pueda volver a intentarlo
    conversationHistory.pop()

  } finally {
    // PASO 8: Siempre desbloquear la UI, incluso si hubo error
    isWaiting = false
    sendBtnEl.disabled = false
    inputEl.disabled = false
    inputEl.focus()
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// INICIALIZACIÓN DEL CHAT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Inicializa el chat: carga historial guardado y re-renderiza los mensajes.
 * Llamada desde renderChat() en app.js cuando el usuario navega a /chat.
 *
 * @param {HTMLElement} messagesEl - El área de mensajes del DOM
 * @returns {boolean} true si había historial previo
 */
export function initChat(messagesEl) {
  // Cargar historial de localStorage (extra credit)
  const stored = loadHistoryFromStorage()

  if (stored.length > 0) {
    conversationHistory = stored

    // Re-renderizar todos los mensajes guardados
    stored.forEach((msg) => {
      const role = msg.role === 'user' ? 'user' : 'ai'
      appendMessageToDOM(role, msg.content, new Date(), messagesEl)
    })

    return true // había historial
  }

  conversationHistory = []
  return false // chat nuevo
}

/**
 * Retorna el historial actual (para tests o debug).
 */
export function getHistory() {
  return [...conversationHistory]
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER PRIVADO
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Escapa caracteres HTML especiales para prevenir XSS.
 * CRÍTICO: nunca insertar texto del usuario directamente como innerHTML.
 *
 * @param {string} text
 * @returns {string} texto con caracteres especiales escapados
 */
function escapeHTML(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
