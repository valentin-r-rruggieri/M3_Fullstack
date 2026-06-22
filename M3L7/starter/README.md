# Dad Joke Generator — STARTER M3L7

## De qué se trata

Una app que genera chistes malos en español usando inteligencia artificial, pero con una condición central: **la API key de Gemini nunca debe estar visible en el navegador**.

El flujo seguro que vamos a construir es:

```txt
Navegador → /api/joke → Serverless Function → process.env → Gemini
    ↑              ↑
código público    código privado del servidor
visible           la key nunca llega al browser
```

Este patrón es el que se usa cuando una app frontend necesita consumir una API externa con credenciales privadas.

## Qué ya está listo

Para no sumar complejidad innecesaria, el Starter ya trae resuelta toda la parte de HTML, CSS e interacción con el DOM.

| Archivo | Estado | Rol |
|---------|--------|-----|
| `index.html` | Completo | Interfaz: botón, caja de chiste y caja de error |
| `styles.css` | Completo | Dark mode minimalista, mobile-first |
| `app.js` | Completo para DOM | Eventos, loading, error y chiste hardcodeado |
| `package.json` | Completo | Dependencia `@google/generative-ai` y script local |
| `.gitignore` | Completo | Excluye `node_modules`, `.env`, `.vercel` |
| `.env.example` | Completo | Template para crear `.env` |

## Qué vas a construir en clase

El foco de M3L7 no es manipular el DOM. El foco es construir el puente seguro entre frontend y una API externa.

| Archivo | Qué tiene ahora | Qué modifica el alumno |
|---------|-----------------|-------------------------|
| `app.js` | DOM listo + `getJoke()` hardcodeado | Reemplazar solo `getJoke()` por `fetch("/api/joke")` |
| `api/joke.js` | Skeleton con TODOs | Crear la Serverless Function mock y luego Gemini real |
| `.env` | No existe en Starter | Crear desde `.env.example` y pegar `GEMINI_API_KEY` |

## Cómo levantar el Starter

Desde esta carpeta:

```bash
npm install
npm run local
```

O directo:

```bash
npx --yes vercel dev
```

Abrir:

```txt
http://localhost:3000
```

No uses `live-server` para este ejercicio. M3L7 necesita ejecutar la carpeta `api/`, y eso lo hace Vercel Dev.

No uses `npm run dev`. Si un proyecto define `"dev": "vercel dev"`, Vercel puede detectar una invocación recursiva. Por eso el script se llama `local`.

## Estado inicial esperado

Al abrir el Starter y tocar el botón, debería aparecer un chiste fijo:

```txt
¿Por qué el libro de matemáticas estaba triste? Porque tenía demasiados problemas.
```

Eso confirma que:

- el HTML carga;
- el CSS carga;
- el botón funciona;
- el evento click funciona;
- los estados de loading/error/success ya están conectados.

Recién después de confirmar eso, se trabaja el backend.

## Paso a paso en clase

### Paso 1 — Verificar frontend hardcodeado

Abrir la app y hacer click en:

```txt
Generá un chiste
```

Qué decir:

> “El DOM ya está resuelto. No vamos a gastar tiempo de esta clase escribiendo `getElementById` ni event listeners. Lo que nos importa hoy es que el frontend no llame a Gemini directamente.”

Archivo:

```txt
app.js
```

La función inicial es:

```js
async function getJoke() {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return "¿Por qué el libro de matemáticas estaba triste? Porque tenía demasiados problemas."
}
```

### Paso 2 — Crear `/api/joke` mock

Archivo:

```txt
api/joke.js
```

Primera versión:

```js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  await new Promise((resolve) => setTimeout(resolve, 600))

  return res.status(200).json({
    joke: "[MOCK] ¿Por qué el programador usa lentes? Porque no puede ver C#.",
  })
}
```

Objetivo:

- entender la forma de una Serverless Function;
- probar `/api/joke` sin gastar tokens;
- verificar que Vercel Dev ejecuta backend local.

### Paso 3 — Reemplazar `getJoke()` por `fetch("/api/joke")`

En `app.js`, reemplazar únicamente la función `getJoke()`:

```js
async function getJoke() {
  const response = await fetch("/api/joke", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic: "anything" }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error || "Error del servidor")
  }

  const data = await response.json()
  return data.joke
}
```

No tocar el event listener ni los helpers de UI. Ya están listos.

### Paso 4 — Probar el mock completo

Levantar:

```bash
npm run local
```

Abrir:

```txt
http://localhost:3000
```

Click en el botón.

Resultado esperado:

```txt
[MOCK] ¿Por qué el programador usa lentes? Porque no puede ver C#.
```

### Paso 5 — Crear `.env`

Copiar:

```bash
copy .env.example .env
```

O manualmente crear `.env`:

```txt
GEMINI_API_KEY=tu-api-key-real
```

La key se obtiene en:

```txt
https://aistudio.google.com
```

Importante:

> “`.env` nunca se sube a Git. Por eso está en `.gitignore`.”

### Paso 6 — Reemplazar mock por Gemini real

En `api/joke.js`, reemplazar el mock por:

```js
import { GoogleGenerativeAI } from "@google/generative-ai"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY no configurada" })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt =
      "Generá un dad joke corto en español. " +
      "Debe tener juego de palabras o remate inesperado. " +
      "Solo el chiste, sin explicaciones."

    const result = await model.generateContent(prompt)
    const joke = result.response.text().trim()

    return res.status(200).json({ joke })
  } catch (error) {
    console.error("[/api/joke] Error:", error.message)
    return res.status(500).json({ error: "Error al generar el chiste" })
  }
}
```

### Paso 7 — Verificar seguridad

Abrir DevTools:

```txt
F12 → Sources
```

Buscar:

```txt
GEMINI_API_KEY
AIza
```

Resultado esperado:

```txt
Sin resultados
```

Qué decir:

> “El navegador solo conoce `/api/joke`. No conoce Gemini, no importa `@google/generative-ai` y no ve la API key.”

## Anti-patrón que evitamos

No hacer esto en `app.js`:

```js
const API_KEY = "AIzaSy..."

fetch("https://generativelanguage.googleapis.com/...", {
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
})
```

Eso deja la key visible para cualquier usuario.

## Resultado final

Al terminar, el Starter debería comportarse como `M3L7-Resolution`:

- botón genera chistes desde Gemini;
- frontend llama solo a `/api/joke`;
- la serverless function lee `process.env.GEMINI_API_KEY`;
- la key no aparece en DevTools;
- el error se muestra en la UI si falla el backend.

## Troubleshooting

| Problema | Causa probable | Solución |
|----------|----------------|----------|
| `npm run dev` falla con recursión | Script mal nombrado | Usar `npm run local` |
| `/api/joke` da 404 | Se levantó con `live-server` | Usar `npx --yes vercel dev` |
| `GEMINI_API_KEY no configurada` | Falta `.env` | Crear `.env` y reiniciar Vercel Dev |
| `Cannot find module @google/generative-ai` | Falta instalar dependencias | Ejecutar `npm install` |
| La key aparece en DevTools | Se puso en frontend | Moverla a `.env` y leerla desde `process.env` |
