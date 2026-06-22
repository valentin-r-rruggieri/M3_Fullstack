// ============================================================
// router.js — Núcleo del sistema de routing SPA
// ============================================================

import { renderHome } from "./views/home.js";
import { renderChat } from "./views/chat.js";
import { renderAbout } from "./views/about.js";
import { renderNotFound } from "./views/notFound.js";

// TODO 1: Crear la tabla de rutas
// Asocia cada pathname con su función de render
// const routes = { ... }

// TODO 2: Implementar router()
// Debe:
//   - Leer window.location.pathname
//   - Normalizar trailing slash (ej: "/chat/" → "/chat")
//   - Buscar el renderer en routes, o usar renderNotFound
//   - Llamar al renderer
//   - Llamar a updateActiveLink()
//   - Llamar a updateRouteBadge(path)
// export function router() { ... }

// TODO 3: Implementar navigateTo(path)
// Debe:
//   - Si ya estamos en ese path, no hacer nada
//   - history.pushState(null, "", path)
//   - Llamar router() manualmente (pushState NO dispara popstate)
// export function navigateTo(path) { ... }

// TODO 4: Implementar updateActiveLink()
// Debe recorrer todos los "nav a" y agregar/quitar clase "active"
// según si link.pathname === window.location.pathname
// function updateActiveLink() { ... }

// TODO 5: Implementar updateRouteBadge(path)
// Crea o actualiza un div.route-badge en el body mostrando la ruta activa
// Ayuda visual para debuggear durante la clase
// function updateRouteBadge(path) { ... }
