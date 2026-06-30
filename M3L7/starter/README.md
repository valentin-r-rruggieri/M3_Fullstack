# Chat AI Serverless Gemini — STARTER M3L7

Este starter continua directamente el ejercicio de M3L6.

El chat ya funciona con el mock local: UI, personajes, historial, payload, normalizacion de `content[]`, debounce, lock de UI y manejo de estados ya estan resueltos.

En M3L7 el foco nuevo es uno solo:

```txt
Frontend -> /api/chat -> Serverless Function -> process.env.GEMINI_API_KEY -> Gemini
```

La idea central: **la API key nunca vive en el frontend**.

---

## Que ya esta listo

| Archivo/carpeta | Estado | Rol |
|-----------------|--------|-----|
| `index.html` | Completo | Carga la SPA |
| `styles.css` | Completo | UI responsive del chat |
| `src/router.js` | Completo | Rutas `/`, `/about`, `/chat/:character` |
| `src/views/*` | Completo | Home, chat, about y 404 |
| `src/engine/history.js` | Completo | Historial de conversacion |
| `src/engine/payload.js` | Completo | Personajes y payload interno |
| `src/engine/normalizer.js` | Completo | Convierte `content[]` a texto seguro |
| `src/ui/render.js` | Completo | Render de burbujas, loading, errores y reset |
| `src/engine/mockApi.js` | Completo | Mock local heredado de M3L6 |

El starter arranca usando `mockApi.js` para confirmar que el chat base funciona antes de conectar Gemini.

---

## Que modifica el alumno

| Archivo | Que se hace | Concepto de la lecture |
|---------|-------------|-------------------------|
| `api/chat.js` | Crear primero una respuesta mock serverless y despues conectar Gemini real | Backend seguro en Vercel |
| `api/utils/*` | Helpers ya listos para parsear request, adaptar mensajes y armar respuestas | Funcion serverless limpia |
| `src/engine/aiClient.js` | Implementar `fetch("/api/chat")` | Frontend habla con backend propio |
| `src/views/chat.js` | Cambiar el import de `mockApi.js` a `aiClient.js` | Reemplazar mock local por proxy seguro |
| `.env` | Crear desde `.env.example` | API key en variable de entorno backend |

No se toca DOM, CSS, historial, payload ni normalizer. Eso ya fue M3L6.

---

## Por que no usamos live-server

En M3L2 a M3L6 muchas demos podian levantarse con un servidor estatico. En M3L7 aparece una carpeta nueva:

```txt
api/
```

Vercel convierte cada archivo de esa carpeta en un endpoint serverless:

```txt
api/chat.js -> /api/chat
```

`live-server` solo sirve archivos estaticos. No ejecuta funciones backend. Por eso en esta clase usamos Vercel Dev.

---

## Como correr

Instalar dependencias:

```bash
npm install
```

Levantar con Vercel Dev:

```bash
npm run local
```

Abrir:

```txt
http://localhost:3000
```

Probar:

```txt
/chat/science
```

Enviar un mensaje. La respuesta inicial viene del mock local de M3L6.

---

## Paso a paso del ejercicio

### Paso 1 — Verificar el punto de partida

Abrir:

```txt
src/views/chat.js
```

Buscar:

```js
import { callAI } from "../engine/mockApi.js";
```

Esa linea marca la frontera actual: el chat llama a un mock local.

### Paso 2 — Crear `/api/chat` mock

Abrir:

```txt
api/chat.js
```

Implementar una serverless function que responda con el mismo formato que ya entiende `normalizer.js`.

La funcion debe leer `payload.messages`. Ese array no es solo el ultimo mensaje: es el historial recortado que viene de M3L6.

```js
{
  content: [
    { type: "text", text: "Respuesta mock desde /api/chat" }
  ]
}
```

Todavia no conectamos Gemini. Primero probamos la infraestructura.

### Paso 3 — Implementar `aiClient.js`

Abrir:

```txt
src/engine/aiClient.js
```

Implementar:

```txt
POST /api/chat
body: payload del chat
si falla: throw Error
si responde OK: return data
```

Este archivo vive en frontend, por eso no puede importar Gemini ni leer `GEMINI_API_KEY`.

El body que manda a `/api/chat` incluye:

```txt
system -> prompt del personaje
messages[] -> historial recortado de la conversacion
temperature/max_tokens -> configuracion
```

### Paso 4 — Cambiar el import del chat

Abrir:

```txt
src/views/chat.js
```

Cambiar:

```js
import { callAI } from "../engine/mockApi.js";
```

por:

```js
import { callAI } from "../engine/aiClient.js";
```

Desde ese momento el chat deja de usar el mock local y empieza a usar `/api/chat`.

### Paso 5 — Crear `.env`

Copiar:

```powershell
Copy-Item .env.example .env
```

Completar:

```txt
GEMINI_API_KEY=tu-api-key-real
```

Reiniciar `npm run local` despues de crear o modificar `.env`.

### Paso 6 — Conectar Gemini en `api/chat.js`

Abrir:

```txt
api/chat.js
```

Agregar el SDK:

```js
import { GoogleGenerativeAI } from "@google/generative-ai";
```

Leer la key solo en backend:

```js
const apiKey = process.env.GEMINI_API_KEY;
```

Adaptar `messages[]` al formato de Gemini y devolver nuevamente `content[]`.

La adaptacion no va mezclada en `api/chat.js`; para eso estan:

| Helper | Responsabilidad |
|--------|-----------------|
| `api/utils/request.js` | Parsear body, validar `messages[]`, leer configuracion |
| `api/utils/gemini.js` | Convertir historial M3L6 a `contents[]` de Gemini |
| `api/utils/response.js` | Devolver `content[]` compatible con el frontend |
| `api/utils/errors.js` | Manejar 429 y status HTTP controlados |

---

## Seguridad que hay que verificar

Abrir DevTools y buscar:

```txt
GEMINI_API_KEY
AIza
@google/generative-ai
```

Resultado esperado:

```txt
La key no aparece en Sources ni en Network.
```

El frontend solo debe ver:

```txt
POST /api/chat
```

---

## Troubleshooting

| Problema | Causa probable | Solucion |
|----------|----------------|----------|
| `/api/chat` da 404 | Se levanto con Live Server | Usar `npm run local` |
| `GEMINI_API_KEY no configurada` | Falta `.env` o falta reiniciar | Crear `.env` y reiniciar Vercel Dev |
| La app sigue usando mock local | No cambiaste el import en `views/chat.js` | Importar desde `aiClient.js` |
| Aparece la key en DevTools | La pusiste en frontend | Moverla a `.env` y leerla en `api/chat.js` |
| Error 429 | Rate limit/cuota de Gemini | Esperar o probar menos mensajes |

---

## Idea clave

```txt
M3L6 construyo el motor del chat.
M3L7 lo conecta de forma segura con una Serverless Function.
```
