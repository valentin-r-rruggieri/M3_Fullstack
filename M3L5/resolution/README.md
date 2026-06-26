# Simpsons Gallery — Resolution M3L5

Versión corregida de la galería de personajes de Los Simpsons, obtenida aplicando los 3 prompts estructurados.

## Cómo correr

```bash
cd M3L5\resolution
npx --yes live-server --port=8096
```

## Cambios aplicados

| Prompt | Archivos modificados | Fix |
|--------|---------------------|-----|
| debugger | `src/api.js`, `src/main.js` | `URLSearchParams`, `response.ok`, `data.results`, pipeline correcto |
| css | `styles.css` | Tema Simpsons (amarillo + celeste), CSS Grid responsive, `100dvh`, cards con sombra |
| refactor | `src/transform/character.js` (nuevo), `src/ui.js`, `src/main.js` | ViewModel, optional chaining, `buildCard()`, `getUserMessage()` completo |

## Estructura

```
resolution/
├── index.html
├── styles.css
└── src/
    ├── main.js
    ├── api.js
    ├── state.js
    ├── ui.js
    └── transform/
        └── character.js
```
