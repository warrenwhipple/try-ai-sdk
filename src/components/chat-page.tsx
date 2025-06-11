import { useChat } from '@ai-sdk/react'
import { Chat } from '@/components/ui/chat'
import { type Message } from '@/components/ui/chat-message'

export function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: '/api/chat',
    initialMessages: [],
    body: {
      model: 'gpt-3.5-turbo',
    },
  })

  return (
    <div className="flex h-screen w-full max-w-4xl mx-auto">
      <div className="flex flex-1 flex-col">
        <Chat
          messages={messages as Message[]}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isGenerating={status === 'submitted' || status === 'streaming'}
          className="flex-1"
        />
      </div>
    </div>
  )
}
