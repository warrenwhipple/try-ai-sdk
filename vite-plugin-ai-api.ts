import { Writable } from 'node:stream'
import type { Plugin } from 'vite'
import { loadEnv } from 'vite'

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
        try {
          if (req.method !== 'POST') {
            res.writeHead(405, { 'Content-Type': 'text/plain' })
            res.end('Method Not Allowed')
            return
          }

          const request = new Request(`http://localhost${req.url}`, {
            method: req.method,
            headers: req.headers as RequestInit['headers'],
            body: req,
            duplex: 'half',
          })

          const { handleChat } = await import('./src/lib/ai-api')
          const response = await handleChat(request)

          res.writeHead(response.status, Object.fromEntries(response.headers))

          if (response.body) {
            await response.body.pipeTo(Writable.toWeb(res))
          } else {
            res.end()
          }
        } catch (error) {
          console.error('Chat API error:', error)
          if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Internal server error' }))
          }
        }
      })
    },
  }
}
