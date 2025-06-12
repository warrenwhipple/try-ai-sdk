import { ChatPane } from '@/components/chat-pane'
import { DocumentPane } from '@/components/document-pane'

export function App() {
  return (
    <div className="flex h-screen w-full">
      <ChatPane />
      <DocumentPane />
    </div>
  )
}
