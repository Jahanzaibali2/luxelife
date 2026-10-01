import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'

export type FooterVariant =
  | 'home'
  | 'shop'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'about'
  | 'faq'
  | 'contact'

interface FooterProps {
  /** Only 'checkout' differs (minimal); every other page shares one footer. */
  variant: FooterVariant
}

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Shop',
    links: [
      { label: 'All pieces', to: '/shop' },
      { label: 'Fashion', to: '/shop?category=fashion' },
      { label: 'Home & lifestyle', to: '/shop?category=home-lifestyle' },
      { label: 'Gifts', to: '/shop?category=gifts' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Shipping & returns', to: '/shipping-returns' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Terms', to: '/terms' },
      { label: 'Privacy', to: '/privacy' },
    ],
  },
]

// ponytail: newsletter is UI-only (no email provider yet); wire to backend/src/email.ts when one is chosen.
function Newsletter() {
  const [done, setDone] = useState(false)
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setDone(true)
  }

  if (done) return <p className="text-label-sm text-secondary" role="status">Thank you, you're on the list.</p>

  return (
    <form onSubmit={onSubmit} className="flex max-w-sm items-end gap-4 border-b border-ink/25 focus-within:border-ink">
      <label className="flex-1">
        <span className="sr-only">Email address</span>
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="Email address"
          className="w-full border-0 bg-transparent px-0 py-3 text-label-sm placeholder:text-secondary focus:ring-0"
        />
      </label>
      <button type="submit" className="link-underline mb-3 shrink-0 text-button">
        Subscribe
      </button>
    </form>
  )
}

export function Footer({ variant }: FooterProps) {
  const year = new Date().getFullYear()

  if (variant === 'checkout') {
    return (
      <footer className="w-full border-t border-hairline py-8 text-center font-label-caps text-label-caps text-secondary">
        © {year} LuxeLife · Secure checkout
      </footer>
    )
  }

  return (
    <footer className="mt-auto w-full border-t border-hairline bg-white">
      <div className="mx-auto grid max-w-container-max grid-cols-2 gap-x-6 gap-y-14 px-margin-mobile py-20 md:grid-cols-12 md:px-margin-desktop md:py-28">
        <div className="col-span-2 flex flex-col gap-8 md:col-span-5">
          <Logo
            imageClassName="h-6 w-6 object-contain shrink-0"
            textClassName="font-serif text-[1.65rem] leading-none tracking-tight"
          />
          <p className="max-w-xs text-body-md text-secondary">
            Considered objects for the home, the wardrobe and the everyday. Delivered across the UAE.
          </p>
          <div>
            <p className="mb-1 font-label-caps text-label-caps">Newsletter</p>
            <Newsletter />
          </div>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} className="flex flex-col gap-3 md:col-span-2" aria-label={col.title}>
            <p className="mb-2 font-label-caps text-label-caps text-secondary">{col.title}</p>
            {col.links.map((l) => (
              <Link key={l.label} to={l.to} className="link-underline w-fit text-label-sm">
                {l.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <div className="mx-auto flex max-w-container-max justify-between border-t border-hairline px-margin-mobile py-6 font-label-caps text-label-caps text-secondary md:px-margin-desktop">
        <span>© {year} LuxeLife</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  )
}
