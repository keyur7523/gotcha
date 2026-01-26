import { create } from 'zustand'
import type { AgentStep, AnalysisResult } from '@/types/analysis'

interface AnalysisState {
  sessionId: string | null
  isRunning: boolean
  steps: AgentStep[]
  result: AnalysisResult | null
  error: string | null
  setSessionId: (id: string | null) => void
  setIsRunning: (running: boolean) => void
  addStep: (step: AgentStep) => void
  setResult: (result: AnalysisResult | null) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  sessionId: null,
  isRunning: false,
  steps: [],
  result: null,
  error: null,
  setSessionId: (sessionId) => set({ sessionId }),
  setIsRunning: (isRunning) => set({ isRunning }),
  addStep: (step) => set((state) => ({ steps: [...state.steps, step] })),
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),
  reset: () => set({ sessionId: null, isRunning: false, steps: [], result: null, error: null }),
}))
