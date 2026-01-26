import { Outlet, Link, useLocation } from 'react-router-dom'
import { Target, History, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AppLayout() {
  const location = useLocation()

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
          <button className="p-2 rounded-md text-text-muted hover:text-text hover:bg-surface-hover transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
