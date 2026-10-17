import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { AnnouncementBar } from '../components/layout/AnnouncementBar'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { LazyImage } from '../components/LazyImage'
import { PageHero } from '../components/PageHero'
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard'
import { Reveal } from '../components/motion/Reveal'
import { useCatalog } from '../lib/useCatalog'
import { GIFTS_EDIT } from '../data/categories'

const HERO_IMAGE = '/images/hero.jpg'

function EditorialImage({ src, alt, to, ratio }: { src: string; alt: string; to: string; ratio: string }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <Link ref={ref} to={to} data-cursor="view" className={`group relative block overflow-hidden bg-backdrop ${ratio}`}>
      <motion.div className="absolute -inset-y-[8%] inset-x-0" style={{ y }}>
        {src && <LazyImage src={src} alt={alt} className="img-hover h-full w-full object-cover" />}
      </motion.div>
    </Link>
  )
}

// Alternating tiles: left column, then right column dropped down for a staggered editorial rhythm.
const TILE_POSITION = ['md:col-span-5', 'md:col-span-5 md:col-start-8 md:mt-40']

function Editorial() {
  const { loading, categories, countIn, cardFor } = useCatalog()

  return (
    <section className="mx-auto max-w-container-max px-margin-mobile py-section-gap md:px-margin-desktop">
      <div className="grid grid-cols-1 gap-y-8 md:grid-cols-12 md:gap-x-6">
        <Reveal className="md:col-span-6">
          <p className="mb-6 font-label-caps text-label-caps text-secondary">The edit</p>
          <h2 className="font-headline-lg text-headline-lg">Fewer, better things.</h2>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-4 md:col-start-8 md:self-end">
          <p className="text-body-md text-secondary">
            Every piece is chosen for its material, its craft and the quiet way it fits into a day. Nothing loud, nothing
            disposable.
          </p>
          <div className="mt-8 flex gap-8">
            <Link to="/collections" className="link-underline is-drawn text-button">
              All collections
            </Link>
            <Link to="/about" className="link-underline text-button">
              Our approach
            </Link>
          </div>
        </Reveal>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-y-16 md:mt-24 md:grid-cols-12 md:gap-x-6 md:gap-y-0">
        {loading
          ? TILE_POSITION.map((pos) => <div key={pos} className={`aspect-[4/5] animate-pulse bg-backdrop ${pos}`} aria-hidden />)
          : categories.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 2) * 0.1} className={TILE_POSITION[i % 2]}>
                <EditorialImage src={cardFor(c)} alt={c.name} to={`/collections/${c.slug}`} ratio="aspect-[4/5]" />
                <div className="mt-5 flex items-baseline justify-between gap-6">
                  <p className="font-serif text-headline-md">{c.name}</p>
                  <span className="shrink-0 font-label-caps text-label-caps tabular-nums text-secondary">
                    {countIn(c.slug)} {countIn(c.slug) === 1 ? 'piece' : 'pieces'}
                  </span>
                </div>
              </Reveal>
            ))}
      </div>
    </section>
  )
}

function SelectedPieces() {
  const { loading, products } = useCatalog()

  return (
    <section className="mx-auto max-w-container-max px-margin-mobile pb-section-gap md:px-margin-desktop">
      <Reveal className="mb-12 flex items-end justify-between gap-6 border-b border-hairline pb-6">
        <h2 className="font-headline-lg text-headline-lg">Selected pieces</h2>
        <Link to="/shop" className="link-underline shrink-0 font-label-caps text-label-caps">
          View all
        </Link>
      </Reveal>
      <div className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }, (_, i) => <ProductCardSkeleton key={i} />)
          : products.slice(0, 6).map((product, i) => (
              <Reveal key={product.slug} delay={(i % 3) * 0.08}>
                <ProductCard product={product} />
              </Reveal>
            ))}
      </div>
    </section>
  )
}

function GiftsBanner() {
  return (
    <section className="mx-auto max-w-container-max px-margin-mobile pb-section-gap md:px-margin-desktop">
      <Reveal>
        <Link to="/gifts" data-cursor="view" className="group relative block h-[70svh] min-h-[420px] overflow-hidden bg-ink">
          <LazyImage src={GIFTS_EDIT.heroImage} alt="" className="img-hover absolute inset-0 h-full w-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 p-8 text-white md:flex-row md:items-end md:justify-between md:p-14">
            <div>
              <p className="mb-4 font-label-caps text-label-caps text-white/80">The edit</p>
              <p className="font-display-lg text-display-lg">{GIFTS_EDIT.name.replace('The ', '')}</p>
            </div>
            <span className="inline-flex items-center gap-2 text-button">
              <span className="link-underline is-drawn">{GIFTS_EDIT.tagline}</span>
              <ArrowRight strokeWidth={1.25} className="h-4 w-4 transition-transform duration-500 ease-editorial group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </Reveal>
    </section>
  )
}

function Promise() {
  return (
    <section className="border-t border-hairline">
      <Reveal className="mx-auto max-w-4xl px-margin-mobile py-section-gap text-center md:px-margin-desktop">
        <p className="mb-8 font-label-caps text-label-caps text-secondary">The LuxeLife promise</p>
        <p className="font-display-lg text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.1]">
          Your everyday deserves <em className="italic text-accent">better</em> choices.
        </p>
      </Reveal>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="overflow-x-clip bg-white font-body-md text-ink">
      <title>LuxeLife | Curated lifestyle objects, delivered across the UAE</title>
      <meta
        name="description"
        content="Thoughtfully selected fashion, beauty, home and jewellery pieces. Complimentary delivery across the UAE."
      />
      <AnnouncementBar />
      <Header variant="home" activeNav="home" />
      <main>
        <PageHero
          image={HERO_IMAGE}
          lines={['Curated for', 'the way you live.']}
          aside={
            <>
              <p className="text-body-md text-white/85">
                Thoughtfully selected objects for the home, the wardrobe and the everyday.
              </p>
              <Link to="/shop" className="link-underline is-drawn w-fit text-button">
                Shop the collection
              </Link>
            </>
          }
        />
        <Editorial />
        <SelectedPieces />
        <GiftsBanner />
        <Promise />
      </main>
      <Footer variant="home" />
    </div>
  )
}
