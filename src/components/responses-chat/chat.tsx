import { LoaderCircleIcon } from 'lucide-react'
import { Textarea } from '../ui/textarea'
import { useResponses } from './use-responses'
import { Button } from '../ui/button'

export function ResponsesChat() {
  const { messages, inputProps, isLoading, cancelRequest } = useResponses()

  return (
    <div className="flex flex-col gap-4 p-4">
      <ul className="flex flex-col gap-2">
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      {isLoading && (
        <div className="flex items-center gap-2">
          <LoaderCircleIcon className="animate-spin" />
          <span>Generating response...</span>
          <Button variant="outline" onClick={cancelRequest}>
            Cancel
          </Button>
        </div>
      )}
      <Textarea {...inputProps} />
    </div>
  )
}
