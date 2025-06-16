import 'dotenv/config'
import { addItemTool } from '@/lib/tools'
import { openai } from '@ai-sdk/openai'
import { serve } from '@hono/node-server'
import { streamText, type Message } from 'ai'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { stream } from 'hono/streaming'

const PORT = 8787

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

type Body = {
  messages: Message[]
  model: string
}

app.post('/', async (c) => {
  try {
    console.log('headers', c.req.header())
    const body = (await c.req.json()) as Body

    const result = streamText({
      model: openai(body.model),
      system:
        'You are a helpful AI assistant. You can add items to a list using the addItem tool.',
      messages: body.messages,
      tools: { addItem: addItemTool },
      toolChoice: 'auto',
      // providerOptions: { openai: { reasoningEffort: 'low' } },
    })

    // Mark the response as a v1 data stream:
    c.header('X-Vercel-AI-Data-Stream', 'v1')
    c.header('Content-Type', 'text/plain; charset=utf-8')

    return stream(c, (s) => s.pipe(result.toDataStream()))
  } catch (error) {
    console.error('Error in POST /:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

console.log(`Hono server running at http://localhost:${PORT}`)

serve({ fetch: app.fetch, port: PORT })
