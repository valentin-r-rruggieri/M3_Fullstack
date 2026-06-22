# Dad Joke Generator + Tests — M3L8 Resolution

Resolución simplificada de M3L8 basada en el proyecto de M3L7.

El objetivo es que la clase de 30 minutos sea familiar y enfocada: no hay app nueva, solo agregamos testing al Dad Joke Generator.

## Qué se agregó sobre M3L7

- `jokeUtils.js`: funciones puras testeables.
- `jokeUtils.test.js`: tests unitarios con `describe`, `it`, `expect`.
- `apiClient.js`: `fetch('/api/joke')` separado de la UI.
- `apiClient.test.js`: tests con `fetch` mockeado usando `vi.fn()`.
- `package.json`: scripts de Vitest.

## Comandos

```bash
npm install
npm test
npm run test:run
npm run local
```

## Qué se testea

| Archivo | Qué se testea | Por qué |
|---------|---------------|---------|
| `jokeUtils.js` | `formatJoke`, `buildErrorMessage` | Son funciones puras |
| `apiClient.js` | request a `/api/joke`, success/error | Aíslamos fetch con mock |

## Qué no se testea

| Parte | Por qué no |
|-------|------------|
| DOM en `app.js` | Es efecto secundario, no foco de esta clase |
| Gemini real | Sería lento, frágil y consume cuota |
| Vercel real | Es integration/deployment, no unit test |

## Resultado

```bash
npm run test:run
```

Debe mostrar todos los tests pasando.
