import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { LazyImage } from '../components/LazyImage'
import { api } from '../lib/api'
import { RELATED_PRODUCTS } from '../data/products'
import type { Product } from '../types/api'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    api.getProduct(slug)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  const gallery = product?.gallery?.length ? product.gallery : product ? [product.image] : []

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <p className="text-secondary">Loading product...</p>
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

  const handleAddToCart = () => {
    addItem(
      {
        id: product.slug,
        name: product.name,
        variant: product.subtitle || 'Standard',
        price: product.price,
        currency: product.currency,
        image: product.image,
      },
      quantity,
    )
    navigate('/cart')
  }

  return (
    <div className="font-body-md text-on-surface antialiased bg-brand-bg">
      <Header variant="product" activeNav="shop" />
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24">
        <nav className="font-label-caps text-label-caps text-secondary mb-8 flex items-center gap-2">
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-primary transition-colors capitalize">
            {product.category.replace('-', ' ')}
          </Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-primary">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-section-gap">
          <div className="md:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible w-full md:w-24 shrink-0">
              {gallery.map((img, i) => (
                <button key={img} type="button" onClick={() => setSelectedImage(i)} className={`w-20 h-24 md:w-24 md:h-28 bg-white border shrink-0 overflow-hidden focus:outline-none ${i === selectedImage ? 'border-primary/20' : 'border-outline-variant/30 opacity-60 hover:opacity-100 transition-opacity'}`}>
                  <img className="w-full h-full object-cover" alt="" src={img} loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
            <div className="w-full h-[500px] md:h-[700px] bg-white overflow-hidden relative cursor-zoom-in group border border-outline-variant/15">
              <LazyImage eager className="w-full h-full object-cover gallery-main-image" alt={product.name} src={gallery[selectedImage] ?? product.image} />
              {product.badge && (
                <div className="absolute top-4 right-4 bg-surface-bright/90 px-3 py-1 font-label-caps text-label-caps text-primary-container">
                  {product.badge === 'Limited' ? 'Limited Edition' : product.badge}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-5 md:pl-8 flex flex-col justify-start">
            <div className="mb-6 border-b border-outline-variant/15 pb-6">
              <h2 className="font-label-caps text-label-caps text-secondary mb-2 tracking-widest uppercase capitalize">
                {product.category.replace('-', ' ')}
              </h2>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-4">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-primary">
                  {[1, 2, 3, 4].map((s) => (
                    <span key={s} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                  <span className="material-symbols-outlined">star_half</span>
                </div>
                <span className="font-label-sm text-label-sm text-secondary">(4.8 / 12 reviews)</span>
              </div>
              <div className="font-headline-md text-headline-md text-primary mb-2">
                {product.currency} {product.price}
              </div>
              <div className="font-label-sm text-label-sm text-[#452829] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#452829]" /> {product.inStock ? 'In Stock - Ready to Ship' : 'Out of Stock'}
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
              {product.description || product.subtitle}
            </p>
            <div className="mb-8">
              <label className="font-label-caps text-label-caps text-primary block mb-3">Quantity</label>
              <div className="flex items-center border border-outline-variant/30 w-32 h-12 bg-white">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-secondary hover:text-primary transition-colors focus:outline-none">
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <input className="w-12 h-full text-center border-none focus:ring-0 font-body-md text-body-md p-0 bg-transparent text-primary" type="text" value={quantity} readOnly />
                <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center text-secondary hover:text-primary transition-colors focus:outline-none">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4 mb-8">
              <button type="button" onClick={handleAddToCart} disabled={!product.inStock} className="w-full h-14 bg-primary-container text-white font-label-caps text-label-caps hover:bg-tertiary transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                Add to Cart
              </button>
              <div className="flex gap-4">
                <button type="button" onClick={() => navigate('/checkout')} className="flex-1 h-14 border border-primary/20 text-primary bg-transparent font-label-caps text-label-caps hover:bg-surface-bright transition-colors flex items-center justify-center">
                  Buy Now
                </button>
                <button type="button" aria-label="Add to Wishlist" className="w-14 h-14 border border-primary/20 text-primary bg-transparent hover:bg-surface-bright transition-colors flex items-center justify-center focus:outline-none">
                  <span className="material-symbols-outlined">favorite_border</span>
                </button>
              </div>
            </div>
            <div className="border-t border-outline-variant/15">
              <details className="group py-4 border-b border-outline-variant/15" open>
                <summary className="font-label-caps text-label-caps text-primary cursor-pointer list-none flex justify-between items-center focus:outline-none">
                  Description
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="font-body-md text-body-md text-on-surface-variant pt-4 pb-2">
                  {product.description || 'Premium curated product from the LuxeLife collection.'}
                </div>
              </details>
              <details className="group py-4 border-b border-outline-variant/15">
                <summary className="font-label-caps text-label-caps text-primary cursor-pointer list-none flex justify-between items-center focus:outline-none">
                  Shipping & Returns
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="font-body-md text-body-md text-on-surface-variant pt-4 pb-2">
                  Complimentary next-day delivery within Dubai and Abu Dhabi. Returns accepted within 14 days of purchase in original packaging.
                </div>
              </details>
            </div>
          </div>
        </div>

        <section className="border-t border-outline-variant/15 pt-24 mb-section-gap">
          <h3 className="font-headline-md text-headline-md text-primary text-center mb-12">You May Also Like</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
            {RELATED_PRODUCTS.map((item) => (
              <div key={item.name} className="group bg-white p-4 border border-outline-variant/15 hover:border-primary/30 transition-all cursor-pointer">
                <div className="w-full h-80 bg-surface-container-low mb-4 overflow-hidden relative">
                  <LazyImage className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.name} src={item.image} />
                </div>
                <div className="font-label-caps text-label-caps text-secondary mb-1">{item.category}</div>
                <div className="font-body-lg text-body-lg font-medium text-primary mb-2">{item.name}</div>
                <div className="font-body-md text-body-md text-primary">{item.currency} {item.price}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer variant="product" />
    </div>
  )
}
