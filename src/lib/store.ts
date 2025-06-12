import { create } from 'zustand'

type ActionResult<T> = {
  status: 'success' | 'error'
  message?: string
} & T

interface DocumentState {
  items: string[]
  addItem: (item: string) => ActionResult<{ items: string[] }>
  removeItem: (index: number) => ActionResult<{ items: string[] }>
  updateItem: (
    index: number,
    newValue: string
  ) => ActionResult<{ items: string[] }>
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  items: ['alpha', 'beta', 'gamma'],
  addItem: (item) => {
    set((state) => ({ items: [...state.items, item] }))
    return { status: 'success', items: get().items }
  },
  removeItem: (index) => {
    if (index < 0 || index >= get().items.length) {
      return { status: 'error', message: 'Invalid index', items: get().items }
    }
    set((state) => ({ items: state.items.filter((_, i) => i !== index) }))
    return { status: 'success', items: get().items }
  },
  updateItem: (index, newValue) => {
    if (index < 0 || index >= get().items.length) {
      return { status: 'error', message: 'Invalid index', items: get().items }
    }
    set((state) => ({
      items: state.items.map((item, i) => (i === index ? newValue : item)),
    }))
    return { status: 'success', items: get().items }
  },
}))
