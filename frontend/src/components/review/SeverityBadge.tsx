import { cn } from '@/lib/utils'
import type { Severity } from '@/types/analysis'

interface SeverityBadgeProps {
  severity: Severity
}

const severityConfig: Record<Severity, { label: string; className: string }> = {
  critical: { label: 'Critical', className: 'bg-error/20 text-error' },
  high: { label: 'High', className: 'bg-error/10 text-error' },
  medium: { label: 'Medium', className: 'bg-warning/20 text-warning' },
  low: { label: 'Low', className: 'bg-info/20 text-info' },
  info: { label: 'Info', className: 'bg-text-muted/20 text-text-secondary' },
}

export default function SeverityBadge({ severity }: SeverityBadgeProps) {
  const config = severityConfig[severity]

  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded text-xs font-medium',
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
