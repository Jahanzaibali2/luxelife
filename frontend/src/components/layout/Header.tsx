import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { NAV_ITEMS, type NavKey } from '../../data/constants'
import { useCart } from '../../context/CartContext'

export type HeaderVariant =
  | 'home'
  | 'shop'
  | 'product'
  | 'cart'
  | 'about'
  | 'faq'
  | 'contact'

interface HeaderProps {
  variant: HeaderVariant
  activeNav?: NavKey
}

function NavLink({
  href,
  label,
  active,
  className = '',
  onClick,
}: {
  href: string
  label: string
  active?: boolean
  className?: string
  onClick?: () => void
}) {
  const base =
    'font-label-caps text-label-caps transition-colors duration-300'
  if (active) {
    return (
      <Link
        to={href}
        onClick={onClick}
        className={`${base} text-primary dark:text-on-primary-fixed border-b border-primary dark:border-on-primary-fixed pb-1 ${className}`}
      >
        {label}
      </Link>
    )
  }
  return (
    <Link
      to={href}
      onClick={onClick}
      className={`${base} text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed ${className}`}
    >
      {label}
    </Link>
  )
}

function HeaderActions({
  cartActive,
  iconStyle = 'primary',
  hidePersonOnMobile = false,
  hideFavoriteOnMobile = false,
}: {
  cartActive?: boolean
  iconStyle?: 'primary' | 'opacity' | 'secondary'
  hidePersonOnMobile?: boolean
  hideFavoriteOnMobile?: boolean
}) {
  const { itemCount } = useCart()
  const iconClass =
    iconStyle === 'opacity'
      ? 'hover:opacity-70 transition-opacity'
      : iconStyle === 'secondary'
        ? 'hover:text-primary dark:hover:text-primary-fixed transition-all duration-300 text-secondary dark:text-secondary-fixed-dim'
        : 'hover:text-primary dark:hover:text-primary-fixed transition-all duration-300'

  const textClass =
    iconStyle === 'secondary'
      ? 'text-secondary dark:text-secondary-fixed-dim'
      : 'text-primary dark:text-on-primary-fixed'

  return (
    <div className={`flex items-center gap-4 ${textClass}`}>
      <button type="button" aria-label="search" className={iconClass}>
        <span className="material-symbols-outlined">search</span>
      </button>
      <button
        type="button"
        aria-label="person"
        className={`${iconClass} ${hidePersonOnMobile ? 'hidden md:block' : ''}`}
      >
        <span className="material-symbols-outlined">person</span>
      </button>
      <button
        type="button"
        aria-label="favorite"
        className={`${iconClass} ${hideFavoriteOnMobile ? 'hidden md:block' : ''}`}
      >
        <span className="material-symbols-outlined">favorite</span>
      </button>
      <Link
        to="/cart"
        aria-label="shopping_bag"
        className={`relative ${
          cartActive
            ? 'text-primary dark:text-primary-fixed border-b border-primary dark:border-primary-fixed pb-1'
            : iconClass
        }`}
      >
        <span
          className="material-symbols-outlined"
          style={
            cartActive
              ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
              : undefined
          }
        >
          shopping_bag
        </span>
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-primary text-on-primary text-[10px] font-label-caps flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Link>
    </div>
  )
}

const HEADER_ACTIONS_BY_VARIANT: Record<
  HeaderVariant,
  { iconStyle?: 'primary' | 'opacity' | 'secondary'; hidePersonOnMobile?: boolean; hideFavoriteOnMobile?: boolean; cartActive?: boolean }
> = {
  home: { hidePersonOnMobile: true },
  shop: { iconStyle: 'secondary' },
  product: {},
  cart: { cartActive: true },
  about: { hidePersonOnMobile: true, hideFavoriteOnMobile: true },
  faq: { iconStyle: 'opacity' },
  contact: {},
}

export function Header({ variant, activeNav }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const resolveActive = (key: NavKey) => {
    if (activeNav) return activeNav === key
    if (key === 'home') return location.pathname === '/'
    if (key === 'shop') return location.pathname.startsWith('/shop') || location.pathname.startsWith('/products')
    if (key === 'about' || key === 'faq' || key === 'contact') return location.pathname.startsWith(`/${key}`)
    return false
  }

  return (
    <header className="bg-surface dark:bg-surface-container-highest border-b border-outline-variant/15 w-full sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        <button
          type="button"
          aria-label="menu"
          className="md:hidden text-primary dark:text-on-primary-fixed"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <Logo
          to="/"
          textClassName="font-display-lg text-headline-md font-semibold tracking-tighter text-primary dark:text-on-primary-fixed"
        />
        <nav className="hidden md:flex gap-6 lg:gap-8">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.key} href={item.href} label={item.label} active={resolveActive(item.key)} />
          ))}
        </nav>
        <HeaderActions {...HEADER_ACTIONS_BY_VARIANT[variant]} />
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-outline-variant/15 bg-surface dark:bg-surface-container-highest px-margin-mobile py-4 flex flex-col gap-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              href={item.href}
              label={item.label}
              active={resolveActive(item.key)}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </div>
      )}
    </header>
  )
}

export function CheckoutHeader() {
  return (
    <header className="w-full flex justify-center items-center py-8 border-b border-outline/15 sticky top-0 z-50 bg-surface/95 backdrop-blur-sm relative">
      <Logo
        to="/"
        className="justify-center"
        textClassName="font-headline-md text-headline-md font-semibold text-primary tracking-tight"
      />
      <div className="absolute right-margin-mobile md:right-margin-desktop flex items-center gap-2 text-secondary font-label-caps text-label-caps">
        <span className="material-symbols-outlined text-[18px]">lock</span>
        SECURE CHECKOUT
      </div>
    </header>
  )
}
