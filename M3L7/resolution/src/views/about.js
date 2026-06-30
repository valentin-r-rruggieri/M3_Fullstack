export function renderAbout() {
  const $app = document.querySelector("#app");
  $app.className = "view-about";

  $app.innerHTML = `
    <div class="about">
      <h1 class="about__title">Acerca de este proyecto</h1>
      <p class="about__desc">
        Chat AI Secure Proxy es la continuación del engine de M3L6.
        El objetivo de M3L7 es mover la conexión real con Gemini a una
        Serverless Function para proteger la API key.
      </p>
      <div class="about__features">
        <div class="about__feature">🔧 <span>Vanilla JS + ES Modules</span></div>
        <div class="about__feature">🔐 <span>API key protegida en backend</span></div>
        <div class="about__feature">🎭 <span>3 personajes con personalidad única</span></div>
        <div class="about__feature">⚡ <span>Vercel Serverless Function en /api/chat</span></div>
      </div>
      <a href="/" class="about__back">← Volver al inicio</a>
    </div>
  `;
}
