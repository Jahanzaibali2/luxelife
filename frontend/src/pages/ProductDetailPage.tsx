import { useEffect, useMemo, useState } from 'react'
import { Heart, Minus, Plus, ShoppingBag } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Price } from '../components/Price'
import { useCart } from '../context/CartContext'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { AnimatePresence, motion } from 'motion/react'
import { ProductCard } from '../components/ProductCard'
import { Reveal } from '../components/motion/Reveal'
import { EASE_EDITORIAL } from '../components/motion/ease'
import { api } from '../lib/api'
import { useCatalog } from '../lib/useCatalog'
import { useWishlist } from '../context/WishlistContext'
import type { Product } from '../types/api'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addItem, openCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const catalog = useCatalog()
  const wishlist = useWishlist()

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    api.getProduct(slug)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  const relatedProducts = useMemo(() => {
    if (!product) return []
    const others = catalog.products.filter((p) => p.slug !== product.slug)
    const sameCategory = others.filter((p) => p.category === product.category)
    return (sameCategory.length ? sameCategory : others).slice(0, 3)
  }, [catalog.products, product])

  const gallery = product?.gallery?.length ? product.gallery : product ? [product.image] : []

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="font-label-caps text-label-caps text-secondary">Loading</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <p>Product not found. <Link to="/shop" className="underline">Back to shop</Link></p>
      </div>
    )
  }

  const cartPayload = {
    id: product.slug,
    name: product.name,
    variant: product.subtitle || 'Standard',
    price: product.price,
    currency: product.currency,
    image: product.image,
  }

  const handleAddToCart = () => {
    addItem(cartPayload, quantity)
    openCart()
  }

  const handleBuyNow = () => {
    addItem(cartPayload, quantity)
    navigate('/checkout')
  }

  const category = catalog.nameOf(product.category)
  const saved = wishlist.has(product.slug)

  return (
    <div className="flex min-h-screen flex-col bg-white font-body-md text-ink">
      <title>{`${product.name} | LuxeLife`}</title>
      <meta name="description" content={(product.description || product.subtitle || product.name).slice(0, 155)} />
      <Header variant="product" activeNav="shop" />
      <main className="mx-auto w-full max-w-container-max px-margin-mobile pt-8 md:px-margin-desktop md:pt-10">
        <nav className="mb-8 flex items-center gap-3 font-label-caps text-label-caps text-secondary" aria-label="Breadcrumb">
          <Link to="/shop" className="link-underline hover:text-ink">Shop</Link>
          <span aria-hidden>/</span>
          <Link to={`/collections/${product.category}`} className="link-underline hover:text-ink">{category}</Link>
        </nav>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-6">
          <div className="flex flex-col gap-4 md:col-span-7">
            {/* Desktop: fit the viewport below header + breadcrumb (and thumbnails, when shown) instead of a tall 4:5 crop. */}
            <div
              className={`relative aspect-[4/5] overflow-hidden bg-backdrop md:aspect-auto ${
                gallery.length > 1 ? 'md:h-[calc(100svh-19rem)]' : 'md:h-[calc(100svh-12rem)]'
              } md:min-h-[24rem]`}
            >
              <AnimatePresence initial={false}>
                <motion.img
                  key={gallery[selectedImage] ?? product.image}
                  src={gallery[selectedImage] ?? product.image}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover md:object-contain"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE_EDITORIAL } }}
                  exit={{ opacity: 0, transition: { duration: 0.5 } }}
                />
              </AnimatePresence>
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {gallery.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    aria-label={`View image ${i + 1} of ${gallery.length}`}
                    aria-current={i === selectedImage}
                    className={`h-24 w-20 shrink-0 overflow-hidden bg-backdrop transition-opacity duration-500 ${
                      i === selectedImage ? 'opacity-100 outline outline-1 outline-offset-2 outline-ink' : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img className="h-full w-full object-cover" alt="" src={img} loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <Reveal className="md:sticky md:top-28">
              <p className="mb-4 font-label-caps text-label-caps text-secondary">
                {category}
                {product.badge && <span className="text-accent"> · {product.badge === 'Limited' ? 'Limited edition' : product.badge}</span>}
              </p>
              <h1 className="font-serif text-[clamp(1.5rem,1.9vw,2rem)] leading-[1.1] tracking-[-0.01em]">{product.name}</h1>
              {product.subtitle && <p className="mt-3 font-label-caps text-label-caps text-secondary">{product.subtitle}</p>}
              <div className="mt-6 flex items-baseline justify-between border-b border-hairline pb-6">
                <Price amount={product.price} variant="emphasis" />
                <span className="font-label-caps text-label-caps text-secondary">
                  {product.inStock ? 'In stock' : 'Sold out'}
                </span>
              </div>

              <p className="mt-6 text-body-md leading-relaxed text-secondary">{product.description || product.subtitle}</p>

              <div className="mt-8 flex items-center justify-between border-y border-hairline py-3">
                <span className="font-label-caps text-label-caps">Quantity</span>
                <div className="flex items-center gap-3">
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-8 w-8 items-center justify-center border border-hairline text-secondary transition-colors hover:border-ink hover:text-ink">
                    <Minus strokeWidth={1.25} className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center tabular-nums" aria-live="polite">{quantity}</span>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)} className="flex h-8 w-8 items-center justify-center border border-hairline text-secondary transition-colors hover:border-ink hover:text-ink">
                    <Plus strokeWidth={1.25} className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button type="button" onClick={handleAddToCart} disabled={!product.inStock} className="btn-primary w-full">
                  Add to cart
                  <ShoppingBag strokeWidth={1.25} className="h-4 w-4" />
                </button>
                <div className="flex gap-3">
                  <button type="button" onClick={handleBuyNow} disabled={!product.inStock} className="btn-ghost flex-1">
                    Buy now
                  </button>
                  <button
                    type="button"
                    onClick={() => wishlist.toggle(product.slug)}
                    aria-pressed={saved}
                    aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                    className="btn-ghost w-[3.25rem] shrink-0 px-0"
                  >
                    <Heart strokeWidth={1.25} className={`h-5 w-5 transition-transform duration-500 ease-editorial ${saved ? 'scale-110 fill-ink' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="mt-10 border-t border-hairline">
                <details className="group border-b border-hairline py-5" open>
                  <summary className="flex cursor-pointer list-none items-center justify-between font-label-caps text-label-caps">
                    Description
                    <Plus strokeWidth={1.25} aria-hidden className="h-4 w-4 transition-transform duration-500 ease-editorial group-open:rotate-45" />
                  </summary>
                  <p className="pt-4 text-body-md text-secondary">
                    {product.description || 'Premium curated product from the LuxeLife collection.'}
                  </p>
                </details>
                <details className="group border-b border-hairline py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-label-caps text-label-caps">
                    Shipping &amp; returns
                    <Plus strokeWidth={1.25} aria-hidden className="h-4 w-4 transition-transform duration-500 ease-editorial group-open:rotate-45" />
                  </summary>
                  <p className="pt-4 text-body-md text-secondary">
                    Complimentary next-day delivery within Dubai and Abu Dhabi. Returns accepted within 14 days of purchase in original packaging.
                  </p>
                </details>
              </div>
            </Reveal>
          </div>
        </div>
      </main>

      {relatedProducts.length > 0 && (
        <section className="mx-auto w-full max-w-container-max px-margin-mobile py-section-gap md:px-margin-desktop">
          <Reveal className="mb-12 flex items-end justify-between border-b border-hairline pb-6">
            <h2 className="font-headline-lg text-headline-lg">You may also like</h2>
            <Link to={`/collections/${product.category}`} className="link-underline font-label-caps text-label-caps">View all</Link>
          </Reveal>
          <div className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((item, i) => (
              <Reveal key={item.slug} delay={i * 0.08}>
                <ProductCard product={item} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
      <Footer variant="product" />
    </div>
  )
}
