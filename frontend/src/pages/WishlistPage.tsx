import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard'
import { Reveal } from '../components/motion/Reveal'
import { useCatalog } from '../lib/useCatalog'
import { useWishlist } from '../context/WishlistContext'

export default function WishlistPage() {
  const { loading, products } = useCatalog()
  const { slugs } = useWishlist()
  // Keep saved order; silently skip pieces that no longer exist.
  const saved = slugs.map((s) => products.find((p) => p.slug === s)).filter((p) => p !== undefined)

  return (
    <div className="flex min-h-screen flex-col bg-white font-body-md text-ink">
      <title>Wishlist | LuxeLife</title>
      <meta name="robots" content="noindex" />
      <Header variant="shop" />
      <main className="mx-auto w-full max-w-container-max flex-grow px-margin-mobile pb-section-gap md:px-margin-desktop">
        <Reveal className="border-b border-hairline pb-10 pt-16 md:pt-28">
          <p className="mb-4 font-label-caps text-label-caps text-secondary">Saved for later</p>
          <h1 className="font-display-lg text-display-lg">Wishlist</h1>
        </Reveal>

        {loading && slugs.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-16 pt-12 sm:grid-cols-2 lg:grid-cols-3">
            {slugs.slice(0, 3).map((s) => <ProductCardSkeleton key={s} />)}
          </div>
        ) : saved.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-32 text-center">
            <Heart strokeWidth={1} className="h-10 w-10 text-secondary" />
            <p className="font-serif text-headline-md">Nothing saved yet.</p>
            <p className="max-w-xs text-body-md text-secondary">Tap the heart on any piece to keep it here.</p>
            <Link to="/shop" className="link-underline is-drawn text-button">
              Browse the collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-16 pt-12 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((product, i) => (
              <Reveal key={product.slug} delay={(i % 3) * 0.08}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </main>
      <Footer variant="shop" />
    </div>
  )
}
