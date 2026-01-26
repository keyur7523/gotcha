import { cn } from '@/lib/utils'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'
import type { IssueStatus } from '@/types/analysis'

interface StatusBadgeProps {
  status: IssueStatus
}

const statusConfig: Record<IssueStatus, { icon: typeof CheckCircle; label: string; className: string }> = {
  verified: { icon: CheckCircle, label: 'Verified', className: 'text-error' },
  potential: { icon: AlertCircle, label: 'Potential', className: 'text-warning' },
  suggestion: { icon: Info, label: 'Suggestion', className: 'text-info' },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span className={cn('flex items-center gap-1 text-xs font-medium', config.className)}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  )
}
