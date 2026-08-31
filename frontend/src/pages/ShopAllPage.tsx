import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { LazyImage } from '../components/LazyImage'
import { formatPrice } from '../context/CartContext'
import { api } from '../lib/api'
import { PRODUCTS as FALLBACK_PRODUCTS } from '../data/products'
import type { Product, ProductCategory } from '../types/api'

type SortOption = 'featured' | 'newest' | 'best' | 'price-high' | 'price-low'

const PAGE_SIZE = 9

const CATEGORY_FILTERS: { label: string; value: ProductCategory | 'all-fashion' }[] = [
  { label: 'All Fashion', value: 'fashion' },
  { label: 'Home Decor', value: 'home-lifestyle' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'Fine Jewelry', value: 'jewelry' },
]

export default function ShopAllPage() {
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getProducts()
      .then(setAllProducts)
      .catch(() => setAllProducts(FALLBACK_PRODUCTS as Product[]))
      .finally(() => setLoading(false))
  }, [])

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(() => {
    if (categoryParam) return new Set([categoryParam])
    return new Set()
  })
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [preorderOnly, setPreorderOnly] = useState(false)
  const [sort, setSort] = useState<SortOption>('featured')
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const filtered = useMemo(() => {
    let list = [...allProducts]
    if (selectedCategories.size > 0) {
      list = list.filter((p) => selectedCategories.has(p.category))
    }
    const min = minPrice ? Number(minPrice) : null
    const max = maxPrice ? Number(maxPrice) : null
    if (min !== null) list = list.filter((p) => p.price >= min)
    if (max !== null) list = list.filter((p) => p.price <= max)
    if (inStockOnly) list = list.filter((p) => p.inStock)
    if (preorderOnly) list = list.filter((p) => p.preorder)

    switch (sort) {
      case 'price-high':
        list.sort((a, b) => b.price - a.price)
        break
      case 'price-low':
        list.sort((a, b) => a.price - b.price)
        break
      case 'newest':
        list.reverse()
        break
      default:
        break
    }
    return list
  }, [allProducts, selectedCategories, minPrice, maxPrice, inStockOnly, preorderOnly, sort])

  useEffect(() => {
    setPage(1)
  }, [selectedCategories, minPrice, maxPrice, inStockOnly, preorderOnly, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const showingFrom = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const showingTo = Math.min(currentPage * PAGE_SIZE, filtered.length)

  const toggleWishlist = (slug: string) => {
    setWishlist((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  return (
    <div className="antialiased min-h-screen flex flex-col font-body-md text-body-md bg-warm-ivory">
      <Header variant="shop" activeNav="shop" />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24">
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-charcoal-grey mb-4">Shop All</h1>
          <p className="font-body-lg text-body-lg text-secondary">Discover the LuxeLife collection.</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-gutter">
          <aside className="w-full lg:w-1/4 pr-0 lg:pr-8 mb-8 lg:mb-0">
            <div className="sticky top-24 border border-charcoal-grey/10 bg-white p-6 rounded">
              <div className="mb-8">
                <h3 className="font-label-caps text-label-caps text-charcoal-grey mb-4 pb-2 border-b border-charcoal-grey/10">Category</h3>
                <ul className="space-y-3">
                  {CATEGORY_FILTERS.map((cat) => (
                    <li key={cat.value}>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="form-checkbox text-deep-cocoa border-charcoal-grey/20 rounded-sm focus:ring-deep-cocoa"
                          checked={selectedCategories.has(cat.value)}
                          onChange={() => toggleCategory(cat.value)}
                        />
                        <span className="text-charcoal-grey">{cat.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-8">
                <h3 className="font-label-caps text-label-caps text-charcoal-grey mb-4 pb-2 border-b border-charcoal-grey/10">Price</h3>
                <div className="flex gap-4 items-center">
                  <input className="w-full border-b border-charcoal-grey/20 bg-transparent py-2 focus:border-deep-cocoa focus:ring-0 text-sm" placeholder="Min" type="text" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                  <span className="text-secondary">-</span>
                  <input className="w-full border-b border-charcoal-grey/20 bg-transparent py-2 focus:border-deep-cocoa focus:ring-0 text-sm" placeholder="Max" type="text" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                </div>
              </div>
              <div>
                <h3 className="font-label-caps text-label-caps text-charcoal-grey mb-4 pb-2 border-b border-charcoal-grey/10">Availability</h3>
                <ul className="space-y-3">
                  <li>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="form-checkbox text-deep-cocoa border-charcoal-grey/20 rounded-sm focus:ring-deep-cocoa" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
                      <span className="text-charcoal-grey">In Stock</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="form-checkbox text-deep-cocoa border-charcoal-grey/20 rounded-sm focus:ring-deep-cocoa" checked={preorderOnly} onChange={(e) => setPreorderOnly(e.target.checked)} />
                      <span className="text-charcoal-grey">Pre-order</span>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
          <div className="w-full lg:w-3/4">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-charcoal-grey/10">
              <span className="text-secondary text-sm">
                {loading ? 'Loading…' : `Showing ${showingFrom}-${showingTo} of ${filtered.length} products`}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary">Sort by:</span>
                <select className="border-none bg-transparent text-charcoal-grey font-medium text-sm focus:ring-0 cursor-pointer pl-0 pr-8 py-0" value={sort} onChange={(e) => setSort(e.target.value as SortOption)}>
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="best">Best Selling</option>
                  <option value="price-high">Price (High-Low)</option>
                  <option value="price-low">Price (Low-High)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-gutter">
              {loading
                ? Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="bg-white border border-charcoal-grey/10 rounded overflow-hidden">
                      <div className="aspect-[4/5] bg-charcoal-grey/5 animate-pulse" />
                      <div className="p-6 space-y-3">
                        <div className="h-4 w-2/3 bg-charcoal-grey/10 animate-pulse rounded" />
                        <div className="h-3 w-1/3 bg-charcoal-grey/10 animate-pulse rounded" />
                      </div>
                    </div>
                  ))
                : pageItems.map((product) => (
                    <ProductCard key={product.slug} product={product} wishlisted={wishlist.has(product.slug)} onWishlist={() => toggleWishlist(product.slug)} />
                  ))}
            </div>
            {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-2 border-t border-charcoal-grey/10 pt-8">
              <button type="button" className="w-10 h-10 flex items-center justify-center border border-charcoal-grey/20 text-charcoal-grey hover:border-deep-cocoa transition-colors disabled:opacity-40" disabled={currentPage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} type="button" onClick={() => setPage(p)} className={`w-10 h-10 flex items-center justify-center font-label-caps text-xs ${currentPage === p ? 'bg-deep-cocoa text-white' : 'border border-charcoal-grey/20 text-charcoal-grey hover:border-deep-cocoa transition-colors'}`}>
                  {p}
                </button>
              ))}
              <button type="button" className="w-10 h-10 flex items-center justify-center border border-charcoal-grey/20 text-charcoal-grey hover:border-deep-cocoa transition-colors disabled:opacity-40" disabled={currentPage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
            )}
          </div>
        </div>
      </main>
      <Footer variant="shop" />
    </div>
  )
}

function ProductCard({ product, wishlisted, onWishlist }: { product: Product; wishlisted: boolean; onWishlist: () => void }) {
  return (
    <div className="product-card group bg-white border border-charcoal-grey/10 rounded overflow-hidden flex flex-col relative">
      {product.badge === 'New Arrival' && (
        <div className="absolute top-4 left-4 z-10 bg-soft-blush text-deep-cocoa px-3 py-1 font-label-caps text-[10px] tracking-wider rounded-sm">New Arrival</div>
      )}
      {product.badge === 'Limited' && (
        <div className="absolute top-4 left-4 z-10 bg-deep-cocoa text-white px-3 py-1 font-label-caps text-[10px] tracking-wider rounded-sm">Limited</div>
      )}
      <button type="button" onClick={onWishlist} className={`absolute top-4 right-4 z-10 text-charcoal-grey hover:text-deep-cocoa bg-white/80 p-2 rounded-full transition-opacity ${wishlisted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <span className="material-symbols-outlined text-sm" style={wishlisted ? { fontVariationSettings: "'FILL' 1" } : undefined}>favorite</span>
      </button>
      <Link to={`/products/${product.slug}`} className="aspect-[4/5] overflow-hidden bg-surface-container-lowest block">
        <LazyImage className="product-image w-full h-full object-cover" alt={product.name} src={product.image} />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-body-lg text-body-lg text-charcoal-grey mb-1">{product.name}</h3>
        </Link>
        <p className="text-secondary text-sm mb-4">{product.subtitle}</p>
        <p className="font-headline-md text-headline-md text-charcoal-grey mt-auto">{formatPrice(product.price)}</p>
      </div>
    </div>
  )
}
