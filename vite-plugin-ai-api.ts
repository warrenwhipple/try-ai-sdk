import type { Plugin } from 'vite'
import { loadEnv } from 'vite'

export function aiApiPlugin(): Plugin {
  return {
    name: 'ai-api',
    apply: 'serve',
    config(_, { mode }) {
      // Load .env files based on mode
      const env = loadEnv(mode, process.cwd(), '')
      // Make VITE_ prefixed vars available to process.env
      Object.assign(process.env, env)
    },
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        const { handleChat } = await import('./src/lib/ai-api')
        const response = await handleChat(req as unknown as Request)
        res.writeHead(response.status, Object.fromEntries(response.headers))
        res.end(await response.text())
      })
    },
  }
}
