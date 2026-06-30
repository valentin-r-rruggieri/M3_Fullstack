# PIM3 — Chat AI Serverless Gemini

Proyecto integrador final resuelto del Modulo 3.

Este proyecto toma el recorrido construido en M3L6, M3L7 y M3L8:

- chat engine con historial;
- payload con system prompt;
- normalizacion de `content[]`;
- serverless function en Vercel;
- API key segura con `process.env.GEMINI_API_KEY`;
- adaptador de historial a Gemini;
- tests unitarios con Vitest.

---

## Como correr

```bash
npm install
Copy-Item .env.example .env
npm run local
```

Completar `.env`:

```txt
GEMINI_API_KEY=tu-api-key-real
```

Abrir:

```txt
http://localhost:3000
```

---

## Tests

```bash
npm run test:run
```

Los tests cubren:

| Archivo | Que valida |
|---------|------------|
| `tests/history.test.js` | Historial inmutable y recorte |
| `tests/payload.test.js` | Payload correcto con historial |
| `tests/gemini.test.js` | Adaptacion a `contents[]` |
| `tests/aiClient.test.js` | `fetch("/api/chat")` mockeado |

---

## Arquitectura

```txt
src/views/chat.js
  -> history.js
  -> payload.js
  -> aiClient.js
  -> /api/chat
  -> api/utils/gemini.js
  -> Gemini
```

La API key nunca llega al navegador.

---

## Deploy

1. Subir el proyecto a GitHub.
2. Importarlo en Vercel.
3. Configurar Environment Variable:

```txt
GEMINI_API_KEY=tu-api-key-real
```

4. Deploy.

Antes de deploy:

```bash
npm run test:run
```

---

## Checklist de entrega

- [x] SPA funcional.
- [x] Chat con personajes.
- [x] Historial de conversacion.
- [x] Serverless Function `/api/chat`.
- [x] Gemini conectado desde backend.
- [x] API key protegida.
- [x] Tests unitarios.
- [x] Deep links funcionando con `vercel.json`.
