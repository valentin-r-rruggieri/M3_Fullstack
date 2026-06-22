// ============================================================
// STARTER — Anti-patrón: cambio de vista sin History API
// ============================================================
// La app "funciona" pero tiene 3 problemas:
//   1. La URL nunca cambia
//   2. Back/Forward del navegador no hace nada útil
//   3. Abrir /chat directamente muestra Home (o nada)
//
// Tu tarea: transformar esto en una SPA real con History API
// ============================================================

import { renderHome } from "./views/home.js";
import { renderChat } from "./views/chat.js";
import { renderAbout } from "./views/about.js";

// Anti-patrón: función global para los onclick del HTML
// ⚠️ Problema: solo cambia el DOM, la URL nunca cambia
window.showView = function (view) {
  if (view === "home") renderHome();
  if (view === "chat") renderChat();
  if (view === "about") renderAbout();
};

// Render inicial hardcodeado — no lee la URL
// ⚠️ Problema: si alguien abre /chat directamente, igual ve Home
renderHome();

// ============================================================
// TODO 1: Importar router y setupLinkInterception
// TODO 2: Registrar listener de popstate → llamar router()
// TODO 3: Llamar setupLinkInterception()
// TODO 4: Reemplazar renderHome() por router() como render inicial
// ============================================================
