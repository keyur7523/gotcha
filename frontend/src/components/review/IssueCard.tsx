import { useState } from 'react'
import { ChevronDown, ChevronUp, Code, Wrench } from 'lucide-react'
import SeverityBadge from './SeverityBadge'
import StatusBadge from './StatusBadge'
import type { Issue } from '@/types/analysis'

interface IssueCardProps {
  issue: Issue
}

export default function IssueCard({ issue }: IssueCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start gap-3 text-left hover:bg-surface-hover transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={issue.status} />
            <SeverityBadge severity={issue.severity} />
          </div>
          <h3 className="font-medium text-sm">{issue.title}</h3>
          <p className="text-xs text-text-muted mt-1">
            Line {issue.line_start}
            {issue.line_end !== issue.line_start && `-${issue.line_end}`}
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          <div>
            <h4 className="text-xs font-medium text-text-secondary mb-1">Description</h4>
            <p className="text-sm text-text-secondary">{issue.description}</p>
          </div>

          {issue.test_result && (
            <div>
              <h4 className="text-xs font-medium text-text-secondary mb-1 flex items-center gap-1">
                <Code className="w-3 h-3" />
                Test Code
              </h4>
              <pre className="text-xs bg-code-bg p-3 rounded-md overflow-x-auto">
                {issue.test_result.test_code}
              </pre>
              {issue.test_result.stderr && (
                <pre className="text-xs bg-error/10 text-error p-3 rounded-md mt-2 overflow-x-auto">
                  {issue.test_result.stderr}
                </pre>
              )}
            </div>
          )}

          {issue.suggested_fix && (
            <div>
              <h4 className="text-xs font-medium text-text-secondary mb-1 flex items-center gap-1">
                <Wrench className="w-3 h-3" />
                Suggested Fix
              </h4>
              <pre className="text-xs bg-success/10 p-3 rounded-md overflow-x-auto">
                {issue.suggested_fix}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
