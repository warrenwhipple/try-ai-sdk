import type { ChatPropsWithoutSuggestions } from '@/components/chat'
import { useDocumentStore } from '@/lib/store'
import { addItemSchema } from '@/lib/tools'
import { useChat } from '@ai-sdk/react'

export const useAisdkChat = () => {
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    status,
  } = useChat({
    api: 'http://localhost:8787',
    maxSteps: 3,
    onToolCall({ toolCall }) {
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

  const isGenerating = status === 'submitted' || status === 'streaming'

  const chatProps: ChatPropsWithoutSuggestions = {
    messages,
    setMessages,
    handleSubmit,
    input,
    handleInputChange,
    isGenerating,
  }

  return chatProps
}
