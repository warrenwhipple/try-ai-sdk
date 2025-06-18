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
    body: {
      model: 'o4-mini',
      stream: true,
      tools: { add_item: addItemTool },
    },
    onToolCall: ({ toolCall }) => {
      try {
        switch (toolCall.toolName.toLowerCase()) {
          case 'add_item':
          case 'add item':
          case 'additem':
          case 'add': {
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
