/*
 * render.js — Capa de render del chat
 *
 * Responsabilidad única: recibir datos y construir HTML.
 * No hace fetch, no modifica el historial y no conoce el payload.
 */

const $messages = document.querySelector("#messages");
const $empty = document.querySelector("#messages-empty");
const $statusPanel = document.querySelector("#status-panel");
const $statusText = document.querySelector("#status-text");
const $sendBtn = document.querySelector("#send-btn");
const $input = document.querySelector("#composer-input");
const $headerName = document.querySelector(".header-name");
const $statusDot = document.querySelector("#connection-status");
const $avatar = document.querySelector(".avatar");

/*
 * lockUI() / unlockUI()
 * Bloquean la UI mientras hay request en vuelo para evitar doble submit.
 */
export function lockUI() {
  $sendBtn.disabled = true;
  $input.disabled = true;
}

export function unlockUI() {
  $sendBtn.disabled = false;
  $input.disabled = false;
  $input.focus();
}

/*
 * showTyping() / hideTyping()
 * Muestran el indicador de typing mientras esperamos a la API.
 */
export function showTyping() {
  $empty.classList.add("hidden");
  hideTyping();

  const el = document.createElement("div");
  el.className = "message message--assistant";
  el.id = "typing-indicator";
  el.innerHTML = `
    <span class="message__author">${getCurrentCharacterName()}</span>
    <div class="typing-indicator">
      <span></span><span></span><span></span>
    </div>
  `;

  $messages.appendChild(el);
  scrollToBottom();
}

export function hideTyping() {
  document.querySelector("#typing-indicator")?.remove();
}

/*
 * appendMessage(role, text, meta)
 * Agrega una burbuja al panel de mensajes. Escapa HTML para que texto de usuario
 * nunca se interprete como markup.
 */
export function appendMessage(role, text, meta = "") {
  $empty.classList.add("hidden");

  const div = document.createElement("div");
  div.className = `message message--${role}`;
  div.innerHTML = `
    <span class="message__author">${role === "user" ? "Vos" : getCurrentCharacterName()}</span>
    <div class="message__bubble">${escapeHtml(String(text))}</div>
    ${meta ? `<span class="message__meta">${escapeHtml(meta)}</span>` : ""}
  `;

  $messages.appendChild(div);
  scrollToBottom();
}

/*
 * showStatus(type, text)
 * type: "loading" | "retrying" | "error" | "hidden"
 */
export function showStatus(type, text = "") {
  if (type === "hidden") {
    $statusPanel.classList.add("hidden");
    $statusPanel.className = "status-panel hidden";
    $statusText.textContent = "";
    $statusDot.className = "status-dot status--online";
    return;
  }

  $statusPanel.classList.remove("hidden");
  $statusText.textContent = text;

  if (type === "retrying") {
    $statusPanel.className = "status-panel status--retrying";
    $statusDot.className = "status-dot status--busy";
    return;
  }

  if (type === "error") {
    $statusPanel.className = "status-panel status--error-msg";
    $statusDot.className = "status-dot status--error";
    return;
  }

  $statusPanel.className = "status-panel";
  $statusDot.className = "status-dot status--busy";
}

/*
 * updateCharacterUI(character)
 * Actualiza el header y el empty state cuando cambia el personaje.
 */
export function updateCharacterUI(character) {
  $headerName.textContent = character.name;
  $avatar.textContent = character.avatar;
  $empty.innerHTML = `<p>${escapeHtml(character.avatar)} ¡Hola! Soy ${escapeHtml(character.name)}.<br>Preguntame lo que quieras.</p>`;
}

/*
 * clearMessages()
 * Limpia las burbujas, conserva el empty state y vuelve al estado online.
 */
export function clearMessages() {
  [...$messages.children].forEach((el) => {
    if (el.id !== "messages-empty") el.remove();
  });

  $empty.classList.remove("hidden");
  showStatus("hidden");
}

function scrollToBottom() {
  $messages.scrollTop = $messages.scrollHeight;
}

function getCurrentCharacterName() {
  return $headerName.textContent || "Asistente";
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
