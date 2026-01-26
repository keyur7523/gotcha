import { useAnalysisStore } from '@/stores/analysisStore'
import IssueCard from './IssueCard'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { Target, CheckCircle, AlertTriangle } from 'lucide-react'

export default function ReviewPanel() {
  const { result, isRunning, steps, error } = useAnalysisStore()

  if (!result && !isRunning && steps.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <Target className="w-12 h-12 text-text-muted mb-4" />
        <h2 className="text-lg font-medium mb-2">Ready to Review</h2>
        <p className="text-sm text-text-secondary max-w-xs">
          Paste your code and click "Review Code" to find bugs with verified test cases.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <AlertTriangle className="w-12 h-12 text-error mb-4" />
        <h2 className="text-lg font-medium mb-2">Analysis Failed</h2>
        <p className="text-sm text-text-secondary max-w-xs">{error}</p>
      </div>
    )
  }

  if (isRunning && !result) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <h2 className="font-medium">Analyzing...</h2>
          </div>
          <p className="text-sm text-text-secondary">
            {steps.length > 0 ? steps[steps.length - 1].description : 'Starting analysis...'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    )
  }

  if (!result) return null

  const verifiedCount = result.issues.filter((i) => i.status === 'verified').length
  const potentialCount = result.issues.filter((i) => i.status === 'potential').length

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <h2 className="font-medium">Review Complete</h2>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-text-secondary">
              Score:{' '}
              <span
                className={
                  result.code_quality_score >= 80
                    ? 'text-success font-medium'
                    : result.code_quality_score >= 50
                    ? 'text-warning font-medium'
                    : 'text-error font-medium'
                }
              >
                {result.code_quality_score}/100
              </span>
            </span>
          </div>
        </div>
        <p className="text-sm text-text-secondary">
          Found {verifiedCount} verified and {potentialCount} potential issues
          {result.total_duration_ms && (
            <span className="text-text-muted"> · {(result.total_duration_ms / 1000).toFixed(1)}s</span>
          )}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {result.issues.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-10 h-10 text-success mx-auto mb-3" />
            <p className="font-medium">No issues found!</p>
            <p className="text-sm text-text-secondary mt-1">
              Your code looks good. Gotcha couldn't find any bugs.
            </p>
          </div>
        ) : (
          result.issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))
        )}
      </div>
    </div>
  )
}
