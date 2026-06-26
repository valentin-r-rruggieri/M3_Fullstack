# Prompt 02 — Diseñador CSS

> Rol: **Diseñador frontend especializado en CSS responsive, UI/UX y tematización**
> Objetivo: Transformar el CSS actual (feo, no responsive, con errores de diseño) en una interfaz profesional con temática de Los Simpsons, completamente responsive y accesible.

---

## Contexto

Aplicación vanilla HTML/CSS/JS: galería de personajes de Los Simpsons usando la API `https://thesimpsonsapi.com/api`.

### Estructura HTML fija (NO modificar)

```html
<div id="app">
  <header>
    <h1>Simpsons Gallery</h1>
    <span id="badge">estado: loading</span>
  </header>
  <main>
    <div id="loading">
      <div class="spinner"></div>
      <p>Cargando personajes...</p>
    </div>
    <div id="error" class="hidden">
      <p id="error-message"></p>
      <button id="retry">Reintentar</button>
    </div>
    <div id="grid" class="hidden"></div>
  </main>
</div>
```

### Estructura HTML de cada card (NO modificar)

```html
<article class="card">
  <img src="https://cdn.thesimpsonsapi.com/500/character/1.webp" alt="Homer Simpson" loading="lazy" />
  <div class="card__body">
    <h3 class="card__name">Homer Simpson</h3>
    <p class="card__occupation">Safety Inspector</p>
    <div class="card__meta">
      <span class="status-dot status-dot--alive"></span>
      <span class="card__status">Alive</span>
      <span class="card__age">39 años</span>
    </div>
    <blockquote class="card__phrase">"Doh!"</blockquote>
  </div>
</article>
```

### API y assets

- Imágenes CDN: `https://cdn.thesimpsonsapi.com/500/character/{id}.webp`
- Colores icónicos Simpsons: amarillo `#ffd90f`, amarillo oscuro `#f9a825`, naranja `#f57f17`, azul marino `#1a237e`, rojo `#e53935`
- Los personajes pueden estar "Alive" (verde), "Dead" (rojo), o sin estado (gris `#bdbdbd`)

---

## Objetivo

Reemplazar **completamente** `styles.css` para lograr una interfaz que cumpla estrictamente con:

### 1. Temática Simpsons pura (basada en paleta amarilla)
- **Fondo**: color sólido amarillo muy claro `#fffde7` (NO gradiente de cielo). La app debe sentirse EMPAPADA de amarillo Simpsons.
- **Decoración**: pseudo-elementos `body::before` y `body::after` con círculos amarillos semitransparentes (opacidad 0.1-0.15) como manchas de color de fondo.
- **Header**: gradiente amarillo (`#ffd90f` → `#f9a825` → `#f57f17`), texto azul marino `#1a237e`. Compacto (padding vertical 10px).
- **Estrella blanca** en el título con `clip-path: polygon()` de 5 puntas, 22x22px.
- **Badge**: estilo glassmorphism con `backdrop-filter: blur(4px)`, transparente, texto navy.
- **Cards**: blancas con `border: 1px solid #f5f5f5`. Al hover: borde amarillo y elevación sutil (translateY -3px). SIN barra degradada inferior (mantener simple).
- **Frase destacada**: fondo `#fff8e1` (amarillo clarísimo), SIN borde izquierdo. Comillas con pseudo-elementos `::before`/`::after` en color amarillo oscuro.

### 2. Cards COMPACTAS (densidad alta de información)
- **Imagen**: altura fija de `140px` (no fluidas). `object-fit: cover`.
- **Body**: padding reducido `8px 10px 10px`, gap de 3px entre elementos.
- **Nombre**: `14px`, bold 800, navy, `white-space: nowrap` con `text-overflow: ellipsis`.
- **Ocupación**: `11px`, color `#bdbdbd`, also truncada con ellipsis.
- **Metadata**: padding-top `5px`, separador con `border-top: 1px solid #f5f5f5`.
- **Status-dot**: círculo de `8px` (no 10px).
- **Status text**: `10px`, uppercase.
- **Edad**: `10px`, color `#bdbdbd`, margin-left auto.
- **Frase**: `11px`, padding `6px 8px`, truncada con ellipsis.

### 3. Grid de alta densidad
- **Grid**: `grid-template-columns: repeat(3, 1fr)` — exactamente 3 columnas fijas.
- **Max-width**: `640px` centrado (para que se vea contenido compacto y centrado).
- **Gap**: `10px` entre cards.
- En tablet (< 600px): `grid-template-columns: repeat(2, 1fr)`.
- En mobile (< 400px): `grid-template-columns: repeat(2, 1fr)`, gap `6px`, imagen altura `100px`, body padding `5px 6px 6px`.

### 4. Diseño consistente con variables CSS
- **CSS Custom Properties** en `:root`: `--yellow`, `--yellow-dark`, `--yellow-deep`, `--yellow-light`, `--yellow-bg`, `--navy`, `--red`, `--gray-*`, sombras y radios pequeños (6px, 10px, 14px).
- **Header**: sin clamp, valores fijos compactos (20px título, 11px badge).
- **Spinner**: `40px` (no 52px), borde `4px`.
- **Error**: card blanca con `border-top: 3px solid red` (no border-left), padding `32px`.

### 5. Responsive
- **Mobile (< 480px)**: header más chico (padding 8px 12px, título 17px), main padding 8px, cards más chicas.
- **No usar `clamp()`** en ningún lado (son valores fijos compactos).
- **Touch targets**: botón retry con `min-height: 40px`.
- **Mobile keyboard**: `height: 100dvh` con fallback `100vh`.

---

## Restricciones (estrictas)

- ❌ **No** frameworks CSS (nada de Bootstrap, Tailwind, Materialize, etc.)
- ❌ **No** librerías externas
- ❌ **No** JavaScript para el layout (solo CSS)
- ❌ **No** modificar `index.html`
- ❌ **No** fuentes externas (solo system-ui stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif`)
- ❌ **No** gradientes de cielo azul (usar fondo amarillo claro `#fffde7`)
- ❌ **No** valores hardcodeados de color (usar variables CSS)
- ✅ **Sí** usar `::before` y `::after` para decoraciones amarillas
- ✅ **Sí** usar `backdrop-filter` para efecto glassmorphism en badge
- ✅ **Sí** usar `clip-path` para estrella en título
- ✅ **Sí** usar `text-overflow: ellipsis` para textos largos en cards

---

## Evidencia

### CSS actual (con errores) — este es el código que hay que REEMPLAZAR COMPLETAMENTE

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Comic Sans MS", cursive;
  background-color: #2d0a3e;
  color: #00ff00;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background-color: #4a0e5c;
  padding: 20px;
  text-align: center;
  border-bottom: 5px solid #00ff00;
}

header h1 {
  font-size: 28px;
  color: #ffcc00;
  text-shadow: 2px 2px 0 #ff0000, 4px 4px 0 #0000ff;
  margin-bottom: 10px;
}

#badge {
  display: inline-block;
  padding: 5px 15px;
  background-color: #ff00ff;
  color: #00ff00;
  font-size: 14px;
  font-weight: bold;
  border: 2px dashed #00ff00;
}

main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.hidden {
  display: none !important;
}

#loading {
  text-align: center;
  padding: 60px 20px;
}

#loading p {
  font-size: 22px;
  color: #ff00ff;
  animation: blink 0.5s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.spinner {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  border: 8px solid #4a0e5c;
  border-top-color: #00ff00;
  border-radius: 0;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

#error {
  text-align: center;
  padding: 60px 20px;
  background-color: #000;
  border: 5px solid #ff0000;
}

#error p {
  font-size: 18px;
  color: #ff0000;
  margin-bottom: 20px;
}

#retry {
  padding: 12px 30px;
  background-color: #ff00ff;
  color: #00ff00;
  border: 3px solid #00ff00;
  font-size: 18px;
  font-family: "Comic Sans MS", cursive;
  font-weight: bold;
  cursor: pointer;
}

#retry:hover {
  background-color: #00ff00;
  color: #ff00ff;
}

#grid {
  display: block;
}

.card {
  width: 100%;
  margin-bottom: 15px;
  padding: 15px;
  background-color: #1a0525;
  border: 3px solid #ff00ff;
  text-align: center;
}

.card img {
  width: 120px;
  height: 120px;
  border-radius: 60px;
  border: 4px solid #00ff00;
  object-fit: cover;
}

.card h3 {
  font-size: 20px;
  color: #ffcc00;
  margin: 10px 0 5px;
  text-decoration: underline;
}

.card p {
  font-size: 14px;
  color: #ff9999;
  margin-bottom: 8px;
}

.status {
  display: inline-block;
  padding: 4px 12px;
  background-color: #00ff00;
  color: #000;
  font-size: 12px;
  font-weight: bold;
  border: 2px dotted #000;
}

.status.Alive {
  background-color: #00ff00;
}

.status.Dead {
  background-color: #ff0000;
}

.status.unknown {
  background-color: #999;
}
```

### Errores detectados en el CSS actual

| # | Error | Impacto |
|---|-------|---------|
| 1 | Fondo morado `#2d0a3e` + texto verde neón `#00ff00` | Ilegible, nada que ver con Simpsons |
| 2 | Comic Sans MS como tipografía principal | No profesional, rompe el tema |
| 3 | Text-shadow rojo+azul en título | Efecto feo, parece error de render |
| 4 | Badge magenta `#ff00ff` con borde dashed verde | Sin coherencia con paleta amarilla |
| 5 | Spinner cuadrado (`border-radius: 0`) | No es un spinner, es un cuadrado girando |
| 6 | Texto loading con blink infinito | Molesto, poco accesible |
| 7 | Error con fondo negro + borde rojo | Parece pantalla de crash |
| 8 | Botón retry magenta con borde verde dashed | No parece un botón clickeable |
| 9 | Grid con `display: block` | Sin responsive, todo apilado |
| 10 | Cards fondo `#1a0525` + borde magenta | Texto ilegible, nada de amarillo |
| 11 | Imagen circular 120px + borde verde | Recorta mal, muy chica, sin amarillo |
| 12 | `height: 100vh` sin fallback | Se rompe en mobile con teclado virtual |
| 13 | Sin media queries | No existe responsive en absoluto |
| 14 | Sin `min-height: 0` en main | Flex child no puede encogerse |
| 15 | Cards de 100% width sin grid | Sin densidad, ocupan todo el ancho |
| 16 | Sin CSS custom properties | Código repetitivo, difícil de mantener |
| 17 | Imagen 120px demasiado chica | No se ve bien el personaje |
| 18 | Sin hover effects en cards | No hay feedback interactivo |
| 19 | Sin NADA de amarillo Simpsons | El color más icónico de la serie ausente |
| 20 | Texto de loading en magenta (#ff00ff) | Duele a la vista, cero Simpsons |

---

## Formato de salida

Proporcioná el archivo `styles.css` **COMPLETO** (no parches ni fragmentos) que incluya **OBLIGATORIAMENTE** estos bloques en orden:

### Bloque 1: CSS Custom Properties (`:root`)
- `--yellow`, `--yellow-dark`, `--yellow-light`
- `--navy`, `--sky-top`, `--sky-mid`, `--sky-bottom`
- `--white`, `--gray-50`, `--gray-100`, `--gray-300`, `--gray-500`, `--gray-700`, `--gray-900`
- `--alive`, `--dead`, `--unknown`
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- `--radius-sm`, `--radius-md`, `--radius-lg`
- `--font` con system-ui stack

### Bloque 2: Reset + Body
- `* { margin: 0; padding: 0; box-sizing: border-box; }`
- Body con gradiente vertical `sky-top → sky-mid → sky-bottom → white`
- `body::before` y `body::after` como nubes (elipses blancas con `border-radius: 50%`, fijas, z-index 0, pointer-events: none)

### Bloque 3: App Layout
- `height: 100dvh` + fallback `100vh`
- `display: flex; flex-direction: column; overflow: hidden`

### Bloque 4: Header
- Gradiente `yellow → yellow-dark → #f57f17`
- `padding` con `clamp()`
- `header::after` con círculo radial semi-transparente (decoración)
- `h1` con `font-size: clamp()`, estrella via `::before` con `clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)`

### Bloque 5: Badge
- `backdrop-filter: blur(4px)`, fondo semi-transparente, border-radius 20px

### Bloque 6: Main
- `flex: 1; min-height: 0; overflow-y: auto; scroll-behavior: smooth`

### Bloque 7: Loading
- Spinner circular 52px, borde `gray-300`, top-color `yellow`, right-color `navy`
- Animación con `cubic-bezier(0.4, 0, 0.2, 1)`
- Texto con `pulse-text` (opacidad 1 → 0.6 → 1)

### Bloque 8: Error
- Card blanca con `border-left: 4px solid var(--dead)`, `max-width: 420px`
- Botón con gradiente amarillo, `min-height: 44px`, hover eleva 2px

### Bloque 9: Grid
- `grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr))`
- `gap: clamp(12px, 2vw, 24px)`

### Bloque 10: Card
- Blanca, border-radius, sombra, hover translateY(-6px)
- `card::after` con barra degradada horizontal (yellow → navy → dead), `scaleX(0)` → `scaleX(1)` al hover
- Imagen con `height: clamp(180px, 25vw, 240px)`, hover scale(1.03)

### Bloque 11: Card Body
- Padding con clamp, flex column, gap 6px

### Bloque 12: Card Meta
- Border-top sutil, flex wrap, gap clamp
- Status-dot: 10px círculo con `box-shadow: 0 0 4px currentColor`
- Status: uppercase, letter-spacing 0.5px
- Age: margin-left auto

### Bloque 13: Card Phrase
- background `gray-50`, border-left `3px solid yellow`
- `::before` con comilla izquierda `\201C`, `::after` con comilla derecha `\201D`

---

## Criterios de éxito (checklist de verificación)

### Temática Simpsons
- [ ] Fondo gradiente azul cielo → blanco (nada de morado ni verde neón)
- [ ] Al menos 2 nubes decorativas con pseudo-elementos CSS
- [ ] Header gradiente amarillo → naranja (no magenta ni bordes dashed)
- [ ] Estrella Simpsons en el título con `clip-path`
- [ ] Tipografía system-ui en toda la app (sin Comic Sans)
- [ ] Barra degradada decorativa en cards al hover
- [ ] Paleta cromática consistente: amarillo, azul marino, azul cielo, rojo, verde, grises

### Responsive
- [ ] 320px: 1 columna, sin scroll horizontal, touch targets ≥ 44px
- [ ] 480px: 1 columna, textos fluidos con clamp
- [ ] 768px: 2 columnas, header compacto
- [ ] 1024px: 3 columnas, cards con hover effects
- [ ] 1440px+: 4+ columnas, max-width 1280px centrado
- [ ] Mobile keyboard: layout no se rompe (100dvh)
- [ ] No hay valores fijos en px para tamaños de fuente (usar clamp)
- [ ] Imágenes fluidas con height en clamp

### UI/UX
- [ ] Cards blancas con sombra y hover que eleva
- [ ] Spinner circular con animación smooth (sin blink)
- [ ] Panel de error: card blanca, borde izquierdo rojo, botón amarillo
- [ ] Status-dot: círculo con glow verde/rojo/gris
- [ ] Frase con comillas tipográficas y borde amarillo
- [ ] Badge con glassmorphism (backdrop-filter: blur)
- [ ] Transiciones suaves en todos los hover effects (cubic-bezier)
- [ ] Sin parpadeos ni animaciones que puedan causar molestias

### Código
- [ ] CSS Custom Properties en :root
- [ ] Sin frameworks ni librerías externas
- [ ] Sin modificación de index.html
- [ ] Sin fuentes externas
- [ ] Código organizado en bloques con comentarios
