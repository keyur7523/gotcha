export type Language = 'python' | 'javascript'
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'
export type IssueStatus = 'verified' | 'potential' | 'suggestion'
export type SessionStatus = 'pending' | 'running' | 'completed' | 'error'
export type StepAction = 'analyzing' | 'generating_test' | 'executing' | 'refining' | 'complete'

export interface TestResult {
  test_code: string
  passed: boolean
  stdout: string
  stderr: string
  exit_code: number
  duration_ms: number
  error_line?: number
}

export interface Issue {
  id: string
  title: string
  description: string
  severity: Severity
  status: IssueStatus
  line_start: number
  line_end: number
  test_result?: TestResult
  suggested_fix?: string
  reasoning: string
}

export interface AgentStep {
  step_number: number
  action: StepAction
  description: string
  timestamp: string
  data?: Record<string, unknown>
}

export interface AnalysisResult {
  issues: Issue[]
  summary: string
  code_quality_score: number
  steps: AgentStep[]
  total_duration_ms: number
}

export interface AnalysisSession {
  id: string
  code: string
  language: Language
  status: SessionStatus
  result?: AnalysisResult
  created_at: string
  completed_at?: string
}

export type Strictness = 'relaxed' | 'normal' | 'strict'

export interface AnalyzeRequest {
  code: string
  language: Language
  strictness?: Strictness
  max_issues?: number
}

export interface AnalyzeResponse {
  session_id: string
  status: 'started'
}
