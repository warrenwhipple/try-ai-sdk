import type { Plugin } from 'vite'

export function aiApiPlugin(): Plugin {
  return {
    name: 'ai-api',
    apply: 'serve',
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
