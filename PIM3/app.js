/**
 * app.js — Lógica principal: Router SPA + renderizado de vistas
 *
 * Este archivo implementa el patrón SPA con History API (L2).
 *
 * RESPONSABILIDADES:
 *   1. Tabla de rutas: mapea paths → funciones de render
 *   2. router(): lee la URL actual y llama a la función de render correcta
 *   3. navigateTo(path): cambia la URL con pushState y llama a router()
 *   4. setupLinkInterception(): listener global para links <a>
 *   5. Renderizar las tres vistas: Home, Chat, About
 *   6. Inicializar la app al cargar
 *
 * FLUJO DE NAVEGACIÓN (L2):
 *   Click en link → setupLinkInterception → navigateTo → pushState + router
 *   Back/Forward → popstate → router
 *   Carga inicial → router (lee URL actual)
 */

import {
  handleSendMessage,
  initChat,
  clearHistory,
  hasStoredHistory,
} from './chat.js'

// ─────────────────────────────────────────────────────────────────────────────
// TABLA DE RUTAS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * routes: objeto que asocia cada path con su función de render.
 * Equivalente al "menú" que el router consulta (L2).
 *
 * El router normaliza el path antes de buscar:
 *   '/'      → renderHome  (redirect de raíz)
 *   '/home'  → renderHome
 *   '/chat'  → renderChat
 *   '/about' → renderAbout
 */
const routes = {
  '/':      renderHome,
  '/home':  renderHome,
  '/chat':  renderChat,
  '/about': renderAbout,
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * router() — Lee la URL actual y renderiza la vista correspondiente.
 *
 * ¿Por qué llamarlo manualmente después de pushState? (L2 — concepto clave)
 * pushState() cambia la URL PERO no dispara ningún evento.
 * Solo popstate lo hace (al presionar Back/Forward).
 * Por eso navigateTo() llama a router() manualmente después de pushState().
 */
function router() {
  const rawPath = window.location.pathname

  // Normalizar trailing slash: '/home/' → '/home' (excepto '/')
  const path = rawPath.length > 1 ? rawPath.replace(/\/$/, '') : rawPath

  // Buscar la función de render en la tabla de rutas
  const renderFn = routes[path] || renderNotFound

  renderFn()
  updateActiveNavLink()
}

/**
 * navigateTo(path) — Navegación programática.
 *
 * Paso 1: evitar entrada duplicada si ya estamos en ese path
 * Paso 2: pushState → cambia la URL sin recargar
 * Paso 3: router() → renderiza la nueva vista
 *
 * ⚠️ IMPORTANTE: pushState NO dispara popstate.
 *    Por eso llamamos router() manualmente (L2 — concepto crítico).
 *
 * @param {string} path - Ruta a navegar (ej: '/chat')
 */
export function navigateTo(path) {
  if (window.location.pathname === path) return
  window.location.replace // NO usamos esto
  history.pushState(null, '', path)
  router()
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERCEPCIÓN DE LINKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * setupLinkInterception() — Intercepta clicks en links internos.
 *
 * Usamos delegación de eventos: UN solo listener en document
 * en lugar de un listener por cada <a>. Esto funciona con links
 * dinámicos que se agregan después del load inicial (L2 — delegación).
 *
 * Filtros de exclusión (casos que NO interceptamos):
 *   - No es un link → return
 *   - Sin href → return
 *   - Ctrl/Cmd/Shift/Alt click → nueva pestaña, no interceptar
 *   - target="_blank" → diseñado para otra pestaña
 *   - link externo (distinto origin) → navegar normalmente
 *   - Ancla (#seccion) → scroll interno
 *   - No empieza con "/" → ruta relativa no manejada
 */
function setupLinkInterception() {
  document.addEventListener('click', (event) => {
    // Buscar el <a> más cercano (puede ser un click en un hijo del link)
    const link = event.target.closest('a')

    if (!link) return
    const href = link.getAttribute('href')
    if (!href) return

    // No interceptar modificadores de teclado
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (link.target === '_blank') return

    // No interceptar links externos
    if (link.origin !== window.location.origin) return

    // No interceptar anclas ni protocolos especiales
    if (href.startsWith('#')) return
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return

    // Solo interceptar rutas internas absolutas
    if (!href.startsWith('/')) return

    event.preventDefault()
    navigateTo(href)
  })
}

/**
 * Actualiza la clase .active en los links de la navbar.
 * Se llama después de cada navegación para reflejar la ruta actual.
 */
function updateActiveNavLink() {
  const currentPath = window.location.pathname
  document.querySelectorAll('.nav-link').forEach((link) => {
    const linkPath = link.getAttribute('href') || link.dataset.href
    link.classList.toggle('active', linkPath === currentPath)
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// VISTAS / RENDERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * renderHome() — Renderiza la vista /home
 *
 * La vista de bienvenida presenta al personaje y tiene un CTA para chatear.
 * El botón "Empezar a chatear" usa navigateTo('/chat').
 */
function renderHome() {
  const app = document.getElementById('app')

  app.innerHTML = `
    <section class="home-view" aria-label="Inicio">

      <div class="home-view__hero">
        <span class="home-view__avatar" role="img" aria-label="Lupa">🔍</span>
        <h1 class="home-view__title">Chat con Sherlock Holmes</h1>
        <p class="home-view__subtitle">
          El detective más brillante del mundo te espera en Baker Street 221B
        </p>
        <a href="/chat" class="btn-primary" data-href="/chat">
          Empezar a chatear →
        </a>
      </div>

      <div class="home-view__description">
        <h2>Sobre el Detective</h2>
        <p>
          Sherlock Holmes es el famoso detective privado creado por Sir Arthur Conan Doyle,
          conocido por su extraordinaria capacidad deductiva y su intelecto superior.
          Vive en Baker Street 221B junto a su compañero el Dr. Watson.
        </p>
        <ul class="home-view__traits">
          <li>Mente deductiva y analítica excepcional</li>
          <li>Obsesionado con los detalles que otros ignoran</li>
          <li>Directo, sarcástico y fascinantemente condescendiente</li>
          <li>Experto en química, esgrima, violín y boxeo</li>
          <li>Archienemigo: el Profesor James Moriarty</li>
        </ul>
      </div>

      <div class="home-view__description">
        <h2>¿Qué podés preguntarle?</h2>
        <ul class="home-view__traits">
          <li>Sus casos más famosos</li>
          <li>Sus métodos de deducción</li>
          <li>Su opinión sobre el Dr. Watson</li>
          <li>Consejos para resolver misterios</li>
          <li>Su relación con Irene Adler o Moriarty</li>
        </ul>
      </div>

    </section>
  `
}

/**
 * renderChat() — Renderiza la vista /chat
 *
 * Esta es la vista principal: interfaz de chat con burbujas,
 * input del usuario, botón de enviar y los estados de loading/error.
 *
 * Después de renderizar el HTML, configura los event listeners:
 *   - Click en botón enviar
 *   - Enter en el textarea (extra credit)
 *   - Click en "Borrar historial" (extra credit)
 *   - Resize automático del textarea
 */
function renderChat() {
  const app = document.getElementById('app')
  const storedHistory = hasStoredHistory()

  app.innerHTML = `
    <div class="chat-view" role="main" aria-label="Chat con Sherlock Holmes">

      <!-- Header del chat -->
      <header class="chat-view__header">
        <span class="chat-header__avatar" role="img" aria-label="Sherlock Holmes">🔍</span>
        <div class="chat-header__info">
          <h2>Sherlock Holmes</h2>
          <span class="chat-header__status">
            <span class="status-dot"></span>
            Detective, Baker Street 221B
          </span>
        </div>
        <div class="chat-header__actions">
          <!-- Botón borrar historial (extra credit) -->
          <button class="btn-icon" id="clear-btn" title="Borrar historial" aria-label="Borrar historial">
            🗑️
          </button>
          <!-- Botón toggle de modo oscuro/claro (extra credit) -->
          <button class="btn-icon" id="theme-btn" title="Cambiar tema" aria-label="Cambiar tema claro/oscuro">
            🌙
          </button>
        </div>
      </header>

      <!-- Badge de localStorage (extra credit) -->
      ${storedHistory ? '<div class="history-badge">💾 Historial guardado cargado</div>' : ''}

      <!-- Área de mensajes -->
      <section
        class="messages-area"
        id="messages-area"
        aria-live="polite"
        aria-label="Conversación"
      >
        <!-- Si no hay historial, mostrar mensaje vacío -->
        <div class="messages-empty" id="messages-empty">
          <span role="img" aria-label="Lupa">🔍</span>
          <p>El Sr. Holmes está esperando tu consulta.</p>
          <p style="font-size:0.8rem; color: var(--text-muted)">
            Escribí algo para comenzar la conversación.
          </p>
        </div>
      </section>

      <!-- Input del usuario -->
      <div class="composer" role="form" aria-label="Enviar mensaje">
        <textarea
          class="composer__input"
          id="message-input"
          placeholder="Escribí tu mensaje..."
          rows="1"
          maxlength="500"
          aria-label="Tu mensaje"
        ></textarea>
        <button
          class="composer__send"
          id="send-btn"
          aria-label="Enviar mensaje"
          title="Enviar"
        >
          ↑
        </button>
      </div>

    </div>
  `

  // Obtener referencias al DOM recién creado
  const messagesEl = document.getElementById('messages-area')
  const inputEl    = document.getElementById('message-input')
  const sendBtn    = document.getElementById('send-btn')
  const clearBtn   = document.getElementById('clear-btn')
  const themeBtn   = document.getElementById('theme-btn')

  // Inicializar el chat (cargar historial de localStorage si existe)
  initChat(messagesEl)
  inputEl.focus()

  // ── Event Listeners ──────────────────────────────────────────────────────

  // Botón enviar: click
  sendBtn.addEventListener('click', () => {
    const text = inputEl.value
    handleSendMessage(text, messagesEl, inputEl, sendBtn)
  })

  /**
   * Enter para enviar (extra credit — L5/L7 UX patterns).
   * Shift+Enter hace un salto de línea (comportamiento estándar de chat).
   */
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const text = inputEl.value
      handleSendMessage(text, messagesEl, inputEl, sendBtn)
    }
  })

  /**
   * Auto-resize del textarea (UX: se expande mientras escribís).
   * Limita la altura máxima para que no ocupe toda la pantalla.
   */
  inputEl.addEventListener('input', () => {
    inputEl.style.height = 'auto'
    inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px'
  })

  // Botón borrar historial (extra credit)
  clearBtn.addEventListener('click', () => {
    if (!confirm('¿Borrar toda la conversación? No se puede deshacer.')) return
    clearHistory()
    renderChat() // re-renderizar la vista vacía
  })

  // Toggle modo claro/oscuro (extra credit)
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode')
    themeBtn.textContent = document.body.classList.contains('light-mode') ? '🌑' : '🌙'
    // Guardar preferencia en localStorage
    localStorage.setItem(
      'sherlock-theme',
      document.body.classList.contains('light-mode') ? 'light' : 'dark'
    )
  })

  // Restaurar tema guardado
  const savedTheme = localStorage.getItem('sherlock-theme')
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode')
    if (themeBtn) themeBtn.textContent = '🌑'
  }
}

/**
 * renderAbout() — Renderiza la vista /about
 *
 * Información del proyecto: tecnologías usadas, el personaje,
 * y el registro del uso de IA (requerido en la consigna).
 */
function renderAbout() {
  const app = document.getElementById('app')

  app.innerHTML = `
    <section class="about-view" aria-label="Acerca de">

      <h1 class="about-view__title">Acerca del Proyecto</h1>
      <p class="about-view__subtitle">
        Chat con Sherlock Holmes — Proyecto Integrador M3 · ComicSansCon POC
      </p>

      <div class="about-section">
        <h3>👤 El Personaje: Sherlock Holmes</h3>
        <p>
          Sherlock Holmes es el famoso detective privado de la ficción victoriana,
          creado por Sir Arthur Conan Doyle en 1887. Conocido por su método deductivo
          excepcional, su frialdad analítica y su capacidad para resolver los casos
          más complejos con aparente facilidad. Su base de operaciones es el
          departamento 221B de Baker Street, Londres.
        </p>
        <p style="margin-top: 0.5rem">
          El system prompt fue diseñado para capturar su tono directo, su sarcasmo
          inteligente y su desdén por lo "elemental", manteniendo respuestas
          apropiadas para el formato de chat.
        </p>
      </div>

      <div class="about-section">
        <h3>🛠️ Tecnologías utilizadas</h3>
        <p>Este proyecto integra los conceptos de todo el Módulo 3:</p>
        <div style="margin-top: 0.75rem">
          <span class="tech-tag">HTML5 semántico</span>
          <span class="tech-tag">CSS Mobile-First</span>
          <span class="tech-tag">Flexbox + Grid</span>
          <span class="tech-tag">Media Queries</span>
          <span class="tech-tag">JavaScript ES6+</span>
          <span class="tech-tag">History API (SPA)</span>
          <span class="tech-tag">Fetch API async/await</span>
          <span class="tech-tag">Google Gemini AI</span>
          <span class="tech-tag">Vercel Serverless Functions</span>
          <span class="tech-tag">Variables de Entorno</span>
          <span class="tech-tag">Vitest (Unit Testing)</span>
          <span class="tech-tag">localStorage</span>
        </div>
      </div>

      <div class="about-section">
        <h3>🏗️ Arquitectura del proyecto</h3>
        <ul>
          <li><strong>src/index.html</strong> — Shell SPA, una sola página</li>
          <li><strong>src/app.js</strong> — Router y renderizado de vistas</li>
          <li><strong>src/chat.js</strong> — Lógica del chat e integración AI</li>
          <li><strong>src/utils.js</strong> — Funciones puras testeables</li>
          <li><strong>api/functions.js</strong> — Serverless Function (proxy a Gemini)</li>
          <li><strong>tests/</strong> — Tests unitarios con Vitest</li>
        </ul>
      </div>

      <div class="about-section">
        <h3>🤖 Registro del uso de IA</h3>
        <p>Durante el desarrollo se utilizó IA (Claude) con los siguientes propósitos:</p>
        <ul>
          <li>
            <strong>System prompt del personaje:</strong>
            Prompt: "Diseñá un system prompt para Sherlock Holmes que mantenga
            respuestas cortas y en español, con tono deductivo". La respuesta
            se iteró 3 veces hasta lograr el balance entre personalidad y brevedad.
          </li>
          <li>
            <strong>CSS del layout del chat:</strong>
            Prompt: "¿Cómo hacer que el área de mensajes sea scrolleable internamente
            en un flex layout sin desbordarse?". Fue el fix de min-height: 0 en
            el flex child.
          </li>
          <li>
            <strong>Tests con vi.fn():</strong>
            Prompt: "Mostrá un ejemplo de cómo mockear fetch con Vitest para
            testear una función async". Se adaptó el ejemplo al patrón del proyecto.
          </li>
        </ul>
      </div>

    </section>
  `
}

/**
 * renderNotFound() — Vista 404 para rutas desconocidas.
 * El agente nunca inventa datos — muestra error claro (L2 concepto).
 */
function renderNotFound() {
  const app = document.getElementById('app')
  app.innerHTML = `
    <div style="text-align:center; padding: 4rem 1rem; color: var(--text-secondary)">
      <div style="font-size: 5rem; margin-bottom: 1rem">🔎</div>
      <h2 style="font-size: 1.5rem; color: var(--accent-primary); margin-bottom: 0.5rem">
        Ruta no encontrada
      </h2>
      <p style="margin-bottom: 1.5rem">
        Incluso Holmes necesita una pista.
        La ruta <code style="background:var(--bg-tertiary); padding: 0.2rem 0.4rem; border-radius: 4px">
          ${window.location.pathname}
        </code> no existe.
      </p>
      <a href="/home" class="btn-primary" style="display:inline-flex">
        ← Volver al inicio
      </a>
    </div>
  `
}

// ─────────────────────────────────────────────────────────────────────────────
// HAMBURGUESA MOBILE (toggle del menú en mobile)
// ─────────────────────────────────────────────────────────────────────────────

function setupHamburger() {
  const hamburger = document.getElementById('hamburger-btn')
  const navLinks  = document.querySelector('.navbar__links')

  if (!hamburger || !navLinks) return

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('is-open')
    hamburger.setAttribute(
      'aria-expanded',
      navLinks.classList.contains('is-open').toString()
    )
  })

  // Cerrar menú al hacer click en cualquier link
  navLinks.addEventListener('click', () => {
    navLinks.classList.remove('is-open')
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// INICIALIZACIÓN DE LA APP
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Punto de entrada de la aplicación.
 *
 * Orden de inicialización (L2):
 *   1. Registrar listener de popstate (Back/Forward del navegador)
 *   2. Interceptar clicks en links internos
 *   3. Configurar hamburguesa mobile
 *   4. Render inicial según la URL actual
 *
 * IMPORTANTE: el listener de popstate se registra UNA SOLA VEZ.
 * Si se registrara dentro de router() o en cada render,
 * se acumularían listeners y la app funcionaría raro.
 */

// 1. popstate: se dispara cuando el usuario usa Back/Forward
window.addEventListener('popstate', router)

// 2. Interceptar todos los clicks en links <a>
setupLinkInterception()

// 3. Hamburguesa mobile
setupHamburger()

// 4. Render inicial: mostrar la vista correcta según la URL actual
router()
