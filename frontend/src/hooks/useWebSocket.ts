import { useEffect, useRef, useCallback } from 'react'
import { useAnalysisStore } from '@/stores/analysisStore'
import type { AgentStep } from '@/types/analysis'

export function useAnalysisWebSocket(sessionId: string | null) {
  const wsRef = useRef<WebSocket | null>(null)
  const { addStep, setIsRunning, setResult, setError } = useAnalysisStore()

  const connect = useCallback(() => {
    if (!sessionId) return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/v1/ws/${sessionId}`)

    ws.onopen = () => {
      setIsRunning(true)
    }

    ws.onmessage = (event) => {
      const step: AgentStep = JSON.parse(event.data)
      addStep(step)

      if (step.action === 'complete') {
        setIsRunning(false)
        if (step.data?.result) {
          setResult(step.data.result as never)
        }
      }
    }

    ws.onerror = () => {
      setError('WebSocket connection error')
      setIsRunning(false)
    }

    ws.onclose = () => {
      setIsRunning(false)
    }

    wsRef.current = ws
  }, [sessionId, addStep, setIsRunning, setResult, setError])

  useEffect(() => {
    connect()

    return () => {
      wsRef.current?.close()
    }
  }, [connect])

  return wsRef.current
}
