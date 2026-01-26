import { useRef, useEffect } from 'react'
import Editor, { type Monaco } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { useEditorStore } from '@/stores/editorStore'
import { useAnalysisStore } from '@/stores/analysisStore'
import { useSettingsStore } from '@/stores/settingsStore'

export default function CodeEditor() {
  const { code, language, setCode } = useEditorStore()
  const { highlightedLines } = useAnalysisStore()
  const { fontSize, tabSize, showMinimap, theme } = useSettingsStore()
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const decorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null)

  const handleEditorMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    // Define custom themes
    monaco.editor.defineTheme('gotcha-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.lineHighlightBackground': '#ff000020',
      },
    })

    monaco.editor.defineTheme('gotcha-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.lineHighlightBackground': '#ff000015',
      },
    })

    monaco.editor.setTheme(theme === 'dark' ? 'gotcha-dark' : 'gotcha-light')
  }

  // Update theme when setting changes
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(theme === 'dark' ? 'gotcha-dark' : 'gotcha-light')
    }
  }, [theme])

  useEffect(() => {
    if (!editorRef.current) return

    // Clear previous decorations
    if (decorationsRef.current) {
      decorationsRef.current.clear()
    }

    if (highlightedLines) {
      const { start, end } = highlightedLines
      decorationsRef.current = editorRef.current.createDecorationsCollection([
        {
          range: {
            startLineNumber: start,
            startColumn: 1,
            endLineNumber: end,
            endColumn: 1,
          },
          options: {
            isWholeLine: true,
            className: 'highlighted-line',
            glyphMarginClassName: 'highlighted-glyph',
          },
        },
      ])

      // Scroll to the highlighted line
      editorRef.current.revealLineInCenter(start)
    }
  }, [highlightedLines])

  return (
    <div className="h-full rounded-lg overflow-hidden border border-border">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={(value) => setCode(value || '')}
        theme={theme === 'dark' ? 'gotcha-dark' : 'gotcha-light'}
        onMount={handleEditorMount}
        options={{
          minimap: { enabled: showMinimap },
          fontSize,
          tabSize,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          padding: { top: 16 },
          fontFamily: 'ui-monospace, monospace',
          glyphMargin: true,
        }}
      />
    </div>
  )
}
