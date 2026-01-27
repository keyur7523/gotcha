import { useState } from 'react'
import { X, Monitor, Code, Sparkles, Key, RotateCcw, Eye, EyeOff } from 'lucide-react'
import { useSettingsStore, type Theme, type Strictness } from '@/stores/settingsStore'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

type Tab = 'editor' | 'analysis' | 'theme' | 'api'

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('editor')
  const [showApiKey, setShowApiKey] = useState(false)
  const settings = useSettingsStore()

  const tabs: { id: Tab; label: string; icon: typeof Code }[] = [
    { id: 'editor', label: 'Editor', icon: Code },
    { id: 'analysis', label: 'Analysis', icon: Sparkles },
    { id: 'theme', label: 'Theme', icon: Monitor },
    { id: 'api', label: 'API Key', icon: Key },
  ]

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
            className="relative bg-surface border border-border rounded-lg shadow-xl w-full max-w-lg mx-4"
          >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px',
                  activeTab === tab.id
                    ? 'text-accent border-accent'
                    : 'text-text-secondary border-transparent hover:text-text'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 min-h-[280px]">
          {activeTab === 'editor' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Font Size: {settings.fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="20"
                  value={settings.fontSize}
                  onChange={(e) => settings.setFontSize(Number(e.target.value))}
                  className="w-full accent-accent"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>12px</span>
                  <span>20px</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tab Size</label>
                <div className="flex gap-2">
                  {[2, 4].map((size) => (
                    <button
                      key={size}
                      onClick={() => settings.setTabSize(size)}
                      className={cn(
                        'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                        settings.tabSize === size
                          ? 'bg-accent text-white'
                          : 'bg-surface-hover text-text-secondary hover:text-text'
                      )}
                    >
                      {size} spaces
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Show Minimap</label>
                <button
                  onClick={() => settings.setShowMinimap(!settings.showMinimap)}
                  className={cn(
                    'w-11 h-6 rounded-full transition-colors relative',
                    settings.showMinimap ? 'bg-accent' : 'bg-surface-hover'
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                      settings.showMinimap ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            </>
          )}

          {activeTab === 'analysis' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Strictness Level</label>
                <div className="flex gap-2">
                  {(['relaxed', 'normal', 'strict'] as Strictness[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => settings.setStrictness(level)}
                      className={cn(
                        'flex-1 px-3 py-2 rounded-md text-sm font-medium capitalize transition-colors',
                        settings.strictness === level
                          ? 'bg-accent text-white'
                          : 'bg-surface-hover text-text-secondary hover:text-text'
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-text-muted mt-2">
                  {settings.strictness === 'relaxed' && 'Only report high-confidence bugs'}
                  {settings.strictness === 'normal' && 'Balanced bug detection'}
                  {settings.strictness === 'strict' && 'Report all potential issues'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Issues: {settings.maxIssues}
                </label>
                <input
                  type="range"
                  min="3"
                  max="20"
                  value={settings.maxIssues}
                  onChange={(e) => settings.setMaxIssues(Number(e.target.value))}
                  className="w-full accent-accent"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>3</span>
                  <span>20</span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'theme' && (
            <div>
              <label className="block text-sm font-medium mb-3">Appearance</label>
              <div className="grid grid-cols-2 gap-3">
                {(['dark', 'light'] as Theme[]).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => settings.setTheme(theme)}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-colors',
                      settings.theme === theme
                        ? 'border-accent'
                        : 'border-border hover:border-text-muted'
                    )}
                  >
                    <div
                      className={cn(
                        'h-20 rounded-md mb-3 flex items-center justify-center',
                        theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-100'
                      )}
                    >
                      <Monitor
                        className={cn(
                          'w-8 h-8',
                          theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                        )}
                      />
                    </div>
                    <p className="text-sm font-medium capitalize">{theme}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Custom Gemini API Key</label>
                <p className="text-xs text-text-muted mb-3">
                  Optionally use your own API key instead of the default one.
                </p>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.customApiKey}
                    onChange={(e) => settings.setCustomApiKey(e.target.value)}
                    placeholder="AIza..."
                    className="w-full bg-bg border border-border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text"
                  >
                    {showApiKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {settings.customApiKey && (
                <div className="flex items-center gap-2 text-xs text-success">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  Custom API key configured
                </div>
              )}

              <p className="text-xs text-text-muted">
                Get your API key from{' '}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
          )}
        </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <button
              onClick={settings.resetToDefaults}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-text transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to defaults
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-md text-sm font-medium transition-colors"
            >
              Done
            </button>
          </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
