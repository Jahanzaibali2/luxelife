import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { LazyImage } from './LazyImage'
import { Price } from './Price'
import type { Product } from '../types/api'

interface ProductCardProps {
  product: Product
  wishlisted?: boolean
  onWishlist?: () => void
  eager?: boolean
}

/** Image-first card: gray backdrop, slow scale + crossfade to the second gallery image on hover. */
export function ProductCard({ product, wishlisted = false, onWishlist, eager }: ProductCardProps) {
  const href = `/products/${product.slug}`
  const alt = product.gallery?.find((src) => src && src !== product.image)
  const caption = product.subtitle || product.category.replace('-', ' ')

  return (
    <article className="group relative">
      <Link to={href} data-cursor="view" className="relative block aspect-[4/5] overflow-hidden bg-backdrop">
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
        {!product.inStock && (
          <span className="absolute bottom-3 left-3 font-label-caps text-label-caps text-secondary">Sold out</span>
        )}
      </Link>

      {onWishlist && (
        <button
          type="button"
          onClick={onWishlist}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={wishlisted}
          className={`absolute right-2 top-2 flex h-10 w-10 items-center justify-center text-ink transition-opacity duration-500 ${
            wishlisted ? 'opacity-100' : 'opacity-0 focus-visible:opacity-100 group-hover:opacity-100'
          }`}
        >
          <Heart strokeWidth={1.25} className={`h-5 w-5 transition-transform duration-500 ease-editorial hover:scale-110 ${wishlisted ? 'fill-ink' : ''}`} />
        </button>
      )}

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
