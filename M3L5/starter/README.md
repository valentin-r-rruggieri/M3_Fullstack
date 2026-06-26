# Simpsons Gallery — Starter M3L5

Galería de personajes de Los Simpsons con **bugs intencionales** para practicar AI Prompting.

## Cómo correr

```bash
cd M3L5\starter
npx --yes live-server --port=8095
```

---

## Índice de anti-patrones (21 total)

| # | Anti-patrón | Archivo | ¿Cómo se detecta? | Lo corrige |
|---|-------------|---------|-------------------|------------|
| 1 | Concatenación manual de URLs | `api.js` | URL se rompe con caracteres especiales (&, espacios) | **Prompt 01** |
| 2 | Falta de validación `response.ok` | `api.js` | UI se queda en loading ante 404/500 | **Prompt 01** |
| 3 | Devuelve objeto raíz en vez de `data.results` | `api.js` | `data.map is not a function` en consola | **Prompt 01** |
| 4 | `getFirstSixCharacters` asume que recibe un array | `api.js` | `data.slice is not a function` | **Prompt 01** |
| 5 | `loadCharacters` mezcla fetch + estado + render | `main.js` | Todo junto en una función, difícil de debuggear | **Prompt 03** |
| 6 | No usa `getFirstSixCharacters` (trae 20 en vez de 6) | `main.js` | Network muestra 20 personajes en vez de 6 | **Prompt 03** |
| 7 | Renderiza datos crudos de la API sin transformar | `main.js` | Pasa el objeto raíz directo a la UI | **Prompt 03** |
| 8 | No hay capa de transformación | `main.js` | No existe `transform/character.js` | **Prompt 03** |
| 9 | No cachea referencias del DOM | `ui.js` | `getElementById` en cada render | **Prompt 03** |
| 10 | `buildCard` inline dentro del `.map()` | `ui.js` | No se puede reutilizar ni testear | **Prompt 03** |
| 11 | `getUserMessage` incompleto | `ui.js` | No distingue entre 404, 5xx, NO_RESULTS | **Prompt 03** |
| 12 | Usa datos crudos en vez de ViewModel | `ui.js` | Falta `statusClass`, `phrase`, `image` completa | **Prompt 03** |
| 13 | Fondo morado + verde neón (nada de amarillo) | `styles.css` | Duele a la vista, no es Simpsons | **Prompt 02** |
| 14 | Comic Sans como tipografía | `styles.css` | Fuente no profesional | **Prompt 02** |
| 15 | `height: 100vh` sin fallback mobile | `styles.css` | Layout roto con teclado virtual | **Prompt 02** |
| 16 | Grid con `display: block` (sin CSS Grid) | `styles.css` | Cards apiladas verticalmente siempre | **Prompt 02** |
| 17 | Sin media queries | `styles.css` | No existe responsive | **Prompt 02** |
| 18 | Sin CSS custom properties | `styles.css` | Valores hardcodeados, difícil de mantener | **Prompt 02** |
| 19 | Spinner cuadrado en vez de circular | `styles.css` | `border-radius: 0` | **Prompt 02** |
| 20 | Texto de carga con blink infinito | `styles.css` | Parpadea constantemente, molesto | **Prompt 02** |
| 21 | Cards sin hover, sin sombras, sin personalidad | `styles.css` | Planas, sin feedback interactivo | **Prompt 02** |

---

## Orden de aplicación de prompts

```
1 → PROMPT 01 (debugger)  → api.js   → API empieza a funcionar
2 → PROMPT 03 (refactor)  → main.js + transform/character.js + ui.js → app funcional (fea)
3 → PROMPT 02 (css)       → styles.css → app funcional + bonita
```

---

## Explicación en clase

Cada archivo del starter tiene comentarios detallados con:
- **ANTI-PATRÓN**: qué está mal
- **PROBLEMA**: por qué es un problema
- **DETECCIÓN**: cómo identificarlo en DevTools
- **SOLUCIÓN**: qué va a cambiar con el prompt
- **RESUMEN**: cómo queda el archivo final en resolution/
