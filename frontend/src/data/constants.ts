export const LOGO_URL = '/icon.png'

export type NavKey =
  | 'home'
  | 'shop'
  | 'gifts'
  | 'fashion'
  | 'home-lifestyle'
  | 'gadgets'

export const NAV_ITEMS: { key: NavKey; label: string; href: string }[] = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'shop', label: 'Shop', href: '/shop' },
  { key: 'gifts', label: 'Gifts', href: '/shop?category=gifts' },
  { key: 'fashion', label: 'Fashion', href: '/shop?category=fashion' },
  {
    key: 'home-lifestyle',
    label: 'Home & Lifestyle',
    href: '/shop?category=home-lifestyle',
  },
  { key: 'gadgets', label: 'Gadgets', href: '/shop?category=gadgets' },
]
