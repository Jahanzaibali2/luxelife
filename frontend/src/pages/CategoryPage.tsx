import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { CategoryCard } from '../components/CategoryCard'
import { PageHero } from '../components/PageHero'
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard'
import { Reveal } from '../components/motion/Reveal'
import { useCatalog } from '../lib/useCatalog'
import { GIFTS_EDIT } from '../data/categories'

type Sort = 'featured' | 'price-low' | 'price-high'

/** Landing page for one category (/collections/:slug), or the curated Gifts edit (/gifts). */
export default function CategoryPage({ edit }: { edit?: 'gifts' }) {
  const { slug = '' } = useParams<{ slug: string }>()
  const { loading, products, categories, countIn, heroFor } = useCatalog()
  const [sort, setSort] = useState<Sort>('featured')

  const category = edit ? null : categories.find((c) => c.slug === slug)
  const page = edit
    ? { name: GIFTS_EDIT.name, tagline: GIFTS_EDIT.tagline, intro: GIFTS_EDIT.intro, hero: GIFTS_EDIT.heroImage, eyebrow: 'The edit' }
    : category
      ? { name: category.name, tagline: category.tagline, intro: category.intro, hero: heroFor(category), eyebrow: 'Collection' }
      : null

  const items = useMemo(() => {
    const list = products.filter((p) => (edit ? p.isGift : p.category === slug))
    if (sort === 'price-low') list.sort((a, b) => a.price - b.price)
    if (sort === 'price-high') list.sort((a, b) => b.price - a.price)
    return list
  }, [products, edit, slug, sort])

  const others = categories.filter((c) => c.slug !== slug).slice(0, 4)

  if (!loading && !page) {
    return (
      <div className="flex min-h-screen flex-col bg-white text-ink">
        <title>Collection not found | LuxeLife</title>
        <Header variant="shop" activeNav="shop" />
        <main className="mx-auto flex w-full max-w-container-max flex-grow flex-col items-center justify-center gap-6 px-margin-mobile py-section-gap text-center">
          <p className="font-label-caps text-label-caps text-secondary">Collection</p>
          <h1 className="font-display-lg text-display-lg">Coming soon.</h1>
          <p className="max-w-sm text-body-md text-secondary">This collection is being curated. Explore what is ready now.</p>
          <Link to="/collections" className="link-underline is-drawn text-button">
            All collections
          </Link>
        </main>
        <Footer variant="shop" />
      </div>
    )
  }

  return (
    <div className="overflow-x-clip bg-white font-body-md text-ink">
      {page && (
        <>
          <title>{`${page.name} | LuxeLife`}</title>
          <meta name="description" content={`${page.tagline} ${page.intro}`.trim()} />
        </>
      )}
      <Header variant="home" activeNav="shop" />
      <main>
        {page ? (
          <PageHero
            size="tall"
            image={page.hero}
            eyebrow={page.eyebrow}
            lines={[page.name]}
            aside={<p className="text-body-md text-white/85">{page.tagline}</p>}
          />
        ) : (
          <div className="-mt-16 h-[78svh] animate-pulse bg-backdrop md:-mt-20" />
        )}

        <section className="mx-auto max-w-container-max px-margin-mobile py-section-gap md:px-margin-desktop">
          <Reveal className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-12">
            <Link to="/collections" className="flex w-fit items-center gap-2 self-start font-label-caps text-label-caps text-secondary transition-colors hover:text-ink md:col-span-3">
              <ArrowLeft strokeWidth={1.25} className="h-4 w-4" />
              All collections
            </Link>
            <p className="font-serif text-[clamp(1.5rem,2.4vw,2.25rem)] leading-snug md:col-span-7 md:col-start-5">{page?.intro}</p>
          </Reveal>

          <div className="mb-10 flex items-center justify-between border-b border-hairline pb-4">
            <span className="font-label-caps text-label-caps text-secondary" aria-live="polite">
              {loading ? 'Loading' : `${items.length} ${items.length === 1 ? 'piece' : 'pieces'}`}
            </span>
            <label className="flex items-center gap-2 font-label-caps text-label-caps text-secondary">
              Sort
              <select
                className="cursor-pointer border-0 bg-transparent py-0 pl-0 pr-7 font-label-caps text-label-caps text-ink focus:ring-0"
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price, low to high</option>
                <option value="price-high">Price, high to low</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }, (_, i) => <ProductCardSkeleton key={i} />)
              : items.map((product, i) => (
                  <Reveal key={product.slug} delay={(i % 3) * 0.08}>
                    <ProductCard product={product} eager={i < 3} />
                  </Reveal>
                ))}
          </div>

          {!loading && items.length === 0 && (
            <div className="flex flex-col items-center gap-6 py-24 text-center">
              <p className="font-serif text-headline-md text-secondary">
                {edit ? 'The gift edit is being curated.' : 'New pieces are on their way.'}
              </p>
              <Link to="/shop" className="link-underline is-drawn text-button">
                Shop all pieces
              </Link>
            </div>
          )}
        </section>

        {others.length > 0 && (
          <section className="border-t border-hairline">
            <div className="mx-auto max-w-container-max px-margin-mobile py-section-gap md:px-margin-desktop">
              <Reveal className="mb-12 flex items-end justify-between gap-6">
                <h2 className="font-headline-lg text-headline-lg">Explore other collections</h2>
                <Link to="/collections" className="link-underline shrink-0 font-label-caps text-label-caps">
                  View all
                </Link>
              </Reveal>
              <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
                {others.map((c, i) => (
                  <Reveal key={c.slug} delay={i * 0.08}>
                    <CategoryCard category={c} image={heroFor(c)} count={countIn(c.slug)} size="sm" />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer variant="shop" />
    </div>
  )
}
