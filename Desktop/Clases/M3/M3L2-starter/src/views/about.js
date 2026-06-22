export function renderAbout() {
  const app = document.querySelector("#app");

  app.innerHTML = `
    <div class="view">
      <h1 class="view__title">ℹ️ About</h1>
      <p class="view__subtitle">Sobre este proyecto</p>
      <p class="view__body">
        Esta demo educativa implementa un router SPA mínimo para entender cómo
        una aplicación puede cambiar de vista, actualizar la URL y respetar el
        historial del navegador sin depender de frameworks.
      </p>

      <ul class="feature-list">
        <li>Navegación sin recarga de página</li>
        <li>URLs compartibles y con deep linking</li>
        <li>Back y Forward nativos del navegador</li>
        <li>Vista 404 para rutas desconocidas</li>
        <li>Arquitectura modular por responsabilidad</li>
      </ul>

      <p><a href="/chat" class="link">Ver el Chat →</a></p>
    </div>
  `;
}
