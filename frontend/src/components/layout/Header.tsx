import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Lock, Menu, ShoppingBag, X } from 'lucide-react'
import { Logo } from '../brand/Logo'
import { NAV_ITEMS, type NavKey } from '../../data/constants'
import { useCart } from '../../context/CartContext'
import { EASE_EDITORIAL } from '../motion/ease'
import { useScrollLock } from '../motion/useScrollLock'

export type HeaderVariant =
  | 'home'
  | 'shop'
  | 'product'
  | 'cart'
  | 'about'
  | 'faq'
  | 'contact'

interface HeaderProps {
  /** 'home' renders transparent over the full-bleed hero until scrolled; others are solid. */
  variant: HeaderVariant
  activeNav?: NavKey
}

const PRIMARY_NAV: NavKey[] = ['shop', 'fashion', 'home-lifestyle', 'gadgets', 'gifts']
const SECONDARY_NAV: NavKey[] = ['about', 'contact']
const navItems = (keys: NavKey[]) => NAV_ITEMS.filter((i) => keys.includes(i.key))

export function Header({ variant, activeNav }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const location = useLocation()
  const { itemCount, openCart } = useCart()
  const { scrollY } = useScroll()

  useScrollLock(menuOpen)

  // Solid after a little scroll; slide away while scrolling down, return on scroll up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 40)
    setHidden(y > 240 && y > prev)
  })

  const isActive = (key: NavKey) => {
    if (activeNav) return activeNav === key
    const href = NAV_ITEMS.find((i) => i.key === key)?.href ?? ''
    return href === location.pathname + location.search
  }

  const overHero = variant === 'home' && !scrolled && !menuOpen
  const tone = overHero ? 'text-white' : 'text-ink'

  return (
    <>
      <motion.header
        className={`sticky top-0 z-50 w-full transition-colors duration-500 ease-editorial ${
          overHero ? 'bg-transparent border-b border-white/0' : 'bg-white/95 backdrop-blur-sm border-b border-hairline'
        } ${tone}`}
        animate={{ y: hidden && !menuOpen ? '-100%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE_EDITORIAL }}
      >
        <div className="mx-auto grid h-16 max-w-container-max grid-cols-[1fr_auto_1fr] items-center px-margin-mobile md:h-20 md:px-margin-desktop">
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {navItems(PRIMARY_NAV).map((item) => (
              <Link
                key={item.key}
                to={item.href}
                aria-current={isActive(item.key) ? 'page' : undefined}
                className="link-underline font-label-caps text-label-caps"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="-m-2 flex h-11 w-11 items-center justify-center justify-self-start lg:hidden"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X strokeWidth={1.25} className="h-[22px] w-[22px]" /> : <Menu strokeWidth={1.25} className="h-[22px] w-[22px]" />}
          </button>

          <Logo
            to="/"
            className="flex items-center gap-2 justify-self-center"
            imageClassName={`h-6 w-6 object-contain shrink-0 transition-[filter] duration-500 ${overHero ? 'invert brightness-0' : ''}`}
            textClassName="font-serif text-[1.65rem] leading-none tracking-tight"
          />

          <div className="flex items-center justify-self-end gap-7">
            {navItems(SECONDARY_NAV).map((item) => (
              <Link
                key={item.key}
                to={item.href}
                aria-current={isActive(item.key) ? 'page' : undefined}
                className="link-underline font-label-caps text-label-caps hidden lg:inline"
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
              className="group relative -m-2 flex h-11 w-11 items-center justify-center"
            >
              <ShoppingBag
                strokeWidth={1.25}
                className="h-[22px] w-[22px] transition-transform duration-500 ease-editorial group-hover:-translate-y-0.5"
              />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE_EDITORIAL }}
                    className={`absolute right-0.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium tabular-nums leading-none ${
                      overHero ? 'bg-white text-ink' : 'bg-ink text-white'
                    }`}
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {createPortal(
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col overflow-y-auto bg-white px-margin-mobile pb-10 pt-8 md:top-20 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.4 } }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
            >
              <nav className="flex flex-col" aria-label="Mobile">
                {[...navItems(PRIMARY_NAV), ...navItems(SECONDARY_NAV), ...navItems(['faq'])].map((item, i) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.08 + i * 0.05, duration: 0.6, ease: EASE_EDITORIAL } }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block border-b border-hairline py-4 font-serif text-4xl leading-none text-ink"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}

export function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-hairline bg-white/95 backdrop-blur-sm">
      <div className="relative mx-auto flex h-16 max-w-container-max items-center justify-center px-margin-mobile md:h-20 md:px-margin-desktop">
        <Logo
          to="/"
          imageClassName="h-6 w-6 object-contain shrink-0"
          textClassName="font-serif text-[1.65rem] leading-none tracking-tight text-ink"
        />
        <span className="absolute right-margin-mobile hidden items-center gap-2 font-label-caps text-label-caps text-secondary sm:flex md:right-margin-desktop">
          <Lock strokeWidth={1.25} className="h-3.5 w-3.5" />
          Secure checkout
        </span>
      </div>
    </header>
  )
}
