import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import HistoryPage from './pages/HistoryPage'
import { PageTransition } from './components/ui/Animations'
import { useSettingsStore } from './stores/settingsStore'

export default function App() {
  const theme = useSettingsStore((state) => state.theme)
  const location = useLocation()

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }, [theme])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/history" element={<PageTransition><HistoryPage /></PageTransition>} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
