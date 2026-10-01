import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { EASE_EDITORIAL } from './motion/ease'

type Mode = 'hidden' | 'default' | 'link' | 'view'

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary'

const enabled =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

// One 72px circle, scaled down for dot/link states so only transforms animate.
const SCALE: Record<Mode, number> = { hidden: 0, default: 0.12, link: 0.42, view: 1 }

/** Trailing dot that grows over links and becomes a "View" ring over [data-cursor="view"]. Desktop only. */
export function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 450, damping: 40, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 450, damping: 40, mass: 0.5 })
  const [mode, setMode] = useState<Mode>('hidden')

  useEffect(() => {
    if (!enabled) return
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = (e.target as Element | null)?.closest?.(`[data-cursor="view"], ${INTERACTIVE}`)
      setMode(!target ? 'default' : target.matches('[data-cursor="view"]') ? 'view' : 'link')
    }
    const onLeave = () => setMode('hidden')
    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [x, y])

  if (!enabled) return null

  const isView = mode === 'view'
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-[200] ${isView ? '' : 'mix-blend-difference'}`}
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className={`-ml-9 -mt-9 flex h-18 w-18 items-center justify-center rounded-full ${isView ? 'bg-ink' : 'bg-white'}`}
        animate={{ scale: SCALE[mode] }}
        transition={{ duration: 0.45, ease: EASE_EDITORIAL }}
      >
        <span
          className={`font-label-caps text-[10px] tracking-[0.18em] text-white transition-opacity duration-300 ${isView ? 'opacity-100' : 'opacity-0'}`}
        >
          View
        </span>
      </motion.div>
    </motion.div>
  )
}
