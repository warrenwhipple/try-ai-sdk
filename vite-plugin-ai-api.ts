import type { Plugin } from 'vite'
import { loadEnv } from 'vite'
import { handleChat } from './src/lib/ai-api'

export function aiApiPlugin(): Plugin {
  return {
    name: 'ai-api',
    apply: 'serve',
    config(_, { mode }) {
      const env = loadEnv(mode, process.cwd(), '')
      Object.assign(process.env, env)
    },
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        const response = await handleChat(req as unknown as Request)
        res.writeHead(response.status, Object.fromEntries(response.headers))
        res.end(await response.text())
      })
    },
  }
}
