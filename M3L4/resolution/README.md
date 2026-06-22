# Rick Gallery — Ejercicio Práctico M3L4

Galería responsiva de 6 personajes "Rick" consumidos desde la Rick & Morty API.
El objetivo técnico es construir el pipeline completo de una app que consume una API REST y transforma colecciones antes de renderizar:

```text
buildUrl -> fetchJson -> fetchCharacters -> toCharacterProfile -> renderGrid
```

Conceptos principales:

- `URLSearchParams` para construir query strings seguras.
- `fetchJson` con `response.ok`.
- Inspección del shape real del JSON.
- Transformación raw API -> ViewModel.
- `Array.map()` para transformar colecciones.
- `?.` y `??` para datos anidados y defaults.
- CSS Grid responsive con cards y hover.

---

## 2. El flujo completo en un diagrama y en palabras

```text
Rick & Morty API (raw JSON)
  ↓
fetchJson.js
  valida response.ok y parsea JSON
  ↓
rmApi.js
  buildUrl con URLSearchParams y extrae data.results[]
  ↓
character.js
  raw character -> ViewModel plano
  ↓
characterGrid.js
  ViewModel -> HTML de cards
  ↓
DOM
  grilla responsive de personajes
```

En palabras:

1. `main.js` llama `getFirstSixCharacters("rick")`.
2. `rmApi.js` construye la URL y pide datos.
3. `fetchJson.js` resuelve la comunicación HTTP robusta.
4. `rmApi.js` extrae `data.results`, porque los personajes no están en la raíz.
5. `character.js` convierte cada personaje raw en un ViewModel plano.
6. `characterGrid.js` renderiza la grilla.

---

## 3. Conceptos clave con ejemplos del proyecto

### URLSearchParams — por qué y cómo

Anti-patrón:

```js
const url = `${BASE_URL}?name=${name}&page=${page}`;
```

Problema: si `name` contiene espacios, `&`, tildes o caracteres especiales, la URL puede romperse.

Patrón correcto:

```js
const params = new URLSearchParams({
  name: name.trim(),
  page: String(page),
});

return `${BASE_URL}?${params.toString()}`;
```

Ejemplo:

```js
new URLSearchParams({ name: "Rick & Morty" }).toString();
// "name=Rick+%26+Morty"
```

### El shape del JSON — cómo inspeccionarlo

La API devuelve:

```json
{
  "info": {
    "count": 107,
    "pages": 6
  },
  "results": [
    {
      "id": 1,
      "name": "Rick Sanchez",
      "status": "Alive",
      "species": "Human",
      "origin": { "name": "Earth (C-137)" },
      "location": { "name": "Citadel of Ricks" }
    }
  ]
}
```

Rutas importantes:

- `data.results` -> array de personajes.
- `results[0].name` -> nombre.
- `results[0].origin.name` -> origen.
- `results[0].location.name` -> ubicación.

Error común:

```js
const characters = data; // mal: data es objeto raíz, no array
```

Correcto:

```js
const characters = data.results;
```

### Por qué `??` y no `||`

| Valor | `valor || "Unknown"` | `valor ?? "Unknown"` | Diferencia |
|-------|----------------------|----------------------|------------|
| `"Earth"` | `"Earth"` | `"Earth"` | Igual |
| `""` | `"Unknown"` | `""` | `??` respeta string vacío |
| `0` | `"Unknown"` | `0` | `??` respeta cero |
| `null` | `"Unknown"` | `"Unknown"` | Igual |
| `undefined` | `"Unknown"` | `"Unknown"` | Igual |

En transforms de API preferimos `??` porque solo reemplaza `null` y `undefined`.

### ViewModel — qué es y por qué importa

Raw JSON:

```js
{
  id: 1,
  name: "Rick Sanchez",
  origin: { name: "Earth (C-137)", url: "..." },
  location: { name: "Citadel of Ricks", url: "..." }
}
```

ViewModel:

```js
{
  id: 1,
  name: "Rick Sanchez",
  image: "...",
  status: "Alive",
  statusClass: "alive",
  species: "Human",
  originName: "Earth (C-137)",
  locationName: "Citadel of Ricks"
}
```

Beneficios:

- La UI recibe campos planos.
- La UI no depende del shape anidado de la API.
- Los defaults quedan centralizados.
- Si la API cambia, se toca el transform, no toda la app.

### Array.map() para transformar colecciones

```js
export function toCharacterProfileList(rawArray) {
  return rawArray.map(toCharacterProfile);
}
```

`map()` es la herramienta natural cuando queremos transformar un array en otro array del mismo largo.

---

## 4. Estructura del proyecto y responsabilidad de cada archivo

| Archivo | Hace | Exporta | Importa |
|---------|------|---------|---------|
| `index.html` | Estructura de estados y contenedores | Nada | `styles.css`, `main.js` |
| `styles.css` | Layout, grilla, cards, responsive y estados | Nada | Nada |
| `services/fetchJson.js` | Fetch robusto | `fetchJson` | Nada |
| `services/rmApi.js` | URLs y requests a Rick & Morty API | `buildUrl`, `fetchCharacters`, `getFirstSixCharacters` | `fetchJson` |
| `transform/character.js` | Raw API -> ViewModel | `toCharacterProfile`, `toCharacterProfileList` | Nada |
| `ui/characterGrid.js` | Render de estados y cards | `render`, `getUserMessage` | Nada |
| `main.js` | Orquesta pipeline, estado y retry | Nada | servicios, transform y UI |

---

## 5. Cómo correr el proyecto

Desde `M3L4-Resolution`:

```bash
npx --yes live-server --port=8094
```

Con Python:

```bash
python -m http.server 3000
```

Con VS Code:

```text
Abrir carpeta M3L4-Resolution -> Live Server -> Go Live
```

Necesitás servidor porque el proyecto usa módulos ES:

```html
<script type="module" src="./src/main.js"></script>
```

---

## 6. La grilla responsiva

CSS Grid mobile-first:

```css
.cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

Comportamiento:

- Mobile: 1 columna.
- Tablet: 2 columnas.
- Desktop: 3 columnas.

---

## 7. Los 3 bugs más comunes

### Bug 1: `results is not iterable` o `[object Object]`

Causa: usar `data` en vez de `data.results`.

Fix:

```js
const results = data.results;
```

### Bug 2: Cards muestran `Unknown` en campos anidados

Causa: ruta incorrecta o acceso inseguro a campos anidados.

Fix:

```js
raw.origin?.name ?? "Unknown";
raw.location?.name ?? "Unknown";
```

### Bug 3: URL con espacios o `&` rompe la búsqueda

Causa: concatenación manual.

Fix:

```js
new URLSearchParams({ name: name.trim(), page: String(page) });
```

---

## 8. Glosario

**Endpoint**: URL específica de una API.

**Query string**: parte de la URL después de `?`, por ejemplo `?name=rick&page=1`.

**URLSearchParams**: API del navegador para construir query strings seguras.

**response.ok**: booleano que indica status HTTP 200-299.

**Doble await**: esperar respuesta de red y parseo del body.

**ViewModel**: objeto preparado para la UI, plano y estable.

**Transform**: conversión de datos raw a datos útiles para la app.

**Optional chaining (`?.`)**: acceso seguro a campos anidados.

**Nullish coalescing (`??`)**: default solo para `null` o `undefined`.

**CSS Grid**: sistema CSS para grillas bidimensionales.

**Grilla responsiva**: layout que cambia según ancho de pantalla.

**Array.map()**: método para transformar arrays.
