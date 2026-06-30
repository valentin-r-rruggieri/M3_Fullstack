# Chat AI + Unit Testing — M3L8 Resolution

Resolucion de M3L8 basada directamente en el chat serverless de M3L7.

La app no cambia. Lo nuevo es la capa de tests con Vitest sobre piezas pequeñas y testeables:

- historial;
- payload;
- adaptador a Gemini;
- cliente `fetch("/api/chat")`.

---

## Como correr

```bash
npm install
npm run test:run
```

Tambien podes levantar la app:

```bash
npm run local
```

---

## Tests incluidos

| Archivo | Que valida |
|---------|------------|
| `tests/history.test.js` | `appendUserMessage`, `appendAssistantMessage`, `getTrimmedHistory`, `resetHistory` |
| `tests/payload.test.js` | `buildPayload`, `isValidPayload`, system top-level e historial |
| `tests/gemini.test.js` | `toGeminiContents()` preserva historial y adapta roles |
| `tests/aiClient.test.js` | `fetch("/api/chat")` y manejo de errores con mock |

---

## Que no se testea

| Cosa | Por que |
|------|--------|
| Gemini real | Unit tests no deben depender de red/cuota/proveedor |
| Vercel real | Es integration/deployment |
| DOM visual | Para esta clase conviene enfocarse en logica aislada |

---

## Comando de verificacion

```bash
npm run test:run
```

Resultado esperado:

```txt
Test Files  4 passed
Tests       todos los tests pasan
```
