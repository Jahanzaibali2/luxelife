import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { EASE_EDITORIAL } from './ease'

/** Fade + 20px rise when scrolled into view. Pass `delay` (index * 0.06) to stagger grid items. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.6, ease: EASE_EDITORIAL, delay }}
    >
      {children}
    </motion.div>
  )
}
