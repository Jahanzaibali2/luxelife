import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard'
import { Reveal } from '../components/motion/Reveal'
import { matchesQuery } from '../lib/search'
import { useCatalog } from '../lib/useCatalog'

type SortOption = 'featured' | 'newest' | 'price-high' | 'price-low'
const SORTS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-high', label: 'Price, high to low' },
  { value: 'price-low', label: 'Price, low to high' },
]

const PAGE_SIZE = 9

export default function ShopAllPage() {
  const { loading, products, categories, countIn, nameOf } = useCatalog()
  // All filter state lives in the URL, so nav links, back/forward and shared links stay in sync.
  const [params, setParams] = useSearchParams()
  const selected = useMemo(() => new Set((params.get('category') ?? '').split(',').filter(Boolean)), [params])
  const minPrice = params.get('min') ?? ''
  const maxPrice = params.get('max') ?? ''
  const inStockOnly = params.get('stock') === '1'
  const preorderOnly = params.get('preorder') === '1'
  const sort = (params.get('sort') as SortOption) || 'featured'
  const q = params.get('q') ?? ''
  const page = Math.max(1, Number(params.get('page')) || 1)

  const update = (changes: Record<string, string | null>, replace = false) => {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    if (!('page' in changes)) next.delete('page')
    setParams(next, { replace })
  }

  const toggleCategory = (slug: string) => {
    const next = new Set(selected)
    if (next.has(slug)) next.delete(slug)
    else next.add(slug)
    update({ category: [...next].join(',') || null })
  }

  const filtered = useMemo(() => {
    let list = [...products]
    if (selected.size > 0) list = list.filter((p) => selected.has(p.category))
    if (q) list = list.filter((p) => matchesQuery(p, q, nameOf(p.category)))
    const min = minPrice ? Number(minPrice) : null
    const max = maxPrice ? Number(maxPrice) : null
    if (min !== null && !Number.isNaN(min)) list = list.filter((p) => p.price >= min)
    if (max !== null && !Number.isNaN(max)) list = list.filter((p) => p.price <= max)
    if (inStockOnly) list = list.filter((p) => p.inStock)
    if (preorderOnly) list = list.filter((p) => p.preorder)
    if (sort === 'price-high') list.sort((a, b) => b.price - a.price)
    if (sort === 'price-low') list.sort((a, b) => a.price - b.price)
    if (sort === 'newest') list.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    return list
  }, [products, selected, q, minPrice, maxPrice, inStockOnly, preorderOnly, sort, nameOf])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const hasFilters = selected.size > 0 || q || minPrice || maxPrice || inStockOnly || preorderOnly

  const checkbox = 'h-3.5 w-3.5 rounded-none border-ink/30 text-ink focus:ring-0 focus:ring-offset-0'
  const priceInput = 'w-full border-0 border-b border-hairline bg-transparent px-0 py-2 text-label-sm focus:border-ink focus:ring-0'
  const filterLabel = 'flex cursor-pointer items-center gap-3 text-label-sm text-secondary transition-colors hover:text-ink has-[:checked]:text-ink'
  const title = q ? `Results for “${q}”` : selected.size === 1 ? nameOf([...selected][0]) : 'Shop all'

  return (
    <div className="flex min-h-screen flex-col bg-white font-body-md text-body-md text-ink">
      <title>{`${title} | LuxeLife`}</title>
      <meta name="description" content="Browse every LuxeLife piece: fashion, beauty, home and jewellery. Complimentary UAE delivery." />
      <Header variant="shop" activeNav="shop" />
      <main className="mx-auto w-full max-w-container-max flex-grow px-margin-mobile pb-section-gap md:px-margin-desktop">
        <Reveal className="flex flex-col gap-6 border-b border-hairline pb-10 pt-16 md:flex-row md:items-end md:justify-between md:pt-28">
          <div>
            <p className="mb-4 font-label-caps text-label-caps text-secondary">{q ? 'Search' : 'The collection'}</p>
            <h1 className="font-display-lg text-display-lg">{title}</h1>
          </div>
          <p className="max-w-sm text-body-md text-secondary">
            Objects chosen for how they look, feel and last.{' '}
            <Link to="/collections" className="link-underline text-ink">
              Browse by collection
            </Link>
          </p>
        </Reveal>

        <div className="flex flex-col gap-12 pt-10 lg:flex-row lg:gap-16">
          <aside className="w-full shrink-0 lg:w-56">
            <div className="flex flex-col gap-10 lg:sticky lg:top-28">
              <fieldset>
                <legend className="mb-4 font-label-caps text-label-caps">Category</legend>
                <ul className="flex flex-wrap gap-x-6 gap-y-3 lg:flex-col">
                  {categories.map((cat) => (
                    <li key={cat.slug}>
                      <label className={filterLabel}>
                        <input type="checkbox" className={checkbox} checked={selected.has(cat.slug)} onChange={() => toggleCategory(cat.slug)} />
                        {cat.name}
                        <span className="tabular-nums text-secondary/70">{countIn(cat.slug)}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>
              <fieldset>
                <legend className="mb-2 font-label-caps text-label-caps">Price (AED)</legend>
                <div className="flex items-center gap-4">
                  <input className={priceInput} placeholder="Min" inputMode="numeric" aria-label="Minimum price" value={minPrice} onChange={(e) => update({ min: e.target.value }, true)} />
                  <span className="text-secondary">–</span>
                  <input className={priceInput} placeholder="Max" inputMode="numeric" aria-label="Maximum price" value={maxPrice} onChange={(e) => update({ max: e.target.value }, true)} />
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-4 font-label-caps text-label-caps">Availability</legend>
                <ul className="flex gap-6 lg:flex-col lg:gap-3">
                  <li>
                    <label className={filterLabel}>
                      <input type="checkbox" className={checkbox} checked={inStockOnly} onChange={(e) => update({ stock: e.target.checked ? '1' : null })} />
                      In stock
                    </label>
                  </li>
                  <li>
                    <label className={filterLabel}>
                      <input type="checkbox" className={checkbox} checked={preorderOnly} onChange={(e) => update({ preorder: e.target.checked ? '1' : null })} />
                      Pre-order
                    </label>
                  </li>
                </ul>
              </fieldset>
              {hasFilters && (
                <button type="button" onClick={() => setParams({})} className="flex w-fit items-center gap-2 text-label-sm text-secondary transition-colors hover:text-ink">
                  <X strokeWidth={1.25} className="h-4 w-4" />
                  Clear all
                </button>
              )}
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-label-caps text-label-caps text-secondary" aria-live="polite">
                  {loading ? 'Loading' : `${filtered.length} ${filtered.length === 1 ? 'piece' : 'pieces'}`}
                </span>
                {q && (
                  <button type="button" onClick={() => update({ q: null })} className="flex items-center gap-1.5 border border-hairline px-3 py-1 text-label-sm transition-colors hover:border-ink">
                    “{q}” <X strokeWidth={1.25} className="h-3.5 w-3.5" aria-label="Clear search" />
                  </button>
                )}
              </div>
              <label className="flex items-center gap-2 font-label-caps text-label-caps text-secondary">
                Sort
                <select
                  className="cursor-pointer border-0 bg-transparent py-0 pl-0 pr-7 font-label-caps text-label-caps text-ink focus:ring-0"
                  value={sort}
                  onChange={(e) => update({ sort: e.target.value === 'featured' ? null : e.target.value })}
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
              {loading
                ? Array.from({ length: 6 }, (_, i) => <ProductCardSkeleton key={i} />)
                : pageItems.map((product, i) => (
                    <Reveal key={product.slug} delay={(i % 3) * 0.08}>
                      <ProductCard product={product} eager={i < 3} />
                    </Reveal>
                  ))}
            </div>

            {!loading && filtered.length === 0 && (
              <div className="flex flex-col items-center gap-6 py-24 text-center">
                <p className="font-serif text-headline-md text-secondary">Nothing matches those filters.</p>
                <button type="button" onClick={() => setParams({})} className="link-underline is-drawn text-button">
                  Clear filters
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <nav className="mt-24 flex items-center justify-center gap-8 border-t border-hairline pt-10 font-label-caps text-label-caps" aria-label="Pagination">
                <button type="button" className="link-underline text-secondary hover:text-ink disabled:pointer-events-none disabled:opacity-30" disabled={currentPage === 1} onClick={() => update({ page: String(currentPage - 1) })}>
                  Previous
                </button>
                <div className="flex gap-5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => update({ page: p === 1 ? null : String(p) })}
                      aria-current={currentPage === p ? 'page' : undefined}
                      className={`link-underline tabular-nums ${currentPage === p ? 'text-ink' : 'text-secondary hover:text-ink'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button type="button" className="link-underline text-secondary hover:text-ink disabled:pointer-events-none disabled:opacity-30" disabled={currentPage === totalPages} onClick={() => update({ page: String(currentPage + 1) })}>
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
