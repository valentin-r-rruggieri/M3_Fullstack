import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // En el Starter, apiClient.test.js empieza como ejercicio comentado.
    // passWithNoTests evita que Vitest falle solo porque ese archivo aun no
    // tiene tests activos. Los tests que si deben fallar al inicio estan en
    // jokeUtils.test.js.
    passWithNoTests: true,
  },
})
