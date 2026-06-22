# Chat AI Engine — Ejercicio Práctico M3L6

![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-ES_Modules-f7df1e)
![No Framework](https://img.shields.io/badge/No_Framework-100%25_JS-0f172a)
![Mock API](https://img.shields.io/badge/API-Mock_sin_key-1d4ed8)

Este proyecto construye el motor completo de un chat con AI sin usar una API key real en el frontend. La app demuestra cómo armar un payload correcto para Anthropic, conservar historial, normalizar `content[]`, bloquear la UI durante requests, aplicar debounce y manejar rate limits `429` con `retry-after`.

La idea no es “hacer un chatbot lindo” solamente. La idea es entender el contrato técnico que hay detrás de un chat de producción.

## Objetivos de aprendizaje

En este ejercicio vas a aprender a:

- Comprender el contrato de una API de mensajes y la estructura correcta del payload.
- Construir requests para un modelo de AI con system prompt y mensajes.
- Implementar un chat engine básico con historial de conversación.
- Normalizar respuestas de la API cuando llegan como bloques de contenido.
- Manejar errores de rate limit `429` con lógica de retry.
- Prevenir múltiples requests usando debounce en el envío de mensajes.

## Contexto de trabajo

Trabajamos sobre una SPA de chat con un chat engine incompleto. El chat ya tiene UI, pero faltan piezas clave para que la integración con AI sea robusta.

El objetivo es construir el motor del chat que:

- arme correctamente el payload de la API;
- mantenga el historial de conversación;
- procese respuestas en formato `content[]`;
- maneje rate limits `429`;
- evite múltiples requests con debounce y bloqueo de UI.

Al final, el chat envía mensajes, recibe **respuestas mock** y maneja estados de UI correctamente.

## 1. Qué problema resuelve

Un chat con AI puede “parecer” simple:

```js
const raw = await callAI({
  messages: [
    { role: "system", content: "Sos un asistente" },
    { role: "user", content: text },
  ],
})
```

Pero ese código tiene varios problemas:

- En Anthropic, `system` no va dentro de `messages[]`.
- El modelo no recuerda nada si no mandamos historial.
- La respuesta no viene como string directo, viene como `content[]`.
- El usuario puede disparar múltiples requests si hace doble click o Enter rápido.
- Un `429` necesita espera y reintento controlado, no un loop infinito.

El patrón correcto del proyecto es:

```js
chatHistory = appendUserMessage(chatHistory, trimmed)
const trimmedHistory = getTrimmedHistory(chatHistory, 10)
const payload = buildPayload(currentCharacter, trimmedHistory)
const raw = await callAI(payload)
const { text } = normalizeAIResponse(raw)
chatHistory = appendAssistantMessage(chatHistory, text)
appendMessage("assistant", text)
```

## 2. Pipeline completo

```txt
Usuario escribe
  ↓
debounce(300ms)
  ↓
isLoading check
  ↓
appendUserMessage()        → agrega mensaje al historial
  ↓
getTrimmedHistory()        → recorta últimos N mensajes
  ↓
buildPayload()             → system top-level + messages[]
  ↓
callAI()                   → mock con shape de Anthropic
  ↓
normalizeAIResponse()      → content[] → string seguro
  ↓
appendAssistantMessage()   → guarda respuesta en historial
  ↓
appendMessage()            → renderiza burbuja
```

## 3. Conceptos clave

### Payload correcto: `system` top-level

Anthropic espera este formato:

```js
{
  model: "claude-3-5-sonnet-latest",
  system: "Actúa como Dr. Science...",
  messages: [
    { role: "user", content: "Hola" },
    { role: "assistant", content: "Hola, ¿en qué te ayudo?" },
  ],
  max_tokens: 150,
  temperature: 0.7,
}
```

El error típico es copiar el patrón de otra API:

```js
{
  messages: [
    { role: "system", content: "Actúa como Dr. Science..." }, // ❌
    { role: "user", content: "Hola" },
  ],
}
```

En este proyecto `buildPayload()` evita ese bug:

```js
export function buildPayload(character, messages) {
  return {
    model: "claude-3-5-sonnet-latest",
    system: createSystemPrompt(character),
    messages,
    max_tokens: 150,
    temperature: character.temperature,
  }
}
```

### Historial: por qué se envía completo

La API no tiene memoria entre requests. Si el usuario pregunta “¿y eso por qué?”, el modelo solo puede entender “eso” si mandamos los turnos anteriores.

```js
export function appendUserMessage(messages, text) {
  return [...messages, { role: "user", content: text }]
}
```

Se usa spread para no mutar el array original. Eso vuelve el flujo más claro: cada función recibe historial y devuelve historial nuevo.

También recortamos:

```js
export function getTrimmedHistory(messages, maxTurns = 10) {
  return messages.slice(-maxTurns)
}
```

Recortar importa porque cada mensaje suma `input_tokens`. Más tokens implican más costo y más chance de rate limit.

### Normalización de `content[]`

La respuesta de Anthropic no es:

```js
raw.content === "Hola"
```

Es:

```js
raw.content = [
  { type: "text", text: "Hola" },
]
```

Por eso esto rompe:

```js
raw.content.trim() // ❌ TypeError: content es array
```

El proyecto normaliza así:

```js
const text = blocks
  .filter((block) => block && block.type === "text" && typeof block.text === "string")
  .map((block) => block.text)
  .join("")
  .trim()
```

Además detecta `stop_reason: "max_tokens"` para marcar respuestas truncadas.

### Debounce + lock

Son dos defensas distintas:

| Defensa | Cuándo actúa | Qué evita |
|---------|--------------|-----------|
| `debounce` | Antes del request | Enter/clicks repetidos en milisegundos |
| `isLoading` | Durante el request | Requests paralelos mientras la API responde |

No se reemplazan entre sí. Se complementan.

### 429 y retry-after

El mock dispara un `429` cada 4to request. El flujo correcto:

```txt
429 recibido
  ↓
leer retryAfterSeconds
  ↓
mostrar countdown visible
  ↓
esperar
  ↓
reintentar una sola vez
  ↓
si falla de nuevo, mostrar error
```

Un solo reintento evita loops infinitos y protege al usuario de una UI que parece trabada.

## 4. Estructura del proyecto

| Archivo | Responsabilidad | Exporta | Importa |
|---------|-----------------|---------|---------|
| `src/main.js` | Coordina eventos y pipeline | Nada | engine + UI |
| `src/engine/history.js` | Maneja historial inmutable | `appendUserMessage`, `appendAssistantMessage`, `getTrimmedHistory`, `resetHistory` | Nada |
| `src/engine/payload.js` | Personajes y payload Anthropic | `getCharacter`, `createSystemPrompt`, `buildPayload`, `isValidPayload` | Nada |
| `src/engine/normalizer.js` | Convierte respuesta raw a texto seguro | `normalizeAIResponse`, `extractUsage` | Nada |
| `src/engine/mockApi.js` | Simula API real y 429 | `callAI` | Nada |
| `src/ui/render.js` | Toca el DOM y renderiza chat | funciones de render/UI | Nada |

## 5. Cómo correr el proyecto

Desde `M3L6-Resolution`:

```bash
npx --yes live-server --port=8096
```

Alternativas:

```bash
python -m http.server 8096
```

O con VS Code Live Server usando “Go Live”.

Necesitás servidor HTTP porque el proyecto usa:

```html
<script type="module" src="./src/main.js"></script>
```

Los ES Modules no deben probarse como `file://` para este tipo de ejercicio.

## 6. Cómo migrar de mock a API real

No pongas una API key en el frontend. El patrón correcto es:

```txt
Frontend
  ↓
Tu backend / proxy serverless
  ↓ agrega x-api-key en servidor
Anthropic API
```

El único módulo a reemplazar sería `mockApi.js`:

```js
export async function callAI(payload) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const err = new Error(`HTTP ${response.status}`)
    err.status = response.status
    throw err
  }

  return response.json()
}
```

El resto del engine no cambia porque el shape esperado sigue siendo el mismo.

## 7. Bugs comunes y cómo debuggearlos

### Bug 1: HTTP 400 en API real

Causa probable: `system` está dentro de `messages[]`.

Diagnóstico:

```js
console.log(payload.messages)
```

Si aparece `{ role: "system" }`, el payload está mal.

Fix: usar `buildPayload()` y verificar:

```js
console.log(isValidPayload(payload)) // true
```

### Bug 2: `[object Object]` o burbuja vacía

Causa probable: se accede a `raw.content` como si fuera string.

Diagnóstico:

```js
console.log(raw.content)
```

Si ves un array, necesitás `normalizeAIResponse(raw)`.

### Bug 3: requests duplicados

Causa probable: falta `debounce`, falta `isLoading`, o el botón no se deshabilita.

Diagnóstico:

```js
console.log("sendMessage llamado")
```

Si aparece varias veces por un solo intento del usuario, revisar el listener y el lock.

## 8. Glosario

- **payload**: objeto que enviamos a la API.
- **system prompt**: instrucción de alto nivel que define rol, tono y límites del asistente.
- **messages[]**: historial de turnos con `role` y `content`.
- **role**: autor del mensaje: `"user"` o `"assistant"` en Anthropic.
- **content[]**: array de bloques que devuelve la API.
- **stop_reason**: razón por la que el modelo terminó la respuesta.
- **max_tokens**: límite de tokens de salida.
- **temperature**: nivel de variabilidad de respuesta.
- **input_tokens**: tokens enviados al modelo.
- **output_tokens**: tokens generados por el modelo.
- **debounce**: técnica para agrupar llamadas rápidas.
- **UI lock**: bloqueo de input y botón durante un request.
- **rate limit**: límite de requests impuesto por la API.
- **retry-after**: tiempo recomendado antes de reintentar.
- **normalización**: convertir datos raw en un formato seguro para la app.
