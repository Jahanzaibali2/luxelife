import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, ShoppingBag } from 'lucide-react'
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

// Short slide in the direction of travel, crossfaded so it never shows a gap.
const GALLERY_SLIDE = {
  enter: (dir: number) => ({ x: `${dir * 6}%`, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.7, ease: EASE_EDITORIAL } },
  exit: (dir: number) => ({ x: `${dir * -6}%`, opacity: 0, transition: { duration: 0.5, ease: EASE_EDITORIAL } }),
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addItem, openCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [direction, setDirection] = useState(1)
  const [quantity, setQuantity] = useState(1)
  const [expanded, setExpanded] = useState(false)
  const catalog = useCatalog()
  const wishlist = useWishlist()

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setSelectedImage(0)
    setExpanded(false)
    api.getProduct(slug)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  const relatedProducts = useMemo(() => {
    if (!product) return []
    const others = catalog.products.filter((p) => p.slug !== product.slug)
    const sameCategory = others.filter((p) => p.category === product.category)
    return (sameCategory.length ? sameCategory : others).slice(0, 4)
  }, [catalog.products, product])

  // Cover image always leads; gallery extras follow without repeating it.
  const gallery = product ? [...new Set([product.image, ...(product.gallery ?? [])].filter(Boolean))] : []

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
  const description = product.description || 'Premium curated product from the LuxeLife collection.'
  // ponytail: char count approximates "longer than 3 lines"; measure with a ref if short copy ever shows a stray toggle.
  const longDescription = description.length > 200
  const step = (dir: number) => {
    setDirection(dir)
    setSelectedImage((i) => (i + dir + gallery.length) % gallery.length)
  }
  const show = (i: number) => {
    setDirection(i >= selectedImage ? 1 : -1)
    setSelectedImage(i)
  }

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
          <span aria-hidden>/</span>
          <span aria-current="page" className="truncate text-ink">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-6">
          <div className="flex flex-col gap-4 md:col-span-6">
            {/* Desktop: fit the viewport below header + breadcrumb instead of a tall 4:5 crop. */}
            <div className="relative aspect-[4/5] overflow-hidden bg-backdrop md:aspect-auto md:h-[calc(100svh-12rem)] md:min-h-[24rem]">
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={gallery[selectedImage] ?? product.image}
                  src={gallery[selectedImage] ?? product.image}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-contain mix-blend-multiply"
                  custom={direction}
                  variants={GALLERY_SLIDE}
                  initial="enter"
                  animate="center"
                  exit="exit"
                />
              </AnimatePresence>
              {gallery.length > 1 && (
                <>
                  {/* Desktop: thumbnails float over the image's top-left corner. */}
                  <div className="absolute left-4 top-4 z-10 hidden max-h-[calc(100%-2rem)] flex-col gap-2 overflow-y-auto md:flex">
                    {gallery.map((img, i) => (
                      <button
                        key={img}
                        type="button"
                        onClick={() => show(i)}
                        aria-label={`View image ${i + 1} of ${gallery.length}`}
                        aria-current={i === selectedImage}
                        className={`h-14 w-12 shrink-0 overflow-hidden bg-backdrop transition-opacity duration-500 ${
                          i === selectedImage ? 'opacity-100 outline outline-1 outline-offset-1 outline-ink' : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img className="h-full w-full object-contain mix-blend-multiply" alt="" src={img} loading="lazy" decoding="async" />
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={() => step(-1)} aria-label="Previous image" className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-ink transition-opacity hover:opacity-60 md:left-20">
                    <ChevronLeft strokeWidth={1.25} className="h-6 w-6" />
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label="Next image" className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-ink transition-opacity hover:opacity-60">
                    <ChevronRight strokeWidth={1.25} className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5" aria-hidden>
                    {gallery.map((img, i) => (
                      <span key={img} className={`h-px w-6 transition-colors duration-500 ${i === selectedImage ? 'bg-ink' : 'bg-ink/25'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto md:hidden">
                {gallery.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => show(i)}
                    aria-label={`View image ${i + 1} of ${gallery.length}`}
                    aria-current={i === selectedImage}
                    className={`h-24 w-20 shrink-0 overflow-hidden bg-backdrop transition-opacity duration-500 ${
                      i === selectedImage ? 'opacity-100 outline outline-1 outline-offset-2 outline-ink' : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img className="h-full w-full object-contain mix-blend-multiply" alt="" src={img} loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-5 md:col-start-8 md:self-center">
            <Reveal>
              <p className="mb-4 font-label-caps text-label-caps text-secondary">
                {category}
                {product.badge && <span className="text-accent"> · {product.badge === 'Limited' ? 'Limited edition' : product.badge}</span>}
              </p>
              <h1 className="font-serif text-[clamp(1.5rem,1.9vw,2rem)] leading-[1.1] tracking-[-0.01em]">{product.name}</h1>
              {product.subtitle && <p className="mt-3 font-label-sm text-label-sm text-secondary">{product.subtitle}</p>}
              <div className="mt-6 flex items-baseline justify-between border-b border-hairline pb-6">
                <Price amount={product.price} variant="emphasis" />
                <span className="font-label-caps text-label-caps text-secondary">
                  {product.inStock ? 'In stock' : 'Sold out'}
                </span>
              </div>

              <div className="mt-6">
                <p className={`text-body-md leading-relaxed text-secondary ${longDescription && !expanded ? 'line-clamp-3' : ''}`}>
                  {description}
                </p>
                {longDescription && (
                  <button type="button" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} className="link-underline mt-3 font-label-caps text-label-caps">
                    {expanded ? 'Read less' : 'Read more'}
                  </button>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-y border-hairline py-3">
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

              <div className="mt-6 flex gap-3">
                <button type="button" onClick={handleAddToCart} disabled={!product.inStock} className="btn-primary flex-1">
                  Add to cart
                  <ShoppingBag strokeWidth={1.25} className="h-4 w-4" />
                </button>
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
          <div className="product-grid">
            {relatedProducts.map((item, i) => (
              <Reveal key={item.slug} delay={(i % 4) * 0.06}>
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
