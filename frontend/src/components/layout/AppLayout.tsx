import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Target, History, Settings, Keyboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import SettingsModal from '@/components/settings/SettingsModal'
import KeyboardShortcutsModal from '@/components/ui/KeyboardShortcutsModal'
import { useGlobalShortcuts } from '@/hooks/useKeyboardShortcuts'

export default function AppLayout() {
  const location = useLocation()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  useGlobalShortcuts({
    onOpenSettings: () => setSettingsOpen(true),
    onShowHelp: () => setShortcutsOpen(true),
  })

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-14 border-b border-border flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <Target className="w-5 h-5 text-accent" />
          <span>Gotcha</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={cn(
              'px-3 py-1.5 rounded-md text-sm transition-colors',
              location.pathname === '/'
                ? 'bg-surface text-text'
                : 'text-text-secondary hover:text-text hover:bg-surface-hover'
            )}
          >
            Review
          </Link>
          <Link
            to="/history"
            className={cn(
              'px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-1.5',
              location.pathname === '/history'
                ? 'bg-surface text-text'
                : 'text-text-secondary hover:text-text hover:bg-surface-hover'
            )}
          >
            <History className="w-4 h-4" />
            History
          </Link>
          <button
            onClick={() => setShortcutsOpen(true)}
            className="p-2 rounded-md text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
            title="Keyboard shortcuts (⌘/)"
          >
            <Keyboard className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-md text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
            title="Settings (⌘,)"
          >
            <Settings className="w-4 h-4" />
          </button>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <KeyboardShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  )
}
