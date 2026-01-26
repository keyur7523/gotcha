import { Beaker } from 'lucide-react'
import { useEditorStore } from '@/stores/editorStore'
import { useAnalysisStore } from '@/stores/analysisStore'

const EXAMPLES = [
  { id: 'division', label: 'Division by Zero', description: 'Empty list causes crash' },
  { id: 'index', label: 'Off-by-One', description: 'Index out of bounds' },
  { id: 'type', label: 'Type Error', description: 'String concatenation fails' },
] as const

export default function ExampleSelector() {
  const { loadExample } = useEditorStore()
  const { isRunning } = useAnalysisStore()

  return (
    <div className="flex items-center gap-2">
      <Beaker className="w-3.5 h-3.5 text-text-muted" />
      <span className="text-xs text-text-muted">Try:</span>
      {EXAMPLES.map((example) => (
        <button
          key={example.id}
          onClick={() => loadExample(example.id)}
          disabled={isRunning}
          className="text-xs text-accent hover:text-accent-hover disabled:text-text-muted disabled:cursor-not-allowed transition-colors"
          title={example.description}
        >
          {example.label}
        </button>
      ))}
    </div>
  )
}
