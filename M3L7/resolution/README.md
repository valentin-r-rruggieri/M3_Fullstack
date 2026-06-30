# Chat AI Serverless Gemini — M3L7 Resolution

Resolucion del ejercicio practico M3L7. Esta version toma el chat engine de M3L6 y reemplaza el mock local por una integracion segura con Gemini:

```txt
Frontend -> /api/chat -> Vercel Serverless Function -> Gemini
```

La API key queda protegida en backend:

```js
process.env.GEMINI_API_KEY
```

Nunca aparece en el navegador.

---

## Que demuestra

- Separacion frontend/backend para proteger credenciales.
- Uso de Vercel Serverless Functions.
- Endpoint `POST /api/chat`.
- Uso del SDK `@google/generative-ai` solo en backend.
- Adaptacion del payload interno del chat al formato de Gemini.
- Respuesta compatible con el normalizador de M3L6 (`content[]`).
- Uso de `.env` en local y Environment Variables en Vercel.

---

## Archivos clave

| Archivo | Responsabilidad |
|---------|-----------------|
| `src/views/chat.js` | Usa `callAI()` desde `aiClient.js` |
| `src/engine/aiClient.js` | Hace `POST /api/chat` desde el frontend |
| `api/chat.js` | Lee `GEMINI_API_KEY`, llama a Gemini y adapta la respuesta |
| `.env.example` | Template de variable de entorno |
| `package.json` | Dependencia `@google/generative-ai` y script `npm run local` |

---

## Como correr en local

```bash
npm install
Copy-Item .env.example .env
npm run local
```

Editar `.env`:

```txt
GEMINI_API_KEY=tu-api-key-real
```

Abrir:

```txt
http://localhost:3000
```

No usar `live-server`, porque `live-server` no ejecuta la carpeta `api/`.

---

## Flujo completo

```txt
1. Usuario escribe en /chat/science
2. views/chat.js arma historial y payload
3. aiClient.js hace fetch("/api/chat")
4. Vercel ejecuta api/chat.js
5. api/chat.js lee process.env.GEMINI_API_KEY
6. api/chat.js llama a Gemini
7. api/chat.js devuelve content[]
8. normalizer.js convierte content[] a texto
9. render.js pinta la burbuja
```

---

## Seguridad

Verificar en DevTools:

```txt
Sources -> buscar GEMINI_API_KEY
Sources -> buscar AIza
Network -> request /api/chat
```

Resultado esperado:

```txt
La key no aparece.
El frontend solo conoce /api/chat.
```

---

## Deploy en Vercel

1. Subir el proyecto a GitHub.
2. Importarlo en Vercel.
3. Ir a Project Settings -> Environment Variables.
4. Agregar:

```txt
GEMINI_API_KEY=tu-api-key-real
```

5. Hacer deploy o redeploy.

Si la app carga pero el chat falla con `GEMINI_API_KEY no configurada`, falta configurar la variable en Vercel o falta redeployar.

---

## Troubleshooting

| Problema | Causa probable | Solucion |
|----------|----------------|----------|
| `/api/chat` 404 local | Se uso Live Server | Usar `npm run local` |
| `Cannot find module @google/generative-ai` | Falta instalar | `npm install` |
| `GEMINI_API_KEY no configurada` | Falta `.env` o env en Vercel | Crear/configurar variable |
| Respuesta vacia | Gemini devolvio texto vacio | Revisar logs de `api/chat.js` |
| Error 429 | Cuota/rate limit | Esperar y reintentar |

---

## Patron que queda

Este patron sirve para cualquier frontend que necesite hablar con una API externa protegida:

```txt
Cliente publico -> endpoint propio -> proveedor externo con credenciales privadas
```
