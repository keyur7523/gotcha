// frontend/src/components/ui/KeyboardShortcutsModal.tsx
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

const shortcuts = [
  { keys: ['⌘', 'Enter'], description: 'Run code review' },
  { keys: ['⌘', ','], description: 'Open settings' },
  { keys: ['⌘', '/'], description: 'Show shortcuts' },
  { keys: ['Esc'], description: 'Close modal' },
]

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="relative bg-surface border border-border rounded-lg shadow-xl w-full max-w-sm mx-4 p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-surface-hover transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {shortcuts.map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">{shortcut.description}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, j) => (
                      <kbd
                        key={j}
                        className="px-2 py-1 text-xs bg-surface-hover border border-border rounded font-mono"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-text-muted mt-4">
              Use ⌘ on Mac or Ctrl on Windows/Linux
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}