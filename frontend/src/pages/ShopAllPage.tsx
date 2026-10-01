import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard'
import { Reveal } from '../components/motion/Reveal'
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

  const toggleWishlist = (slug: string) => {
    setWishlist((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  const checkbox = 'h-3.5 w-3.5 rounded-none border-ink/30 text-ink focus:ring-0 focus:ring-offset-0'
  const priceInput = 'w-full border-0 border-b border-hairline bg-transparent px-0 py-2 text-label-sm focus:border-ink focus:ring-0'

  return (
    <div className="flex min-h-screen flex-col bg-white font-body-md text-body-md text-ink">
      <Header variant="shop" activeNav="shop" />
      <main className="mx-auto w-full max-w-container-max flex-grow px-margin-mobile pb-section-gap md:px-margin-desktop">
        <Reveal className="flex flex-col gap-6 border-b border-hairline pb-10 pt-16 md:flex-row md:items-end md:justify-between md:pt-28">
          <div>
            <p className="mb-4 font-label-caps text-label-caps text-secondary">The collection</p>
            <h1 className="font-display-lg text-display-lg">Shop all</h1>
          </div>
          <p className="max-w-sm text-body-md text-secondary">
            Objects chosen for how they look, feel and last. Delivered across the UAE.
          </p>
        </Reveal>

        <div className="flex flex-col gap-12 pt-10 lg:flex-row lg:gap-16">
          <aside className="w-full shrink-0 lg:w-56">
            <div className="flex flex-col gap-10 lg:sticky lg:top-28">
              <fieldset>
                <legend className="mb-4 font-label-caps text-label-caps">Category</legend>
                <ul className="flex flex-wrap gap-x-6 gap-y-3 lg:flex-col">
                  {CATEGORY_FILTERS.map((cat) => (
                    <li key={cat.value}>
                      <label className="flex cursor-pointer items-center gap-3 text-label-sm text-secondary transition-colors hover:text-ink has-[:checked]:text-ink">
                        <input type="checkbox" className={checkbox} checked={selectedCategories.has(cat.value)} onChange={() => toggleCategory(cat.value)} />
                        {cat.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>
              <fieldset>
                <legend className="mb-2 font-label-caps text-label-caps">Price (AED)</legend>
                <div className="flex items-center gap-4">
                  <input className={priceInput} placeholder="Min" inputMode="numeric" aria-label="Minimum price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                  <span className="text-secondary">–</span>
                  <input className={priceInput} placeholder="Max" inputMode="numeric" aria-label="Maximum price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-4 font-label-caps text-label-caps">Availability</legend>
                <ul className="flex gap-6 lg:flex-col lg:gap-3">
                  <li>
                    <label className="flex cursor-pointer items-center gap-3 text-label-sm text-secondary transition-colors hover:text-ink has-[:checked]:text-ink">
                      <input type="checkbox" className={checkbox} checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
                      In stock
                    </label>
                  </li>
                  <li>
                    <label className="flex cursor-pointer items-center gap-3 text-label-sm text-secondary transition-colors hover:text-ink has-[:checked]:text-ink">
                      <input type="checkbox" className={checkbox} checked={preorderOnly} onChange={(e) => setPreorderOnly(e.target.checked)} />
                      Pre-order
                    </label>
                  </li>
                </ul>
              </fieldset>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-10 flex items-center justify-between">
              <span className="font-label-caps text-label-caps text-secondary" aria-live="polite">
                {loading ? 'Loading' : `${filtered.length} ${filtered.length === 1 ? 'piece' : 'pieces'}`}
              </span>
              <label className="flex items-center gap-2 font-label-caps text-label-caps text-secondary">
                Sort
                <select
                  className="cursor-pointer border-0 bg-transparent py-0 pl-0 pr-7 font-label-caps text-label-caps text-ink focus:ring-0"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="best">Best selling</option>
                  <option value="price-high">Price, high to low</option>
                  <option value="price-low">Price, low to high</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
              {loading
                ? Array.from({ length: 6 }, (_, i) => <ProductCardSkeleton key={i} />)
                : pageItems.map((product, i) => (
                    <Reveal key={product.slug} delay={(i % 3) * 0.08}>
                      <ProductCard
                        product={product}
                        eager={i < 3}
                        wishlisted={wishlist.has(product.slug)}
                        onWishlist={() => toggleWishlist(product.slug)}
                      />
                    </Reveal>
                  ))}
            </div>

            {!loading && filtered.length === 0 && (
              <p className="py-24 text-center font-serif text-headline-md text-secondary">Nothing matches those filters.</p>
            )}

            {totalPages > 1 && (
              <nav className="mt-24 flex items-center justify-center gap-8 border-t border-hairline pt-10 font-label-caps text-label-caps" aria-label="Pagination">
                <button type="button" className="link-underline text-secondary hover:text-ink disabled:pointer-events-none disabled:opacity-30" disabled={currentPage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Previous
                </button>
                <div className="flex gap-5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      aria-current={currentPage === p ? 'page' : undefined}
                      className={`link-underline tabular-nums ${currentPage === p ? 'text-ink' : 'text-secondary hover:text-ink'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button type="button" className="link-underline text-secondary hover:text-ink disabled:pointer-events-none disabled:opacity-30" disabled={currentPage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                  Next
                </button>
              </nav>
            )}
          </div>
        </div>
      </main>
      <Footer variant="shop" />
    </div>
  )
}
