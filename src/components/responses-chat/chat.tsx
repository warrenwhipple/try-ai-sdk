import { LoaderCircleIcon } from 'lucide-react'
import { Textarea } from '../ui/textarea'
import { useResponses } from './use-responses'

export function ResponsesChat() {
  const { messages, streamingMessage, inputProps, isLoading } = useResponses()

  return (
    <div className="flex flex-col gap-4 p-4">
      <ul className="flex flex-col gap-2">
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
        {isLoading && !streamingMessage && (
          <li>
            <LoaderCircleIcon className="animate-spin" />
          </li>
        )}
        {streamingMessage && <li>AI: {streamingMessage}</li>}
      </ul>
      <Textarea {...inputProps} />
    </div>
  )
}
