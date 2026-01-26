import CodeEditor from '@/components/editor/CodeEditor'
import EditorToolbar from '@/components/editor/EditorToolbar'
import ReviewPanel from '@/components/review/ReviewPanel'
import AgentTimeline from '@/components/timeline/AgentTimeline'
import { useAnalysisStore } from '@/stores/analysisStore'
import { useAnalysisWebSocket } from '@/hooks/useWebSocket'

export default function HomePage() {
  const { sessionId } = useAnalysisStore()

  useAnalysisWebSocket(sessionId)

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 flex flex-col border-r border-border">
          <EditorToolbar />
          <div className="flex-1 min-h-0">
            <CodeEditor />
          </div>
        </div>

        <div className="w-[420px] flex flex-col bg-surface">
          <ReviewPanel />
        </div>
      </div>

      <AgentTimeline />
    </div>
  )
}
