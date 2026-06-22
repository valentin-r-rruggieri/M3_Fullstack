# Buscador de Pokémon — Ejercicio Práctico M3L3
<img width="1024" height="733" alt="image" src="https://github.com/user-attachments/assets/d5916b4f-8fdb-4009-bc48-122783da656d" />

Este ejercicio construye un buscador visual de Pokémon usando Fetch API, `async/await` y manejo explícito de estados de UI.
La app demuestra el patrón completo para pedir datos a una API externa sin dejar la pantalla en blanco: doble `await`, validación de `response.ok`, estados `idle/loading/success/error` y botón de retry.
No usa frameworks, bundlers ni npm: funciona con HTML, CSS y módulos ES en el navegador.

Para explicar la solución archivo por archivo y guiar el pasaje desde el starter, usá [GUIA_VISUAL.md](./GUIA_VISUAL.md).

---

## 2. El problema que resuelve: del fetch roto al fetch robusto

El anti-patrón típico parece simple, pero es frágil:

```js
// ❌ Anti-patrón: 3 bugs en 5 líneas
fetch(`https://pokeapi.co/api/v2/pokemon/${name}`) // ❌ sin await: no controlamos el flujo
  .then((r) => r.json()) // ❌ no valida response.ok: 404 parece éxito
  .then((data) => {
    content.textContent = data.name; // ❌ si hay error, data.name = undefined
  })
  // ❌ sin .catch: errores de red desaparecen en silencio
```

El patrón robusto del proyecto:

```js
export async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} — ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
```

Qué resuelve:

- El primer `await` espera la respuesta HTTP.
- `response.ok` distingue respuestas exitosas de 404/500.
- El segundo `await` espera la deserialización del body a JSON.
- El `throw` permite que `catch` maneje errores HTTP igual que errores de red.

---

## 3. Los conceptos clave con ejemplos del proyecto

### El doble await — por qué es necesario

`fetch()` no retorna los datos. Retorna una `Promise<Response>`.
Ese `Response` contiene headers, status y un body que todavía no está parseado.

```js
const response = await fetch(url); // Response, no datos
const data = await response.json(); // objeto JS
```

Si olvidás el segundo `await`:

```js
const data = response.json();
console.log(data); // Promise { <pending> }
```

`response.json()` también es asíncrono porque el body llega como stream y debe deserializarse.

### El gotcha de response.ok

`fetch()` solo rechaza la promesa ante fallos de red, CORS o interrupciones reales de conexión.
Un HTTP 404 o 500 sigue siendo una respuesta HTTP válida desde el punto de vista de `fetch`.

Por eso este proyecto hace:

```js
if (!response.ok) {
  throw new Error(`HTTP ${response.status} — ${response.statusText}`);
}
```

En DevTools Network:

- `pikachu` devuelve `200`.
- `pikachu123` devuelve `404`.
- Sin `response.ok`, ese `404` no entra al `catch`.
- Con `throw`, el `catch` muestra un mensaje legible.

### Los 4 estados de UI

| Estado | Cuándo ocurre | Qué ve el usuario | Qué hace el código |
|--------|---------------|-------------------|--------------------|
| `idle` | Al cargar la app | Mensaje inicial | Espera input |
| `loading` | Mientras corre fetch | Spinner y botón deshabilitado | Limpia datos/error previos |
| `success` | La API responde bien | Tarjeta del Pokémon | Guarda `data` |
| `error` | Error HTTP o red | Mensaje y botón retry | Guarda `error` |

### El patrón render(state)

La UI se actualiza desde una sola función:

```js
export function render(state) {
  [$idle, $loading, $success, $error].forEach((el) => {
    el.classList.add("hidden");
  });

  $badge.textContent = `estado: ${state.status}`;

  // Mostrar solo el panel correcto...
}
```

Esto evita que partes del DOM queden desincronizadas. Cada render oculta todo y muestra solo lo que corresponde al estado actual.

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
    ├── api.js
    ├── state.js
    └── ui.js
```

| Archivo | Qué hace | Exporta | Importa |
|---------|----------|---------|---------|
| `index.html` | Define estructura, formulario y paneles de estado | Nada | `styles.css`, `src/main.js` |
| `styles.css` | Resuelve layout, estados visuales, spinner y tarjeta | Nada | Nada |
| `src/api.js` | Centraliza fetch robusto | `fetchJson`, `getPokemon` | Nada |
| `src/state.js` | Guarda estado único de la app | `getState`, `setState` | Nada |
| `src/ui.js` | Renderiza la UI según estado | `render` | Nada |
| `src/main.js` | Coordina eventos, estado, fetch y render | Nada | `api`, `state`, `ui` |

---

## 5. Cómo correr el proyecto

Desde `M3L3-Resolution`:

```bash
npx --yes live-server --port=8080
```

O si tenés `live-server` instalado global:

```bash
live-server
```

Con Python:

```bash
python -m http.server 3000
```

Necesitás un servidor HTTP porque el proyecto usa:

```html
<script type="module" src="./src/main.js"></script>
```

Los módulos ES deben cargarse desde HTTP para evitar problemas de rutas y políticas del navegador.

---

## 6. Los 3 bugs más comunes y cómo debuggearlos

### Bug 1: `Promise { <pending> }` en consola

Causa: falta `await` en `response.json()`.

Diagnóstico:

```js
const data = response.json();
console.log(data); // Promise
```

Fix:

```js
const data = await response.json();
```

### Bug 2: El `catch` no corre con 404

Causa: falta validar `response.ok`.

Diagnóstico:

- Network muestra `404`.
- La UI no muestra error.
- El código sigue al `.then` o al bloque de éxito.

Fix:

```js
if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}
```

### Bug 3: La UI no se actualiza

Causa: se llamó `setState()` pero no `render()`.

Diagnóstico:

- El estado interno cambió.
- La pantalla sigue igual.

Fix:

```js
setState({ status: "loading" });
render(getState());
```

Regla práctica: en este proyecto, cada cambio de estado que debe verse en pantalla va seguido de `render(getState())`.

---

## 7. Cómo usar DevTools para debuggear este ejercicio

### Network

Usar Network para mirar:

- Status: `200`, `404`, errores de red.
- Preview: datos JSON recibidos.
- Timing: cuánto tardó la request.
- Throttling: simular `Slow 3G` u `Offline`.

### Console

Logs útiles:

```js
console.log("status antes del fetch", getState());
console.log("response ok?", response.ok, response.status);
console.log("pokemon", pokemon);
```

### Throttling

Casos para probar:

- `Slow 3G`: confirmar que loading se ve.
- `Offline`: confirmar que aparece error de conexión.
- Volver online y presionar `Reintentar`.

---

## 8. Glosario del ejercicio

**Promise**: objeto que representa un resultado futuro.

**async/await**: sintaxis para escribir código asíncrono con flujo legible.

**Doble await**: primer `await` para `fetch`; segundo `await` para `response.json()`.

**response.ok**: booleano que indica si el status HTTP está en rango 200-299.

**Estado UI**: representación explícita de qué debe ver el usuario.

**Retry**: reintento de una operación fallida usando la última búsqueda guardada.

**idle/loading/success/error**: los cuatro momentos de la operación asíncrona.

**fetchJson**: helper que encapsula fetch robusto y devuelve datos JSON o lanza error.
