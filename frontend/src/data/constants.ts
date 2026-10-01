export const LOGO_URL = '/icon.png'

export type NavKey = 'home' | 'shop' | 'gifts' | 'about' | 'contact' | 'faq'

export const NAV_ITEMS: { key: NavKey; label: string; href: string }[] = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'shop', label: 'Shop', href: '/shop' },
  { key: 'gifts', label: 'Gifts', href: '/gifts' },
  { key: 'about', label: 'About', href: '/about' },
  { key: 'contact', label: 'Contact', href: '/contact' },
  { key: 'faq', label: 'FAQ', href: '/faq' },
]
