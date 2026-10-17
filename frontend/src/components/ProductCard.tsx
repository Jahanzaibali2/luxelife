import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { LazyImage } from './LazyImage'
import { Price } from './Price'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import type { Product } from '../types/api'

/** Image-first card: contained packshot on a backdrop (multiply-blended), badge chip, crossfade to the second gallery image, quick add, wishlist; title, subtitle and price stacked below. */
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
            className={`img-hover absolute inset-0 h-full w-full object-contain p-[8%] mix-blend-multiply transition-[opacity,transform] duration-700 ease-editorial ${alt ? 'group-hover:opacity-0' : ''} ${product.inStock ? '' : 'opacity-60'}`}
          />
          {alt && (
            <LazyImage
              alt=""
              aria-hidden
              src={alt}
              className={`img-hover absolute inset-0 h-full w-full object-contain p-[8%] mix-blend-multiply opacity-0 transition-[opacity,transform] duration-700 ease-editorial ${product.inStock ? 'group-hover:opacity-100' : 'group-hover:opacity-60'}`}
            />
          )}
        </Link>

        {product.badge && (
          <span className="pointer-events-none absolute left-3 top-3 bg-white/90 px-2 py-1 font-label-caps text-label-caps text-ink">
            {product.badge === 'New Arrival' ? 'New' : product.badge}
          </span>
        )}

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
          className={`absolute right-1.5 top-1.5 flex h-11 w-11 items-center justify-center text-ink transition-opacity duration-500 ${
            saved ? 'opacity-100' : 'opacity-0 focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100'
          }`}
        >
          <Heart
            strokeWidth={1.25}
            className={`h-5 w-5 transition-transform duration-500 ease-editorial hover:scale-110 ${saved ? 'fill-ink' : ''}`}
          />
        </button>
      </div>

      <div className="mt-4">
        <Link to={href}>
          <h3 className="line-clamp-2 min-h-[2.75em] font-serif text-base leading-snug text-ink md:text-[1.2rem]">{product.name}</h3>
        </Link>
        <p className="mt-1 line-clamp-1 text-label-sm text-secondary" title={caption}>
          {caption}
        </p>
        <div className="mt-2">
          <Price amount={product.price} variant="card" />
        </div>
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden>
      <div className="aspect-[4/5] animate-pulse bg-backdrop" />
      <div className="mt-4 flex min-h-[2.75em] flex-col gap-[0.375em] text-base leading-snug md:text-[1.2rem]">
        <div className="h-[1em] w-5/6 animate-pulse bg-backdrop" />
        <div className="h-[1em] w-2/3 animate-pulse bg-backdrop" />
      </div>
      <div className="mt-1 flex h-[1.1375rem] items-center">
        <div className="h-3 w-1/2 animate-pulse bg-backdrop" />
      </div>
      <div className="mt-2 flex h-[1.5rem] items-center">
        <div className="h-3 w-1/4 animate-pulse bg-backdrop" />
      </div>
    </div>
  )
}
