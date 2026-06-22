# SPA Router con History API — Ejercicio Práctico M3L2

## 1. Título y descripción

![Vanilla JS](https://img.shields.io/badge/Vanilla%20JS-ES%20Modules-f7df1e?logo=javascript&logoColor=111)
![No framework](https://img.shields.io/badge/No%20framework-100%25%20browser-0f172a)
![ES Modules](https://img.shields.io/badge/ES%20Modules-type%3Dmodule-1d4ed8)

Este ejercicio construye una SPA pequeña usando solamente HTML, CSS y JavaScript moderno.
El objetivo es entender cómo funciona un router del lado del cliente sin depender de React Router, Vue Router ni librerías similares.
La demo muestra navegación sin recarga, URLs compartibles, soporte para Back/Forward y una vista 404 interna.
El foco conceptual está en `pushState`, `popstate`, `router()`, `navigateTo()` e intercepción de links.

---

## 2. ¿Qué problema resuelve?

En muchas primeras apps de JavaScript se cambia lo que se ve en pantalla manipulando el DOM, pero sin actualizar la URL.
Eso parece funcionar al principio, pero rompe comportamientos básicos del navegador.

ANTES (DOM-only, roto):

```js
homeBtn.onclick = () => mostrarSeccion("home"); // URL nunca cambia
```

Consecuencias:

- URL siempre la misma → no se puede compartir el link.
- Back/Forward del navegador no funciona dentro de la app.
- Recargar en `/chat` → volvés a Home.

DESPUÉS (con History API):

```js
navigateTo("/chat"); // pushState + router()
```

Resultado: la URL cambia, el historial funciona y los deep links son posibles.

El navegador ya tiene herramientas para historial y URLs. La SPA no debería ignorarlas: debería integrarse con ellas.

---

## 3. Conceptos clave (con ejemplos del proyecto)

### pushState — ¿qué hace y qué NO hace?

`history.pushState()` agrega una entrada al historial del navegador y cambia la URL visible sin recargar el documento.

Recibe 3 argumentos:

```js
history.pushState(state, title, url);
```

- `state`: datos asociados a la entrada del historial. En este ejercicio usamos `null` porque el estado se deriva de la URL.
- `title`: históricamente pensado para el título de la entrada. Los navegadores modernos casi no lo usan, por eso pasamos `""`.
- `url`: la nueva URL que queremos mostrar, por ejemplo `"/chat"`.

Lo importante:

- SÍ cambia la URL.
- SÍ agrega una entrada al historial.
- NO recarga la página.
- NO renderiza ninguna vista.
- NO dispara el evento `popstate`.

Ejemplo del proyecto, en `src/router.js`:

```js
export function navigateTo(path) {
  if (window.location.pathname === path) return;

  history.pushState(null, "", path);
  router();
}
```

La línea `history.pushState(null, "", path)` cambia la URL.
La línea `router()` actualiza la vista.
Son dos responsabilidades diferentes y las dos son necesarias.

### popstate — cuándo se dispara

`popstate` es el evento que el navegador dispara cuando el usuario se mueve por el historial.

Se dispara con:

- Back del navegador.
- Forward del navegador.
- `history.back()`.
- `history.forward()`.

NO se dispara con:

- `history.pushState()`.
- `history.replaceState()`.

Ejemplo del proyecto, en `src/main.js`:

```js
window.addEventListener("popstate", router);
```

Diagrama mental:

```text
Click en link          → navigateTo() → pushState + router() manual
Back/Forward usuario   → popstate     → router() automático
```

Ese es el corazón del ejercicio: cuando la navegación la inicia nuestra app, llamamos `router()` nosotros. Cuando la navegación la inicia el historial del navegador, escuchamos `popstate`.

### router() — el cerebro del sistema

Código completo del proyecto:

```js
export function router() {
  const raw = window.location.pathname;
  const path = normalizePath(raw);
  const render = routes[path] || renderNotFound;

  render();
  updateActiveLink();
  updateRouteBadge(path);
}
```

Línea por línea:

- `const raw = window.location.pathname;` lee la ruta actual de la URL. Si la URL es `http://localhost:3000/chat`, el pathname es `"/chat"`.
- `const path = normalizePath(raw);` normaliza un trailing slash final. Así `/chat/` se interpreta como `/chat`.
- `const render = routes[path] || renderNotFound;` busca una función render en la tabla de rutas. Si no existe, usa la vista 404.
- `render();` ejecuta la función de vista que escribe en `#app`.
- `updateActiveLink();` marca el link activo del navbar.
- `updateRouteBadge(path);` actualiza el indicador visual de debug.

Por qué normalizamos el trailing slash:

```text
/chat  → ruta esperada
/chat/ → misma intención del usuario, pero string distinto
```

Sin normalización, `/chat/` no coincidiría con la clave `"/chat"` de la tabla de rutas y caería en 404.

### navigateTo() — navegación programática

Código completo:

```js
export function navigateTo(path) {
  if (window.location.pathname === path) return;

  history.pushState(null, "", path);
  router();
}
```

`navigateTo()` existe para centralizar la navegación interna de la SPA.
Cada vez que la app quiera moverse a otra ruta, debería hacerlo con esta función y no llamando `pushState()` suelto por cualquier archivo.

Por qué verifica `pathname === path` antes de `pushState`:

- Evita duplicar entradas iguales en el historial.
- Evita que el usuario tenga que apretar Back varias veces para salir de la misma vista.
- Mantiene el historial más predecible.

Por qué llama `router()` manualmente:

- `pushState()` no dispara `popstate`.
- Cambiar la URL no cambia el DOM.
- Si no llamamos `router()`, la URL puede decir `/chat` mientras la pantalla sigue mostrando Home.

### Intercepción de links — delegación de eventos

En vez de agregar un listener a cada `<a>`, el proyecto registra un único listener en `document`.
Ese patrón se llama delegación de eventos.

Ventajas:

- Menos listeners.
- Funciona también con links que aparezcan después por `innerHTML`.
- Mantiene la lógica de navegación en un solo archivo.

La clave es esta línea:

```js
const link = event.target.closest("a");
```

`event.target` es el elemento exacto donde ocurrió el click.
`closest("a")` sube por el árbol del DOM hasta encontrar el `<a>` más cercano.
Así el listener funciona aunque el click sea sobre un `<span>`, un ícono o cualquier elemento dentro del link.

Casos excluidos:

| Caso | Condición | Por qué excluir |
|------|-----------|-----------------|
| Ctrl+Click / Cmd+Click | `metaKey` o `ctrlKey` | El usuario quiere nueva pestaña |
| Shift/Alt+Click | `shiftKey` o `altKey` | El usuario está pidiendo un comportamiento especial del navegador |
| `target="_blank"` | `link.target === "_blank"` | Diseñado para otra pestaña |
| Link externo | `link.origin !== location.origin` | No es ruta interna |
| Ancla | `href.startsWith("#")` | Solo scroll, no navegación |
| `mailto:` / `tel:` | `href.startsWith("mailto:")` o `href.startsWith("tel:")` | Protocolo especial |

El orden importa: primero se evalúan los casos que NO se interceptan; recién después se llama `event.preventDefault()`.

---

## 4. Estructura del proyecto y responsabilidad de cada archivo

```text
project/
├── index.html
├── styles.css
├── .gitignore
├── README.md
├── GUION.md
└── src/
    ├── main.js
    ├── router.js
    ├── navigation.js
    └── views/
        ├── home.js
        ├── chat.js
        ├── about.js
        └── notFound.js
```

### `index.html`

Responsabilidad: define el documento base, la navegación real con `<a href>` y el contenedor `#app`.

Exporta: nada.

Importa: `styles.css` y `src/main.js`.

Código clave:

```html
<base href="/">
<main id="app"></main>
<script type="module" src="./src/main.js"></script>
```

`#app` arranca vacío porque las vistas se renderizan desde JavaScript según la URL actual.
`<base href="/">` hace que los assets relativos como `./src/main.js` se resuelvan desde la raíz incluso si abrís una URL con slash final como `/chat/`.
`type="module"` permite usar `import` y `export` en el navegador.

### `styles.css`

Responsabilidad: define reset, layout base, navbar, vistas, chat, 404, links internos y badge de ruta activa.

Exporta: reglas CSS.

Importa: nada.

Código clave:

```css
.navbar__links a.active {
  background: #1d4ed8;
  color: white;
}
```

La clase `active` no está fija en el HTML. La agrega y la quita el router según la URL.

### `src/main.js`

Responsabilidad: inicializa la app en el orden correcto.

Exporta: nada.

Importa: `router` y `setupLinkInterception`.

Código clave:

```js
window.addEventListener("popstate", router);
setupLinkInterception();
router();
```

Primero se registra `popstate`, luego se activa la intercepción de links y finalmente se renderiza según la URL actual.

### `src/router.js`

Responsabilidad: resolver qué vista corresponde a cada ruta y coordinar la navegación programática.

Exporta: `router()` y `navigateTo(path)`.

Importa: todas las vistas.

Código clave:

```js
const routes = {
  "/": renderHome,
  "/chat": renderChat,
  "/about": renderAbout,
};
```

La tabla de rutas es el mapa central de la SPA.
Si una ruta no existe en esta tabla, el router usa `renderNotFound`.

### `src/navigation.js`

Responsabilidad: interceptar clicks en links internos para convertirlos en navegación SPA.

Exporta: `setupLinkInterception()`.

Importa: `navigateTo`.

Código clave:

```js
event.preventDefault();
navigateTo(href);
```

`preventDefault()` evita la navegación tradicional del navegador.
`navigateTo(href)` cambia la URL con `pushState` y renderiza la vista correcta.

### `src/views/home.js`

Responsabilidad: renderizar la pantalla Home.

Exporta: `renderHome()`.

Importa: nada.

Código clave:

```js
app.innerHTML = `
  <div class="view">
    <h1 class="view__title">🏠 Home</h1>
  </div>
`;
```

### `src/views/chat.js`

Responsabilidad: renderizar una interfaz estática de chat.

Exporta: `renderChat()`.

Importa: nada.

Código clave:

```js
<div class="message message--bot">
  Usamos History API con pushState para cambiar la URL sin recargar 🚀
</div>
```

La vista simula una conversación para conectar la UI con el concepto técnico.

### `src/views/about.js`

Responsabilidad: explicar qué demuestra el proyecto.

Exporta: `renderAbout()`.

Importa: nada.

Código clave:

```js
<ul class="feature-list">
  <li>Navegación sin recarga de página</li>
  <li>URLs compartibles y con deep linking</li>
</ul>
```

### `src/views/notFound.js`

Responsabilidad: renderizar una respuesta útil cuando la ruta no existe.

Exporta: `renderNotFound()`.

Importa: nada.

Código clave:

```js
La ruta <span class="not-found__path">${window.location.pathname}</span>
no existe en esta app.
```

El usuario ve qué ruta falló y recibe links para volver a una ruta válida.

---

## 5. Cómo levantar el proyecto

Desde la carpeta del proyecto:

```bash
# Con live-server (npm install -g live-server)
live-server --entry-file=index.html
```

```bash
# Con Python
python -m http.server 3000
```

```text
# Con VS Code
Instalar la extensión Live Server → botón "Go Live"
```

Luego abrir:

```text
http://localhost:3000
```

⚠️ Por qué necesitás un servidor:

Este proyecto usa:

```html
<script type="module" src="./src/main.js"></script>
```

Los módulos ES (`type="module"`) funcionan correctamente servidos por HTTP.
Abrir el archivo directamente con `file://` suele traer problemas de carga de módulos, rutas y políticas del navegador.

Además, para probar rutas como `/chat`, `/about` o `/xyz`, necesitás que el servidor entregue `index.html` para esas rutas.
Si el servidor responde su propio 404 antes de entregar `index.html`, el router del navegador nunca llega a ejecutarse.
Por eso, con `live-server`, usamos `--entry-file=index.html`: cualquier ruta interna sin extensión carga `index.html`, y recién ahí `router()` decide si muestra Home, Chat, About o el 404 interno.

---

## 6. Flujo completo de navegación — paso a paso

Flujo de un click en "Chat":

1. Usuario clickea `<a href="/chat">Chat</a>`.
2. El listener de `document` captura el click.
3. `closest("a")` encuentra el link.
4. Se evalúan los filtros → todos pasan.
5. `preventDefault()` evita la recarga.
6. `navigateTo("/chat")` se ejecuta.
7. `pushState(null, "", "/chat")` cambia la URL a `/chat`.
8. `router()` manual lee `pathname` como `"/chat"` y llama `renderChat()`.
9. `updateActiveLink()` hace que "Chat" en el nav tome la clase `active`.
10. Usuario ve la vista Chat sin recarga.

Vuelta con Back:

11. Usuario presiona Back.
12. Navegador restaura la URL a `"/"`.
13. `popstate` se dispara.
14. El listener llama `router()`.
15. `router()` lee `"/"` y llama `renderHome()`.
16. Usuario ve Home y la URL es `"/"`.

El punto importante: el router no adivina. Siempre lee `window.location.pathname` y renderiza en base a esa fuente de verdad.

---

## 7. Los 3 bugs más comunes y cómo debuggearlos

### Bug 1: pushState cambia la URL pero la vista no cambia

Causa: olvidaron llamar `router()` después de `pushState`.

Diagnóstico:

```js
export function navigateTo(path) {
  console.log("navigateTo llamado:", path);
  history.pushState(null, "", path);
}
```

Si aparece el log y la URL cambia, pero el DOM no cambia, falta renderizar.

Solución:

```js
export function navigateTo(path) {
  history.pushState(null, "", path);
  router();
}
```

Regla práctica: navegación interna de SPA = `pushState + router()`.

### Bug 2: Back no hace nada

Causa posible: falta el listener de `popstate`.

Otra causa posible: el listener se registró dentro de una función que se llama muchas veces y terminaste creando listeners duplicados.

Diagnóstico:

```js
window.addEventListener("popstate", (e) => {
  console.log("popstate disparado:", window.location.pathname);
  router();
});
```

Verificar si aparece el log al hacer Back.

Solución:

```js
window.addEventListener("popstate", router);
```

Registrarlo una sola vez, en el arranque de la app, como se hace en `main.js`.

### Bug 3: Ctrl+Click no abre nueva pestaña

Causa: `preventDefault()` se llama antes de verificar los modificadores.

Diagnóstico:

El orden de los filtros importa.
Primero se decide si el link debe quedar en manos del navegador.
Después, solo si es una navegación interna normal, se llama `preventDefault()`.

Solución: estructura correcta del listener:

```js
if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
if (link.target === "_blank") return;
if (link.origin !== window.location.origin) return;
if (href.startsWith("#")) return;
if (href.startsWith("mailto:") || href.startsWith("tel:")) return;
if (!href.startsWith("/")) return;

event.preventDefault();
navigateTo(href);
```

---

## 8. Tabla de decisión — ¿cuándo usar pushState vs replaceState?

| Situación | Método | Por qué |
|-----------|--------|---------|
| Click en link interno | `pushState` | Agrega entrada → Back funciona |
| Redirect post-login | `replaceState` | No queremos que Back vuelva al login |
| Normalizar URL (`/chat/` → `/chat`) | `replaceState` | Corrección, no nueva vista |
| Navegación por app (nav, botones) | `pushState` | El usuario debe poder volver |

En este ejercicio usamos `pushState` para navegación normal.
`replaceState` queda como concepto comparativo para casos donde no querés agregar una nueva entrada al historial.

---

## 9. Glosario

**SPA**: Single Page Application. App que carga un documento HTML principal y luego cambia vistas con JavaScript sin recargar toda la página.

**History API**: API del navegador para leer y manipular el historial de navegación. En este ejercicio usamos `history.pushState()` y el evento `popstate`.

**pushState**: Método que agrega una entrada al historial y cambia la URL sin recargar. No renderiza nada por sí solo.

**popstate**: Evento que se dispara cuando el usuario navega por el historial con Back/Forward o cuando se llama `history.back()` / `history.forward()`.

**router**: Función que lee la URL actual, busca una vista en la tabla de rutas y la renderiza.

**navigateTo**: Función de navegación programática. En este proyecto hace `pushState` y luego llama `router()`.

**Delegación de eventos**: Patrón donde se registra un listener en un elemento padre, como `document`, para manejar eventos que ocurren en elementos hijos.

**Deep linking**: Capacidad de abrir directamente una URL interna como `/chat` y ver la vista correcta.

**Trailing slash**: Barra final de una ruta. Por ejemplo, `/chat/`. El router la normaliza para tratarla como `/chat`.

**Origin**: Combinación de protocolo, dominio y puerto. Por ejemplo, `http://localhost:3000`. Sirve para distinguir links internos de externos.
