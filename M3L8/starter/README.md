# Dad Joke Generator + Tests — STARTER M3L8

Este Starter parte del ejercicio de M3L7. La app ya es familiar: el **Dad Joke Generator** con Vercel Serverless Function y Gemini.

En M3L8 no construimos una app nueva. Agregamos los conceptos de la lecture 8 sobre el proyecto que ya conocemos:

- funciones puras;
- unit tests con Vitest;
- patrón Arrange / Act / Assert;
- mock de `fetch` con `vi.fn()`;
- qué conviene testear y qué no.

## Qué ya está listo

| Archivo | Estado |
|---------|--------|
| `index.html` | completo |
| `styles.css` | completo |
| `app.js` | completo, ya usa `apiClient.js` y `jokeUtils.js` |
| `api/joke.js` | completo, igual que M3L7 |
| `apiClient.js` | completo, lo vamos a testear |
| `package.json` | Vitest ya configurado |

## Qué completa el alumno

| Archivo | Tarea |
|---------|-------|
| `jokeUtils.js` | Implementar 2 funciones puras |
| `jokeUtils.test.js` | Hacer pasar 3 tests ya escritos |
| `apiClient.test.js` | Descomentar/completar 1 test con `fetch` mockeado |

## Guia archivo por archivo

### `index.html`

Ya esta completo. No se toca.

Lo importante es entender que los `id` del HTML son el contrato que usa `app.js`:

- `#joke-btn`
- `#joke-output`
- `#joke-text`
- `#error-output`
- `#error-text`

Si se cambia un `id`, el DOM deja de conectarse con JavaScript.

### `styles.css`

Ya esta completo. No se toca.

La clase no se enfoca en CSS. La UI queda lista para que la atencion vaya a testing.

### `app.js`

Ya esta completo. Se lee, pero no se modifica.

Este archivo muestra una decision importante:

```txt
app.js coordina la UI
jokeUtils.js contiene logica testeable
apiClient.js contiene fetch testeable con mock
```

No testeamos `showLoading()`, `showJoke()` ni `showError()` en este Hands On porque manipulan DOM.

### `jokeUtils.js`

Primer archivo que se corrige.

Tiene dos funciones incompletas:

- `formatJoke(joke)`
- `buildErrorMessage(error)`

La consigna no es inventar comportamiento nuevo. La consigna es leer los tests en `jokeUtils.test.js` e implementar lo minimo para que pasen.

### `jokeUtils.test.js`

Ya tiene tests activos.

Estos tests fallan al inicio a proposito. Ese es el punto de partida:

```txt
rojo -> corregimos jokeUtils.js -> verde
```

No se arregla cambiando el test. Se arregla cambiando la funcion.

### `apiClient.js`

Ya esta completo. Se testea, pero no se modifica.

Responsabilidad:

- llamar a `/api/joke`;
- usar `POST`;
- parsear JSON;
- lanzar `Error` si `response.ok` es falso;
- devolver `data.joke` si todo salio bien.

### `apiClient.test.js`

Segundo archivo de practica.

El alumno debe:

1. Activar `global.fetch = vi.fn()`.
2. Activar `beforeEach()` para limpiar el mock.
3. Completar el primer test para verificar que `getJoke()` llama a `/api/joke` con `POST`.
4. Si queda tiempo, agregar test de success y test de error.

### `api/joke.js`

Ya esta completo. Viene de M3L7.

No se testea contra Gemini real porque un unit test no deberia depender de:

- internet;
- Vercel;
- una API externa;
- una API key;
- cuota disponible.

### `vitest.config.js`

Ya esta completo.

Tiene `passWithNoTests: true` porque `apiClient.test.js` empieza con el test comentado. Los tests que deben fallar al inicio estan en `jokeUtils.test.js`.

### `package.json`

Ya esta completo.

Scripts importantes:

```bash
npm test
npm run test:run
npm run local
```

## Cómo correr

Instalar dependencias:

```bash
npm install
```

Correr tests:

```bash
npm test
```

Correr tests una sola vez:

```bash
npm run test:run
```

Levantar la app:

```bash
npm run local
```

Abrir:

```txt
http://localhost:3000
```

## Flujo de 30 minutos

1. Ver M3L7 funcionando.
2. Explicar qué testear y qué no:
   - no testeamos DOM;
   - no testeamos Gemini real;
   - sí testeamos funciones puras;
   - sí testeamos `fetch` mockeado.
3. Correr `npm test` y ver tests fallar.
4. Completar `jokeUtils.js`.
5. Ver tests verdes.
6. Completar un test de `apiClient.test.js` con `vi.fn()`.
7. Cierre conceptual.

## Resultado esperado

Al final:

- `jokeUtils.test.js` pasa;
- `apiClient.test.js` pasa;
- la app sigue funcionando como M3L7;
- los alumnos entienden que testing no significa testear todo, sino aislar la lógica importante.

## Idea clave

```txt
DOM / Vercel / Gemini → no se testea en este Hands On
Funciones puras / fetch aislado → sí se testea
```
