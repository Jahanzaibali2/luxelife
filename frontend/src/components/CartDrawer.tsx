import { useEffect, useRef, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useCart } from '../context/CartContext'
import { Price } from './Price'
import { EASE_EDITORIAL } from './motion/ease'
import { useScrollLock } from './motion/useScrollLock'

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'

/** Right-side cart panel. Opened via useCart().openCart(); /cart stays as a full page. */
export function CartDrawer() {
  const { items, isCartOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount } = useCart()
  const panelRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  useScrollLock(isCartOpen)

  useEffect(() => {
    if (isCartOpen) {
      returnFocusRef.current = document.activeElement as HTMLElement | null
      // Wait one frame so the panel is mounted.
      requestAnimationFrame(() => panelRef.current?.focus())
    } else {
      returnFocusRef.current?.focus()
    }
  }, [isCartOpen])

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeCart()
      return
    }
    if (e.key !== 'Tab' || !panelRef.current) return
    const nodes = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
    if (!nodes.length) return
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[150]" onKeyDown={onKeyDown}>
          <motion.div
            className="absolute inset-0 bg-ink/40"
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5, ease: EASE_EDITORIAL } }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            tabIndex={-1}
            className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-white outline-none"
            initial={{ x: '100%' }}
            animate={{ x: 0, transition: { duration: 0.55, ease: EASE_EDITORIAL } }}
            exit={{ x: '100%', transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } }}
          >
            <div className="flex items-center justify-between border-b border-hairline px-6 py-5 md:px-8">
              <h2 className="font-label-caps text-label-caps">Cart ({itemCount})</h2>
              <button type="button" onClick={closeCart} className="link-underline text-label-sm text-secondary hover:text-ink">
                Close
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
                <p className="font-serif text-headline-md">Your cart is empty.</p>
                <Link to="/shop" onClick={closeCart} className="link-underline is-drawn text-button">
                  Browse the collection
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6 md:px-8" data-lenis-prevent>
                  {items.map((item, i) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.06, duration: 0.5, ease: EASE_EDITORIAL } }}
                      exit={{ opacity: 0 }}
                      className="flex gap-5 border-b border-hairline py-6"
                    >
                      <div className="h-28 w-22 shrink-0 overflow-hidden bg-backdrop">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-serif text-xl leading-tight">{item.name}</p>
                            <p className="mt-1 font-label-caps text-label-caps text-secondary">{item.variant}</p>
                          </div>
                          <Price amount={item.price * item.quantity} variant="line" />
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-4">
                          <div className="flex items-center gap-4 text-label-sm">
                            <button type="button" aria-label={`Decrease quantity of ${item.name}`} onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-8 w-6 text-secondary hover:text-ink">
                              −
                            </button>
                            <span className="tabular-nums" aria-live="polite">{item.quantity}</span>
                            <button type="button" aria-label={`Increase quantity of ${item.name}`} onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-8 w-6 text-secondary hover:text-ink">
                              +
                            </button>
                          </div>
                          <button type="button" onClick={() => removeItem(item.id)} className="link-underline text-label-sm text-secondary hover:text-ink">
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
                <div className="border-t border-hairline px-6 py-6 md:px-8">
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="font-label-caps text-label-caps">Subtotal</span>
                    <Price amount={subtotal} variant="emphasis" />
                  </div>
                  <p className="mb-6 text-label-sm text-secondary">Complimentary delivery across the UAE.</p>
                  <Link to="/checkout" onClick={closeCart} className="btn-primary w-full">
                    Checkout
                  </Link>
                  <Link to="/cart" onClick={closeCart} className="link-underline mx-auto mt-4 block w-fit text-label-sm text-secondary hover:text-ink">
                    View cart
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
