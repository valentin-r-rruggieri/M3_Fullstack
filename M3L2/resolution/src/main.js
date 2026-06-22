// 1. Imports
// Importamos el router y la configuracion de navegacion en un unico punto
// de entrada para que el orden de inicializacion sea claro.
import { router } from "./router.js";
import { setupLinkInterception } from "./navigation.js";

// 2. Back/Forward: popstate se dispara cuando el usuario
//    navega en el historial. pushState NO lo dispara.
window.addEventListener("popstate", router);

// 3. Interceptar clicks en links internos.
// Esto debe registrarse antes del render inicial para que cualquier vista
// renderizada despues ya quede cubierta por la delegacion de eventos.
setupLinkInterception();

// 4. Render inicial: segun la URL actual al cargar la app.
//    Si alguien abre /chat directamente, debe ver Chat, no Home.
router();
