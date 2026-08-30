import { Link } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'

export default function AboutPage() {
  return (
    <div className="text-on-surface font-body-md min-h-screen flex flex-col bg-warm-ivory">
      <Header variant="about" />
      <main className="flex-grow">
        <section className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-section-gap flex flex-col items-center text-center">
          <span className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.2em] uppercase mb-6">About Us</span>
          <h1 className="font-display-lg text-display-lg text-primary max-w-4xl mb-8">Elevating Everyday Living</h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-2xl">
            Welcome to LuxeLife — a modern lifestyle destination curated for the discerning individual. We believe that everyday moments deserve exceptional design and uncompromising quality.
          </p>
        </section>

        <section className="w-full px-margin-mobile md:px-margin-desktop pb-section-gap">
          <div className="w-full max-w-container-max mx-auto h-[60vh] md:h-[80vh] relative overflow-hidden bg-surface-container rounded">
            <img className="w-full h-full object-cover" alt="Brand story" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlYkX0IYDE2eIMroREgz3pG2NYEuyAiggxb0aXaO73j5S1AwJe1L9Bipudj6Li-V2Ubo9CsR4YkvUNHu75yebe2ZJXhuOOp7l-skZT3qt7vp-LyH7e5XJ_zvp026lOVzV0Tf6LmyDmflfLlmMXuOPKrNCvNSKKCcioQZbe3cEeUNg5677a9lO4WVq8-qLT_2FOsgMM9PUHHCzJkn_25cG_plyFVBfi_oLrB8t1LUYjozev5v5p8CM5Fg" />
          </div>
        </section>

        <section className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="col-span-1 md:col-span-5 flex flex-col justify-center pr-0 md:pr-12 mb-12 md:mb-0">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-6">Curated for Your Lifestyle</h2>
              <p className="font-body-md text-body-md text-secondary leading-relaxed">
                Our collections are thoughtfully assembled to seamlessly integrate into a modern, sophisticated life. We reject the clutter of endless choices in favor of a curated selection where every item holds purpose and beauty. We source from artisans and designers who share our commitment to craftsmanship and timeless aesthetic.
              </p>
            </div>
            <div className="col-span-1 md:col-span-7 h-96 md:h-auto bg-surface-container rounded overflow-hidden relative">
              <img className="w-full h-full object-cover absolute inset-0" alt="Philosophy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe1Fr41wSYwUqW8w7wEbebBc8y-EdJMn6DExiIvE4QkZXin_8eprnKRvkHjkgiMmXFEa78GpzSVx1cvmFmDEy-SIZZ0ePkZ3MMYFYLvFavYqEzf0eQwHbHDV9fvnnmiMhBzX4tuWlyV7qwSWbFOhqxdiy7yiskoARzJgjO_JykSzjI3e74mSL2XjZxVf4H0tguVzg1_Qod9usizoKyGmkeUApn3QUgZXQlKVBHWHG6NjegqtyCam4tKw" />
            </div>
          </div>
        </section>

        <section className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="col-span-1 md:col-span-6 h-96 md:h-[600px] bg-surface-container rounded overflow-hidden relative order-2 md:order-1 mt-12 md:mt-0">
              <img className="w-full h-full object-cover absolute inset-0" alt="Quality" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCV25bWzMw8aGMxX0tld1p1k4gBPESI1Ptx-l2OiBcmfi_R4pVpxUAV1NruMycedhb9svSHbAVQ8sI0NO9fVQ3DRagxKyOnrSVq_TjjOFqO-0ANFElTZoMHuH-ptE0M1IorQa9EntrZJkDhRrIrcdKTgzPkokFPFEaFy_UXR_DxWuteBy4RWTDhZILrJHtCDfueF_Ofg9lby7hCrLhJnrJD7dvVJ-UPa4MegQTaA_jchwzT5nJWshurbg" />
            </div>
            <div className="col-span-1 md:col-span-5 md:col-start-8 flex flex-col justify-center order-1 md:order-2">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-6">Quality & Value</h2>
              <p className="font-body-md text-body-md text-secondary leading-relaxed mb-8">
                We believe that true value lies in longevity. Our rigorous selection process ensures that every piece meets the highest standards of durability and design. By partnering directly with creators and focusing on essential materials, we bring you uncompromised quality that enriches your daily routines without unnecessary markups.
              </p>
              <Link to="/shop" className="inline-flex items-center gap-2 font-label-caps text-label-caps text-primary border-b border-primary pb-1 w-fit hover:text-surface-tint hover:border-surface-tint transition-colors">
                Explore Our Collections <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full bg-surface py-section-gap px-margin-mobile md:px-margin-desktop border-t border-outline-variant/15">
          <div className="max-w-4xl mx-auto text-center">
            <span className="material-symbols-outlined text-4xl text-on-tertiary-container mb-6 block">format_quote</span>
            <h3 className="font-headline-lg text-headline-lg md:text-display-lg font-display-lg text-primary leading-tight">
              &quot;Your lifestyle deserves better choices.&quot;
            </h3>
            <p className="font-label-caps text-label-caps text-secondary mt-8 tracking-[0.1em] uppercase">The LuxeLife Vision</p>
          </div>
        </section>
      </main>
      <Footer variant="about" />
    </div>
  )
}
