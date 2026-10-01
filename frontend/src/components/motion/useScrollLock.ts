import { useEffect } from 'react'
import { useLenis } from 'lenis/react'

/** Freeze page scroll (Lenis or native) while an overlay is open. */
export function useScrollLock(active: boolean) {
  const lenis = useLenis()
  useEffect(() => {
    if (!active) return
    lenis?.stop()
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      lenis?.start()
      document.documentElement.style.overflow = prev
    }
  }, [active, lenis])
}
