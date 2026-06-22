/*
 * ui.js — Capa de render
 *
 * Responsabilidad ÚNICA: recibir el estado y decidir qué mostrar.
 * NO hace fetch. NO transforma datos raw de API.
 * Solo pinta el DOM y traduce errores técnicos a mensajes humanos.
 */

const $loading = document.querySelector("#state-loading");
const $error = document.querySelector("#state-error");
const $success = document.querySelector("#state-success");
const $errMsg = document.querySelector("#error-message");
const $badge = document.querySelector("#connection-badge");

export function render(state) {
  [$loading, $error, $success].forEach((el) => el.classList.add("hidden"));

  if (state.status === "loading") {
    $loading.classList.remove("hidden");
    setBadge("loading", "Cargando...");
  } else if (state.status === "error") {
    $error.classList.remove("hidden");
    $errMsg.textContent = state.error;
    setBadge("error", "Error de conexión");
  } else if (state.status === "success") {
    $success.classList.remove("hidden");
    $success.innerHTML = state.data.map(buildMessage).join("");
    setBadge("success", "Conectado");

    const panel = document.querySelector("#messages");
    if (panel) panel.scrollTop = panel.scrollHeight;
  }
}

function setBadge(type, text) {
  $badge.className = "badge badge--" + type;
  $badge.textContent = text;
}

function buildMessage(post) {
  var isUser = post.id % 3 === 0;
  var userClass = isUser ? "message--user" : "message--bot";
  var author = isUser ? "Vos" : "Personaje #" + post.userId;
  return "<div class=\"message " + userClass + "\">"
    + "<p class=\"message__author\">" + author + "</p>"
    + "<p>" + post.title + "</p>"
    + "</div>";
}

export function getUserMessage(error) {
  if (!navigator.onLine) return "Sin conexión a internet.";
  if (error?.status === 404) return "Mensajes no encontrados (404). Verificá la URL.";
  if (error?.status >= 500) return "Error del servidor. Intentá más tarde.";
  return "Error inesperado: " + (error?.message ?? "Algo salió mal");
}
