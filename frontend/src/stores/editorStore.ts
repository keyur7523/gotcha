import { create } from 'zustand'
import type { Language } from '@/types/analysis'

interface EditorState {
  code: string
  language: Language
  setCode: (code: string) => void
  setLanguage: (language: Language) => void
  loadExample: (example: 'division' | 'index' | 'type') => void
}

const EXAMPLES = {
  division: `def calculate_average(numbers):
    """Calculate the average of a list of numbers."""
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)  # Bug: crashes on empty list

# Test it
print(calculate_average([1, 2, 3, 4, 5]))
`,
  index: `def get_last_item(items):
    """Get the last item from a list."""
    return items[len(items)]  # Bug: off-by-one, should be len(items) - 1

# Test it
print(get_last_item(['a', 'b', 'c']))
`,
  type: `def concat_strings(a, b):
    """Concatenate two strings with a space."""
    return a + " " + b

# Bug: no type checking, will fail with non-strings
result = concat_strings("Hello", 42)
print(result)
`,
}

export const useEditorStore = create<EditorState>((set) => ({
  code: EXAMPLES.division,
  language: 'python',
  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  loadExample: (example) => set({ code: EXAMPLES[example], language: 'python' }),
}))
