# Simpsons Gallery — Starter M3L5

Galería de personajes de Los Simpsons con **múltiples bugs intencionales** (API, CSS, arquitectura).

El objetivo es usar **3 prompts estructurados** para que una IA diagnostique y corrija cada capa: debugger de API, diseñador CSS, y refactor de código.

## Cómo correr

```bash
cd M3L5\starter
npx --yes live-server --port=8095
```

## Bugs incluidos

| Capa | Archivo | Síntoma |
|------|---------|---------|
| API | `src/api.js` | No valida `response.ok`, concatenación manual de URL, extrae `data` en vez de `data.results` |
| CSS | `styles.css` | Fondo morado + verde neón, Comic Sans, sin responsive, `100vh` roto, spinner cuadrado |
| Arquitectura | `src/main.js`, `src/ui.js` | Antipatrón, sin transform layer, render usa datos crudos |

## Prompts disponibles

1. `prompts/prompt-01-debugger.md` — corrige api.js + main.js (API layer)
2. `prompts/prompt-02-css.md` — reemplaza styles.css (diseño Simpsons responsive)
3. `prompts/prompt-03-refactor.md` — crea transform/character.js, refactoriza ui.js y main.js
