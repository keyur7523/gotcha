import { useAnalysisStore } from '@/stores/analysisStore'
import IssueCard from './IssueCard'
import { Target } from 'lucide-react'

export default function ReviewPanel() {
  const { result, isRunning } = useAnalysisStore()

  if (!result && !isRunning) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <Target className="w-12 h-12 text-text-muted mb-4" />
        <h2 className="text-lg font-medium mb-2">Ready to Review</h2>
        <p className="text-sm text-text-secondary max-w-xs">
          Paste your code and click "Review Code" to find bugs and get verified test cases.
        </p>
      </div>
    )
  }

  if (!result) {
    return null
  }

  const verifiedCount = result.issues.filter((i) => i.status === 'verified').length
  const potentialCount = result.issues.filter((i) => i.status === 'potential').length

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-medium">Review Results</h2>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-text-secondary">
              Score:{' '}
              <span
                className={
                  result.code_quality_score >= 80
                    ? 'text-success'
                    : result.code_quality_score >= 50
                    ? 'text-warning'
                    : 'text-error'
                }
              >
                {result.code_quality_score}/100
              </span>
            </span>
          </div>
        </div>
        <p className="text-sm text-text-secondary">
          {verifiedCount} verified, {potentialCount} potential issues
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {result.issues.length === 0 ? (
          <p className="text-center text-text-secondary py-8">
            No issues found. Your code looks good!
          </p>
        ) : (
          result.issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))
        )}
      </div>
    </div>
  )
}
