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

Corregir **únicamente** `src/api.js` para que:

1. Construya URLs seguras usando `URLSearchParams` (no concatenación manual).
2. Valide `response.ok` antes de parsear JSON (que lance error en 404/500).
3. Extraiga correctamente `data.results` (no `data` directamente).
4. Tome solo los primeros 6 personajes con `Array.slice()`.

> ⚠️ **No modificar `src/main.js`**. Ese archivo será corregido por otro prompt.

---

## Restricciones

- Sin frameworks ni librerías externas.
- Sin modificar `index.html`.
- Sin modificar `state.js`, `main.js`, `ui.js`.
- Mantener la estructura de módulos ES (`import`/`export`).
- Solo modificar `src/api.js`.

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



---

## Formato de salida

Proporcioná el **código completo** de `src/api.js` reemplazado con estos cambios:

- Función `buildUrl(params)` que use `URLSearchParams`.
- Función `fetchJson(url)` que valide `response.ok` y lance error con mensaje `"HTTP {status}: {statusText}"`.
- Función `fetchCharacters(name)` que use `buildUrl`, `fetchJson`, y extraiga `data.results` validando que sea array.
- Función `getFirstSixCharacters(name)` que llame a `fetchCharacters` y use `.slice(0, 6)`.
- Cada función mantenida como `export async function`.

---

## Criterios de éxito

- [ ] `buildUrl("homer")` produce `https://thesimpsonsapi.com/api/characters?name=homer&page=1`.
- [ ] `buildUrl("Bart & Lisa")` codifica el `&` como `%26` en la URL.
- [ ] `fetchJson` lanza error para status HTTP 404/500.
- [ ] `fetchCharacters` devuelve un array de personajes (no el objeto raíz).
- [ ] `getFirstSixCharacters` devuelve exactamente 6 elementos.
- [ ] `fetchCharacters` con URL inválida lanza error HTTP (no queda colgado).
- [ ] `fetchCharacters` con URL válida devuelve un array de personajes.
