import { useState } from 'react'
import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { Chat } from '@/components/ui/chat'
import { type Message } from '@/components/ui/chat-message'

const openai = createOpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
})

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = async (event?: { preventDefault?: () => void }) => {
    event?.preventDefault?.()
    if (!input.trim() || isGenerating) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsGenerating(true)

    try {
      const result = await generateText({
        model: openai('gpt-3.5-turbo'),
        system: 'You are a helpful assistant.',
        messages: [...messages, userMessage].map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      })

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.text,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  return (
    <div className="flex h-screen w-full max-w-4xl mx-auto">
      <div className="flex flex-1 flex-col">
        <Chat
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isGenerating={isGenerating}
          className="flex-1"
        />
      </div>
    </div>
  )
}
