import { Play, Loader2 } from 'lucide-react'
import { useEditorStore } from '@/stores/editorStore'
import { useAnalysisStore } from '@/stores/analysisStore'
import { analysisApi } from '@/api/analysis'
import { cn } from '@/lib/utils'
import type { Language } from '@/types/analysis'

export default function EditorToolbar() {
  const { language, setLanguage, code } = useEditorStore()
  const { isRunning, setSessionId, reset } = useAnalysisStore()

  const handleSubmit = async () => {
    reset()
    try {
      const response = await analysisApi.create({ code, language })
      setSessionId(response.session_id)
    } catch (error) {
      console.error('Failed to start analysis:', error)
    }
  }

  return (
    <div className="flex items-center justify-between p-3 border-b border-border">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-surface border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-border-focus"
      >
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
      </select>

      <button
        onClick={handleSubmit}
        disabled={isRunning || !code.trim()}
        className={cn(
          'flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
          isRunning || !code.trim()
            ? 'bg-surface text-text-muted cursor-not-allowed'
            : 'bg-accent hover:bg-accent-hover text-white'
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
  )
}
