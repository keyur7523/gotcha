import { useEffect } from 'react'
import CodeEditor from '@/components/editor/CodeEditor'
import EditorToolbar from '@/components/editor/EditorToolbar'
import ReviewPanel from '@/components/review/ReviewPanel'
import AgentTimeline from '@/components/timeline/AgentTimeline'
import { useAnalysisStore } from '@/stores/analysisStore'
import { useAnalysisWebSocket } from '@/hooks/useWebSocket'
import { analysisApi } from '@/api/analysis'

export default function HomePage() {
  const { sessionId, setResult, setIsRunning } = useAnalysisStore()

  useAnalysisWebSocket(sessionId)

  // Fetch result when session completes
  useEffect(() => {
    if (!sessionId) return

    const fetchResult = async () => {
      try {
        const session = await analysisApi.get(sessionId)
        if (session.status === 'completed' && session.result) {
          setResult(session.result)
          setIsRunning(false)
        }
      } catch (error) {
        console.error('Failed to fetch session:', error)
      }
    }

    const interval = setInterval(fetchResult, 2000)
    return () => clearInterval(interval)
  }, [sessionId, setResult, setIsRunning])

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 flex flex-col border-r border-border">
          <EditorToolbar />
          <div className="flex-1 min-h-0">
            <CodeEditor />
          </div>
        </div>

        <div className="w-[400px] flex flex-col bg-surface">
          <ReviewPanel />
        </div>
      </div>

      <AgentTimeline />
    </div>
  )
}
