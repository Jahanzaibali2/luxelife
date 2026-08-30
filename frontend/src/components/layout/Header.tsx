import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LOGO_URL, NAV_ITEMS, type NavKey } from '../../data/constants'
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
}: {
  href: string
  label: string
  active?: boolean
  className?: string
}) {
  const base =
    'font-label-caps text-label-caps transition-colors duration-300'
  if (active) {
    return (
      <Link
        to={href}
        className={`${base} text-primary dark:text-on-primary-fixed border-b border-primary dark:border-on-primary-fixed pb-1 ${className}`}
      >
        {label}
      </Link>
    )
  }
  return (
    <Link
      to={href}
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

export function Header({ variant, activeNav }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const resolveActive = (key: NavKey) => {
    if (activeNav) return activeNav === key
    if (key === 'home') return location.pathname === '/'
    if (key === 'shop') return location.pathname.startsWith('/shop') || location.pathname.startsWith('/products')
    return false
  }

  if (variant === 'contact') {
    return (
      <nav className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 w-full sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-outline/15 transition-all duration-200 ease-in-out">
        <div className="hidden md:flex space-x-6 font-label-caps text-label-caps tracking-[0.1em]">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              to={item.href}
              className="text-secondary hover:text-primary transition-colors duration-300"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <button
          type="button"
          className="md:hidden text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <Link
          to="/"
          className="font-headline-md text-headline-md font-semibold text-primary absolute left-1/2 -translate-x-1/2"
        >
          LuxeLife
        </Link>
        <div className="flex space-x-4 text-primary">
          <button type="button" className="hover:text-surface-tint transition-colors">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button type="button" className="hover:text-surface-tint transition-colors hidden md:block">
            <span className="material-symbols-outlined">person</span>
          </button>
          <button type="button" className="hover:text-surface-tint transition-colors hidden md:block">
            <span className="material-symbols-outlined">favorite</span>
          </button>
          <Link to="/cart" className="hover:text-surface-tint transition-colors">
            <span className="material-symbols-outlined">shopping_bag</span>
          </Link>
        </div>
        {mobileOpen && (
          <div className="absolute top-full left-0 right-0 bg-surface border-b border-outline/15 p-4 md:hidden flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <Link key={item.key} to={item.href} className="font-label-caps text-label-caps text-secondary" onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    )
  }

  if (variant === 'faq') {
    return (
      <nav className="bg-surface dark:bg-surface-dim flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 w-full sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-outline/15 transition-all duration-200 ease-in-out">
        <button type="button" className="md:hidden text-primary flex items-center justify-center p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          <span className="material-symbols-outlined">menu</span>
        </button>
        <Link to="/" className="font-headline-md text-headline-md font-semibold text-primary dark:text-primary-fixed">
          LuxeLife
        </Link>
        <div className="hidden md:flex items-center space-x-8 font-label-caps text-label-caps tracking-[0.1em]">
          {NAV_ITEMS.map((item) => (
            <Link key={item.key} to={item.href} className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed transition-colors duration-300">
              {item.label}
            </Link>
          ))}
        </div>
        <HeaderActions iconStyle="opacity" />
      </nav>
    )
  }

  if (variant === 'about') {
    return (
      <header className="bg-surface dark:bg-surface-container-highest w-full z-50 sticky top-0 full-width border-b border-outline-variant/15">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
          <button type="button" className="md:hidden text-primary dark:text-on-primary-fixed" onClick={() => setMobileOpen(!mobileOpen)}>
            <span className="material-symbols-outlined">menu</span>
          </button>
          <Link to="/" className="font-display-lg text-headline-md font-semibold tracking-tighter text-primary dark:text-on-primary-fixed">
            LuxeLife
          </Link>
          <nav className="hidden md:flex gap-8">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.key} href={item.href} label={item.label} active={resolveActive(item.key)} />
            ))}
          </nav>
          <HeaderActions hidePersonOnMobile hideFavoriteOnMobile />
        </div>
      </header>
    )
  }

  if (variant === 'cart') {
    return (
      <nav className="bg-surface dark:bg-surface-dim docked full-width top-0 border-b border-outline/15 flat no shadows flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 w-full sticky top-0 z-50 bg-surface/95 backdrop-blur-sm transition-all duration-200 ease-in-out">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-headline-md text-headline-md font-semibold text-primary dark:text-primary-fixed">
            LuxeLife
          </Link>
          <div className="hidden md:flex items-center gap-6 font-label-caps text-label-caps tracking-[0.1em]">
            {NAV_ITEMS.map((item) => (
              <Link key={item.key} to={item.href} className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed transition-colors duration-300">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <HeaderActions cartActive />
      </nav>
    )
  }

  if (variant === 'product') {
    return (
      <nav className="bg-surface dark:bg-surface-container-highest border-b border-outline-variant/15 w-full top-0 sticky z-50">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-display-lg text-headline-md font-semibold tracking-tighter text-primary dark:text-on-primary-fixed">
              LuxeLife
            </Link>
            <div className="hidden md:flex items-center gap-8 font-label-caps text-label-caps">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.key} href={item.href} label={item.label} active={item.key === 'shop' || resolveActive(item.key)} className={item.key === 'shop' ? 'opacity-80 transition-opacity' : ''} />
              ))}
            </div>
          </div>
          <HeaderActions />
        </div>
      </nav>
    )
  }

  if (variant === 'shop') {
    return (
      <header className="bg-surface dark:bg-surface-container-highest border-b border-outline-variant/15 w-full top-0 sticky z-50">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
          <Link to="/" className="font-display-lg text-headline-md font-semibold tracking-tighter text-primary dark:text-on-primary-fixed">
            LuxeLife
          </Link>
          <nav className="hidden md:flex gap-8">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.key}
                href={item.href}
                label={item.label}
                active={item.key === 'shop'}
                className={item.key === 'shop' ? 'opacity-80 transition-opacity' : ''}
              />
            ))}
          </nav>
          <HeaderActions iconStyle="secondary" />
        </div>
      </header>
    )
  }

  // home variant
  return (
    <header className="bg-surface dark:bg-surface-container-highest border-b border-outline-variant/15 w-full sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        <Link to="/" className="flex items-center gap-2 font-display-lg text-headline-md font-semibold tracking-tighter text-primary dark:text-on-primary-fixed">
          <img alt="LuxeLife Logo" className="h-8 w-8 object-contain mix-blend-multiply" src={LOGO_URL} />
          LuxeLife
        </Link>
        <nav className="hidden md:flex items-center gap-6 font-label-caps text-label-caps text-secondary dark:text-secondary-fixed-dim">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.key} href={item.href} label={item.label} active={resolveActive(item.key)} />
          ))}
        </nav>
        <HeaderActions hidePersonOnMobile />
      </div>
    </header>
  )
}

export function CheckoutHeader() {
  return (
    <header className="w-full flex justify-center items-center py-8 border-b border-outline/15 sticky top-0 z-50 bg-surface/95 backdrop-blur-sm relative">
      <Link to="/" className="font-headline-md text-headline-md font-semibold text-primary tracking-tight">
        LuxeLife
      </Link>
      <div className="absolute right-margin-mobile md:right-margin-desktop flex items-center gap-2 text-secondary font-label-caps text-label-caps">
        <span className="material-symbols-outlined text-[18px]">lock</span>
        SECURE CHECKOUT
      </div>
    </header>
  )
}
