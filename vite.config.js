import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'
import fs from 'fs'

export default defineConfig({
  base: '/stats-incendios-2026/',
  plugins: [
    svelte(),
    {
      name: 'serve-stats',
      configureServer(server) {
        server.middlewares.use('/stats.json', (_req, res) => {
          const file = resolve('../mapa_incendios/stats.json')
          res.setHeader('Content-Type', 'application/json')
          res.end(fs.readFileSync(file, 'utf-8'))
        })
      }
    }
  ]
})
