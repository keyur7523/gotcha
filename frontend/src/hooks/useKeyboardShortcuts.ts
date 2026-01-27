// frontend/src/hooks/useKeyboardShortcuts.ts
import { useHotkeys } from 'react-hotkeys-hook'
import { useEditorStore } from '@/stores/editorStore'
import { useAnalysisStore } from '@/stores/analysisStore'
import { analysisApi } from '@/api/analysis'
import { useSettingsStore } from '@/stores/settingsStore'
import { toast } from 'sonner'

export function useGlobalShortcuts(callbacks: {
  onOpenSettings?: () => void
  onShowHelp?: () => void
}) {
  const { code, language } = useEditorStore()
  const { isRunning, setSessionId, reset } = useAnalysisStore()
  const { strictness, maxIssues } = useSettingsStore()

  // Cmd/Ctrl + Enter to submit
  useHotkeys('mod+enter', (e) => {
    e.preventDefault()
    if (isRunning || !code.trim()) return

    reset()
    analysisApi.create({ code, language, strictness, max_issues: maxIssues })
      .then((response) => {
        setSessionId(response.session_id)
        toast.success('Analysis started')
      })
      .catch(() => {
        toast.error('Failed to start analysis')
      })
  }, { enableOnFormTags: true })

  // Cmd/Ctrl + , to open settings
  useHotkeys('mod+comma', (e) => {
    e.preventDefault()
    callbacks.onOpenSettings?.()
  })

  // Cmd/Ctrl + / to show help
  useHotkeys('mod+slash', (e) => {
    e.preventDefault()
    callbacks.onShowHelp?.()
  })

  // Escape to close modals (handled by modal itself)
}