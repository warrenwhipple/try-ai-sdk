import { useChat } from '@ai-sdk/react'
import { Chat } from '@/components/ui/chat'
import { type Message } from '@/components/ui/chat-message'
import { useDocumentStore } from '@/lib/store'
import { addItemSchema } from '@/lib/tools'

export function ChatPane() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: '/api/chat',
    maxSteps: 3,
    initialMessages: [],
    body: { model: 'o4-mini' },
    async onToolCall({ toolCall }) {
      switch (toolCall.toolName) {
        case 'addItem': {
          try {
            const args = addItemSchema.parse(toolCall.args)
            useDocumentStore.getState().addItem(args.item)
            return {
              status: 'success',
              items: useDocumentStore.getState().items,
            }
          } catch (error) {
            return { status: 'error', message: `Invalid arguments: ${error}` }
          }
        }
        default:
          return {
            status: 'error',
            message: `Unknown tool: ${toolCall.toolName}`,
          }
      }
    },
  })

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
