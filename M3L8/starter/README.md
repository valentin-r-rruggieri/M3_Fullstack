# Chat AI + Unit Testing — STARTER M3L8

Este starter parte directamente del chat serverless de M3L7.

La app ya funciona. En esta clase no reconstruimos UI, no tocamos Gemini y no cambiamos `/api/chat`. El foco nuevo es **testing unitario con Vitest** sobre piezas aisladas del proyecto.

Los archivos de test del starter NO estan resueltos: tienen imports, `describe(...)`, `it.todo(...)` y comentarios paso a paso para que el alumno los convierta en tests reales.

---

## Que se practica

- Testear funciones puras.
- Testear transformaciones de datos.
- Mockear `fetch` con `vi.fn()`.
- Elegir que conviene testear y que no.
- Correr tests antes de deployar.

---

## Archivos que modifica el alumno

| Archivo | Que hace el alumno | Concepto |
|---------|--------------------|----------|
| `tests/history.test.js` | Reemplazar `it.todo` por `it` + `expect` | Funciones puras |
| `tests/payload.test.js` | Escribir assertions del contrato interno | Payload y validacion |
| `tests/gemini.test.js` | Testear la adaptacion de historial a Gemini | Transformacion de datos |
| `tests/aiClient.test.js` | Mockear `fetch` con `vi.fn()` | Mocking |

## Archivos que NO se modifican

| Archivo | Motivo |
|---------|--------|
| `src/views/chat.js` | Ya viene resuelto de M3L7 |
| `api/chat.js` | Es integracion serverless, no unidad chica |
| `styles.css` | No es clase de CSS |
| `index.html` | No hay cambios de UI |

---

## Como correr

Instalar dependencias:

```bash
npm install
```

Correr tests en modo watch:

```bash
npm test
```

Correr una sola vez:

```bash
npm run test:run
```

Levantar app si queres verla:

```bash
npm run local
```

---

## Orden de clase

1. Correr `npm test`.
2. Leer los `it.todo` y los comentarios.
3. Completar `history.test.js`.
4. Completar `payload.test.js`.
5. Completar `gemini.test.js`.
6. Completar `aiClient.test.js` usando `vi.fn()`.
7. Correr `npm run test:run`.

Al principio Vitest no debe mostrar tests reales pasando: debe mostrar TODOs. Eso es correcto. El trabajo de clase es transformar esos TODOs en tests ejecutables.

---

## Que NO testeamos en este Hands On

No testeamos Gemini real. Eso consume red, cuota y depende de un proveedor externo.

No testeamos DOM. Se puede, pero no es el objetivo de esta clase de 30 minutos.

No testeamos Vercel real. Eso es deployment/integration, no unit testing.

---

## Idea clave

```txt
DOM / Vercel / Gemini real -> no en unit tests introductorios
Funciones puras / adaptadores / fetch mockeado -> si
```
