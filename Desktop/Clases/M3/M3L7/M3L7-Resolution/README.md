# Dad Joke Generator — M3L7 (Solución)

Proyecto resuelto del Hands-On: Frontend + Vercel Serverless Function + Gemini.
La API key nunca está visible en el navegador.

---

## Cómo levantar en local

```bash
npm install                    # instalar @google/generative-ai
cp .env.example .env          # crear .env con tu API key (editar el archivo)
npm run local                  # levantar Vercel Dev en http://localhost:3000
```

Abrir `http://localhost:3000` → click en "Generá un chiste" → la serverless function llama a Gemini → se muestra el chiste.

---

## Cómo desplegar a producción

```bash
# 1. Subir a GitHub
git init
git add .
git commit -m "Dad Joke Generator"
# crear repo en github.com y copiar la URL
git remote add origin <URL-del-repo>
git push -u origin main
```

En el navegador:
1. Ir a https://vercel.com → Dashboard → Add New → Project
2. Importar el repo de GitHub
3. Antes de Deploy → abrir **Environment Variables**
4. Agregar: `GEMINI_API_KEY` con el mismo valor que usás en local
5. Deploy

⚠️ **Nunca subas el .env a Git.** En producción la API key se configura en el dashboard de Vercel, no en archivos del repo.

---

## Lo que deberías verificar después del deploy

| Qué mirar | Cómo | Resultado esperado |
|-----------|------|--------------------|
| App funcionando | Abrir la URL de Vercel | El botón genera un chiste |
| Key no visible | F12 → Sources → Ctrl+F "AIza" | **Sin resultados** |
| Key no visible | F12 → Network → ver request a /api/joke | No hay headers con API key |
| Logs del servidor | Vercel Dashboard → Functions → Logs | Solo visible para vos (dueño del proyecto) |

---

## Lo que construimos

```
📁 M3L7-Resolution/
├── index.html           → HTML estático (interfaz)
├── styles.css           → Dark mode minimalista
├── app.js               → Frontend: llama a /api/joke con fetch (POST)
├── api/
│   └── joke.js          → Serverless Function: recibe POST, llama a Gemini
├── package.json         → @google/generative-ai + dev script
├── .env.example         → Template de la API key
├── .gitignore           → exclude: node_modules, .env, .vercel, GUION.md
├── README.md            → Este archivo
└── GUION.md             → Guía docente (en .gitignore)
```

---

## El flujo de seguridad (confirmado)

```
❌ ANTI-PATRÓN (lo que NO hicimos):
   app.js → Gemini directo → API key visible en DevTools

✅ FLUJO SEGURO (lo que implementamos):
   app.js → POST /api/joke → api/joke.js → process.env.GEMINI_API_KEY → Gemini
            ↑                                     ↑
       el frontend no sabe       la key existe SOLO en el servidor
       que Gemini existe         (Vercel), nunca en el navegador
```

**Punto clave:** `app.js` llama a `/api/joke` y nada más. Ni siquiera importa `@google/generative-ai`. La librería de Gemini y la API key existen exclusivamente en la serverless function, que corre en los servidores de Vercel.

---

## Troubleshooting común

| Problema | Solución |
|----------|----------|
| `npm run dev` da error recursivo | Usar `npm run local` o `npx --yes vercel dev` |
| `vercel dev` no arranca | Usar `npx --yes vercel dev` o instalar `npm install -g vercel` |
| Error "GEMINI_API_KEY no configurada" | Crear `.env` con la key real + reiniciar Vercel Dev |
| Gemini devuelve error 429 | Rate limit del free tier, esperar 1 minuto |
| Funciona en local pero no en producción | Verificar Environment Variables en Vercel Dashboard → redeploy |
| Cannot find module @google/generative-ai | `npm install` desde la raíz del proyecto |

---

## Nota sobre `npm run dev`

No usar `npm run dev` en este proyecto.

Si `package.json` define `"dev": "vercel dev"`, Vercel detecta una invocación recursiva y corta el arranque con este error:

```txt
vercel dev must not recursively invoke itself
```

Por eso el script se llama `local`:

```bash
npm run local
```

También podés correr directamente:

```bash
npx --yes vercel dev
```
