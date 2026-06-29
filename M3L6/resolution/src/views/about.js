export function renderAbout() {
  const $app = document.querySelector("#app");
  $app.className = "view-about";

  $app.innerHTML = `
    <div class="about">
      <h1 class="about__title">Acerca de este proyecto</h1>
      <p class="about__desc">
        Chat AI Engine es un ejercicio práctico del Módulo 3 del curso.
        Construye el motor completo de un chat con AI: payload correcto,
        historial, normalización de respuestas y manejo de errores.
      </p>
      <div class="about__features">
        <div class="about__feature">🔧 <span>Vanilla JS + ES Modules</span></div>
        <div class="about__feature">🧪 <span>Mock API sin API key real</span></div>
        <div class="about__feature">🎭 <span>3 personajes con personalidad única</span></div>
        <div class="about__feature">🔄 <span>SPA con enrutamiento del lado cliente</span></div>
      </div>
      <a href="/" class="about__back">← Volver al inicio</a>
    </div>
  `;
}
