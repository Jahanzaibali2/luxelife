import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

interface WishlistContextValue {
  slugs: string[]
  has: (slug: string) => boolean
  toggle: (slug: string) => void
  count: number
}

const STORAGE_KEY = 'luxelife-wishlist-v1'

const WishlistContext = createContext<WishlistContextValue | null>(null)

function load(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === 'string') : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs))
    } catch {
      /* private mode: keep in memory only */
    }
  }, [slugs])

  const toggle = useCallback((slug: string) => {
    setSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev]))
  }, [])

  const value = useMemo(
    () => ({ slugs, has: (slug: string) => slugs.includes(slug), toggle, count: slugs.length }),
    [slugs, toggle],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
