import { addItemTool } from '@/lib/tools'
import { anthropic, type AnthropicProviderOptions } from '@ai-sdk/anthropic'
import { openai, type OpenAIResponsesProviderOptions } from '@ai-sdk/openai'
import { serve } from '@hono/node-server'
import { streamText, type Message } from 'ai'
import 'dotenv/config'
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

export type ChatApiBody = {
  id: string
  messages: Message[]
  provider: 'anthropic' | 'openai'
}

app.post('/', async (c) => {
  try {
    const body = (await c.req.json()) as ChatApiBody

    const model =
      body.provider === 'anthropic'
        ? anthropic('claude-3-5-sonnet-20240620')
        : openai.responses('o4-mini')

    const result = streamText({
      model,
      system:
        'You are a helpful AI assistant. You can add items to a list using the addItem tool.',
      messages: body.messages,
      tools: { addItem: addItemTool },
      toolChoice: 'auto',
      providerOptions: {
        anthropic: {
          // thinking: { type: 'enabled', budgetTokens: 12000 },
        } satisfies AnthropicProviderOptions,
        openai: {
          //   reasoningEffort: 'low',
          //   reasoningSummary: 'auto',
        } satisfies OpenAIResponsesProviderOptions,
      },
    })

    // @see https://ai-sdk.dev/cookbook/api-servers/hono
    c.header('X-Vercel-AI-Data-Stream', 'v1')
    c.header('Content-Type', 'text/plain; charset=utf-8')

    // @see https://ai-sdk.dev/docs/troubleshooting/streaming-not-working-when-proxied
    c.header('Content-Encoding', 'none')

    return stream(c, (s) =>
      s.pipe(
        result.toDataStream({
          // sendReasoning: true,
        })
      )
    )
  } catch (error) {
    console.error('Error in POST /:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

console.log(`Hono server running at http://localhost:${PORT}`)

serve({ fetch: app.fetch, port: PORT })
