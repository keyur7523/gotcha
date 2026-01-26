import Editor from '@monaco-editor/react'
import { useEditorStore } from '@/stores/editorStore'

export default function CodeEditor() {
  const { code, language, setCode } = useEditorStore()

  return (
    <div className="h-full rounded-lg overflow-hidden border border-border">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={(value) => setCode(value || '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          padding: { top: 16 },
          fontFamily: 'ui-monospace, monospace',
        }}
      />
    </div>
  )
}
