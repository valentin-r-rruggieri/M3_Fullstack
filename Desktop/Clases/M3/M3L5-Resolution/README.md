# Chat Demo — Ejercicio AI Prompting M3L5

SPA de chat minimalista con **dos bugs reales e intencionales**, construida para practicar el ciclo completo de AI Prompting:

> **Diagnóstico → Prompt estructurado → Fix → Verificación**

El aprendizaje no es el código. El código es el **pretexto** para practicar cómo estructurar prompts que realmente resuelvan problemas de frontend.

---

## 1. Los dos bugs: descripción, causa raíz y fix

### Bug 1 — Fetch: UI se queda en loading ante 404

| Aspecto | Detalle |
|---------|---------|
| **SÍNTOMA observable** | La URL del fetch apunta a una ruta inexistente. Network muestra status 404 (rojo). La UI se queda en "loading" para siempre. El catch nunca se ejecuta. |
| **CAUSA RAÍZ** | fetch() NO rechaza la promesa ante errores HTTP (404, 500). Solo rechaza ante fallos de red real. Sin validar response.ok, el 404 pasa por el try como si fuera éxito. |
| **FIX** | Agregar `if (!response.ok) { throw new Error(...) }` antes de `return response.json()` |
| **VERIFICACIÓN** | Network → status 404 (rojo) ✓ — Console → Error: "HTTP 404: Not Found" ✓ — UI → sale de loading y muestra panel de error ✓ |

### Bug 2 — CSS: layout roto en mobile

| Aspecto | Detalle |
|---------|---------|
| **SÍNTOMA observable** | En DevTools Responsive Mode (320px) con teclado simulado: el composer (input) desaparece, el body genera scroll lateral o vertical, el panel de mensajes no scrollea internamente. |
| **CAUSA RAÍZ** | height: 100vh no considera el teclado virtual en mobile. El flex child (.messages) sin min-height: 0 no puede encogerse. El input del composer sin min-width: 0 puede desbordar el contenedor. |
| **FIXES** | .app: height: 100dvh + overflow: hidden — .messages: flex: 1 1 0 + min-height: 0 — .composer__input: min-width: 0 |
| **VERIFICACIÓN** | DevTools → Responsive 320px → con teclado simulado: composer visible ✓ — No hay scroll lateral en body ✓ — Solo .messages scrollea internamente ✓ |

---

## 2. Los dos prompts modelo (completos)

### PROMPT 1 — Bug de fetch

Estructura completa siguiendo la plantilla de la lecture:

```text
Contexto:
SPA de chat en vanilla JS con estados loading/success/error.
Uso módulos ES (api.js, state.js, ui.js, main.js).

Objetivo:
Cuando fetch responde 404 o 500, la UI debe salir de loading
y mostrar el panel de error con un mensaje legible.
El loading debe apagarse SIEMPRE, incluso si hay error.

Restricciones:
- Sin frameworks ni librerías externas
- Mantener modularidad: api.js solo hace fetch, no toca el DOM
- No instalar paquetes npm

Evidencia:
- Problema: al recibir 404, la UI queda en "loading" y no muestra error
- Snippet actual de api.js:
  ```javascript
  export async function fetchMessages() {
    const response = await fetch(API_URL)
    return response.json()
  }
  ```
- Network muestra status 404 en GET /posts?_limit=8
- El catch en main.js nunca se ejecuta (console.error no aparece)

Formato de salida:
- 2 hipótesis sobre por qué no se muestra el error
- Fix mínimo en código (máximo 3 líneas nuevas)
- Checklist de verificación en DevTools

Criterios de éxito:
- Con URL inválida: Network muestra 404, Console muestra el error lanzado manualmente
- UI sale de loading y muestra "Mensajes no encontrados (404)"
- Con URL válida: la app sigue funcionando normal
- El catch SIEMPRE se ejecuta (tanto para error HTTP como de red)
```

### PROMPT 2 — Bug de CSS

```text
Contexto:
SPA de chat mobile-first, vanilla CSS, layout flex:
header fijo arriba + panel .messages scrolleable + .composer fijo abajo.

Objetivo:
En mobile (320px), cuando el teclado virtual está abierto:
- El composer (input + botón) debe ser siempre visible
- Solo .messages debe scrollear internamente
- El body NO debe tener scroll lateral ni vertical

Restricciones:
- Solo CSS, cambios mínimos en HTML si no hay alternativa
- No usar librerías externas
- Mantener la estructura actual del HTML (clases .app, .messages, .composer)

Evidencia:
- CSS actual:
  ```css
  .app { height: 100vh; display: flex; flex-direction: column; }
  .messages { flex: 1; overflow-y: auto; }
  .composer__input { flex: 1; }
  ```
- Síntoma en DevTools Responsive Mode (320px) con teclado simulado:
  composer desaparece, body tiene scroll lateral, .messages no scrollea internamente

Formato de salida:
- Propuesta CSS completa con los cambios necesarios
- Explicación breve de por qué cada propiedad resuelve el síntoma
- Alternativa para browsers sin soporte de 100dvh
- Pasos para verificar en DevTools Responsive Mode

Criterios de éxito:
- En 320px con teclado simulado: composer visible ✓
- Body sin scroll lateral ✓
- Solo .messages scrollea internamente ✓
- Header y composer siempre accesibles ✓
```

---

## 3. El ciclo completo

```text
síntoma en DevTools
  ↓ diagnóstico con evidencia
prompt estructurado
  (contexto + objetivo + restricciones + evidencia + formato + criterios)
  ↓ respuesta de la IA
evaluar: ¿respeta el stack? ¿usa APIs reales? ¿no asume HTML incorrecto?
  ↓ si sí
aplicar fix mínimo
  ↓
verificar en DevTools / Responsive Mode
  ↓ si algo falla
iterar:
  "La respuesta asumió X pero mi estructura es Y. Acá el HTML real: [snippet]"
```

### Flujo visual

```text
┌─────────────┐     ┌──────────────────┐     ┌────────────┐     ┌──────────────┐
│ 1. Síntoma  │ ──→ │ 2. Prompt       │ ──→ │ 3. Fix     │ ──→ │ 4. Verificar │
│ en DevTools │     │ estructurado     │     │ aplicado   │     │ en DevTools  │
└─────────────┘     └──────────────────┘     └────────────┘     └──────────────┘
                                                                    │
                                                                    ↓
                                                              ¿Funciona?
                                                              ├── Sí → ✅
                                                              └── No → volver a 2
```

---

## 4. Cómo reproducir los bugs (guía para el starter)

### Bug 1 — Fetch

1. Abrí `src/api.js` en el starter
2. Cambiá `API_URL` por una URL inválida, por ejemplo:
   `https://jsonplaceholder.typicode.com/invalida`
3. Abrí DevTools → pestaña **Network**
4. Recargá la app
5. **Observá**: Network muestra un request en rojo con status 404
6. **Observá**: la UI se queda en "Cargando mensajes..." para siempre
7. **Conclusión**: el error HTTP no activó el catch. El bug está confirmado.

### Bug 2 — CSS

1. Abrí la app del starter en el navegador
2. Abrí DevTools → **Responsive Mode** → seleccioná 320px de ancho
3. Simulá el teclado virtual (si el browser lo permite) o achicá el viewport
4. **Observá**: el composer con el input y botón desaparece
5. **Observá**: el body puede tener scroll lateral
6. **Conclusión**: el layout no se adapta al viewport dinámico en mobile

---

## 5. Checklist de validación post-fix

### Bug 1 — Fetch

- [ ] Network muestra 404 en rojo al usar URL inválida
- [ ] Console muestra "Error: HTTP 404: Not Found" o similar
- [ ] UI sale de "loading" y muestra panel de error con mensaje
- [ ] El botón "Reintentar" funciona
- [ ] Con la URL original restaurada, la app carga mensajes normalmente

### Bug 2 — CSS

- [ ] Responsive 320px: el composer (input + botón) es visible
- [ ] No aparece scrollbar horizontal en el body
- [ ] Solo `.messages` scrollea internamente
- [ ] El header es siempre visible
- [ ] Con texto largo en el input, no hay overflow horizontal

---

## 6. Antipatrones de prompting detectados en clase

| Prompt malo | Por qué falla | Versión corregida |
|-------------|---------------|-------------------|
| "Arreglá el fetch" | Sin evidencia → la IA adivina el contexto | "Network muestra 404, UI queda en loading, snippet de api.js..." |
| "El CSS está roto" | Sin contexto → puede sugerir Bootstrap o cambios radicales | "320px con teclado, composer desaparece, CSS actual de .app..." |
| "No funciona" | Sin objetivo → no hay criterio de éxito medible | "Quiero que el loading se apague y muestre error al recibir 404" |

### Señales de que la IA está alucinando

- Propone métodos que no existen (`.jsonParsed()`, `.reverse()` en strings)
- Sugiere selectores CSS que no están en tu HTML (`.chat-wrapper`, `#message-input`)
- Recomienda instalar librerías (axios, date-fns, Bootstrap) a pesar de las restricciones
- Asume estructura de DOM diferente a la real

---

## 7. Iteración: ejemplos de turno 2 y turno 3

### Turno 2 — Agregar timeout al fetch

```text
El fix con response.ok funciona para 404 y 500.
Pero si la red se cae completamente, fetch nunca resuelve
y la UI queda colgada en loading indefinidamente.

Agregá manejo de timeout con AbortController (8 segundos).
Si se supera el tiempo, mostrar error "No se pudo conectar".
Mantené el manejo de 404/500 que ya está.
Sin librerías externas.
```

### Turno 3 — Aprender del fix

```text
Entendí el fix y funciona. Ahora explicame:

1. ¿Por qué fetch no rechaza automáticamente en 404?
2. ¿Cuál es la diferencia entre un error de red real y un error HTTP?
3. ¿En qué casos AbortController lanza al catch y en cuáles no?

No me des más código, solo la explicación conceptual.
```

---

## 8. Cómo correr el proyecto

```bash
cd M3L5-Resolution
npx --yes live-server --port=8096
```

O desde VS Code: abrí la carpeta → Live Server → Go Live.

Necesitás servidor HTTP porque el proyecto usa módulos ES (`type="module"`).

---

## 9. Estructura del proyecto

```text
M3L5-Resolution/
├── index.html        → Estructura HTML de la SPA de chat
├── styles.css        → CSS con todos los fixes aplicados
├── .gitignore        → Ignora GUION.md
├── README.md         → Este archivo
├── GUION.md          → Guía para el instructor (en .gitignore)
└── src/
    ├── main.js       → Coordinador del flujo
    ├── api.js        → Capa de red (con response.ok)
    ├── state.js      → Estado global de la app
    └── ui.js         → Render y mensajes de error
```

---

## 10. Glosario

| Término | Definición |
|---------|------------|
| **Prompt estructurado** | Solicitud a la IA que incluye contexto, objetivo, restricciones, evidencia, formato de salida y criterios de éxito |
| **Response.ok** | Propiedad booleana de la Response API que es `true` para status HTTP 200-299 |
| **100dvh** | Unidad de viewport dinámica que se recalcula cuando aparece/desaparece el teclado en mobile |
| **min-height: 0** | Permite que un flex child se encoja por debajo de su contenido mínimo |
| **min-width: 0** | Permite que un flex item con texto no desborde el contenedor |
| **Alucinación** | Respuesta incorrecta que la IA da con total confianza (método inexistente, selector inventado, etc.) |
| **Iteración** | Ciclo de refinamiento: corregir suposiciones, agregar edge cases, pedir explicaciones |
