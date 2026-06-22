// ============================================================
// navigation.js — Intercepción selectiva de links internos
// ============================================================
// En vez de agregar un listener a cada <a>, usamos delegación:
// un solo listener en document que filtra qué interceptar.

// TODO: Descomentar este import cuando implementes navigateTo(path)
// import { navigateTo } from "./router.js";

// TODO: Implementar setupLinkInterception()
// Debe registrar UN listener de click en document que:
//
//   1. Encuentre el <a> más cercano con event.target.closest("a")
//   2. Salga si no hay link o no hay href
//   3. NO intercepte si: metaKey || ctrlKey || shiftKey || altKey
//   4. NO intercepte si: link.target === "_blank"
//   5. NO intercepte si: link.origin !== window.location.origin
//   6. NO intercepte si: href empieza con "#"
//   7. NO intercepte si: href empieza con "mailto:" o "tel:"
//   8. NO intercepte si: href NO empieza con "/"
//   9. Si pasa todo: preventDefault() y navigateTo(href)
//
// export function setupLinkInterception() { ... }
