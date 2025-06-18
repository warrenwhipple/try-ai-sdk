import OpenAI from 'openai'
import { useEffect, useRef, useState } from 'react'

let _client: OpenAI | null = null

function getClient() {
  if (!_client) {
    _client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    })
  }
  return _client
}

type ResponsesState = {
  messages: string[]
  inputValue: string
  isLoading: boolean
  responseId: string | null
  error: unknown
}

const initialState: ResponsesState = {
  messages: [],
  inputValue: '',
  isLoading: false,
  responseId: null,
  error: null,
}

export function useResponses() {
  const [state, setState] = useState<ResponsesState>(initialState)
  const abortControllerRef = useRef<AbortController>(null)

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (state.isLoading) return
    if (!state.inputValue.trim()) return
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()

    const currentInputValue = state.inputValue
    const currentResponseId = state.responseId

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, `User: ${currentInputValue}`],
      isLoading: true,
      inputValue: '',
    }))

    getClient()
      .responses.create({
        model: 'o4-mini',
        input: currentInputValue,
        previous_response_id: currentResponseId,
      })
      .then((response) => {
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, `AI: ${response.output_text}`],
          isLoading: false,
          responseId: response.id,
          error: null,
        }))
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error ?? 'Unknown error',
        }))
      })
  }

  const cancelRequest = () => {
    if (state.isLoading && abortControllerRef.current) {
      abortControllerRef.current.abort()
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }))
    }
  }

  useEffect(() => () => abortControllerRef.current?.abort(), [])

  const onInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setState((prev) => ({
      ...prev,
      inputValue: e.target.value,
    }))
  }

  const onInputKeyDown: React.KeyboardEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    responseId: state.responseId,
    onSubmit,
    cancelRequest,
    inputProps: {
      value: state.inputValue,
      onChange: onInputChange,
      onKeyDown: onInputKeyDown,
    },
  }
}
