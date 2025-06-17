import { Chat } from '@/components/chat'
import { useAisdkChat } from '@/hooks/useAisdkChat'

export function ChatPane() {
  const chatProps = useAisdkChat()

  return (
    <div className="flex flex-1 flex-col w-1/2">
      <Chat className="flex-1" {...chatProps} />
    </div>
  )
}
