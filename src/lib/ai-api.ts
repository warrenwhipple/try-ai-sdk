import { streamText, type Message } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

export async function handleChat(req: Request) {
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  })

  const body = (await req.json()) as { messages: Message[] }
  const { messages } = body

  const result = streamText({
    model: openai('gpt-3.5-turbo'),
    messages,
    system: 'You are a helpful AI assistant.',
  })

  return result.toDataStreamResponse()
}
