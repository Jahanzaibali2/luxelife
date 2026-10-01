import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { CategoryCard } from '../components/CategoryCard'
import { Reveal } from '../components/motion/Reveal'
import { useCatalog } from '../lib/useCatalog'
import { GIFTS_EDIT } from '../data/categories'

// Alternating rhythm: large card, then a smaller offset one.
const LAYOUT = [
  'md:col-span-7',
  'md:col-span-4 md:col-start-9 md:mt-40',
  'md:col-span-5 md:col-start-2',
  'md:col-span-6 md:col-start-7 md:mt-24',
]

export default function CollectionsPage() {
  const { loading, categories, countIn, heroFor } = useCatalog()

  return (
    <div className="flex min-h-screen flex-col bg-white font-body-md text-ink">
      <title>Collections | LuxeLife</title>
      <meta name="description" content="Browse LuxeLife by collection: fashion, beauty, home & living, jewellery & watches and the gifts edit." />
      <Header variant="shop" activeNav="shop" />
      <main className="mx-auto w-full max-w-container-max flex-grow px-margin-mobile pb-section-gap md:px-margin-desktop">
        <Reveal className="flex flex-col gap-6 border-b border-hairline pb-10 pt-16 md:flex-row md:items-end md:justify-between md:pt-28">
          <div>
            <p className="mb-4 font-label-caps text-label-caps text-secondary">Browse by</p>
            <h1 className="font-display-lg text-display-lg">Collections</h1>
          </div>
          <p className="max-w-sm text-body-md text-secondary">
            Each collection is edited down to the pieces we would choose for ourselves.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-y-20 pt-16 md:grid-cols-12 md:gap-x-6">
          {loading
            ? Array.from({ length: 2 }, (_, i) => <div key={i} className={`aspect-[4/5] animate-pulse bg-backdrop ${LAYOUT[i]}`} />)
            : [...categories.map((c) => ({ c, image: heroFor(c), count: countIn(c.slug), to: undefined as string | undefined })),
                { c: { slug: 'gifts', name: GIFTS_EDIT.name, tagline: GIFTS_EDIT.tagline }, image: GIFTS_EDIT.heroImage, count: undefined, to: '/gifts' },
              ].map(({ c, image, count, to }, i) => (
                <Reveal key={c.slug} delay={(i % 2) * 0.1} className={LAYOUT[i % LAYOUT.length]}>
                  <CategoryCard category={c} image={image} count={count} to={to} ratio={i % 2 ? 'aspect-[3/4]' : 'aspect-[4/5]'} />
                </Reveal>
              ))}
        </div>
      </main>
      <Footer variant="shop" />
    </div>
  )
}
