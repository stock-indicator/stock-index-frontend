import { env } from 'node:process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let settingsHost = 'localhost'
let settingsPort = 8000

try {
  const settingsPath = path.resolve(__dirname, '../stock-index-engine/settings.json')
  const raw = readFileSync(settingsPath, 'utf-8')
  const parsed = JSON.parse(raw) as Record<string, unknown>

  const portCandidate = parsed['api.port']
  if (typeof portCandidate === 'number') {
    settingsPort = portCandidate
  } else if (typeof portCandidate === 'string') {
    const numeric = Number.parseInt(portCandidate, 10)
    if (!Number.isNaN(numeric)) {
      settingsPort = numeric
    }
  }

  const hostCandidate = parsed['api.host']
  if (typeof hostCandidate === 'string' && hostCandidate.trim()) {
    const trimmed = hostCandidate.trim()
    if (trimmed !== '0.0.0.0') {
      settingsHost = trimmed
    }
  }
} catch {
  // Fallback to defaults when settings file is missing or malformed
}

const defaultTarget = 'http://' + settingsHost + ':' + settingsPort
const DEV_ENGINE_PROXY_TARGET = env.VITE_DEV_ENGINE_PROXY_TARGET ?? defaultTarget

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/engine-api': {
        target: DEV_ENGINE_PROXY_TARGET,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/engine-api/, ''),
      },
    },
  },
})
