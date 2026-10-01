import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { CategoryCard } from '../CategoryCard'
import { EASE_EDITORIAL } from '../motion/ease'
import { useCatalog } from '../../lib/useCatalog'

/** Full-width panel under the header: quick links + one card per category. */
export function ShopMenu({ id, onNavigate }: { id: string; onNavigate: () => void }) {
  const { categories, countIn, heroFor, products } = useCatalog()

  return (
    <motion.div
      id={id}
      className="absolute inset-x-0 top-full border-b border-hairline bg-white text-ink"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_EDITORIAL } }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
    >
      <div className="mx-auto grid max-w-container-max grid-cols-12 gap-6 px-margin-desktop pb-12 pt-10">
        <nav className="col-span-3 flex flex-col gap-4" aria-label="Shop">
          <p className="mb-2 font-label-caps text-label-caps text-secondary">Shop</p>
          {[
            { label: 'Shop all', to: '/shop', note: `${products.length} pieces` },
            { label: 'All collections', to: '/collections' },
            { label: 'The gifts edit', to: '/gifts' },
            { label: 'Wishlist', to: '/wishlist' },
          ].map((l) => (
            <Link key={l.to} to={l.to} onClick={onNavigate} className="group flex items-center gap-3 font-serif text-2xl leading-none">
              <span className="link-underline">{l.label}</span>
              <ArrowRight strokeWidth={1.25} className="h-4 w-4 -translate-x-2 opacity-0 transition-[opacity,transform] duration-500 ease-editorial group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          ))}
        </nav>
        <div className="col-span-9 grid grid-cols-4 gap-6">
          {categories.slice(0, 4).map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.06 + i * 0.06, duration: 0.55, ease: EASE_EDITORIAL } }}
            >
              <CategoryCard category={c} image={heroFor(c)} count={countIn(c.slug)} size="sm" ratio="aspect-[4/5]" onNavigate={onNavigate} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
