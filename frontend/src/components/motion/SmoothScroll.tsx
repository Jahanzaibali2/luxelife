import type { ReactNode } from 'react'
import { ReactLenis } from 'lenis/react'

const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Lenis smooth scroll for the whole page; native scroll when the user prefers reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  if (reduceMotion) return <>{children}</>
  return (
    <ReactLenis root options={{ lerp: 0.09, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
