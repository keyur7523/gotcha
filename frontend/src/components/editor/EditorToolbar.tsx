import { Play, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useEditorStore } from '@/stores/editorStore'
import { useAnalysisStore } from '@/stores/analysisStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { analysisApi } from '@/api/analysis'
import { cn } from '@/lib/utils'
import ExampleSelector from './ExampleSelector'
import type { Language } from '@/types/analysis'

export default function EditorToolbar() {
  const { language, setLanguage, code } = useEditorStore()
  const { isRunning, setSessionId, reset } = useAnalysisStore()
  const { strictness, maxIssues } = useSettingsStore()

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to review')
      return
    }

    reset()

    try {
      const response = await analysisApi.create({
        code,
        language,
        strictness,
        max_issues: maxIssues,
      })
      setSessionId(response.session_id)
      toast.success('Analysis started', {
        description: 'Gotcha is reviewing your code...',
      })
    } catch (error) {
      console.error('Failed to start analysis:', error)
      const message = error instanceof Error ? error.message : 'Please check your connection and try again.'
      toast.error('Failed to start analysis', { description: message })
    }
  }

  return (
    <div className="flex flex-col gap-2 p-3 border-b border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            disabled={isRunning}
            className="bg-surface border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-border-focus disabled:opacity-50"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>

          <span className="text-xs text-text-muted">
            {code.split('\n').length} lines
          </span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isRunning || !code.trim()}
          className={cn(
            'flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all',
            isRunning || !code.trim()
              ? 'bg-surface text-text-muted cursor-not-allowed'
              : 'bg-accent hover:bg-accent-hover text-white active:scale-[0.98]'
          )}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Review Code
            </>
          )}
        </button>
      </div>

      <ExampleSelector />
    </div>
  )
}
