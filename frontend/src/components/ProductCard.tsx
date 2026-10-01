import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { LazyImage } from './LazyImage'
import { Price } from './Price'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import type { Product } from '../types/api'

/** Image-first card: gray backdrop, slow scale + crossfade to the second gallery image, quick add, wishlist. */
export function ProductCard({ product, eager }: { product: Product; eager?: boolean }) {
  const { addItem, openCart } = useCart()
  const wishlist = useWishlist()
  const href = `/products/${product.slug}`
  const alt = product.gallery?.find((src) => src && src !== product.image)
  const caption = product.subtitle || product.category.replace(/-/g, ' ')
  const saved = wishlist.has(product.slug)

  const quickAdd = () => {
    addItem({
      id: product.slug,
      name: product.name,
      variant: product.subtitle || 'Standard',
      price: product.price,
      currency: product.currency,
      image: product.image,
    })
    openCart()
  }

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-backdrop">
        <Link to={href} data-cursor="view" className="absolute inset-0 block" aria-label={product.name}>
          <LazyImage
            eager={eager}
            alt={product.name}
            src={product.image}
            className={`img-hover absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-editorial ${alt ? 'group-hover:opacity-0' : ''}`}
          />
          {alt && (
            <LazyImage
              alt=""
              aria-hidden
              src={alt}
              className="img-hover absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-editorial group-hover:opacity-100"
            />
          )}
        </Link>

        {product.inStock ? (
          <button
            type="button"
            onClick={quickAdd}
            aria-label={`Quick add ${product.name} to cart`}
            className="quick-add absolute inset-x-3 bottom-3 flex h-11 items-center justify-center gap-2 bg-white/95 text-button text-ink backdrop-blur-sm transition-[transform,opacity,background-color] duration-500 ease-editorial hover:bg-ink hover:text-white"
          >
            <ShoppingBag strokeWidth={1.25} className="h-4 w-4" />
            <span className="quick-add-label">Quick add</span>
          </button>
        ) : (
          <span className="absolute bottom-3 left-3 font-label-caps text-label-caps text-secondary">Sold out</span>
        )}

        <button
          type="button"
          onClick={() => wishlist.toggle(product.slug)}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={saved}
          className={`absolute right-2 top-2 flex h-10 w-10 items-center justify-center text-ink transition-opacity duration-500 ${
            saved ? 'opacity-100' : 'opacity-0 focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100'
          }`}
        >
          <Heart
            strokeWidth={1.25}
            className={`h-5 w-5 transition-transform duration-500 ease-editorial hover:scale-110 ${saved ? 'fill-ink' : ''}`}
          />
        </button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <Link to={href}>
            <h3 className="line-clamp-2 font-serif text-[1.3rem] leading-snug text-ink">{product.name}</h3>
          </Link>
          <p className="mt-1.5 font-label-caps text-label-caps text-secondary">
            {caption}
            {product.badge && <span className="text-accent"> · {product.badge === 'New Arrival' ? 'New' : product.badge}</span>}
          </p>
        </div>
        <Price amount={product.price} variant="card" className="shrink-0 pt-1" />
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden>
      <div className="aspect-[4/5] animate-pulse bg-backdrop" />
      <div className="mt-4 h-5 w-2/3 animate-pulse bg-backdrop" />
      <div className="mt-2 h-3 w-1/3 animate-pulse bg-backdrop" />
    </div>
  )
}
