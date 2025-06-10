import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ChatPage } from './components/chat-page'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChatPage />
  </StrictMode>
)
