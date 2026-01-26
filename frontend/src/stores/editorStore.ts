import { create } from 'zustand'
import type { Language } from '@/types/analysis'

interface EditorState {
  code: string
  language: Language
  setCode: (code: string) => void
  setLanguage: (language: Language) => void
}

const DEFAULT_CODE = `def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)
`

export const useEditorStore = create<EditorState>((set) => ({
  code: DEFAULT_CODE,
  language: 'python',
  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
}))
