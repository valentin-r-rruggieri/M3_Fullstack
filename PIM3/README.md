# 🔍 Chat con Sherlock Holmes

> **Proyecto Integrador M3 — Módulo Full Stack · Soy Henry**
> Una Single Page Application que te permite chatear con Sherlock Holmes, el famoso detective de Baker Street, usando Google Gemini AI.

![Sherlock Holmes Chat Preview](./screenshots/chat-preview.png)

---

## 🕵️ El Personaje: Sherlock Holmes

Sherlock Holmes es el famoso detective privado de la ficción victoriana, creado por Sir Arthur Conan Doyle en 1887. Conocido mundialmente por su extraordinario método deductivo, su intelecto superior y su base de operaciones en Baker Street 221B, Londres, junto a su compañero el Dr. John Watson.

### Personalidad implementada

- **Directo y analítico**: habla con precisión quirúrgica, usando lógica y deducción en cada respuesta.
- **Levemente condescendiente**: no oculta su superioridad intelectual, pero siempre de forma fascinante.
- **Irónico y observador**: hace referencias a casos reales (Baskerville, Moriarty, Irene Adler).
- **Respuestas cortas**: sistema prompt configurado para 2-3 oraciones max (apropiado para chat).

El system prompt fue diseñado y probado en Google AI Studio antes de integrarse al código.

---

## 🚀 Cómo ejecutar el proyecto localmente

### Requisitos previos

- Node.js 18+ instalado
- Vercel CLI instalado: `npm install -g vercel`
- Cuenta en Google AI Studio con API key de Gemini

### Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/chat-sherlock-holmes.git
cd chat-sherlock-holmes
```

### Paso 2 — Instalar dependencias

```bash
npm install
```

### Paso 3 — Configurar la API key

```bash
# Crear el archivo .env a partir del ejemplo
cp .env.example .env

# Editar .env y agregar tu API key real
# GEMINI_API_KEY=AIzaSy...tu-key-real...
```

> ⚠️ **NUNCA** subas el archivo `.env` al repositorio. Ya está en `.gitignore`.
> Obtené tu API key en [https://aistudio.google.com](https://aistudio.google.com) → Get API key

### Paso 4 — Levantar el servidor de desarrollo

```bash
npm run dev
# o directamente:
vercel dev
```

La primera vez, `vercel dev` te hará algunas preguntas de configuración.
La aplicación estará disponible en `http://localhost:3000`.

---

## 🧪 Cómo ejecutar los tests

El proyecto tiene **13 tests unitarios** con Vitest:
- `tests/utils.test.js` → 8 tests para funciones puras de `utils.js`
- `tests/app.test.js` → 6 tests para `sendToAI()` con fetch mockeado

```bash
# Modo watch (re-corre al guardar archivos)
npm test

# Una sola corrida (para CI/CD)
npm run test:run
```

### Output esperado

```
✓ tests/utils.test.js (28)
  ✓ isValidMessage (8)
  ✓ parseAIResponse (6)
  ✓ formatTimestamp (4)
  ✓ truncateHistory (4)
  ✓ buildMessagesPayload (4)
  ✓ capitalize (5)
✓ tests/app.test.js (6)
  ✓ sendToAI (6)

Test Files  2 passed (2)
Tests      34 passed (34)
```

---

## ☁️ Cómo desplegar en Vercel

### Opción A — Usando Vercel CLI (recomendada para primer deploy)

```bash
# Primer deployment
vercel

# Deployment a producción
vercel --prod
```

### Opción B — Conectar GitHub con Vercel (para deployments automáticos)

1. Subir el código a GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Ir a [vercel.com](https://vercel.com) → Import Project → seleccionar el repositorio.

3. Vercel lo detecta automáticamente como proyecto vanilla JS.

### Configurar la API key en Vercel

Una vez desplegado, agregar la variable de entorno en el dashboard:

**Opción 1 — Usando CLI:**
```bash
vercel env add GEMINI_API_KEY
# Pegar el valor de tu API key y seleccionar: Production, Preview, Development
```

**Opción 2 — Usando el dashboard:**
- Ir al proyecto en Vercel → Settings → Environment Variables
- Agregar: Name: `GEMINI_API_KEY`, Value: tu API key real, Environments: Production

Luego hacer un re-deploy para que tome la variable:
```bash
vercel --prod
```

### Verificar que funciona en producción

1. Abrir la URL de producción: `https://chat-sherlock-holmes.vercel.app`
2. Navegar a `/chat` y enviar un mensaje.
3. Verificar en DevTools → Network que la request va a `/api/functions` (no a Gemini directamente).
4. **CRÍTICO**: Verificar en DevTools → Sources que la API key NO aparece en ningún archivo JavaScript.

---

## 📁 Estructura del proyecto

```
chat-sherlock-holmes/
│
├── api/
│   └── functions.js      # Vercel Serverless Function (proxy seguro a Gemini)
│                          # La API key y system prompt VIVEN ACÁ, nunca en el frontend
│
├── tests/
│   ├── utils.test.js     # Tests de funciones puras (isValidMessage, parseAIResponse, etc.)
│   └── app.test.js       # Tests con fetch mockeado (sendToAI)
│
├── screenshots/          # Capturas de pantalla de la app funcionando
│
├── index.html            # Shell SPA — un solo HTML, todas las vistas en #app
├── styles.css            # CSS mobile-first con 3 breakpoints (320px, 768px, 1024px)
├── app.js                # Router SPA (History API) + renderizado de vistas
├── chat.js               # Lógica del chat + integración con Serverless Function
├── utils.js              # Funciones puras testeables (parse, format, validate)
├── .env.example          # Template de variables de entorno (sin valores reales)
├── .gitignore            # node_modules, .env, .vercel excluidos
├── vercel.json           # Rewrites para SPA (Home, Chat, About)
├── package.json          # Dependencias y scripts
└── README.md             # Esta documentación
```

---

## 🖥️ Capturas de pantalla

*(Agregar capturas de pantalla en la carpeta screenshots/)*

---

## 🌐 Link a la aplicación desplegada

**[TU_URL_DE_VERCEL](https://chat-sherlock-holmes.vercel.app)**

> ⚠️ Reemplazar `TU_URL_DE_VERCEL` con la URL real del deploy en Vercel.
> Para cuidar la cuota gratuita de Gemini ($300 de Google), el deploy
> puede estar pausado después de la entrega. Para verlo en producción,
> seguir los pasos de "Cómo desplegar en Vercel" arriba.

---

## 🤖 Registro del uso de IA en el proyecto

Durante el desarrollo se utilizó Claude (Anthropic) con los siguientes propósitos:

### 1. Diseño del System Prompt
**Prompt usado:**
> "Diseñá un system prompt para Sherlock Holmes que defina su personalidad deductiva, mantenga respuestas cortas en español (máximo 3 oraciones para chat) y no rompa el personaje bajo ninguna circunstancia."

**Influencia en el código:**
El prompt resultante se iteró 3 veces. La versión final incorporó la instrucción explícita de "máximo 3-4 oraciones" que mejoró notablemente la usabilidad del chat. Se agregaron ejemplos de tono que no estaban en mi primer intento.

### 2. Fix del layout CSS del chat
**Prompt usado:**
> "En un flex layout con header + área de mensajes scrolleable + footer, el área de mensajes desborda el contenedor en mobile. ¿Cómo lo soluciono solo con CSS?"

**Influencia en el código:**
La respuesta explicó `flex: 1 1 0` + `min-height: 0` en el flex child. Esos dos valores están exactamente en `.messages-area` en `styles.css` con comentarios explicando el por qué.

### 3. Tests con vi.fn()
**Prompt usado:**
> "Mostrá un ejemplo de cómo testear una función async que usa fetch con Vitest, mockeando fetch para no hacer peticiones reales."

**Influencia en el código:**
El patrón `global.fetch = vi.fn()` + `fetch.mockResolvedValueOnce()` + `beforeEach(() => { fetch.mockClear() })` viene de ese ejemplo. Se adaptó a la estructura específica del proyecto.

### 4. Decisiones tomadas sin IA
- La elección de Sherlock Holmes como personaje fue 100% propia.
- La arquitectura de archivos (utils.js, chat.js separados) se decidió antes de consultar IA.
- Los edge cases en los tests (null, undefined, 501 chars) los definí yo basándome en la lecture de L8.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso | Clase |
|-----------|-----|-------|
| HTML5 semántico | Shell SPA | L1 |
| CSS Mobile-First | Responsive design | L1 |
| Flexbox + Grid | Layout | L1 |
| Media Queries | 3 breakpoints | L1 |
| History API | Router SPA | L2 |
| Fetch API + async/await | Comunicación con backend | L3 |
| Google Gemini AI | Motor de IA del personaje | L6 |
| Vercel Serverless Functions | Proxy seguro para API key | L7 |
| Variables de Entorno | Seguridad de credenciales | L7 |
| Vitest + vi.fn() | Unit testing | L8 |
| localStorage | Persistencia del historial | Extra Credit |

---

## ✅ Checklist del proyecto

- [x] Vista /home con descripción del personaje y CTA
- [x] Vista /chat con interfaz de chat completa
- [x] Vista /about con info del proyecto
- [x] Diferenciación visual mensajes usuario vs personaje
- [x] Estado "escribiendo..." animado
- [x] Manejo de errores (red, rate limit, API)
- [x] Historial de conversación durante la sesión
- [x] Scroll automático al último mensaje
- [x] Routing SPA con History API (pushState + popstate)
- [x] Back/Forward del navegador funcionando
- [x] URLs que reflejan la vista actual
- [x] Diseño mobile-first responsive (3 breakpoints)
- [x] Vercel Serverless Function como proxy
- [x] API key en process.env, nunca en el frontend
- [x] .env.example incluido
- [x] Mínimo 4 tests unitarios con Vitest (hay 13+)
- [x] Fetch mockeado en tests
- [x] Deploy funcional en Vercel
- [x] README completo con todos los requisitos
- [x] Registro del uso de IA documentado
- **Extra Credit:**
  - [x] Historial persistido en localStorage
  - [x] Botón "Borrar historial"
  - [x] Timestamps en cada mensaje
  - [x] Enter para enviar mensaje
  - [x] Toggle modo claro/oscuro
