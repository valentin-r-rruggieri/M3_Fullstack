export function renderChat() {
  const app = document.querySelector("#app");

  app.innerHTML = `
    <div class="view">
      <h1 class="view__title">💬 Chat</h1>
      <p class="view__subtitle">Interfaz de chat (demo estática)</p>

      <div class="chat-window">
        <div class="chat-messages">
          <div class="message message--bot">¡Hola! Soy tu asistente 👋</div>
          <div class="message message--user">Hola, ¿cómo funciona este router?</div>
          <div class="message message--bot">
            Usamos History API con pushState para cambiar la URL sin recargar 🚀
          </div>
          <div class="message message--user">¿Y el botón Back?</div>
          <div class="message message--bot">
            El evento popstate escucha cuando el usuario navega en el historial
            y vuelve a llamar a router() ✅
          </div>
        </div>

        <div class="chat-input-row">
          <input class="chat-input" placeholder="Escribe un mensaje..." disabled>
          <button class="chat-send" disabled>Enviar</button>
        </div>
      </div>

      <p style="font-size:0.85rem;color:#64748b;margin-top:0.75rem">
        * Input deshabilitado — integración real viene en próximas clases
      </p>
      <p style="margin-top:1rem"><a href="/" class="link">← Volver a Home</a></p>
    </div>
  `;
}
