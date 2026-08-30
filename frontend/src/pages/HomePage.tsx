import { Link } from 'react-router-dom'
import { AnnouncementBar } from '../components/layout/AnnouncementBar'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { LazyImage } from '../components/LazyImage'

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDgx4Mri5N_R93WxcqCXgfLH5ayORSijguos1wVJD0FwmvRzqW2kNyV-CtV3M4c_HL8HLflEE0LHfXeUXPQwTFvT2DheoSXMuUI8QvKPgjnN5GcBUnFQISSv7eRgQM4wxSABI2R7ULMwqtfA3NVYIIepFx1d5WygxrBnVbuR9U2loqCw0b-oHsE4PycvLonpsnn_2mxK8cl6E798RA1vuswbuV0aOw1-E7iDav-Hd19BqcBZbCyWFZ5lw'

export default function HomePage() {
  return (
    <div className="bg-background text-on-surface antialiased font-body-md overflow-x-hidden">
      <AnnouncementBar />
      <Header variant="home" activeNav="home" />
      <main>
        <section className="bg-warm-ivory py-section-gap px-margin-mobile md:px-margin-desktop relative overflow-hidden">
          <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center gap-gutter relative z-10">
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary max-w-2xl">
                Curated for the Way You Live.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
                Discover thoughtfully selected products designed to add style, convenience and character to everyday life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link to="/shop" className="bg-primary text-on-primary font-label-caps text-label-caps px-8 py-4 rounded hover:opacity-90 transition-opacity text-center">
                  Shop Collection
                </Link>
                <Link to="/shop" className="minimal-border text-primary font-label-caps text-label-caps px-8 py-4 rounded hover:bg-surface-variant transition-colors text-center">
                  Explore Categories
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 mt-12 md:mt-0 relative aspect-square image-zoom-hover overflow-hidden rounded minimal-border">
              <LazyImage eager className="object-cover w-full h-full absolute inset-0" alt="Lifestyle hero" src={HERO_IMAGE} />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-soft-blush opacity-20 blur-3xl transform translate-x-1/2 -translate-y-1/4 rounded-full pointer-events-none" />
        </section>

        <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-4">Curated for Your Lifestyle</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Explore our thoughtfully categorized collections.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter auto-rows-[250px]">
            <Link to="/shop?category=fashion" className="md:col-span-2 md:row-span-2 relative group overflow-hidden minimal-border rounded image-zoom-hover block">
              <LazyImage
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Fashion accessories"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuLcu-YoGMpPa-kPAlcK3vcKFCJZTKVfg1EqvcR2B_6Lo_hUiXftBZIjCR7iYvZimqtx_JqSu98y9JtN2ajHUPVz1rmG0M2LMtyJK_Bz2p3OzOijL77qOMfwOp0D8QAZBgLA-CRQcqpapqCj4ZlJsMwjV3-iaAOz9uL54z_eRxV7tjf8-1ZNTIonBcVo_VV33G6IzvG_cSDJnfc5pjt6hCcO0_cLWWEyhwk0AdLAcaeFADBmYlV6QdHQ"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-6 left-6 text-on-primary">
                <h3 className="font-headline-md text-headline-md mb-2">Fashion Accessories</h3>
                <span className="font-label-caps text-label-caps flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
            </Link>
            <Link to="/shop?category=home-lifestyle" className="md:col-span-2 relative group overflow-hidden minimal-border rounded image-zoom-hover block bg-warm-ivory">
              <div className="absolute inset-0 p-6 flex flex-col justify-center items-start z-10 w-1/2">
                <h3 className="font-headline-md text-headline-md text-primary mb-2">Home & Lifestyle</h3>
                <span className="font-label-caps text-label-caps text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                  Shop Now <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
              <div className="absolute right-0 top-0 w-1/2 h-full">
                <LazyImage className="object-cover w-full h-full" alt="Home decor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbl1As4q9r7ZAhle_SbZyNgOa-ylZ9KQVuOHKltEShprjpY63G3MGb4gm8xecfp-jM9iC7Wy_FhDI_TShvGVM-lmOO1iX33VXGPG8-oSy47UA7wmHSq-ekzITiGzV7dfHE1aV2ZIUNV5Jsy043ATPQzYEchaFw-uuXk8O8rohRg3FsH2waacEIogeNhwJoeZhKu9Y6aDPg6vsv5TAx1pT1a9EiESwK5NHzXrBg_Xz0DuRbJBFM3UtGHA" />
              </div>
            </Link>
            <Link to="/shop?category=gadgets" className="relative group overflow-hidden minimal-border rounded image-zoom-hover block">
              <LazyImage
                className="absolute inset-0 w-full h-full object-cover"
                alt="Gadgets"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkQNHzabu2onH-OgL5lYjXoSlQF330ufKOB982WG3pmxWoytH1U1PLtr47yG3-AIr-UP657DCZPvc5cTPG9y4NkdOvwe4KmaLwf-nDFiemHOvetksZsrXXhFp9gAevEMPolISmApFymo4p5z4sQb4ZKR3K_c5vHxk9mAD-QkkI38rEQdN53lQlTub5g2xB3k0PoU7iOsgIjC2EOvidFuVhbW40GJX_iWzSEPAxaDlt7fEaJpmo2v3NiQ"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-4 left-4 text-on-primary">
                <h3 className="font-headline-md text-[20px] font-medium mb-1">Gadgets</h3>
              </div>
            </Link>
            <Link to="/shop?category=gifts" className="relative group overflow-hidden minimal-border rounded image-zoom-hover block bg-surface-container">
              <LazyImage
                className="absolute inset-0 w-full h-full object-cover"
                alt="Gifts"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUJe3tMcp9Wtpd6uVACkOs9mM1ZDq-zhfbMod4RCHzY-KTsfkHBlyRZVKxDpqAQuc2ZpbLcbW0yTpzINF4_rHap4hv5lDcHuLlaAll1C-4mJY8khjnHLxxhQJ0jrwMPeEO8etqzvUb0NwgHzGhJcE64mgfW3XpEQRqrRmv5rEikic_saeL62n5CuKIFiNuSh0wDxowKpaF3Fp-jJ27dVuLQM3vhQGN8rZuYu_7nH7oCXzVa8Ofu79c1Q"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-on-primary">
                <h3 className="font-headline-md text-[20px] font-medium mb-1">Gifts</h3>
              </div>
            </Link>
          </div>
        </section>

        <section className="bg-primary-container text-on-primary py-32 px-margin-mobile md:px-margin-desktop text-center">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
            <span className="material-symbols-outlined text-4xl opacity-50">diamond</span>
            <h2 className="font-display-lg text-headline-lg-mobile md:text-headline-lg font-light leading-tight">
              &quot;Your Lifestyle Deserves Better Choices.&quot;
            </h2>
            <p className="font-label-caps text-label-caps text-on-primary-container mt-4">THE LUXELIFE PROMISE</p>
          </div>
        </section>
      </main>
      <Footer variant="home" />
    </div>
  )
}
