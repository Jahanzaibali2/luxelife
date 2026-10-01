import type { Category } from '../types/api'

// Mirrors the seed in supabase/migrations/20261001000000_categories.sql.
// Used only when the categories table can't be reached (offline / migration not applied yet).
export const FALLBACK_CATEGORIES: Category[] = [
  {
    slug: 'fashion',
    name: 'Fashion',
    tagline: 'Pieces that wear well, for years.',
    intro: 'Tailoring, bags and everyday layers chosen for their cut, their cloth and how long they last.',
    sortOrder: 10,
    visible: true,
  },
  {
    slug: 'beauty',
    name: 'Beauty',
    tagline: 'Tools for the daily ritual.',
    intro: 'Styling tools and care, selected for performance and kindness to hair and skin.',
    sortOrder: 20,
    visible: true,
  },
  {
    slug: 'home-living',
    name: 'Home & Living',
    tagline: 'Quiet objects for considered rooms.',
    intro: 'Ceramics, scent and small sculptural pieces that make a space feel finished.',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDbl1As4q9r7ZAhle_SbZyNgOa-ylZ9KQVuOHKltEShprjpY63G3MGb4gm8xecfp-jM9iC7Wy_FhDI_TShvGVM-lmOO1iX33VXGPG8-oSy47UA7wmHSq-ekzITiGzV7dfHE1aV2ZIUNV5Jsy043ATPQzYEchaFw-uuXk8O8rohRg3FsH2waacEIogeNhwJoeZhKu9Y6aDPg6vsv5TAx1pT1a9EiESwK5NHzXrBg_Xz0DuRbJBFM3UtGHA',
    sortOrder: 30,
    visible: true,
  },
  {
    slug: 'jewellery-watches',
    name: 'Jewellery & Watches',
    tagline: 'Made to be worn every day.',
    intro: 'Fine jewellery and precise timepieces with a restrained, lasting design.',
    sortOrder: 40,
    visible: true,
  },
  {
    slug: 'tech',
    name: 'Tech',
    tagline: 'Useful, beautifully made.',
    intro: 'Devices and accessories that earn their place on the desk and in the home.',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDkQNHzabu2onH-OgL5lYjXoSlQF330ufKOB982WG3pmxWoytH1U1PLtr47yG3-AIr-UP657DCZPvc5cTPG9y4NkdOvwe4KmaLwf-nDFiemHOvetksZsrXXhFp9gAevEMPolISmApFymo4p5z4sQb4ZKR3K_c5vHxk9mAD-QkkI38rEQdN53lQlTub5g2xB3k0PoU7iOsgIjC2EOvidFuVhbW40GJX_iWzSEPAxaDlt7fEaJpmo2v3NiQ',
    sortOrder: 50,
    visible: true,
  },
]

export const GIFTS_EDIT = {
  slug: 'gifts',
  name: 'The Gifts Edit',
  tagline: 'Chosen to be given.',
  intro: 'A short list of pieces we would happily wrap: considered, useful and made to be kept.',
  heroImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBUJe3tMcp9Wtpd6uVACkOs9mM1ZDq-zhfbMod4RCHzY-KTsfkHBlyRZVKxDpqAQuc2ZpbLcbW0yTpzINF4_rHap4hv5lDcHuLlaAll1C-4mJY8khjnHLxxhQJ0jrwMPeEO8etqzvUb0NwgHzGhJcE64mgfW3XpEQRqrRmv5rEikic_saeL62n5CuKIFiNuSh0wDxowKpaF3Fp-jJ27dVuLQM3vhQGN8rZuYu_7nH7oCXzVa8Ofu79c1Q',
}
