# Errores del Starter y cómo se corrigen con los Prompts

> Documento de referencia para la clase. Explica qué está mal en cada archivo del starter y qué prompt lo resuelve.

---

## Archivo: `src/api.js` — Corregido por **PROMPT 01 (Debugger)**

### Error 1: Concatenación manual de URLs
```js
const url = API_BASE + "/characters?name=" + name;
```
- **Problema:** Si `name` tiene `&`, `?` o espacios, la URL se rompe.
- **Detectar:** En consola: `const url = "...characters?name=" + "Bart & Lisa"`
- **El prompt genera:** `URLSearchParams` con codificación automática.

### Error 2: Falta de validación `response.ok`
```js
const response = await fetch(url);
const data = await response.json();
```
- **Problema:** `fetch()` no rechaza en 404/500. La UI se queda en loading.
- **Detectar:** Cambiar URL a una inválida → Network muestra 404 rojo → UI queda colgada.
- **El prompt agrega:** `if (!response.ok) { throw new Error(...) }`

### Error 3: Devuelve objeto raíz en vez de `data.results`
```js
return data;
```
- **Problema:** La API devuelve `{ count, next, prev, pages, results }`. El array está en `data.results`.
- **Detectar:** `const r = await api.fetchCharacters("homer"); console.log(Array.isArray(r));` → false
- **El prompt cambia a:** `return data.results`

### Error 4: `getFirstSixCharacters` asume que recibe un array
```js
return data.slice(0, 6);
```
- **Problema:** Recibe el objeto raíz y `data.slice` no es función.
- **Detectar:** Consola muestra `TypeError: data.slice is not a function`
- **El prompt lo corrige automáticamente** al arreglar Error 3.

---

## Archivo: `src/main.js` — Corregido por **PROMPT 03 (Refactor)**

### Error 5: Mezcla fetch + estado + render en una función
```js
function loadCharacters(name) {
  render({ status: "loading"... });
  fetchCharacters(name).then(function (raw) {
    setState(...);
    render(getState());
  });
}
```
- **Problema:** Todo junto, difícil de debuggear y modificar.
- **El prompt refactoriza a:** Pipeline separado: `getFirstSixCharacters → toCharacterProfileList → setState → render`

### Error 6: No usa `getFirstSixCharacters`
```js
fetchCharacters(name)
```
- **Problema:** Trae TODOS los personajes (20 por página) en vez de solo 6.
- **Detectar:** Network → response tiene 20 items.
- **El prompt cambia a:** `getFirstSixCharacters(name).then(...)`

### Error 7: Renderiza datos crudos sin transformar
```js
setState({ status: "success", data: raw, error: null });
```
- **Problema:** `raw` es el objeto raíz de la API, no un array de ViewModels.
- **Detectar:** UI nunca muestra personajes, solo error.
- **El prompt agrega:** `var profiles = toCharacterProfileList(raw); setState({ data: profiles })`

### Error 8: No existe capa de transformación
- **Problema:** No hay `transform/character.js`.
- **El prompt crea:** `src/transform/character.js` con `toCharacterProfile()`, `toCharacterProfileList()`, `getStatusClass()`, `getFirstPhrase()`

---

## Archivo: `src/ui.js` — Corregido por **PROMPT 03 (Refactor)**

### Error 9: No cachea referencias del DOM
```js
export function render(state) {
  document.getElementById("loading")...
  document.getElementById("error")...
  document.getElementById("grid")...
```
- **Problema:** Busca en el DOM cada vez que renderiza. Ineficiente.
- **El prompt agrega:** `init()` que cachea referencias una sola vez.

### Error 10: `buildCard` inline en el `.map()`
```js
state.data.map(function (item) {
  return '<div class="card">...' + item.name + '...</div>';
})
```
- **Problema:** No se puede reutilizar ni testear.
- **El prompt extrae a:** `function buildCard(profile) { return "..."; }`

### Error 11: `getUserMessage` incompleto
```js
export function getUserMessage(error) {
  if (!navigator.onLine) return "Sin conexión a internet";
  if (error?.message) return error.message;
  return "Ocurrió un error inesperado";
}
```
- **Problema:** No distingue entre 404, 500, NO_RESULTS.
- **El prompt expande a:** Casos para `NO_RESULTS`, `HTTP 404`, `HTTP 5xx`, `offline`, default.

### Error 12: Usa datos crudos en vez de ViewModel
```js
<span class="status">' + item.status + '</span>
```
- **Problema:** No usa `statusClass`, `image` completa, `phrase`.
- **El prompt usa:** `profile.statusClass`, `profile.image`, `profile.phrase`

---

## Archivo: `styles.css` — Corregido por **PROMPT 02 (CSS)**

### Error 13: Fondo morado + verde neón (nada de amarillo)
```css
background-color: #2d0a3e;
color: #00ff00;
```
- **Problema:** No se parece en nada a Los Simpsons. El color icónico es el amarillo `#ffd90f`.
- **El prompt cambia a:** `background: #fffde7` (amarillo clarísimo)

### Error 14: Comic Sans
```css
font-family: "Comic Sans MS", cursive;
```
- **Problema:** Fuente no profesional.
- **El prompt cambia a:** system-ui stack.

### Error 15: `height: 100vh` sin fallback
```css
#app { height: 100vh; }
```
- **Problema:** Se rompe en mobile con teclado virtual.
- **El prompt agrega:** `height: 100dvh` con fallback `100vh`.

### Error 16: Grid con `display: block`
```css
#grid { display: block; }
```
- **Problema:** Sin CSS Grid, las cards se apilan siempre.
- **El prompt cambia a:** `display: grid; grid-template-columns: repeat(3, 1fr);`

### Error 17: Sin media queries
- **Problema:** No existe responsive. Se ve igual (mal) en todos los tamaños.
- **El prompt agrega:** Breakpoints a 600px y 400px.

### Error 18: Sin CSS custom properties
- **Problema:** Colores hardcodeados en todo el archivo. Difícil de mantener.
- **El prompt agrega:** `:root { --yellow, --navy, --alive, --dead, ... }`

### Error 19: Spinner cuadrado
```css
border-radius: 0;
```
- **Problema:** Parece un cuadrado girando, no un spinner.
- **El prompt cambia a:** `border-radius: 50%` + colores amarillo/azul marino.

### Error 20: Blink infinito en texto de carga
```css
animation: blink 0.5s infinite;
```
- **Problema:** Parpadea constantemente. Molesto y poco accesible.
- **El prompt cambia a:** Pulse suave de opacidad.

### Error 21: Cards sin hover, sin sombras, sin personalidad
- **Problema:** Planas, sin feedback interactivo.
- **El prompt agrega:** `box-shadow`, `transform: translateY(-3px)`, `border-color: var(--yellow)` al hover.

---

## Resumen: Archivos y prompts

| Archivo | Estado actual | Prompt que lo corrige | Archivo final en resolution/ |
|---------|--------------|----------------------|------------------------------|
| `src/api.js` | 4 errores (concatenación, response.ok, data.results, slice) | **Prompt 01** | `resolution/src/api.js` |
| `src/main.js` | 4 errores (mezcla, sin getFirstSix, datos crudos, sin transform) | **Prompt 03** | `resolution/src/main.js` |
| `src/ui.js` | 4 errores (DOM cache, buildCard inline, getUserMessage, ViewModel) | **Prompt 03** | `resolution/src/ui.js` |
| `src/transform/character.js` | NO EXISTE | **Prompt 03** | `resolution/src/transform/character.js` |
| `styles.css` | 9 errores (colores, tipografía, layout, responsive, spinner, etc.) | **Prompt 02** | `resolution/styles.css` |
| `index.html` | Sin errores | No se modifica | Igual |
| `src/state.js` | Sin errores | No se modifica | Igual |

---

## Orden de aplicación

```
Paso 1 → PROMPT 01 (debugger)
  Solo api.js. El resto del código sigue fallando pero al menos
  la capa de red funciona correctamente.

Paso 2 → PROMPT 03 (refactor)
  Crea transform/character.js, refactoriza main.js y ui.js.
  Ahora la app funciona pero se ve fea.

Paso 3 → PROMPT 02 (css)
  Reemplaza styles.css completo con tema Simpsons compacto.
  App funcional + bonita = resolution completo.
```
