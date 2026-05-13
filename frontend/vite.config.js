import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_TARGET || 'http://localhost:8000'

  const proxy = ['/enhance', '/status', '/result', '/api/images'].reduce((acc, path) => {
    acc[path] = { target: apiTarget, changeOrigin: true }
    return acc
  }, {})

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy,
    },
  }
})
