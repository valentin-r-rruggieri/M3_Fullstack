# Prompt 01 — Debugger de API

> Rol: **Debugger especializado en APIs REST**
> Objetivo: Identificar y corregir errores en la capa de comunicación con la API de Los Simpsons.

---

## Contexto

Tenemos una SPA en vanilla JavaScript (ES modules) que consume la **The Simpsons API**:

- **Base URL:** `https://thesimpsonsapi.com/api`
- **Endpoint:** `GET /api/characters?name={nombre}&page={page}`
- **Response:** `{ count, next, prev, pages, results: [...] }`
- **Imágenes CDN:** `https://cdn.thesimpsonsapi.com/500/character/{id}.webp`
- **Ejemplo:** `https://thesimpsonsapi.com/api/characters?name=homer`

Cada personaje en `results` tiene esta estructura:

```json
{
  "id": 1,
  "name": "Homer Simpson",
  "occupation": "Safety Inspector",
  "status": "Alive",
  "age": 39,
  "gender": "Male",
  "portrait_path": "/character/1.webp",
  "phrases": ["Doh!", "Woo-hoo!"]
}
```

El proyecto usa **4 capas separadas**:
- `api.js` — comunicación HTTP
- `transform/character.js` — transformación de datos
- `ui.js` — renderizado
- `main.js` — coordinación

---

## Objetivo

Corregir los archivos `api.js` y `main.js` para que la aplicación:

1. Construya URLs seguras usando `URLSearchParams` (no concatenación manual).
2. Valide `response.ok` antes de parsear JSON (que lance error en 404/500).
3. Extraiga correctamente `data.results` (no `data` directamente).
4. Tome solo los primeros 6 personajes con `Array.slice()`.
5. Maneje correctamente los errores con try/catch en el flujo principal.

---

## Restricciones

- Sin frameworks ni librerías externas.
- Sin modificar `index.html`.
- Sin modificar `state.js`.
- Mantener la estructura de módulos ES (`import`/`export`).
- No tocar la capa de UI ni de transformación (solo api.js y main.js).

---

## Evidencia

### Archivo actual: `src/api.js`

```js
const API_BASE = "https://thesimpsonsapi.com/api";

export async function fetchCharacters(name) {
  const url = API_BASE + "/characters?name=" + name;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export function getFirstSixCharacters(name) {
  return fetchCharacters(name).then(function (data) {
    return data.slice(0, 6);
  });
}
```

**Problemas detectados en api.js:**
1. **Línea 4** — La URL se construye con concatenación manual (`+`). Si `name` contiene `"&"`, `"?"` o espacios, la URL se rompe.
2. **Línea 5-6** — No se valida `response.ok`. Si la API responde 404 o 500, `response.json()` igual se ejecuta y la promesa NO se rechaza.
3. **Línea 7** — Devuelve `data` (el objeto raíz `{ count, next, prev, pages, results }`) en vez de `data.results` (el array de personajes).
4. **Líneas 11-13** — `getFirstSixCharacters` asume que `data` es un array y llama a `.slice()`, pero recibe el objeto raíz.

### Archivo actual: `src/main.js`

```js
import { fetchCharacters, getFirstSixCharacters } from "./api.js";
import { getState, setState } from "./state.js";
import { render, getUserMessage } from "./ui.js";

function loadCharacters(name) {
  render({ status: "loading", data: null, error: null });

  fetchCharacters(name)
    .then(function (raw) {
      setState({ status: "success", data: raw, error: null });
      render(getState());
    })
    .catch(function (err) {
      setState({ status: "error", data: null, error: err });
      render(getState());
    });
}

document.getElementById("retry").addEventListener("click", function () {
  loadCharacters("homer");
});

loadCharacters("homer");
```

**Problemas detectados en main.js:**
1. **Línea 6** — Llama a `fetchCharacters` (que devuelve el objeto raíz en vez del array de personajes).
2. **Línea 8** — Pasa `raw` (objeto raíz) directamente a `data` del estado, pero la UI espera un array de ViewModels.
3. No usa `getFirstSixCharacters` (que debería limitar a 6 personajes).

---

## Formato de salida

Proporcioná el **código corregido completo** de los dos archivos (`api.js` y `main.js`) con estos cambios:

### `src/api.js` corregido debe incluir:
- Función `buildUrl(params)` que use `URLSearchParams`.
- Función `fetchJson(url)` que valide `response.ok` y lance error con mensaje `"HTTP {status}: {statusText}"`.
- Función `fetchCharacters(name)` que use `buildUrl`, `fetchJson`, y extraiga `data.results` validando que sea array.
- Función `getFirstSixCharacters(name)` que llame a `fetchCharacters` y use `.slice(0, 6)`.
- Cada función mantenida como `export async function`.

### `src/main.js` corregido debe:
- Usar `getFirstSixCharacters` en vez de `fetchCharacters`.
- Llamar al transform (`toCharacterProfileList`) entre la data raw y el render (asumí que existe y hace `Array.map`).
- Mantener el flujo: `loading → getFirstSixCharacters → toCharacterProfileList → success`.

---

## Criterios de éxito

- [ ] `buildUrl("homer")` produce `https://thesimpsonsapi.com/api/characters?name=homer&page=1`.
- [ ] `buildUrl("Bart & Lisa")` codifica el `&` como `%26` en la URL.
- [ ] `fetchJson` lanza error para status HTTP 404/500.
- [ ] `fetchCharacters` devuelve un array de personajes (no el objeto raíz).
- [ ] `getFirstSixCharacters` devuelve exactamente 6 elementos.
- [ ] `main.js` usa `getFirstSixCharacters` y pasa los datos por el transform.
- [ ] Con URL inválida: UI muestra panel de error (no se queda en loading).
- [ ] Con URL válida: UI muestra los 6 personajes correctamente.
- [ ] Todo error HTTP muestra un mensaje legible en la UI.
