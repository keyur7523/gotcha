import { useAnalysisStore } from '@/stores/analysisStore'
import { cn } from '@/lib/utils'
import { Check, Loader2, Search, TestTube, Play, Wrench, Sparkles } from 'lucide-react'
import type { StepAction } from '@/types/analysis'

const actionConfig: Record<StepAction, { icon: typeof Search; label: string }> = {
  analyzing: { icon: Search, label: 'Analyzing' },
  generating_test: { icon: TestTube, label: 'Generating Test' },
  executing: { icon: Play, label: 'Executing' },
  refining: { icon: Wrench, label: 'Refining' },
  complete: { icon: Sparkles, label: 'Complete' },
}

export default function AgentTimeline() {
  const { steps, isRunning } = useAnalysisStore()

  if (steps.length === 0 && !isRunning) {
    return null
  }

  const currentStep = steps[steps.length - 1]
  const isComplete = currentStep?.action === 'complete'

  return (
    <div className={cn(
      'border-t border-border p-4 transition-colors',
      isComplete ? 'bg-success/5' : 'bg-surface'
    )}>
      <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1">
        {steps.map((step, idx) => {
          const config = actionConfig[step.action]
          const Icon = config.icon
          const isLast = idx === steps.length - 1
          const isStepComplete = !isLast || step.action === 'complete'

          return (
            <div key={step.step_number} className="flex items-center flex-shrink-0">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center transition-all',
                  isStepComplete
                    ? 'bg-success/20 text-success'
                    : isLast && isRunning
                    ? 'bg-accent/20 text-accent'
                    : 'bg-surface-hover text-text-muted'
                )}
                title={config.label}
              >
                {isLast && isRunning && step.action !== 'complete' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : isStepComplete ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              {idx < steps.length - 1 && (
                <div className="w-6 h-0.5 mx-0.5 bg-success/30" />
              )}
            </div>
          )
        })}
      </div>

      {currentStep && (
        <div className="flex items-center gap-2">
          {isRunning && !isComplete && (
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          )}
          <p className={cn(
            'text-sm',
            isComplete ? 'text-success' : 'text-text-secondary'
          )}>
            {currentStep.description}
          </p>
        </div>
      )}
    </div>
  )
}
