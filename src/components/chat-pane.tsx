import { Chat } from '@/components/chat'
import { useDocumentStore } from '@/lib/store'
import { addItemSchema, addItemTool } from '@/lib/tools'
import { useChat } from '@ai-sdk/react'

export function ChatPane() {
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
  } = useChat({
    api: 'http://localhost:8787',
    maxSteps: 8,
    body: {
      model: 'gpt-3.5-turbo',
      stream: true,
      tools: { addItem: addItemTool },
    },
    onToolCall: ({ toolCall }) => {
      try {
        switch (toolCall.toolName) {
          case 'addItem': {
            const args = addItemSchema.parse(toolCall.args)
            useDocumentStore.getState().addItem(args.item)
            return {
              status: 'success',
              addedItem: args.item,
              listLength: useDocumentStore.getState().items.length,
            }
          }
        }
        return {
          status: 'error',
          error: `Unknown tool name: ${toolCall.toolName}`,
        }
      } catch (error: unknown) {
        return {
          status: 'error',
          error: String(error),
        }
      }
    },
  })

  const isGenerating = status === 'streaming' || status === 'submitted'

  return (
    <div className="flex flex-1 flex-col w-1/2">
      <Chat
        messages={messages}
        setMessages={setMessages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        stop={stop}
        isGenerating={isGenerating}
        className="h-full"
      />
    </div>
  )
}
