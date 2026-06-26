# Prompt 02 — Diseñador CSS

> Rol: **Diseñador frontend especializado en CSS responsive y UI/UX**
> Objetivo: Transformar el CSS actual (feo, no responsive, con errores de diseño) en una interfaz profesional temática de Los Simpsons.

---

## Contexto

La aplicación es una galería de personajes de Los Simpsons con esta estructura HTML:

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

Cada card se renderiza con esta estructura HTML:

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

**Tema:** Los Simpsons — usar colores icónicos: amarillo Simpsons (#fdd835), azul cielo, rojo de la camiseta de Bart, etc.

---

## Objetivo

Reemplazar completamente `styles.css` para lograr:

1. **Tema visual Simpsons profesional** — fondo con gradiente celeste (como el cielo de Springfield), header amarillo con texto azul oscuro, cards blancas con sombras suaves.
2. **Layout responsive** — CSS Grid con `auto-fill` y `minmax()`, 1 columna en mobile (< 640px), 2 en tablet, 3+ en desktop.
3. **Mobile-first** — usar `100dvh` con fallback `100vh`, `min-height: 0` en flex children, `overflow: hidden` en contenedor principal.
4. **Cards con personalidad** — imagen de portada (220px height, object-fit: cover), nombre en azul oscuro, badge de estado con círculo de color (verde = Alive, rojo = Dead, gris = unknown), edad, frase destacada en itálica sobre fondo gris claro.
5. **Animaciones sutiles** — hover en cards (elevación + sombra), spinner circular, transiciones suaves.
6. **Estado de error** — card de error centrada con fondo blanco, sombra, botón amarillo.

---

## Restricciones

- Sin frameworks CSS (no Bootstrap, Tailwind, etc.).
- Sin librerías externas.
- Sin JavaScript para el layout (solo CSS).
- Mantener las clases HTML existentes (`.card`, `.card__body`, `.card__name`, etc.).
- No modificar `index.html`.
- Compatibilidad con navegadores modernos (Chrome, Firefox, Edge, Safari).
- Usar unidades relativas (rem, %, fr) en vez de px fijos cuando sea posible.

---

## Evidencia

### CSS actual (con errores)

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

**Errores detectados:**
1. **Fondo morado oscuro (#2d0a3e) + texto verde neón (#00ff00)** — combo ilegible y agresivo visualmente.
2. **Comic Sans MS** — fuente no profesional.
3. **Text-shadow extremo** en el título (rojo + azul) — efecto feo.
4. **Badge con fondo magenta (#ff00ff) y borde dashed verde** — parece error de señal de TV.
5. **Spinner con `border-radius: 0`** — spinner cuadrado en vez de circular.
6. **Texto de loading con `blink` infinito** — molesto y poco accesible.
7. **Panel de error con fondo negro (#000) + borde rojo** — parece página de crash.
8. **Botón retry magenta con borde verde dashed** — parece juguete infantil.
9. **Grid con `display: block`** — las cards apiladas sin grid responsivo.
10. **Cards con fondo #1a0525 + borde magenta** — ilegible.
11. **Imagen circular (border-radius: 60px) + borde verde** — recorta mal la imagen.
12. **`height: 100vh`** — se rompe en mobile con teclado virtual (el composer/input no existe pero el layout igual se rompe en ciertos viewports).
13. **Sin media queries** — no hay responsive en absoluto.
14. **Sin `min-height: 0` en main** — el flex child no puede encogerse correctamente.

---

## Formato de salida

Proporcioná el archivo `styles.css` **completo y reemplazado** (no parches) que incluya:

1. **Reset y tipografía** — sistema de fuentes nativas (system-ui stack), colores base.
2. **Layout#app** — `height: 100dvh` + fallback `100vh`, `overflow: hidden`.
3. **Header** — gradiente amarillo (#fdd835 → #f9a825), texto azul marino (#1a237e), flex con espacio entre.
4. **Badge** — pill con fondo semi-transparente blanco, texto oscuro.
5. **Main** — `flex: 1`, `min-height: 0`, `overflow-y: auto`, padding.
6. **Loading** — spinner circular (border-radius: 50%) amarillo, texto gris, centrado.
7. **Error** — card blanca centrada con sombra, texto rojo, botón amarillo con hover.
8. **Grid** — `display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px`.
9. **Card** — fondo blanco, border-radius 12px, sombra suave, hover que eleva.
10. **Card image** — 100% width, 220px height, object-fit: cover.
11. **Card body** — padding 16px, flex column con gap.
12. **Card meta** — status-dot (10px círculo verde/rojo/gris), status text, edad a la derecha.
13. **Card phrase** — fondo gris #f5f5f5, border-radius 8px, itálica.
14. **Media queries** — 640px breakpoint para mobile, entre 641-1024px para 2 columnas.

---

## Criterios de éxito

- [ ] Fondo con gradiente celeste (sin morado ni verde neón).
- [ ] Header amarillo con texto azul oscuro (sin magenta ni bordes dashed).
- [ ] Tipografía system-ui legible (sin Comic Sans).
- [ ] Grid responsive: 1 col en mobile, 2 en tablet, 3+ en desktop.
- [ ] Cards blancas con sombra suave y hover que eleva.
- [ ] Spinner circular con animación suave (sin blink molesto).
- [ ] Panel de error: card blanca centrada, botón amarillo.
- [ ] Status-dot: círculo verde (Alive), rojo (Dead), gris (unknown).
- [ ] Imágenes de personaje bien recortadas (object-fit: cover).
- [ ] Frase destacada en itálica con fondo gris.
- [ ] En mobile (320px): sin scroll horizontal, todo visible.
- [ ] En mobile con teclado virtual: layout no se rompe (usa 100dvh).
