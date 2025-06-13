import { create } from 'zustand'

interface DocumentState {
  items: string[]
  addItem: (item: string) => void
  removeItem: (index: number) => void
  updateItem: (index: number, newValue: string) => void
}

export const useDocumentStore = create<DocumentState>((set) => ({
  items: ['alpha', 'beta', 'gamma'],
  addItem: (item) => {
    set((state) => ({ items: [...state.items, item] }))
  },
  removeItem: (index) => {
    set((state) => ({ items: state.items.filter((_, i) => i !== index) }))
  },
  updateItem: (index, newValue) => {
    set((state) => ({
      items: state.items.map((item, i) => (i === index ? newValue : item)),
    }))
  },
}))
