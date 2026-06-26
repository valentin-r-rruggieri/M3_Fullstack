# Prompt 03 — Refactor de Arquitectura

> Rol: **Arquitecto de software frontend**
> Objetivo: Refactorizar el código de la aplicación aplicando separación de responsabilidades, estado manejado correctamente, transformación de datos, y renderizado ordenado.

---

## Contexto

La aplicación es una **galería de personajes de Los Simpsons** que consume `https://thesimpsonsapi.com/api`. Actualmente el código tiene problemas de arquitectura: todo está mezclado en `main.js` y `ui.js`, no hay capa de transformación de datos, el estado no se gestiona correctamente, y la UI recibe datos crudos de la API en vez de ViewModels limpios.

### Estructura actual del proyecto

```
starter/
├── index.html
├── styles.css
└── src/
    ├── main.js       → mezcla fetch, transform y render (antipatrón)
    ├── api.js        → capa HTTP (debe ser corregida por el debugger prompt)
    ├── state.js      → estado global (correcto, no tocar)
    └── ui.js         → render básico que usa datos crudos
```

### Estructura deseada

```
resolution/
├── index.html
├── styles.css        → corregido por el CSS prompt
└── src/
    ├── main.js                  → coordinador limpio (solo orquesta)
    ├── api.js                   → capa HTTP corregida por debugger
    ├── state.js                 → estado global (sin cambios)
    ├── ui.js                    → render con buildCard() usando ViewModels
    └── transform/
        └── character.js         → NUEVO: transforma raw API → ViewModel
```

### Formato de los datos

**Raw API** (lo que devuelve `data.results`):
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

**ViewModel deseado** (lo que consume la UI):
```js
{
  id: 1,
  name: "Homer Simpson",
  image: "https://cdn.thesimpsonsapi.com/500/character/1.webp",
  occupation: "Safety Inspector",
  status: "Alive",
  statusClass: "alive",       // lowercase para CSS
  phrase: "Doh!",             // primera frase o "Sin frases"
  age: 39,
  gender: "Male"
}
```

---

## Objetivo

Refactorizar la aplicación para que:

1. **Crear `src/transform/character.js`** con funciones de transformación:
   - `getStatusClass(status)` — mapea "Alive"/"Dead"/"unknown" a "alive"/"dead"/"unknown".
   - `getFirstPhrase(phrases)` — extrae la primera frase o devuelve "Sin frases".
   - `toCharacterProfile(rawCharacter)` — construye un ViewModel plano a partir del raw API, usando optional chaining (`?.`) y nullish coalescing (`??`) para campos opcionales.
   - `toCharacterProfileList(rawArray)` — aplica `toCharacterProfile` a todo el array con `Array.map()`.

2. **Refactorizar `src/ui.js`** para que:
   - Use una función `init()` que cachee las referencias del DOM (no `document.getElementById` cada vez).
   - Use `buildCard(profile)` que reciba un ViewModel (no raw API) y construya el HTML.
   - Use `getUserMessage(error)` que traduzca errores técnicos a mensajes humanos:
     - `"NO_RESULTS"` → "No se encontraron personajes con ese nombre."
     - `"HTTP 404"` → "Personajes no encontrados (404)."
     - `"HTTP 5"` → "El servidor de Simpsons no responde."
     - `navigator.onLine === false` → "Sin conexión a internet."
     - default → `error.message`

3. **Refactorizar `src/main.js`** para que:
   - Importe `getFirstSixCharacters` de `api.js` (ya corregido por el debugger).
   - Importe `toCharacterProfileList` del nuevo transform.
   - Importe `getState`, `setState` de `state.js`.
   - Importe `render`, `getUserMessage` de `ui.js`.
   - Implemente `loadGallery(name)` con el pipeline completo:
     ```
     loading → getFirstSixCharacters → toCharacterProfileList → success
     ```
   - Use `setState` + `render` en cada paso.
   - Conecte el botón `#retry` a `loadGallery("homer")`.
   - Cargue automáticamente al inicio con `loadGallery("homer")`.

---

## Restricciones

- No modificar `index.html`.
- No modificar `state.js`.
- No instalar librerías externas.
- No modificar `api.js` (asumir que el debugger prompt ya lo corrigió).
- No usar frameworks (solo vanilla JS, ES modules).
- Las funciones deben ser puras cuando sea posible (transform, buildCard).
- Usar `Array.map()` para transformaciones de listas.
- No usar `var` (usar `let`/`const`).

---

## Evidencia

### Código actual de `src/main.js`

```js
import { fetchCharacters, getFirstSixCharacters } from "./api.js";
import { getState, setState } from "./state.js";
import { render, getUserMessage } from "./ui.js";

function loadCharacters(name) {
  render({ status: "loading", data: null, error: null });

  fetchCharacters(name)
    .then(function (raw) {
      // raw es el objeto raíz de la API (NO el array)
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

**Problemas:**
1. Usa `fetchCharacters` en vez de `getFirstSixCharacters`.
2. Pasa `raw` (objeto raíz) a `data` del estado en vez de ViewModels.
3. No hay capa de transformación entre API y UI.
4. `render` recibe datos crudos y no entiende la estructura.

### Código actual de `src/ui.js`

```js
export function render(state) {
  // ...cambia visibilidad de paneles...

  if (state.status === "success" && state.data) {
    document.getElementById("grid").innerHTML = state.data.map(function (item) {
      return '<div class="card">' +
        '<img src="https://cdn.thesimpsonsapi.com/500/character/' + item.id + '.webp" />' +
        '<h3>' + item.name + '</h3>' +
        '<p>' + (item.occupation || "") + '</p>' +
        '<span>' + item.status + '</span>' +
        '</div>';
    }).join("");
  }
}
```

**Problemas:**
1. No cachea referencias DOM (busca con `getElementById` en cada render).
2. `buildCard` está inline en vez de ser una función dedicada.
3. No usa ViewModel (statusClass, phrase faltan).
4. `getUserMessage` es básica y no cubre todos los casos de error.

---

## Formato de salida

Proporcioná el código **completo** de estos 3 archivos:

### 1. `src/transform/character.js` (nuevo archivo)
- `getStatusClass(status)` → función pura con objeto mapa.
- `getFirstPhrase(phrases)` → `Array.isArray` check + `phrases[0]` + fallback.
- `toCharacterProfile(rawCharacter)` → construye ViewModel con `??` y `?.`.
- `toCharacterProfileList(rawArray)` → `rawArray.map(toCharacterProfile)`.

### 2. `src/ui.js` (refactorizado)
- Variable privada `$loading`, `$error`, `$success`, `$badge`, `$errorMessage`.
- `init()` que cachee referencias.
- `buildCard(profile)` que use el ViewModel y construya el HTML completo.
- `render(state)` que use las referencias cacheadas y delegue en `buildCard`.
- `getUserMessage(error)` con casos completos.

### 3. `src/main.js` (refactorizado)
- Imports correctos (api, transform, state, ui).
- `loadGallery(name)` con pipeline completo.
- Conexión de retry button.
- Carga inicial.

---

## Criterios de éxito

- [ ] `toCharacterProfile` con campos `id`, `name`, `image` (CDN), `occupation`, `status`, `statusClass`, `phrase`, `age`, `gender`.
- [ ] `toCharacterProfile` usa `??` para defaults y no crashea si faltan campos.
- [ ] `toCharacterProfileList` usa `Array.map()`.
- [ ] `buildCard` recibe ViewModel, no raw API.
- [ ] `buildCard` incluye: imagen, nombre, ocupación, status-dot, estado, edad, frase.
- [ ] `render` cachea el DOM en `init()`.
- [ ] `getUserMessage` cubre: offline, NO_RESULTS, HTTP 404, HTTP 5xx, default.
- [ ] `main.js` orquesta el pipeline: loading → fetch → transform → success/error.
- [ ] `main.js` usa `setState` + `render` en lugar de llamar `render` directo.
- [ ] El botón retry recarga la galería correctamente.
- [ ] No hay referencias a datos crudos en la capa de UI.
