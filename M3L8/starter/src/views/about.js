export function renderAbout() {
  const $app = document.querySelector("#app");
  $app.className = "view-about";

  $app.innerHTML = `
    <div class="about">
      <h1 class="about__title">Acerca de M3L8</h1>
      <p class="about__desc">
        Esta clase parte del chat serverless de M3L7 y agrega testing unitario.
        El foco esta en historial, payload, adaptadores y fetch mockeado con Vitest.
      </p>
      <div class="about__features">
        <div class="about__feature">🧪 <span>Vitest + describe/it/expect</span></div>
        <div class="about__feature">🔁 <span>Tests de funciones puras</span></div>
        <div class="about__feature">🔌 <span>Fetch mockeado con vi.fn()</span></div>
        <div class="about__feature">🧠 <span>Historial preservado hacia Gemini</span></div>
      </div>
      <a href="/" class="about__back">← Volver al inicio</a>
    </div>
  `;
}
