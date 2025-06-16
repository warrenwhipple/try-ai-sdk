import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { handleChat } from '../lib/ai-api'

const app = new Hono()

app.use(
  '*',
  cors({
    origin: 'http://localhost:5173',
    allowHeaders: ['Content-Type'],
    allowMethods: ['POST', 'OPTIONS'],
    credentials: true,
  })
)

app.post('/api/chat', async (c) => {
  try {
    const req = c.req.raw
    const response = await handleChat(req)
    // Copy status and headers for streaming response
    for (const [key, value] of response.headers) {
      c.header(key, value)
    }
    // Stream the response body if present
    if (response.body) {
      return new Response(response.body, {
        status: response.status,
        headers: response.headers,
      })
    } else {
      // If no body, return 200 OK with empty text
      return c.text('', 200)
    }
  } catch (error) {
    console.error('Chat API error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default app
