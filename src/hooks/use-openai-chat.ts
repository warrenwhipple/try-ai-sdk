import type { ChatPropsWithoutSuggestions } from '@/components/chat'
import type { UIMessage } from 'ai'
import OpenAI from 'openai'
import type {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from 'openai/resources/chat'
import { useCallback, useState } from 'react'

let _openai: OpenAI | null = null
function getOpenai() {
  if (!_openai) {
    const apiKey = String(import.meta.env.VITE_OPENAI_API_KEY || '')
    if (!apiKey) {
      console.warn('OpenAI API key not found in environment variables')
    }
    _openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY as string,
      dangerouslyAllowBrowser: true,
    })
  }
  return _openai
}

export function useOpenaiChat() {
  const [messages, setMessages] = useState<UIMessage[]>([])

  const [input, setInput] = useState('')
  const handleInputChange = useCallback<
    ChatPropsWithoutSuggestions['handleInputChange']
  >((e) => {
    setInput(e.target.value)
  }, [])

  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = useCallback<ChatPropsWithoutSuggestions['handleSubmit']>(
    (e) => {
      e?.preventDefault?.()
      if (!input) return
      const userMessage: UIMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: input,
        parts: [{ type: 'text', text: input }],
      }
      setInput('')
      const newMessages: UIMessage[] = [...messages, userMessage]
      setMessages(newMessages)
      setIsGenerating(true)
      getOpenai()
        .chat.completions.create({
          model: 'o4-mini',
          messages: newMessages.map(toOpenaiMessage),
        })
        .then((completion) => {
          console.log(completion)
          setIsGenerating(false)
          setMessages((prev) => {
            const draft = [...prev]
            completion.choices.forEach((c) => {
              const m = toUiMessage(c.message)
              draft.push(m)
            })
            return draft
          })
        })
        .catch((reason) => {
          console.error(reason)
        })
    },
    [messages, input]
  )

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

function toOpenaiMessage(m: UIMessage): ChatCompletionMessageParam {
  switch (m.role) {
    case 'user':
    case 'assistant':
    case 'system':
      return { role: m.role, content: m.content }
    default:
      console.error('Unknown message role', m)
      throw new Error(`Unknown message role: ${m.role}`)
  }
}

function toUiMessage(m: ChatCompletionMessage): UIMessage {
  const parts: UIMessage['parts'] = []
  if (m.content) {
    parts.push({ type: 'text', text: m.content })
  }
  m.tool_calls?.forEach((t) => {
    parts.push({
      type: 'tool-invocation',
      toolInvocation: {
        toolCallId: t.id,
        toolName: t.function.name,
        state: 'call',
        args: t.function.arguments,
      },
    })
  })
  return {
    id: crypto.randomUUID(),
    role: m.role,
    content: m.content ?? '',
    parts,
  }
}
