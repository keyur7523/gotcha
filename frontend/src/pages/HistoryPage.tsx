import { useQuery } from '@tanstack/react-query'
import { analysisApi } from '@/api/analysis'
import { Clock, FileCode } from 'lucide-react'
import type { AnalysisSession } from '@/types/analysis'

export default function HistoryPage() {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: analysisApi.history,
  })

  if (isLoading) {
    return (
      <div className="p-8 text-center text-text-secondary">Loading...</div>
    )
  }

  if (!sessions?.length) {
    return (
      <div className="p-8 text-center">
        <FileCode className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <h2 className="text-lg font-medium mb-2">No History Yet</h2>
        <p className="text-sm text-text-secondary">
          Your code reviews will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-xl font-semibold mb-6">Review History</h1>

      <div className="space-y-3">
        {sessions.map((session: AnalysisSession) => (
          <div
            key={session.id}
            className="p-4 bg-surface border border-border rounded-lg"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-surface-hover">
                  {session.language}
                </span>
                <span
                  className={`ml-2 text-xs font-medium px-2 py-0.5 rounded ${
                    session.status === 'completed'
                      ? 'bg-success/20 text-success'
                      : session.status === 'running'
                      ? 'bg-accent/20 text-accent'
                      : 'bg-surface-hover text-text-secondary'
                  }`}
                >
                  {session.status}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-text-muted">
                <Clock className="w-3 h-3" />
                {new Date(session.created_at).toLocaleString()}
              </div>
            </div>

            <pre className="text-xs text-text-secondary bg-code-bg p-2 rounded mt-2 overflow-hidden max-h-20">
              {session.code.slice(0, 200)}
              {session.code.length > 200 && '...'}
            </pre>

            {session.result && (
              <div className="mt-3 flex items-center gap-4 text-xs">
                <span>
                  Score:{' '}
                  <span
                    className={
                      session.result.code_quality_score >= 80
                        ? 'text-success'
                        : session.result.code_quality_score >= 50
                        ? 'text-warning'
                        : 'text-error'
                    }
                  >
                    {session.result.code_quality_score}/100
                  </span>
                </span>
                <span className="text-text-muted">
                  {session.result.issues.length} issues found
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
