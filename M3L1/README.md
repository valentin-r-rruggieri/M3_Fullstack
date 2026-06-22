# Tarjeta de perfil responsive mobile-first

Ejercicio practico del modulo **M3L1 - Mobile-First CSS y Diseno Responsivo**. El proyecto construye una tarjeta de perfil de usuario en un unico archivo HTML autocontenido: estructura HTML, CSS interno y foto embebida.

El ejemplo final muestra el perfil de **Valenti Ruggieri**, **Desarrollador Fullstack**, con bio, estadisticas y botones de accion.

## Objetivo

El objetivo es aplicar los conceptos de la lecture en un caso concreto:

- Construir primero para mobile.
- Escalar progresivamente a tablet y desktop.
- Usar `meta viewport` para que el navegador respete el ancho real del dispositivo.
- Usar `rem`, `%`, `width: 100%` y `max-width` para lograr un layout fluido.
- Usar Flexbox para centrar y distribuir elementos.
- Evitar overflow horizontal y estilos duplicados innecesarios.
- Probar el resultado con DevTools en distintos anchos.

## Archivos

- `index.html`: ejercicio resuelto y autocontenido.
- `README.md`: explicacion del ejercicio, del codigo y de como probarlo.

La foto del perfil esta incrustada dentro del HTML como `data:image/jpeg;base64`. Esto permite mantener un unico archivo HTML sin depender de una imagen externa.

## Relacion con la lecture

La lecture explica que **mobile-first** consiste en construir una base funcional para pantallas pequenas y despues agregar mejoras cuando hay mas espacio.

En este ejercicio se aplico asi:

- La base CSS, sin media query, funciona desde `320px`.
- En `768px` se agregan mejoras para tablet.
- En `1024px` se agregan mejoras para desktop.
- Las media queries usan `min-width`, porque el diseno escala de menor a mayor.
- No se reescriben propiedades que no cambian entre breakpoints.

La idea central es evitar el enfoque desktop-first, donde se suele empezar con un layout grande y despues corregir mobile con muchos overrides.

## Estructura HTML

La tarjeta usa las clases pedidas en la consigna:

```html
<main class="card">
  <img class="card__avatar" src="data:image/jpeg;base64,..." alt="Foto de perfil de Valenti Ruggieri">
  <h1 class="card__name">Valenti Ruggieri</h1>
  <p class="card__role">Desarrollador Fullstack</p>
  <p class="card__bio">Construye aplicaciones web completas, desde interfaces responsivas hasta APIs escalables.</p>

  <section class="card__stats" aria-label="Estadisticas del perfil">
    <div class="stat">
      <span class="stat__value">34</span>
      <span class="stat__label">Proyectos</span>
    </div>
    <div class="stat">
      <span class="stat__value">1.8k</span>
      <span class="stat__label">Seguidores</span>
    </div>
    <div class="stat">
      <span class="stat__value">215</span>
      <span class="stat__label">Siguiendo</span>
    </div>
  </section>

  <div class="card__actions">
    <button class="btn btn--primary" type="button">Seguir</button>
    <button class="btn btn--secondary" type="button">Mensaje</button>
  </div>
</main>
```

### Como funciona

- `.card` es el contenedor principal del componente.
- `.card__avatar` muestra la imagen circular.
- `.card__name`, `.card__role` y `.card__bio` forman la informacion principal del perfil.
- `.card__stats` agrupa las metricas del usuario.
- `.stat__value` contiene el numero destacado.
- `.stat__label` describe el significado del numero.
- `.card__actions` agrupa los botones.
- `.btn--primary` representa la accion principal.
- `.btn--secondary` representa la accion secundaria.

Esta separacion hace que el componente sea facil de leer, mantener y modificar.

## HTML base y viewport

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Por que es importante

El `meta viewport` le indica al navegador que el ancho de la pagina debe coincidir con el ancho real del dispositivo. Sin esta linea, un navegador movil puede simular un viewport grande y las media queries no se activan como esperamos.

Este punto viene directo de la lecture: antes de escribir media queries, hay que asegurar que el navegador mida correctamente el viewport.

## CSS base: mobile 320px+

La primera seccion del CSS no tiene media query:

```css
/* === BASE: MOBILE 320px+ === */
```

Esto significa que esas reglas aplican desde mobile en adelante.

### Reset de caja y base tipografica

```css
* {
  box-sizing: border-box;
}

html {
  font-size: 16px;
}
```

`box-sizing: border-box` evita que el padding y el borde aumenten el ancho final de los elementos. Es una base robusta para prevenir overflow horizontal.

`font-size: 16px` define una base clara para usar `rem`. Si `1rem` equivale a `16px`, los espacios como `1rem`, `1.5rem` o `2rem` son faciles de interpretar.

## Body centrado con Flexbox

```css
body {
  min-height: 100vh;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-family: Arial, Helvetica, sans-serif;
  background: #f1f5f9;
  color: #111827;
}
```

### Que resuelve

- `min-height: 100vh` hace que el body ocupe toda la altura visible.
- `margin: 0` elimina el margen por defecto del navegador.
- `display: flex` activa Flexbox.
- `align-items: center` centra verticalmente la card.
- `justify-content: center` centra horizontalmente la card.
- `padding: 1rem` evita que la tarjeta toque los bordes en mobile.
- `background` y `color` aplican la paleta pedida.

La consigna pedia que la card quedara centrada en todos los breakpoints. Por eso el centrado se resuelve desde el `body`.

## Card principal

```css
.card {
  width: 100%;
  padding: 1rem;
  text-align: center;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 1rem 2rem rgba(15, 23, 42, 0.1);
}
```

### Que resuelve

- `width: 100%` hace que la tarjeta sea fluida en mobile.
- `padding: 1rem` da espacio interno usando una unidad relativa.
- `text-align: center` alinea el contenido de perfil.
- `background: #ffffff` aplica el color de card pedido.
- `box-shadow` agrega una sombra sutil.
- `border-radius` redondea visualmente el componente.

En mobile no se usa todavia `max-width`, porque la prioridad es aprovechar el ancho disponible sin generar desbordes. El limite aparece en desktop.

## Avatar

```css
.card__avatar {
  width: 80px;
  height: 80px;
  display: block;
  margin: 0 auto 1rem;
  border-radius: 50%;
  object-fit: cover;
}
```

### Que resuelve

- `width` y `height` iguales crean una caja cuadrada.
- `border-radius: 50%` transforma esa caja en un circulo.
- `display: block` permite centrar la imagen con `margin`.
- `margin: 0 auto 1rem` centra el avatar y separa la imagen del nombre.
- `object-fit: cover` evita que la foto se deforme.

La consigna pedia avatar circular de `80px` en mobile. En tablet se aumenta a `100px`.

## Textos del perfil

```css
.card__name {
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.2;
}

.card__role {
  margin: 0.25rem 0 0;
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.5;
}

.card__bio {
  margin: 1rem 0 0;
  color: #6b7280;
  line-height: 1.6;
}
```

### Que resuelve

- El nombre usa mayor jerarquia visual.
- El rol y la bio usan el color secundario `#6b7280`.
- `line-height` mejora la lectura.
- Los margenes estan en `rem`, manteniendo consistencia de spacing.

Esta parte aplica la recomendacion de la lecture: usar unidades relativas para que la interfaz escale con criterio.

## Estadisticas

```css
.card__stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin: 1.5rem 0;
}

.stat {
  width: 100%;
}
```

### Que resuelve en mobile

- `display: flex` permite controlar la distribucion.
- `flex-direction: column` apila las estadisticas.
- `align-items: center` las centra.
- `gap: 0.75rem` separa los items.
- `width: 100%` hace que cada stat ocupe todo el ancho disponible.

En mobile, apilar contenido suele ser mas legible que forzar columnas angostas.

Los estilos de valor y etiqueta son:

```css
.stat__value {
  display: block;
  font-weight: 700;
  color: #111827;
  font-size: 1.125rem;
  line-height: 1.3;
}

.stat__label {
  display: block;
  margin-top: 0.125rem;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.4;
}
```

El valor es mas grande y bold porque es el dato principal. La etiqueta es mas pequena y gris porque funciona como descripcion.

## Botones

```css
.card__actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn {
  min-height: 44px;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #111827;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}
```

### Que resuelve

- En mobile, los botones se apilan con `flex-direction: column`.
- `min-height: 44px` mejora la usabilidad tactil.
- `border-radius: 0.75rem` cumple la consigna visual.
- `cursor: pointer` indica que el elemento es interactivo.
- `transition` suaviza el cambio de hover.

Variantes:

```css
.btn--primary {
  background: #111827;
  color: #ffffff;
}

.btn--primary:hover {
  background: #374151;
}

.btn--secondary {
  background: transparent;
  color: #111827;
}

.btn--secondary:hover {
  background: #f9fafb;
}
```

El boton primario tiene mas peso visual porque representa la accion principal. El secundario mantiene borde y fondo transparente para no competir con la accion principal.

## Tablet: 768px+

```css
/* === TABLET: 768px+ === */
@media (min-width: 768px) {
  .card {
    padding: 1.5rem;
  }

  .card__avatar {
    width: 100px;
    height: 100px;
  }

  .card__stats {
    flex-direction: row;
    justify-content: center;
    gap: 1.5rem;
  }

  .stat {
    width: auto;
    min-width: 7rem;
  }

  .stat + .stat {
    border-left: 1px solid #e5e7eb;
    padding-left: 1.5rem;
  }

  .card__actions {
    flex-direction: row;
    justify-content: center;
  }
}
```

### Que cambia

- La card gana mas padding.
- El avatar pasa de `80px` a `100px`.
- Las estadisticas pasan de columna a fila.
- Se agregan separadores visuales entre stats.
- Los botones pasan de columna a fila.

### Por que se hace asi

En tablet hay mas ancho disponible. La interfaz puede usar una distribucion horizontal sin perder legibilidad. Esto es mejora progresiva: se agregan ajustes sin duplicar propiedades que ya estaban bien definidas en mobile.

La regla `.stat + .stat` significa: aplicar estilos a cada `.stat` que tenga otro `.stat` antes. Asi el primer item no recibe borde izquierdo.

## Desktop: 1024px+

```css
/* === DESKTOP: 1024px+ === */
@media (min-width: 1024px) {
  .card {
    max-width: 32rem;
    margin: 0 auto;
    padding: 2rem;
  }

  .btn {
    padding-right: 1.5rem;
    padding-left: 1.5rem;
  }
}
```

### Que cambia

- La card queda limitada a `max-width: 32rem`.
- Se asegura el centrado con `margin: 0 auto`.
- El padding sube a `2rem`.
- Los botones ganan padding horizontal.

### Por que se hace asi

En desktop, si la card siguiera expandiendose al `100%`, quedaria demasiado ancha. Por eso se combina:

```css
width: 100%;
max-width: 32rem;
```

Este patron permite fluidez en mobile y control visual en desktop.

## Como probarlo

Abrir `index.html` en el navegador y usar DevTools.

### Mobile: 320px

Verificar:

- La card ocupa el ancho disponible sin generar scroll horizontal.
- El avatar mide `80px`.
- Las estadisticas estan en columna.
- Los botones estan uno debajo del otro.
- La card esta centrada.

### Tablet: 768px

Verificar:

- El avatar mide `100px`.
- Las estadisticas se muestran en fila.
- Hay separadores entre stats, excepto antes del primero.
- Los botones se muestran en fila.

### Desktop: 1024px

Verificar:

- La card no se estira de mas.
- Aparece `max-width: 32rem`.
- La card queda centrada.
- El padding interno aumenta.
- Los botones tienen mas padding horizontal.

### Hover

Pasar el mouse sobre los botones:

- `Seguir` cambia a `#374151`.
- `Mensaje` muestra fondo `#f9fafb`.

## Checklist final

El ejercicio cumple si:

- El proyecto tiene un unico HTML principal.
- El CSS esta dentro de `<style>`.
- Las clases requeridas estan presentes.
- Existe `meta viewport`.
- La base mobile funciona sin media query.
- Los breakpoints usan `min-width`.
- El avatar es circular.
- La foto personalizada aparece.
- La card se centra en mobile, tablet y desktop.
- No hay overflow horizontal.
- No se duplican propiedades innecesarias en media queries.

