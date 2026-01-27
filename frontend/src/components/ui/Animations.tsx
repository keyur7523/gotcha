import { motion, AnimatePresence, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

interface AnimationProps {
  children: ReactNode
  delay?: number
  className?: string
}

// FadeIn - opacity 0→1, y: 10→0
const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export function FadeIn({ children, delay = 0, className }: AnimationProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={{ duration: 0.3, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// SlideIn - opacity 0→1, x: -10→0 (or +10 for right)
export function SlideIn({ 
  children, 
  delay = 0, 
  className, 
  direction = 'left' 
}: AnimationProps & { direction?: 'left' | 'right' }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === 'left' ? -10 : 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ScaleIn - opacity 0→1, scale: 0.95→1 (for modals/popovers)
const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

export function ScaleIn({ children, className }: Omit<AnimationProps, 'delay'>) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={scaleInVariants}
      transition={{ duration: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Collapse - AnimatePresence with height: 0→auto animation
export function Collapse({ children, isOpen }: { children: ReactNode; isOpen: boolean }) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// StaggerContainer + StaggerItem - For lists with staggerChildren
const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export function StaggerContainer({ children, className }: AnimationProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainerVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: Omit<AnimationProps, 'delay'>) {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  )
}

// PageTransition - Wrap route content for page enter/exit animations
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

// Re-export AnimatePresence for convenience
export { AnimatePresence }