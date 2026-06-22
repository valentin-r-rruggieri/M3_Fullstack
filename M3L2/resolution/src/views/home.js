export function renderHome() {
  const app = document.querySelector("#app");

  app.innerHTML = `
    <div class="view">
      <h1 class="view__title">🏠 Home</h1>
      <p class="view__subtitle">Bienvenido a la SPA Demo</p>
      <p class="view__body">
        Este proyecto muestra cómo construir un router SPA pequeño con Vanilla JS,
        usando la History API para cambiar la URL sin recargar la página completa.
        La idea es entender el mecanismo base antes de usar un router de framework.
      </p>

      <p style="margin-top:1rem">
        <a href="/chat" class="link">Ir al Chat</a>
        y
        <a href="/about" class="link">Conocer el proyecto</a>
      </p>

      <div style="background:#f1f5f9;padding:1rem;border-radius:0.5rem;margin-top:1.5rem">
        <strong>¿Estás probando el router?</strong>
        <ul style="margin-top:0.5rem;padding-left:1.2rem">
          <li>Hacé click en los links del nav</li>
          <li>Usá Back y Forward del navegador</li>
          <li>Intentá escribir /xyz en la URL</li>
          <li>Ctrl+Click en un link → nueva pestaña</li>
        </ul>
      </div>
    </div>
  `;
}
