# Guía Visual — De Starter a Resolution M3L3

Esta guía sirve para explicar visualmente la solución archivo por archivo y, al mismo tiempo, mostrar qué vamos a construir desde `M3L3-Starter` hasta llegar a `M3L3-Resolution`.

Idea central de la clase:

```text
Starter: fetch directo, sin estados claros
   ↓
Resolution: fetch robusto + estado centralizado + render según estado + retry
```

---

## Mapa General

```text
index.html
  contiene la estructura visual:
  form + badge + panel idle + panel loading + panel success + panel error

styles.css
  contiene toda la estética:
  layout + spinner + tarjeta + estados visibles/ocultos

src/api.js
  habla con la API:
  fetchJson() + getPokemon()

src/state.js
  guarda la verdad de la app:
  idle/loading/success/error + data/error/lastQuery

src/ui.js
  toca el DOM:
  render(state) + buildPokemonCard()

src/main.js
  coordina el flujo:
  eventos -> estado -> fetch -> estado -> render
```

Flujo visual final:

```text
Usuario busca "pikachu"
        ↓
main.js recibe submit
        ↓
state.status = "loading"
        ↓
ui.render() muestra spinner
        ↓
api.getPokemon("pikachu")
        ↓
si OK: state.status = "success"
si falla: state.status = "error"
        ↓
ui.render() muestra tarjeta o error
```

---

## === ARCHIVO: index.html ===

### Qué tenemos

Este archivo ya viene completo tanto en Starter como en Resolution.
No se toca durante la clase.

Contiene:

- Header con título y subtítulo.
- Formulario de búsqueda.
- Badge de estado actual.
- Cuatro paneles visuales: `idle`, `loading`, `success`, `error`.
- Script final con `type="module"`.

### Qué comentar en clase

"El HTML ya tiene todos los estados posibles. JavaScript no va a inventar la pantalla desde cero: va a decidir cuál de estos paneles se muestra."

"El badge `estado: idle` es didáctico. Nos permite ver el estado interno sin abrir consola."

"El panel de error tiene `role='alert'` y `aria-live='assertive'` para que un lector de pantalla anuncie el error."

### Qué mirar visualmente

```html
<div id="state-badge" class="state-badge">estado: idle</div>

<div id="state-idle" class="state-panel state-panel--idle">
<div id="state-loading" class="state-panel state-panel--loading hidden">
<div id="state-success" class="state-panel state-panel--success hidden">
<div id="state-error" class="state-panel state-panel--error hidden">
```

### Delta Starter -> Resolution

```text
No cambia.
```

---

## === ARCHIVO: styles.css ===

### Qué tenemos

Este archivo también viene completo en Starter y Resolution.
No se toca durante la clase.

Contiene:

- Reset.
- Layout centrado.
- Estilos del formulario.
- Spinner.
- Paneles de estado.
- Tarjeta de Pokémon.
- Clase utilitaria `.hidden`.

### Qué comentar en clase

"El CSS ya resuelve cómo se ve cada estado. La lógica de JavaScript solo agrega o quita `.hidden`."

"Esto separa responsabilidades: CSS define presentación, JS define estado y comportamiento."

### Qué mirar visualmente

```css
.hidden {
  display: none !important;
}
```

Ese es el mecanismo principal de UI:

```text
Panel con hidden    -> no se ve
Panel sin hidden    -> se ve
```

### Delta Starter -> Resolution

```text
No cambia.
```

---

## === ARCHIVO: src/api.js ===

### Qué tenemos en Starter

Un esqueleto con TODOs:

```text
TODO 1: implementar fetchJson(url)
TODO 2: implementar getPokemon(name)
```

### Qué queda en Resolution

Una capa de comunicación robusta:

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

Y una función específica para la PokéAPI:

```js
export async function getPokemon(name) {
  const url = `${BASE_URL}/${name.toLowerCase().trim()}`;
  return await fetchJson(url);
}
```

### Qué comentar en clase

"Este archivo es la frontera con internet. Si mañana cambiamos de API, el cambio debería vivir acá."

"No usamos `fetch` directo en `main.js` porque queremos centralizar el patrón robusto."

"El primer `await` espera la respuesta HTTP. El segundo `await` parsea el body."

"`response.ok` es el gotcha: sin esto, un 404 no cae en `catch`."

### Delta Starter -> Resolution

```text
Agregar:
- fetchJson(url)
- validación response.ok
- throw manual para errores HTTP
- response.json() con segundo await
- getPokemon(name)
```

### Checkpoint de clase

Probar en consola:

```js
const api = await import("./src/api.js");
await api.getPokemon("pikachu");
await api.getPokemon("pkachuxxx");
```

Esperado:

```text
pikachu     -> devuelve objeto
pkachuxxx   -> lanza Error HTTP 404
```

---

## === ARCHIVO: src/state.js ===

### Qué tenemos en Starter

Un esqueleto para crear la fuente de verdad:

```text
TODO 1: crear state
TODO 2: implementar getState()
TODO 3: implementar setState(updates)
```

### Qué queda en Resolution

```js
const state = {
  status: "idle",
  data: null,
  error: null,
  lastQuery: null,
};
```

```js
export function getState() {
  return { ...state };
}

export function setState(updates) {
  Object.assign(state, updates);
}
```

### Qué comentar en clase

"El estado es el semáforo de la app. Dice en qué momento estamos."

"`data` vive acá cuando hay éxito. `error` vive acá cuando hay fallo."

"`lastQuery` existe por el botón Reintentar. Sin memoria de la última búsqueda, retry no sabe qué repetir."

"`setState` no pinta nada en pantalla. Cambia datos. Después necesitamos `render()`."

### Delta Starter -> Resolution

```text
Agregar:
- objeto state
- getState() con copia
- setState(updates) con Object.assign
```

### Checkpoint de clase

Después de implementarlo:

```js
const s = await import("./src/state.js");
s.getState();
s.setState({ status: "loading" });
s.getState();
```

Esperado:

```text
Primero status idle.
Después status loading.
Todavía no cambia la pantalla porque falta render().
```

---

## === ARCHIVO: src/ui.js ===

### Qué tenemos en Starter

Las referencias DOM ya están listas.
El alumno no tiene que buscarlas.

```js
const $idle = document.querySelector("#state-idle");
const $loading = document.querySelector("#state-loading");
const $success = document.querySelector("#state-success");
const $error = document.querySelector("#state-error");
```

Faltan:

```text
TODO 1: render(state)
TODO 2: buildPokemonCard(pokemon)
```

### Qué queda en Resolution

Una función `render(state)` que sigue este patrón:

```text
1. Ocultar todos los paneles
2. Actualizar badge
3. Mostrar el panel correspondiente
```

Y una función `buildPokemonCard(pokemon)` que arma la tarjeta visual.

### Qué comentar en clase

"Este es el único archivo que toca el DOM."

"La regla es: si queremos cambiar la pantalla, cambiamos el estado y llamamos `render()`."

"Primero ocultamos todo para evitar estados mezclados. Después mostramos uno solo."

"La tarjeta transforma datos crudos de la API en información presentable: artwork oficial, ID formateado, tipos, altura en metros, peso en kilos y experiencia base."

### Delta Starter -> Resolution

```text
Agregar:
- render(state)
- ocultar todos los paneles
- actualizar state-badge
- manejar idle/loading/success/error
- buildPokemonCard(pokemon)
```

### Checkpoint de clase

Cuando `state.js` y `ui.js` estén listos:

```js
const state = await import("./src/state.js");
const ui = await import("./src/ui.js");

state.setState({ status: "loading" });
ui.render(state.getState());
```

Esperado:

```text
Se ve el spinner.
El badge dice estado: loading.
```

---

## === ARCHIVO: src/main.js ===

### Qué tenemos en Starter

Un anti-patrón funcional:

```js
fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
  .then((response) => response.json())
  .then((data) => {
    const card = document.querySelector("#pokemon-card");
    card.innerHTML = `<p>${data.name}</p>`;
    document.querySelector("#state-success").classList.remove("hidden");
  });
```

Funciona solo con el camino feliz.

Problemas:

- No muestra loading.
- No valida `response.ok`.
- No centraliza estado.
- Escribe DOM directo.
- No maneja errores de red.
- No tiene retry.

### Qué queda en Resolution

`main.js` se convierte en coordinador:

```text
eventos del usuario
   ↓
setState(...)
   ↓
render(...)
   ↓
getPokemon(...)
   ↓
setState(success/error)
   ↓
render(...)
```

### Qué comentar en clase

"Main no debería saber cómo se arma la tarjeta ni cómo funciona fetch internamente."

"Main coordina el caso de uso: el usuario busca, pasamos a loading, pedimos datos, mostramos success o error."

"El orden importa: `setState` y después `render`."

"Retry funciona porque guardamos `lastQuery` al iniciar la búsqueda."

### Delta Starter -> Resolution

```text
Reemplazar:
- fetch directo con .then(...)

Por:
- imports de api/state/ui
- render inicial
- handleSearch(query)
- try/catch
- evento submit
- evento retry
```

### Checkpoint final

Probar:

```text
pikachu      -> loading -> success
pkachuxxx    -> loading -> error
Offline      -> loading -> error de conexión
Retry        -> repite lastQuery
```

---

## Orden de Construcción en Clase

```text
1. api.js
   construir fetchJson y getPokemon

2. state.js
   crear la fuente de verdad

3. ui.js
   crear render y la tarjeta

4. main.js
   borrar anti-patrón y coordinar el flujo

5. pruebas
   éxito, 404, offline y retry
```

---

## Mensaje Final para Alumnos

```text
Una app real no solo hace fetch.
Una app real comunica:
- estoy esperando
- encontré datos
- algo falló
- podés reintentar
```

Ese es el salto de `M3L3-Starter` a `M3L3-Resolution`.
