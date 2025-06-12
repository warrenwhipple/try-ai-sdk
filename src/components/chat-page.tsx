import { useChat } from '@ai-sdk/react'
import { Chat } from '@/components/ui/chat'
import { type Message } from '@/components/ui/chat-message'
import { useDocumentStore } from '@/lib/store'

export function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: '/api/chat',
    initialMessages: [],
    body: {
      model: 'gpt-3.5-turbo',
    },
  })

  const { items } = useDocumentStore()

  return (
    <div className="flex h-screen w-full">
      <div className="flex flex-1 flex-col w-1/2">
        <Chat
          messages={messages as Message[]}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isGenerating={status === 'submitted' || status === 'streaming'}
          className="flex-1"
        />
      </div>
      <div className="flex flex-1 items-center justify-center w-1/2 border-l">
        <ul className="space-y-2 text-lg">
          {items.map((item, index) => (
            <li key={index} className="text-center">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
