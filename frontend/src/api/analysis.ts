import { api } from './client'
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  AnalysisSession,
} from '@/types/analysis'

export const analysisApi = {
  create: (data: AnalyzeRequest) =>
    api.post<AnalyzeResponse>('/analyze', data),

  get: (sessionId: string) =>
    api.get<AnalysisSession>(`/analyze/${sessionId}`),

  history: () =>
    api.get<AnalysisSession[]>('/history'),
}
