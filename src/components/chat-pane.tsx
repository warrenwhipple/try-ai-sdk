import { Chat } from '@/components/chat'
import { useOpenaiChat } from '@/hooks/use-openai-chat'

export function ChatPane() {
  const chatProps = useOpenaiChat()
  return (
    <div className="flex flex-1 flex-col w-1/2">
      <Chat {...chatProps} className="h-full" />
    </div>
  )
}
