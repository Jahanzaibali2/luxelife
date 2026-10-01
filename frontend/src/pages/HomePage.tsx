import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'
import { AnnouncementBar } from '../components/layout/AnnouncementBar'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { LazyImage } from '../components/LazyImage'
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard'
import { Reveal } from '../components/motion/Reveal'
import { EASE_EDITORIAL } from '../components/motion/ease'
import { api } from '../lib/api'
import { PRODUCTS as FALLBACK_PRODUCTS } from '../data/products'
import type { Product } from '../types/api'

const HERO_IMAGE = '/images/hero.jpg'

const IMG = {
  fashion:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDuLcu-YoGMpPa-kPAlcK3vcKFCJZTKVfg1EqvcR2B_6Lo_hUiXftBZIjCR7iYvZimqtx_JqSu98y9JtN2ajHUPVz1rmG0M2LMtyJK_Bz2p3OzOijL77qOMfwOp0D8QAZBgLA-CRQcqpapqCj4ZlJsMwjV3-iaAOz9uL54z_eRxV7tjf8-1ZNTIonBcVo_VV33G6IzvG_cSDJnfc5pjt6hCcO0_cLWWEyhwk0AdLAcaeFADBmYlV6QdHQ',
  home: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbl1As4q9r7ZAhle_SbZyNgOa-ylZ9KQVuOHKltEShprjpY63G3MGb4gm8xecfp-jM9iC7Wy_FhDI_TShvGVM-lmOO1iX33VXGPG8-oSy47UA7wmHSq-ekzITiGzV7dfHE1aV2ZIUNV5Jsy043ATPQzYEchaFw-uuXk8O8rohRg3FsH2waacEIogeNhwJoeZhKu9Y6aDPg6vsv5TAx1pT1a9EiESwK5NHzXrBg_Xz0DuRbJBFM3UtGHA',
  gadgets:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDkQNHzabu2onH-OgL5lYjXoSlQF330ufKOB982WG3pmxWoytH1U1PLtr47yG3-AIr-UP657DCZPvc5cTPG9y4NkdOvwe4KmaLwf-nDFiemHOvetksZsrXXhFp9gAevEMPolISmApFymo4p5z4sQb4ZKR3K_c5vHxk9mAD-QkkI38rEQdN53lQlTub5g2xB3k0PoU7iOsgIjC2EOvidFuVhbW40GJX_iWzSEPAxaDlt7fEaJpmo2v3NiQ',
  gifts:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBUJe3tMcp9Wtpd6uVACkOs9mM1ZDq-zhfbMod4RCHzY-KTsfkHBlyRZVKxDpqAQuc2ZpbLcbW0yTpzINF4_rHap4hv5lDcHuLlaAll1C-4mJY8khjnHLxxhQJ0jrwMPeEO8etqzvUb0NwgHzGhJcE64mgfW3XpEQRqrRmv5rEikic_saeL62n5CuKIFiNuSh0wDxowKpaF3Fp-jJ27dVuLQM3vhQGN8rZuYu_7nH7oCXzVa8Ofu79c1Q',
}

const HERO_LINES = ['Curated for', 'the way you live.']

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} className="relative -mt-16 h-[100svh] min-h-[560px] overflow-hidden bg-ink md:-mt-20">
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <motion.div
          className="h-full w-full"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: EASE_EDITORIAL }}
        >
          <LazyImage eager src={HERO_IMAGE} alt="" width={1600} height={1412} className="h-full w-full object-cover object-[50%_60%]" />
        </motion.div>
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/35 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute inset-x-0 bottom-0 mx-auto flex max-w-container-max flex-col gap-8 px-margin-mobile pb-14 text-white md:flex-row md:items-end md:justify-between md:px-margin-desktop md:pb-20"
      >
        <h1 className="font-display-lg text-display-lg">
          {HERO_LINES.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block"
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, ease: EASE_EDITORIAL, delay: 0.35 + i * 0.12 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div
          className="flex max-w-xs flex-col gap-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_EDITORIAL, delay: 0.8 }}
        >
          <p className="text-body-md text-white/85">
            Thoughtfully selected objects for the home, the wardrobe and the everyday.
          </p>
          <Link to="/shop" className="link-underline is-drawn w-fit text-button">
            Shop the collection
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}

function EditorialImage({
  src,
  alt,
  to,
  className,
  ratio,
}: {
  src: string
  alt: string
  to: string
  className?: string
  ratio: string
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <Link ref={ref} to={to} data-cursor="view" className={`group relative block overflow-hidden bg-backdrop ${ratio} ${className ?? ''}`}>
      <motion.div className="absolute -inset-y-[8%] inset-x-0" style={{ y }}>
        <LazyImage src={src} alt={alt} className="img-hover h-full w-full object-cover" />
      </motion.div>
    </Link>
  )
}

function Editorial() {
  return (
    <section className="mx-auto max-w-container-max px-margin-mobile py-section-gap md:px-margin-desktop">
      <div className="grid grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-6">
        <Reveal className="md:col-span-7">
          <EditorialImage src={IMG.home} alt="Home and lifestyle objects" to="/shop?category=home-lifestyle" ratio="aspect-[4/5]" />
          <div className="mt-5 flex items-baseline justify-between gap-6">
            <p className="font-serif text-headline-md">Home &amp; lifestyle</p>
            <Link to="/shop?category=home-lifestyle" className="link-underline font-label-caps text-label-caps">
              Explore
            </Link>
          </div>
        </Reveal>

        <div className="flex flex-col justify-between gap-16 md:col-span-4 md:col-start-9 md:pt-48">
          <Reveal delay={0.1}>
            <p className="mb-6 font-label-caps text-label-caps text-secondary">The edit</p>
            <h2 className="font-headline-lg text-headline-lg">Fewer, better things.</h2>
            <p className="mt-6 text-body-md text-secondary">
              Every piece is chosen for its material, its craft and the quiet way it fits into a day. Nothing loud, nothing
              disposable.
            </p>
            <Link to="/about" className="link-underline is-drawn mt-8 inline-block text-button">
              Our approach
            </Link>
          </Reveal>
          <Reveal delay={0.15}>
            <EditorialImage src={IMG.fashion} alt="Fashion accessories" to="/shop?category=fashion" ratio="aspect-[3/4]" />
            <div className="mt-5 flex items-baseline justify-between gap-6">
              <p className="font-serif text-headline-md">Fashion</p>
              <Link to="/shop?category=fashion" className="link-underline font-label-caps text-label-caps">
                Explore
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function SelectedPieces() {
  const [products, setProducts] = useState<Product[] | null>(null)

  useEffect(() => {
    api
      .getProducts()
      .then((all) => setProducts(all.slice(0, 6)))
      .catch(() => setProducts((FALLBACK_PRODUCTS as Product[]).slice(0, 6)))
  }, [])

  return (
    <section className="mx-auto max-w-container-max px-margin-mobile pb-section-gap md:px-margin-desktop">
      <Reveal className="mb-12 flex items-end justify-between gap-6 border-b border-hairline pb-6">
        <h2 className="font-headline-lg text-headline-lg">Selected pieces</h2>
        <Link to="/shop" className="link-underline shrink-0 font-label-caps text-label-caps">
          View all
        </Link>
      </Reveal>
      <div className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {products === null
          ? Array.from({ length: 3 }, (_, i) => <ProductCardSkeleton key={i} />)
          : products.map((product, i) => (
              <Reveal key={product.slug} delay={(i % 3) * 0.08}>
                <ProductCard product={product} />
              </Reveal>
            ))}
      </div>
    </section>
  )
}

function CategoryPair() {
  const items = [
    { label: 'Gadgets', to: '/shop?category=gadgets', src: IMG.gadgets },
    { label: 'Gifts', to: '/shop?category=gifts', src: IMG.gifts },
  ]
  return (
    <section className="mx-auto grid max-w-container-max grid-cols-1 gap-6 px-margin-mobile pb-section-gap sm:grid-cols-2 md:px-margin-desktop">
      {items.map((item, i) => (
        <Reveal key={item.label} delay={i * 0.1} className={i === 1 ? 'sm:mt-32' : ''}>
          <EditorialImage src={item.src} alt={item.label} to={item.to} ratio="aspect-[4/5]" />
          <div className="mt-5 flex items-baseline justify-between">
            <p className="font-serif text-headline-md">{item.label}</p>
            <Link to={item.to} className="link-underline font-label-caps text-label-caps">
              Explore
            </Link>
          </div>
        </Reveal>
      ))}
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
      <AnnouncementBar />
      <Header variant="home" activeNav="home" />
      <main>
        <Hero />
        <Editorial />
        <SelectedPieces />
        <CategoryPair />
        <Promise />
      </main>
      <Footer variant="home" />
    </div>
  )
}
