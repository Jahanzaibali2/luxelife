import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { ChevronDown, Heart, Lock, Menu, Search, ShoppingBag, X } from 'lucide-react'
import { Logo } from '../brand/Logo'
import { ShopMenu } from './ShopMenu'
import { SearchOverlay } from '../SearchOverlay'
import { NAV_ITEMS, type NavKey } from '../../data/constants'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { EASE_EDITORIAL } from '../motion/ease'
import { useScrollLock } from '../motion/useScrollLock'
import { useCatalog } from '../../lib/useCatalog'
import { LazyImage } from '../LazyImage'

export type HeaderVariant =
  | 'home'
  | 'shop'
  | 'product'
  | 'cart'
  | 'about'
  | 'faq'
  | 'contact'

interface HeaderProps {
  /** 'home' renders transparent over a full-bleed hero until scrolled; others are solid. */
  variant: HeaderVariant
  activeNav?: NavKey
}

const SHOP_MENU_ID = 'shop-menu'
const navHref = (key: NavKey) => NAV_ITEMS.find((i) => i.key === key)?.href ?? '/'

function IconButton({ label, onClick, to, badge, overHero, children }: {
  label: string
  onClick?: () => void
  to?: string
  badge?: number
  overHero: boolean
  children: ReactNode
}) {
  const cls = 'group relative -m-2 flex h-11 w-11 items-center justify-center'
  const inner = (
    <>
      {children}
      <AnimatePresence>
        {!!badge && (
          <motion.span
            key={badge}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_EDITORIAL }}
            className={`absolute right-0.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium tabular-nums leading-none ${
              overHero ? 'bg-white text-ink' : 'bg-ink text-white'
            }`}
          >
            {badge}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  )
  return to ? (
    <Link to={to} aria-label={label} className={cls}>{inner}</Link>
  ) : (
    <button type="button" onClick={onClick} aria-label={label} className={cls}>{inner}</button>
  )
}

const icon = 'h-[21px] w-[21px] transition-transform duration-500 ease-editorial group-hover:-translate-y-0.5'

export function Header({ variant, activeNav }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const location = useLocation()
  const { itemCount, openCart } = useCart()
  const wishlist = useWishlist()
  const { categories, heroFor } = useCatalog()
  const { scrollY } = useScroll()

  useScrollLock(menuOpen)

  // Close every panel on navigation.
  useEffect(() => {
    setMenuOpen(false)
    setShopOpen(false)
  }, [location.key])

  // Cmd/Ctrl+K opens search; Esc closes the shop panel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') setShopOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Solid after a little scroll; slide away while scrolling down, return on scroll up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 40)
    setHidden(y > 240 && y > prev)
    if (y > prev + 4) setShopOpen(false)
  })

  const isActive = (key: NavKey) =>
    activeNav ? activeNav === key : location.pathname === navHref(key)

  const overHero = variant === 'home' && !scrolled && !menuOpen && !shopOpen
  const navLink = 'link-underline font-label-caps text-label-caps'

  return (
    <>
      <motion.header
        onMouseLeave={() => setShopOpen(false)}
        className={`sticky top-0 z-50 w-full transition-colors duration-500 ease-editorial ${
          overHero ? 'border-b border-white/0 bg-transparent text-white' : 'border-b border-hairline bg-white/95 text-ink backdrop-blur-sm'
        }`}
        animate={{ y: hidden && !menuOpen && !shopOpen ? '-100%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE_EDITORIAL }}
      >
        <div className="mx-auto grid h-16 max-w-container-max grid-cols-[1fr_auto_1fr] items-center px-margin-mobile md:h-20 md:px-margin-desktop">
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            <Link to="/" aria-current={isActive('home') ? 'page' : undefined} className={navLink} onMouseEnter={() => setShopOpen(false)}>
              Home
            </Link>
            <button
              type="button"
              aria-expanded={shopOpen}
              aria-controls={SHOP_MENU_ID}
              onMouseEnter={() => setShopOpen(true)}
              onClick={() => setShopOpen((o) => !o)}
              className={`${navLink} flex items-center gap-1.5 ${isActive('shop') ? 'is-drawn' : ''}`}
            >
              Shop
              <ChevronDown strokeWidth={1.25} className={`h-3.5 w-3.5 transition-transform duration-500 ease-editorial ${shopOpen ? 'rotate-180' : ''}`} />
            </button>
            <Link to="/gifts" aria-current={isActive('gifts') ? 'page' : undefined} className={navLink} onMouseEnter={() => setShopOpen(false)}>
              Gifts
            </Link>
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

          <div className="flex items-center justify-self-end gap-5 md:gap-6" onMouseEnter={() => setShopOpen(false)}>
            <Link to="/about" aria-current={isActive('about') ? 'page' : undefined} className={`${navLink} mr-2 hidden lg:inline`}>
              About
            </Link>
            <IconButton label="Search (Ctrl+K)" onClick={() => setSearchOpen(true)} overHero={overHero}>
              <Search strokeWidth={1.25} className={icon} />
            </IconButton>
            <span className="hidden sm:contents">
              <IconButton label={`Wishlist, ${wishlist.count} saved`} to="/wishlist" badge={wishlist.count} overHero={overHero}>
                <Heart strokeWidth={1.25} className={icon} />
              </IconButton>
            </span>
            <IconButton label={`Open cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`} onClick={openCart} badge={itemCount} overHero={overHero}>
              <ShoppingBag strokeWidth={1.25} className={icon} />
            </IconButton>
          </div>
        </div>

        <AnimatePresence>{shopOpen && <ShopMenu id={SHOP_MENU_ID} onNavigate={() => setShopOpen(false)} />}</AnimatePresence>
      </motion.header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {createPortal(
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col overflow-y-auto bg-white px-margin-mobile pb-10 pt-6 md:top-20 lg:hidden"
              data-lenis-prevent
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.4 } }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
            >
              {categories.length > 0 && (
                <motion.div
                  className="-mx-margin-mobile mb-6 flex snap-x gap-3 overflow-x-auto px-margin-mobile pb-2"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_EDITORIAL } }}
                >
                  {categories.map((c) => (
                    <Link key={c.slug} to={`/collections/${c.slug}`} className="w-32 shrink-0 snap-start">
                      <div className="aspect-[4/5] overflow-hidden bg-backdrop">
                        <LazyImage src={heroFor(c)} alt="" className="h-full w-full object-cover" />
                      </div>
                      <p className="mt-2 font-serif text-base leading-tight">{c.name}</p>
                    </Link>
                  ))}
                </motion.div>
              )}
              <nav className="flex flex-col" aria-label="Mobile">
                {[
                  { label: 'Home', to: '/' },
                  { label: 'Shop all', to: '/shop' },
                  { label: 'Collections', to: '/collections' },
                  { label: 'Gifts', to: '/gifts' },
                  { label: 'Wishlist', to: '/wishlist' },
                  { label: 'About', to: '/about' },
                  { label: 'Contact', to: '/contact' },
                  { label: 'FAQ', to: '/faq' },
                ].map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.08 + i * 0.05, duration: 0.6, ease: EASE_EDITORIAL } }}
                  >
                    <Link to={item.to} className="block border-b border-hairline py-4 font-serif text-3xl leading-none text-ink">
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
