import { useEffect, useRef, useCallback } from 'react'
import { useAnalysisStore } from '@/stores/analysisStore'
import type { AgentStep, AnalysisResult } from '@/types/analysis'

interface WebSocketMessage extends AgentStep {
  error?: string
  data?: {
    result?: AnalysisResult
    [key: string]: unknown
  }
}

export function useAnalysisWebSocket(sessionId: string | null) {
  const wsRef = useRef<WebSocket | null>(null)
  const { addStep, setIsRunning, setResult, setError } = useAnalysisStore()

  const connect = useCallback(() => {
    if (!sessionId) return

    if (wsRef.current) {
      wsRef.current.close()
    }

    const apiUrl = import.meta.env.VITE_API_URL || ''
    let wsUrl: string
    if (apiUrl) {
      // Production: use the backend URL directly
      const wsBase = apiUrl.replace(/^http/, 'ws')
      wsUrl = `${wsBase}/ws/${sessionId}`
    } else {
      // Dev: use Vite proxy
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      wsUrl = `${protocol}//${window.location.host}/api/v1/ws/${sessionId}`
    }

    console.log('Connecting to WebSocket:', wsUrl)
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log('WebSocket connected')
      setIsRunning(true)
    }

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)
        console.log('WebSocket message:', message)

        if (message.error) {
          setError(message.error)
          setIsRunning(false)
          return
        }

        if (message.action) {
          addStep({
            step_number: message.step_number,
            action: message.action,
            description: message.description,
            timestamp: message.timestamp,
            data: message.data,
          })
        }

        if (message.action === 'complete') {
          setIsRunning(false)
          if (message.data?.result) {
            setResult(message.data.result)
          }
        }
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setError('Connection error. Please try again.')
      setIsRunning(false)
    }

    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason)
      setIsRunning(false)
    }

    wsRef.current = ws
  }, [sessionId, addStep, setIsRunning, setResult, setError])

  useEffect(() => {
    connect()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [connect])

  return wsRef.current
}
