import { useAnalysisStore } from '@/stores/analysisStore'
import { cn } from '@/lib/utils'
import { Check, Loader2, Search, TestTube, Play, Wrench } from 'lucide-react'
import type { StepAction } from '@/types/analysis'

const actionIcons: Record<StepAction, typeof Search> = {
  analyzing: Search,
  generating_test: TestTube,
  executing: Play,
  refining: Wrench,
  complete: Check,
}

export default function AgentTimeline() {
  const { steps, isRunning } = useAnalysisStore()

  if (steps.length === 0 && !isRunning) {
    return null
  }

  const currentStep = steps[steps.length - 1]

  return (
    <div className="border-t border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        {steps.map((step, idx) => {
          const Icon = actionIcons[step.action]
          const isLast = idx === steps.length - 1
          const isComplete = step.action === 'complete'

          return (
            <div key={step.step_number} className="flex items-center">
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center',
                  isComplete
                    ? 'bg-success text-white'
                    : isLast && isRunning
                    ? 'bg-accent text-white'
                    : 'bg-surface text-text-secondary'
                )}
              >
                {isLast && isRunning && !isComplete ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Icon className="w-3 h-3" />
                )}
              </div>
              {idx < steps.length - 1 && (
                <div className="w-8 h-0.5 bg-border mx-1" />
              )}
            </div>
          )
        })}
      </div>

      {currentStep && (
        <p className="text-sm text-text-secondary">{currentStep.description}</p>
      )}
    </div>
  )
}
