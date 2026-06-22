# Buscador de Pokémon — Starter M3L3

Este proyecto es el punto de partida para el Hands On de JavaScript asíncrono y Fetch API.
La interfaz visual ya está completa. La clase consiste en reemplazar el anti-patrón de `src/main.js` por el patrón robusto de la resolución: doble `await`, `response.ok`, estados UI y retry.

El resultado final debe quedar idéntico a `M3L3-Resolution`.

---

## Cómo correrlo

Desde esta carpeta:

```bash
npx --yes live-server --port=8080
```

O con Python:

```bash
python -m http.server 3000
```

Usamos servidor HTTP porque el HTML carga módulos ES:

```html
<script type="module" src="./src/main.js"></script>
```

---

## Estado inicial del starter

Archivos completos, no tocar:

- `index.html`
- `styles.css`

Archivos a completar:

- `src/api.js`
- `src/state.js`
- `src/ui.js`
- `src/main.js`

El starter arranca con un anti-patrón:

```js
fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
  .then((response) => response.json())
  .then((data) => {
    const card = document.querySelector("#pokemon-card");
    card.innerHTML = `<p>${data.name}</p>`;
    document.querySelector("#state-success").classList.remove("hidden");
  });
```

Qué bugs tiene:

- No muestra loading.
- No valida `response.ok`.
- Escribe directo en el DOM.
- No tiene estado centralizado.
- No tiene `catch`.
- No tiene retry.

---

## Qué hace el alumno en clase

### Paso 1 — `src/api.js`

Implementar `fetchJson(url)`:

1. `await fetch(url)`
2. Validar `response.ok`
3. `throw new Error(...)` si no está ok
4. `await response.json()`
5. Retornar `data`

Implementar `getPokemon(name)`:

1. Normalizar nombre con `toLowerCase().trim()`
2. Construir URL con `BASE_URL`
3. Retornar `fetchJson(url)`

Pruebas sugeridas en consola:

```js
const api = await import("./src/api.js");
await api.getPokemon("pikachu");
await api.getPokemon("pokemon-inexistente");
```

### Paso 2 — `src/state.js`

Crear:

```js
const state = {
  status: "idle",
  data: null,
  error: null,
  lastQuery: null,
};
```

Implementar:

```js
export function getState() {
  return { ...state };
}

export function setState(updates) {
  Object.assign(state, updates);
}
```

### Paso 3 — `src/ui.js`

Implementar `render(state)` con el patrón:

```text
ocultar todo -> actualizar badge -> mostrar panel correcto
```

Implementar `buildPokemonCard(pokemon)` usando:

- `pokemon.name`
- `pokemon.id`
- `pokemon.sprites.other["official-artwork"].front_default`
- `pokemon.sprites.front_default` como fallback
- `pokemon.types`
- `pokemon.height / 10`
- `pokemon.weight / 10`
- `pokemon.base_experience`

### Paso 4 — `src/main.js`

Borrar el anti-patrón e importar:

```js
import { getPokemon } from "./api.js";
import { getState, setState } from "./state.js";
import { render } from "./ui.js";
```

Luego:

1. Render inicial: `render(getState())`
2. Implementar `handleSearch(query)`
3. En `handleSearch`: `loading -> fetch -> success/error`
4. Agregar evento `submit`
5. Agregar evento `retry`

---

## Resultado esperado

Casos que deben funcionar:

- Buscar `pikachu` muestra loading y luego tarjeta.
- Buscar `pkachuxxx` muestra error legible.
- Offline en DevTools muestra error de conexión.
- Botón `Reintentar` repite la última búsqueda.
- El badge cambia entre `idle`, `loading`, `success` y `error`.
- No quedan dos paneles visibles al mismo tiempo.

---

## Delta starter → solución

| Archivo | Starter | Qué agrega el alumno |
|---------|---------|----------------------|
| `index.html` | Completo | Nada |
| `styles.css` | Completo | Nada |
| `api.js` | TODOs | `fetchJson()` + `getPokemon()` |
| `state.js` | TODOs | `state` + `getState()` + `setState()` |
| `ui.js` | TODOs | `render()` + `buildPokemonCard()` |
| `main.js` | Anti-patrón | Flujo completo + retry |
