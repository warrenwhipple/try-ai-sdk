import OpenAI from 'openai'
import { useState } from 'react'
import { Textarea } from '../ui/textarea'

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

export function ResponsesChat() {
  const [messages, setMessages] = useState<string[]>([])
  const [previous_response_id, setPreviousResponseId] = useState<
    string | undefined
  >(undefined)
  const [input, setInput] = useState('')

  const handleSubmit = () => {
    client.responses
      .create({ model: 'o4-mini', input, previous_response_id })
      .then((response) => {
        setMessages((prev) => [...prev, `AI: ${response.output_text}`])
        setPreviousResponseId(response.id)
      })
      .catch((error) => {
        setMessages((prev) => [...prev, `Error: ${String(error)}`])
      })
    setMessages((prev) => [...prev, `User: ${input}`])
    setInput('')
  }

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setInput(e.target.value)
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <Textarea
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}
