import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Strictness } from '@/types/analysis'

export type Theme = 'dark' | 'light'
export type { Strictness }

interface SettingsState {
  // Editor
  fontSize: number
  tabSize: number
  showMinimap: boolean

  // Analysis
  strictness: Strictness
  maxIssues: number

  // Theme
  theme: Theme

  // API
  customApiKey: string

  // Actions
  setFontSize: (size: number) => void
  setTabSize: (size: number) => void
  setShowMinimap: (show: boolean) => void
  setStrictness: (level: Strictness) => void
  setMaxIssues: (max: number) => void
  setTheme: (theme: Theme) => void
  setCustomApiKey: (key: string) => void
  resetToDefaults: () => void
}

const defaultSettings = {
  fontSize: 14,
  tabSize: 4,
  showMinimap: false,
  strictness: 'normal' as Strictness,
  maxIssues: 10,
  theme: 'dark' as Theme,
  customApiKey: '',
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setFontSize: (fontSize) => set({ fontSize }),
      setTabSize: (tabSize) => set({ tabSize }),
      setShowMinimap: (showMinimap) => set({ showMinimap }),
      setStrictness: (strictness) => set({ strictness }),
      setMaxIssues: (maxIssues) => set({ maxIssues }),
      setTheme: (theme) => set({ theme }),
      setCustomApiKey: (customApiKey) => set({ customApiKey }),
      resetToDefaults: () => set(defaultSettings),
    }),
    {
      name: 'gotcha-settings',
    }
  )
)
