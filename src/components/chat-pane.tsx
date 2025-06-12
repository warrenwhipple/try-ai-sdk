import { useChat } from '@ai-sdk/react'
import { Chat } from '@/components/ui/chat'
import { type Message } from '@/components/ui/chat-message'
import { useDocumentStore } from '@/lib/store'
import { useEffect } from 'react'

export function ChatPane() {
  const addItem = useDocumentStore((state) => state.addItem)

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: '/api/chat',
    initialMessages: [],
    body: {
      model: 'gpt-3.5-turbo',
    },
  })

  // Handle tool calls in messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === 'assistant' && lastMessage.toolInvocations) {
      lastMessage.toolInvocations.forEach((toolInvocation) => {
        if (
          toolInvocation.toolName === 'append' &&
          toolInvocation.state === 'result' &&
          toolInvocation.result?.value
        ) {
          addItem(toolInvocation.result.value)
        }
      })
    }
  }, [messages, addItem])

  return (
    <div className="flex flex-1 flex-col w-1/2 p-4">
      <Chat
        messages={messages as Message[]}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isGenerating={status === 'submitted' || status === 'streaming'}
        className="flex-1"
      />
    </div>
  )
}
