// ============================================================
// STARTER — Chat con anti-patrón (bugs intencionales)
// ============================================================
// Este chat "funciona" con el mock, pero tiene 3 problemas:
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
// Tu tarea: reemplazar este renderChat() usando los módulos del engine.
// ============================================================

import { getCharacter } from "../engine/payload.js";
import { callAI } from "../engine/mockApi.js";
import {
  lockUI,
  unlockUI,
  showTyping,
  hideTyping,
  appendMessage,
  showStatus,
} from "../ui/render.js";

export function renderChat(characterKey) {
  const key = characterKey || "science";
  const currentCharacter = getCharacter(key);

  const $app = document.querySelector("#app");
  $app.className = "view-chat";

  $app.innerHTML = `
    <div class="chat-app">
      <header class="chat-header">
        <a href="/" class="chat-header__back">← Volver</a>
        <div class="chat-header__info">
          <span class="chat-header__avatar">${currentCharacter.avatar}</span>
          <h2 class="chat-header__name">${currentCharacter.name}</h2>
        </div>
        <div class="chat-header__actions">
          <span class="counter-badge" id="counter-badge">💬 #0</span>
          <button id="reset-btn" class="chat-header__reset" title="Nueva conversación">↺</button>
        </div>
      </header>

      <main class="chat-messages" id="messages" aria-live="polite" aria-label="Mensajes del chat">
        <div class="messages-empty" id="messages-empty">
          <div class="messages-empty__avatar">${currentCharacter.avatar}</div>
          <p>👋 ¡Hola! Soy el <strong>${currentCharacter.name}</strong>.<br>Preguntame lo que quieras.</p>
        </div>
      </main>

      <div id="status-panel" class="status-panel hidden" aria-live="assertive">
        <span id="status-text" class="status-text"></span>
      </div>

      <form class="composer" id="composer-form" autocomplete="off" novalidate>
        <input class="composer__input" id="composer-input" type="text"
          placeholder="Escribí tu mensaje..." aria-label="Mensaje" maxlength="500">
        <button class="composer__btn" id="send-btn" type="submit" aria-label="Enviar">↑</button>
      </form>
    </div>
  `;

  const themeKey = getThemeKey(currentCharacter.name);
  $app.classList.add(`theme-${themeKey}`);

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
      // ❌ Bug 1: system dentro de messages[] (patrón OpenAI, no Anthropic)
      // ❌ Bug 2: sin historial
      const raw = await callAI({
        model: "claude-3-5-sonnet-latest",
        messages: [
          { role: "system", content: currentCharacter.system },
          { role: "user", content: text },
        ],
        max_tokens: 150,
      });

      hideTyping();

      // ❌ Bug 3: raw.content no es string, es array de bloques
      const aiText = raw?.content ?? "";
      appendMessage("assistant", aiText);

      showStatus("hidden");
    } catch (err) {
      hideTyping();
      showStatus("error", "Error de conexión. Revisá la consola.");
      console.error("[Starter error]", err);
    } finally {
      unlockUI();
    }
  });

  document.querySelector("#reset-btn").addEventListener("click", () => {
    document.querySelector("#messages").querySelectorAll(".message").forEach((el) => el.remove());
    document.querySelector("#messages-empty").classList.remove("hidden");
    showStatus("hidden");
    const counter = document.querySelector("#counter-badge");
    if (counter) counter.textContent = "💬 #0";
    console.log("[Chat reseteado]");
  });
}

function getThemeKey(name) {
  if (name.includes("Chef")) return "chef";
  if (name.includes("Detective")) return "detective";
  return "science";
}
