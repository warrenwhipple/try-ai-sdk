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
  streamingMessage: string | null
}

const initialState: ResponsesState = {
  messages: [],
  inputValue: '',
  isLoading: false,
  responseId: null,
  error: null,
  streamingMessage: null,
}

export function useResponses() {
  const [state, setState] = useState<ResponsesState>(initialState)
  const abortControllerRef = useRef<AbortController | null>(null)

  const onSubmit = async (e?: React.FormEvent) => {
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
      streamingMessage: '',
      error: null,
    }))

    try {
      const stream = await getClient().responses.create(
        {
          model: 'o4-mini',
          input: currentInputValue,
          previous_response_id: currentResponseId,
          stream: true,
        },
        {
          signal: abortControllerRef.current?.signal,
        }
      )

      let streamingMessage = ''
      const eventMap = new Map<number, OpenAI.Responses.ResponseStreamEvent>()
      let nextSequenceToProcess = 0
      let responseCompleted = false

      const processReadyEvents = () => {
        while (eventMap.has(nextSequenceToProcess)) {
          const event = eventMap.get(nextSequenceToProcess)!
          eventMap.delete(nextSequenceToProcess)
          nextSequenceToProcess++

          switch (event.type) {
            case 'response.created': {
              const responseId = event.response.id
              setState((prev) => ({ ...prev, responseId }))
              break
            }
            case 'response.output_text.delta': {
              streamingMessage += event.delta
              setState((prev) => ({ ...prev, streamingMessage }))
              break
            }
            case 'response.completed': {
              responseCompleted = true
              setState((prev) => ({
                ...prev,
                messages: [...prev.messages, `AI: ${streamingMessage}`],
                streamingMessage: null,
                isLoading: false,
              }))
              break
            }
            case 'error': {
              const error = event.message || 'Unknown error'
              setState((prev) => ({
                ...prev,
                isLoading: false,
                error,
                streamingMessage: null,
              }))
              break
            }
          }
        }
      }

      for await (const event of stream) {
        if (abortControllerRef.current?.signal.aborted) break
        eventMap.set(event.sequence_number, event)
        processReadyEvents()
      }

      processReadyEvents()

      if (eventMap.size > 0) {
        console.warn('Unprocessed response streaming events:', {
          remainingEvents: Array.from(eventMap.entries()),
          nextSequenceToProcess,
        })
      }

      if (
        !abortControllerRef.current?.signal.aborted &&
        streamingMessage &&
        !responseCompleted
      ) {
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, `AI: ${streamingMessage}`],
          isLoading: false,
          streamingMessage: null,
        }))
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          streamingMessage: null,
        }))
        return
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error ?? 'Unknown error',
        streamingMessage: null,
      }))
    }
  }

  const cancelRequest = () => {
    if (state.isLoading && abortControllerRef.current) {
      abortControllerRef.current.abort()
      setState((prev) => ({
        ...prev,
        isLoading: false,
        streamingMessage: null,
      }))
    }
  }

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

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
    streamingMessage: state.streamingMessage,
    onSubmit,
    cancelRequest,
    inputProps: {
      value: state.inputValue,
      onChange: onInputChange,
      onKeyDown: onInputKeyDown,
    },
  }
}
