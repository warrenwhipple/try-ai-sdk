import { streamText, type Message } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const openai = createOpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY!,
})

export async function handleChat(req: Request) {
  const body = (await req.json()) as { messages: Message[] }
  const { messages } = body

  const result = streamText({
    model: openai('gpt-3.5-turbo'),
    messages,
    system: 'You are a helpful AI assistant.',
  })

  return result.toDataStreamResponse()
}
