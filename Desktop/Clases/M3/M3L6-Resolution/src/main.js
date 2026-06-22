/*
 * main.js — Coordinador del chat engine
 *
 * Pipeline:
 *   submit del usuario
 *     → appendUserMessage()
 *     → getTrimmedHistory()
 *     → buildPayload()
 *     → callAI()
 *     → normalizeAIResponse()
 *     → appendAssistantMessage()
 *     → appendMessage()
 *
 * Defensa contra 429:
 *   1. debounce: agrupa submits rápidos.
 *   2. isLoading: bloquea mientras hay request en vuelo.
 *   3. retry-after: espera y reintenta una sola vez.
 */

import { appendUserMessage, appendAssistantMessage, getTrimmedHistory, resetHistory } from "./engine/history.js";
import { buildPayload, isValidPayload, getCharacter } from "./engine/payload.js";
import { callAI } from "./engine/mockApi.js";
import { normalizeAIResponse, extractUsage } from "./engine/normalizer.js";
import {
  lockUI,
  unlockUI,
  showTyping,
  hideTyping,
  appendMessage,
  showStatus,
  updateCharacterUI,
  clearMessages,
} from "./ui/render.js";

let chatHistory = [];
let currentCharacter = getCharacter("science");
let isLoading = false;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/*
 * debounce(fn, delay)
 * Agrupa envíos rápidos. isLoading bloquea durante el request;
 * debounce actúa antes, cuando todavía no arrancó.
 */
function debounce(fn, delay) {
  let timer = null;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

async function retryOnceAfter429(error, payload) {
  const seconds = error.retryAfterSeconds ?? 5;

  for (let i = seconds; i > 0; i -= 1) {
    showStatus("retrying", `⏳ Rate limit. Reintentando en ${i}s...`);
    await wait(1000);
  }

  showTyping();
  showStatus("loading", "Reintentando...");

  const raw = await callAI(payload);
  hideTyping();

  const { text: aiText, truncated } = normalizeAIResponse(raw);
  const { inputTokens, outputTokens } = extractUsage(raw);
  console.log(`[Retry tokens] input: ${inputTokens}, output: ${outputTokens}`);

  chatHistory = appendAssistantMessage(chatHistory, aiText);
  appendMessage("assistant", aiText || "No recibí texto en la respuesta.", truncated ? "⚠️ respuesta truncada" : "");
  showStatus("hidden");
}

/*
 * sendMessage(text)
 * Orquesta el envío completo y mantiene main.js como coordinador, no como
 * módulo de fetch, transform o render.
 */
async function sendMessage(text) {
  if (isLoading) return;

  const trimmed = text.trim();
  if (!trimmed) return;

  document.querySelector("#composer-input").value = "";

  isLoading = true;
  lockUI();

  chatHistory = appendUserMessage(chatHistory, trimmed);
  appendMessage("user", trimmed);

  const trimmedHistory = getTrimmedHistory(chatHistory, 10);
  const payload = buildPayload(currentCharacter, trimmedHistory);
  console.log("[Payload válido]", isValidPayload(payload), payload);

  showTyping();
  showStatus("loading", "Pensando...");

  try {
    const raw = await callAI(payload);
    hideTyping();

    const { text: aiText, truncated } = normalizeAIResponse(raw);
    const { inputTokens, outputTokens } = extractUsage(raw);
    console.log(`[Tokens] input: ${inputTokens}, output: ${outputTokens}`);
    if (truncated) console.warn("[stop_reason: max_tokens] Respuesta truncada");

    chatHistory = appendAssistantMessage(chatHistory, aiText);
    appendMessage("assistant", aiText || "No recibí texto en la respuesta.", truncated ? "⚠️ respuesta truncada" : "");
    showStatus("hidden");
  } catch (err) {
    hideTyping();

    if (err.status === 429) {
      console.warn("[sendMessage 429]", err);

      try {
        await retryOnceAfter429(err, payload);
      } catch (retryErr) {
        hideTyping();
        showStatus("error", "❌ Error al reintentar. Intentá de nuevo más tarde.");
        console.error("[retry failed]", retryErr);
      }
    } else {
      console.error("[sendMessage error]", err);
      showStatus("error", "❌ Error de conexión. Verificá tu red.");
    }
  } finally {
    isLoading = false;
    unlockUI();
  }
}

const debouncedSend = debounce(() => {
  const text = document.querySelector("#composer-input").value;
  sendMessage(text);
}, 300);

document.querySelector("#composer-form").addEventListener("submit", (event) => {
  event.preventDefault();
  debouncedSend();
});

document.querySelector("#character-select").addEventListener("change", (event) => {
  currentCharacter = getCharacter(event.target.value);
  chatHistory = resetHistory();
  clearMessages();
  updateCharacterUI(currentCharacter);
  console.log("[Personaje cambiado]", currentCharacter.name, "Historial reseteado");
});

document.querySelector("#reset-btn").addEventListener("click", () => {
  chatHistory = resetHistory();
  clearMessages();
  console.log("[Historial reseteado]");
});

updateCharacterUI(currentCharacter);
