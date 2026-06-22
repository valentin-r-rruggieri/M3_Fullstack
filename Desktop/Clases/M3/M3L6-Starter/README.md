# Chat AI Engine — Starter M3L6

Este es el punto de partida del Hands On de **Integración con AI API**.

La app ya tiene toda la interfaz visual resuelta: chat, burbujas, selector de personaje, botón de reset, typing indicator y panel de estado. También incluye un `mockApi.js` que simula una API de AI real sin usar API key.

Tu trabajo en clase es transformar este starter, que hoy funciona “mal pero sin romper”, en un chat engine robusto como el proyecto `M3L6-Resolution`.

## Objetivos de aprendizaje

En este Hands On vas a practicar:

- Comprender el contrato de una API de mensajes y la estructura correcta del payload.
- Construir requests para un modelo de AI con system prompt y mensajes.
- Implementar un chat engine básico con historial de conversación.
- Normalizar respuestas cuando llegan como bloques de contenido `content[]`.
- Manejar errores de rate limit `429` con lógica de retry.
- Prevenir múltiples requests usando debounce y bloqueo de UI.

## Contexto de trabajo

Trabajamos sobre una SPA de chat con un engine incompleto. La UI ya existe, pero todavía faltan las piezas clave para que la integración con AI sea robusta.

El objetivo es construir el motor que:

- arme correctamente el payload de la API;
- mantenga el historial de conversación;
- procese respuestas en formato `content[]`;
- maneje rate limits `429`;
- evite múltiples requests con debounce y bloqueo de UI.

Al final, el chat deberá enviar mensajes, recibir **respuestas mock** y manejar estados de UI correctamente.

## Objetivo del ejercicio

Al terminar, vas a tener un chat que:

- Construye un payload correcto para Anthropic.
- Usa `system` como campo top-level, no como `role: "system"`.
- Mantiene historial de conversación.
- Recorta historial para controlar tokens.
- Normaliza `content[]` de la respuesta a un string seguro.
- Evita requests duplicados con debounce + lock de UI.
- Maneja errores `429` con countdown y reintento único.
- Permite cambiar de personaje limpiando el historial anterior.

## Cómo levantar el Starter

Desde esta carpeta:

```bash
npx --yes live-server --port=8097
```

Abrir:

```txt
http://127.0.0.1:8097
```

También podés usar:

```bash
python -m http.server 8097
```

Este proyecto usa ES Modules:

```html
<script type="module" src="./src/main.js"></script>
```

Por eso conviene correrlo con servidor HTTP y no abrir `index.html` directo con `file://`.

## Estado inicial del Starter

El Starter carga y permite enviar mensajes, pero tiene bugs intencionales.

Si enviás un mensaje, vas a ver que la respuesta puede aparecer como:

```txt
[object Object]
```

Eso es parte del ejercicio. El mock devuelve una respuesta con este shape:

```js
{
  role: "assistant",
  content: [
    { type: "text", text: "Respuesta del asistente..." }
  ],
  stop_reason: "end_turn",
  usage: {
    input_tokens: 120,
    output_tokens: 35
  }
}
```

El bug aparece porque el Starter intenta renderizar `raw.content` como si fuera un string, pero en realidad es un array de bloques.

## Qué archivos NO se tocan

Estos archivos ya están completos:

| Archivo | Por qué no se toca |
|---------|--------------------|
| `index.html` | La estructura visual ya está lista |
| `styles.css` | Todo el diseño ya está resuelto |
| `src/engine/mockApi.js` | Simula la API real y el error 429 |
| `src/ui/render.js` | Ya sabe pintar burbujas, typing, status y lock de UI |

En clase nos concentramos en el engine, no en el CSS ni en el HTML.

## Qué archivos SÍ vas a modificar

| Archivo | Qué vas a implementar |
|---------|------------------------|
| `src/engine/history.js` | Funciones para agregar mensajes, recortar historial y resetear |
| `src/engine/payload.js` | Construcción del payload correcto para Anthropic |
| `src/engine/normalizer.js` | Conversión de `content[]` a texto seguro |
| `src/main.js` | Pipeline completo del chat: debounce, lock, payload, mock, retry 429 |

## Orden de resolución recomendado

### Paso 1 — Inspeccionar el anti-patrón

Abrí `src/main.js`.

El Starter tiene este problema:

```js
messages: [
  { role: "system", content: currentCharacter.system },
  { role: "user", content: text },
]
```

Ese formato copia el patrón de OpenAI. En Anthropic, `system` va top-level:

```js
{
  model: "claude-3-5-sonnet-latest",
  system: "Actúa como Dr. Science...",
  messages: [
    { role: "user", content: "Hola" }
  ]
}
```

### Paso 2 — Completar `history.js`

Implementar:

```js
appendUserMessage(messages, text)
appendAssistantMessage(messages, text)
getTrimmedHistory(messages, maxTurns)
resetHistory()
```

La clave es que las funciones no muten el array original.

Correcto:

```js
return [...messages, { role: "user", content: text }]
```

Evitar:

```js
messages.push(...)
return messages
```

### Paso 3 — Completar `payload.js`

Implementar:

```js
createSystemPrompt(character)
buildPayload(character, messages)
isValidPayload(payload)
```

El punto central:

```js
system: createSystemPrompt(character)
```

debe estar al mismo nivel que:

```js
model
messages
max_tokens
temperature
```

No dentro de `messages[]`.

### Paso 4 — Completar `normalizer.js`

Implementar:

```js
normalizeAIResponse(raw)
extractUsage(raw)
```

El objetivo es transformar esto:

```js
content: [
  { type: "text", text: "Hola" },
  { type: "tool_use" }
]
```

en esto:

```js
{
  text: "Hola",
  truncated: false
}
```

La función debe ser defensiva. Estos casos no deberían romper:

```js
normalizeAIResponse({ content: null })
normalizeAIResponse({ content: [] })
normalizeAIResponse({ content: [{ type: "tool_use" }] })
normalizeAIResponse({})
```

### Paso 5 — Reescribir `main.js`

Reemplazar el anti-patrón por el pipeline completo:

```txt
submit
  → debounce
  → isLoading check
  → appendUserMessage
  → getTrimmedHistory
  → buildPayload
  → callAI
  → normalizeAIResponse
  → appendAssistantMessage
  → appendMessage
```

Además:

- bloquear input y botón durante el request;
- mostrar typing indicator;
- loguear payload válido;
- loguear tokens;
- manejar `429` con countdown;
- reintentar una sola vez;
- resetear historial al cambiar personaje;
- resetear historial al tocar el botón de nueva conversación.

## Qué deberías ver al terminar

Cuando el ejercicio esté resuelto:

1. Enviar un mensaje muestra una respuesta legible, no `[object Object]`.
2. Console muestra:

```txt
[Payload válido] true
[Tokens] input: ..., output: ...
```

3. Al cuarto request aparece un countdown por rate limit:

```txt
Rate limit. Reintentando en 5s...
```

4. Después del countdown, la app reintenta y aparece la respuesta.
5. Cambiar de personaje actualiza nombre/avatar y limpia la conversación.
6. El botón de reset deja el chat en blanco otra vez.

## Comparación con Resolution

La carpeta `M3L6-Resolution` contiene el resultado final.

Usala como referencia para:

- verificar el contrato del payload;
- comparar el pipeline de `main.js`;
- revisar cómo se implementa el retry 429;
- consultar el README completo y el `GUION.md` docente.

La meta del Hands On es que, al terminar los TODOs del Starter, el comportamiento sea equivalente al de `M3L6-Resolution`.

## Bugs intencionales del Starter

| Bug | Síntoma | Archivo |
|-----|---------|---------|
| `system` dentro de `messages[]` | En API real sería HTTP 400 | `main.js` |
| Sin historial real | El asistente no recuerda turnos anteriores | `main.js` |
| `raw.content` usado como string | Aparece `[object Object]` | `main.js` |
| Sin debounce | Doble Enter puede disparar múltiples llamadas | `main.js` |
| Sin manejo de 429 | No hay countdown ni retry claro | `main.js` |

## Checklist de entrega

- [ ] `history.js` completo.
- [ ] `payload.js` construye payload con `system` top-level.
- [ ] `isValidPayload(payload)` devuelve `true` para payload correcto.
- [ ] `normalizer.js` convierte `content[]` a string.
- [ ] `extractUsage()` devuelve tokens con fallback a `0`.
- [ ] `main.js` usa debounce.
- [ ] `main.js` usa `isLoading`.
- [ ] La UI se bloquea durante requests.
- [ ] El 429 muestra countdown.
- [ ] El retry se hace una sola vez.
- [ ] Cambiar personaje resetea historial.
- [ ] El botón reset limpia mensajes.

## Comandos útiles

Validar sintaxis:

```bash
node --check src/main.js
node --check src/engine/history.js
node --check src/engine/payload.js
node --check src/engine/normalizer.js
```

Buscar TODOs:

```bash
rg "TODO" src
```

Levantar Starter:

```bash
npx --yes live-server --port=8097
```
