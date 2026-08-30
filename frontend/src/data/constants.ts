export const LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDF7qXh4tpPoTmQIZloi0yppDHLpbI6qzjxTQuUi_Y_RkxvXqW9AyeEJeMk467uKA347zCVx1WF79J4fyvY5LbHIN2DMwr-eaWUtZRC35ZEeZESCl9UheoBG2QyIctAKA-nxsfZMcjPVYW0ZszgW9D7q4h-VvfETYVmMBFBjpkp21Z49PM2PxsDvX11qHxvBplMVjzYOtzIkX7L0-nbPPWvt0NdOdc28-eOqNQqsQ5YRV4CXrVnlM6HeeKaaL1iOWEelgc'

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
