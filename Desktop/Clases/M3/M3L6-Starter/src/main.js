// ============================================================
// STARTER — Anti-patrón: chat sin engine robusto
// ============================================================
// Este chat "funciona" con el mock, pero tiene 5 problemas:
//
//   1. System prompt dentro de messages[] (error de OpenAI pattern)
//      → Anthropic devolvería HTTP 400 Bad Request.
//
//   2. No mantiene historial real
//      → el modelo responde sin contexto de la conversación.
//
//   3. raw.content accedido como si fuera string
//      → la API real devuelve content[] como array de bloques.
//
//   4. Sin debounce ni isLoading
//      → el usuario puede disparar múltiples requests.
//
//   5. Sin manejo de 429
//      → no hay retry-after ni countdown visible.
//
// Tu tarea: reemplazar este main.js usando los módulos del engine.
// ============================================================

import { callAI } from "./engine/mockApi.js";
import {
  lockUI,
  unlockUI,
  showTyping,
  hideTyping,
  appendMessage,
  showStatus,
  updateCharacterUI,
} from "./ui/render.js";
import { getCharacter } from "./engine/payload.js";

const currentCharacter = getCharacter("science");
updateCharacterUI(currentCharacter);

// ❌ Anti-patrón activo:
document.querySelector("#composer-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const input = document.querySelector("#composer-input");
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  appendMessage("user", text);
  lockUI();
  showTyping();

  try {
    // ❌ Bug 1: system dentro de messages[].
    // Esto copia el patrón de OpenAI, pero NO cumple el contrato de Anthropic.
    const raw = await callAI({
      model: "claude-3-5-sonnet-latest",
      messages: [
        { role: "system", content: currentCharacter.system }, // ← 400 en API real
        { role: "user", content: text },                       // ← sin historial
      ],
      max_tokens: 150,
    });

    hideTyping();

    // ❌ Bug 2: raw.content no es string, es array de bloques.
    // El mock lo deja pasar para que podamos ver el síntoma sin romper la app.
    const aiText = raw?.content ?? "";
    appendMessage("assistant", aiText);

    // ❌ Bug 3: sin historial → el modelo no recuerda turnos anteriores.
    // ❌ Bug 4: sin debounce/isLoading real → doble submit posible.
    // ❌ Bug 5: catch genérico → 429 no tiene retry-after ni countdown.
    showStatus("hidden");
  } catch (err) {
    hideTyping();
    showStatus("error", "Error desconocido. En la solución vamos a manejar 429.");
    console.error("[Starter anti-pattern error]", err);
  } finally {
    unlockUI();
  }
});

// ============================================================
// TODO 1: Importar appendUserMessage, appendAssistantMessage,
//         getTrimmedHistory, resetHistory de ./engine/history.js
//
// TODO 2: Importar buildPayload, isValidPayload de ./engine/payload.js
//
// TODO 3: Importar normalizeAIResponse, extractUsage
//         de ./engine/normalizer.js
//
// TODO 4: Declarar estado:
//         let chatHistory = []
//         let currentCharacter = getCharacter("science")
//         let isLoading = false
//
// TODO 5: Implementar debounce(fn, delay)
//         con timer, clearTimeout y setTimeout
//
// TODO 6: Reescribir sendMessage(text) con el pipeline completo:
//         appendUserMessage → getTrimmedHistory → buildPayload
//         → callAI → normalizeAIResponse → appendAssistantMessage
//         → appendMessage
//
// TODO 7: Agregar debounce + isLoading + lockUI/unlockUI
//
// TODO 8: Manejar 429:
//         leer err.retryAfterSeconds, mostrar countdown,
//         esperar y reintentar UNA sola vez
//
// TODO 9: Conectar selector de personaje:
//         getCharacter → resetHistory → clearMessages → updateCharacterUI
//
// TODO 10: Conectar botón de reset:
//          resetHistory → clearMessages
// ============================================================
