import { useState } from 'react'
import { ChevronDown, ChevronUp, Code, Wrench, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import SeverityBadge from './SeverityBadge'
import StatusBadge from './StatusBadge'
import { Collapse } from '@/components/ui/Animations'
import { useAnalysisStore } from '@/stores/analysisStore'
import type { Issue } from '@/types/analysis'

interface IssueCardProps {
  issue: Issue
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success(`${label} copied to clipboard`)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-surface-hover transition-colors"
      title={`Copy ${label.toLowerCase()}`}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-success" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-text-muted" />
      )}
    </button>
  )
}

export default function IssueCard({ issue }: IssueCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { setHighlightedLines } = useAnalysisStore()

  const handleMouseEnter = () => {
    setHighlightedLines({ start: issue.line_start, end: issue.line_end })
  }

  const handleMouseLeave = () => {
    setHighlightedLines(null)
  }

  return (
    <div
      className="border border-border rounded-lg overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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

      <Collapse isOpen={expanded}>
        <div className="px-4 pb-4 space-y-4">
          <div>
            <h4 className="text-xs font-medium text-text-secondary mb-1">Description</h4>
            <p className="text-sm text-text-secondary">{issue.description}</p>
          </div>

          {issue.test_result && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-medium text-text-secondary flex items-center gap-1">
                  <Code className="w-3 h-3" />
                  Test Code
                </h4>
                <CopyButton text={issue.test_result.test_code} label="Test code" />
              </div>
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
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-medium text-text-secondary flex items-center gap-1">
                  <Wrench className="w-3 h-3" />
                  Suggested Fix
                </h4>
                <CopyButton text={issue.suggested_fix} label="Fix" />
              </div>
              <pre className="text-xs bg-success/10 p-3 rounded-md overflow-x-auto">
                {issue.suggested_fix}
              </pre>
            </div>
          )}
        </div>
      </Collapse>
    </div>
  )
}
