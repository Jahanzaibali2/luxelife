import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Search, X } from 'lucide-react'
import { Price } from './Price'
import { EASE_EDITORIAL } from './motion/ease'
import { useScrollLock } from './motion/useScrollLock'
import { matchesQuery } from '../lib/search'
import { useCatalog } from '../lib/useCatalog'

const FOCUSABLE = 'a[href], button:not([disabled]), input'

/** Full-screen search over the cached catalog. Enter goes to /shop?q=. */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { products, categories, nameOf } = useCatalog()

  useScrollLock(open)

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus())
    else setQuery('')
  }, [open])

  const q = query.trim()
  const results = q ? products.filter((p) => matchesQuery(p, q, nameOf(p.category))).slice(0, 8) : []
  const categoryHits = q ? categories.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())) : []

  const submit = (e: FormEvent | MouseEvent) => {
    e.preventDefault()
    if (!q) return
    onClose()
    navigate(`/shop?q=${encodeURIComponent(q)}`)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') return onClose()
    if (e.key !== 'Tab' || !panelRef.current) return
    const nodes = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          onKeyDown={onKeyDown}
          className="fixed inset-0 z-[160] overflow-y-auto bg-white text-ink"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4, ease: EASE_EDITORIAL } }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          <div className="mx-auto max-w-container-max px-margin-mobile pb-20 md:px-margin-desktop">
            <div className="flex h-16 items-center justify-between md:h-20">
              <span className="font-label-caps text-label-caps text-secondary">Search</span>
              <button type="button" onClick={onClose} aria-label="Close search" className="-mr-2 flex h-11 w-11 items-center justify-center transition-transform duration-500 ease-editorial hover:rotate-90">
                <X strokeWidth={1.25} className="h-[22px] w-[22px]" />
              </button>
            </div>

            <motion.form
              onSubmit={submit}
              className="flex items-center gap-4 border-b border-ink pb-4 pt-10 md:pt-16"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.1, duration: 0.6, ease: EASE_EDITORIAL } }}
            >
              <Search strokeWidth={1.25} className="h-6 w-6 shrink-0 text-secondary md:h-8 md:w-8" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for?"
                aria-label="Search products"
                className="w-full border-0 bg-transparent p-0 font-serif text-[clamp(1.75rem,4vw,3.25rem)] leading-tight placeholder:text-ink/25 focus:ring-0"
              />
              {q && (
                <button type="submit" aria-label="See all results" className="flex h-11 w-11 shrink-0 items-center justify-center">
                  <ArrowRight strokeWidth={1.25} className="h-6 w-6" />
                </button>
              )}
            </motion.form>

            {categoryHits.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {categoryHits.map((c) => (
                  <Link key={c.slug} to={`/collections/${c.slug}`} onClick={onClose} className="border border-hairline px-4 py-2 text-label-sm transition-colors hover:border-ink">
                    {c.name}
                  </Link>
                ))}
              </div>
            )}

            {q && (
              <div className="mt-10">
                <p className="mb-6 font-label-caps text-label-caps text-secondary" aria-live="polite">
                  {results.length ? `${results.length}${results.length === 8 ? '+' : ''} results` : 'No pieces match that search'}
                </p>
                <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                  {results.map((p, i) => (
                    <motion.li
                      key={p.slug}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.45, ease: EASE_EDITORIAL } }}
                    >
                      <Link to={`/products/${p.slug}`} onClick={onClose} className="group flex items-center gap-5 border-b border-hairline py-4">
                        <div className="h-20 w-16 shrink-0 overflow-hidden bg-backdrop">
                          <img src={p.image} alt="" className="img-hover h-full w-full object-cover" loading="lazy" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 font-serif text-xl">{p.name}</p>
                          <p className="mt-1 font-label-caps text-label-caps text-secondary">{nameOf(p.category)}</p>
                        </div>
                        <Price amount={p.price} variant="line" className="shrink-0" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                {results.length > 0 && (
                  <button type="button" onClick={submit} className="group mt-8 flex items-center gap-2 text-button">
                    <span className="link-underline is-drawn">View all results</span>
                    <ArrowRight strokeWidth={1.25} className="h-4 w-4 transition-transform duration-500 ease-editorial group-hover:translate-x-1" />
                  </button>
                )}
              </div>
            )}

            {!q && categories.length > 0 && (
              <div className="mt-12">
                <p className="mb-5 font-label-caps text-label-caps text-secondary">Popular</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <Link key={c.slug} to={`/collections/${c.slug}`} onClick={onClose} className="border border-hairline px-4 py-2 text-label-sm transition-colors hover:border-ink">
                      {c.name}
                    </Link>
                  ))}
                  <Link to="/gifts" onClick={onClose} className="border border-hairline px-4 py-2 text-label-sm transition-colors hover:border-ink">
                    Gifts
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
