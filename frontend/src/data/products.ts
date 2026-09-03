export type ProductCategory =
  | 'fashion'
  | 'home-lifestyle'
  | 'accessories'
  | 'jewelry'
  | 'gadgets'
  | 'gifts'

export interface Product {
  slug: string
  name: string
  subtitle: string
  price: number
  currency: 'AED'
  image: string
  category: ProductCategory
  badge?: 'New Arrival' | 'Limited'
  inStock: boolean
  preorder?: boolean
}

export const PRODUCTS: Product[] = [
  {
    slug: 'essential-weekender',
    name: 'The Essential Weekender',
    subtitle: 'Italian Leather',
    price: 450,
    currency: 'AED',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAIYgSu1fFcD7NsXR8ah1UmgOhD9atBtyUPZ6Sn9HNfLjld1WQhnsNwIurrA1RMzp1yCrHDYmC5Bi2DDPLSnz9qCcVQFk2HomMej_PY7eBirbjFXYIHdy7M6uhliOhX9yntFQE9SYGIh_fHta8i8R3pswYWhyJczGJu6EF094b_sERHwNdFCpC93JkaOAJoe-n1g68UF5iPnFL5cuZfcoT17M-KnJKqsoG6qxrE4o_HRYLm3hN7dGuJUw',
    category: 'fashion',
    badge: 'New Arrival',
    inStock: true,
  },
  {
    slug: 'sculptural-vase-trio',
    name: 'Sculptural Vase Trio',
    subtitle: 'Matte Ceramic',
    price: 185,
    currency: 'AED',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC5DNAomMZzZatazAofTdRg-3H8StTnLWfILcszgKRAmqiP2GxEwFBZXnTgLkgQhzWhAjy-SfMYeIvIX1Ve40mvhAsZoxGNWAUJL7mcD_wkacjW3hUo2_6u3qxlYmlgQPWcXekEwPSvobgT3fVTtl32jpIa1Xq-T1cnyiYfYDRA3g-H0fSAndX5SvAtMtrKypMqg3K6_O7SAHaXUkVnaEd4quLj0avK9PdVuPwXB496zeUOU1Usk0EGzg',
    category: 'home-lifestyle',
    inStock: true,
  },
  {
    slug: 'titanium-chronograph',
    name: 'Titanium Chronograph',
    subtitle: 'Precision Timepiece',
    price: 890,
    currency: 'AED',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBnxUcgr_BPfyrwZiuJeAcZB-9p76xYbdR0TvmCgdolrLvka7szl0hLdUfEwZFyqECiF5zdANYlj53ttPq54PAUGnRFULhS_VYApG5Bm02nB45g3iJIy0UHJSTtla-aL2O9PBFaW9a27ilgVyv8NA6LXU0k-o0wHGt3g1fvVSHEs2roXSEHo8DJ-z2X5LkYXub74wp1wADsXSmo10_nlG0FMBBwJFDA4kmn3-6NDvnx3Nxz-v-JxthHFw',
    category: 'gadgets',
    badge: 'Limited',
    inStock: true,
  },
  {
    slug: 'noir-fig-amber-candle',
    name: 'Noir Fig & Amber Candle',
    subtitle: 'Home Fragrance',
    price: 65,
    currency: 'AED',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCypdVnGDnlZunY4n_TAsPULRXKataQy8UF-k_aHRfF_GVAJhv8TNJfED3GkavpjT3CiqU8U7j3ELR6a4yYrp1Qk1Gqr_31pi2l2VJHoCJ_scH-S90JHYrPGd1OWvfl_XOWJdhNmHK7mDE__UEUjhlHpxrB5H-sqw3aXBPfd5-MD4nui5ou2uMT9KDuiTQXvtnv-P2SwL300zT-VW4oN8t2JFV-AXCDX4CpR08yW4CwfUp_pyOqKLal1A',
    category: 'home-lifestyle',
    inStock: true,
  },
  {
    slug: 'lumiere-pearl-pendant',
    name: 'Lumière Pearl Pendant',
    subtitle: '18k Gold Fill',
    price: 220,
    currency: 'AED',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuClTakEGPZiqD6X9oqarb9sKhZeUs7ox3PY0vOmjhjj-7_Pb1BG3ZEE4xAdGeGi4wrKMJ2secsJaFaLTm2EP-wMCBLzGeI7gg8BOb8gTmc_2IBWtY78bWitlJVcg3DJzttVdHLcSjN0AO7fOmfz9TdY_-z-jfvgw1Aqb0XPYS6DnwStLmL14J1W-33x5xK7rIhDt7dubI5ae3isrKsxcoSNman7C9ZtS-XnP_qDdJMCWrBkMLT6DlPTuw',
    category: 'jewelry',
    inStock: true,
  },
  {
    slug: 'oversized-linen-blazer',
    name: 'Oversized Linen Blazer',
    subtitle: "Women's Tailoring",
    price: 310,
    currency: 'AED',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuALetYE7It6wujnKEJymvcLbVx8V_xE7J3xLUEItb1d_xklfz46ZIcJ-e1JEBvYfm_NhvI7dJVBqBNjUXVl3KUgtuq3UiEuQtJaLbakDFikzV9TRP4Sg4ISvCXD05Qg8Y_btQJdM4NHiqp5I5gD9cECAxs88ckgh1LhrXTcibfVhbxwR0Zl61JpndEWVsi9NlP3DaSTejxwgl11RFvXiML6k05bHG9N49_W3B4cuAq3_BSuK21OFl955g',
    category: 'fashion',
    inStock: true,
  },
]

export const AURA_CERAMIC_VASE = {
  slug: 'aura-ceramic-vase',
  name: 'Aura Ceramic Vase',
  category: 'Home & Lifestyle',
  price: 450,
  currency: 'AED' as const,
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDNfZghSxN-2y0Uk8rs_gWudjM2J737cs0CpAssiSOwLUswXG2Ed9bfShTfkNidgGjrvQHB5tPy-qY0-463PLMOqOmV5eHaaJSEV5ojEoQQenOaznadv-aZ_uCuymz6KBXgc2qW68v3hHjR9MtNNQeEC4fzDcZLH7elV3aKyuS8q-NAYGCjeKyHCYaz0fd3zlqoz2Ifsah6YeDadK7Es38y-LHx3CrwMSycLHcd_QZaYf9EeIuSttqexQ',
  gallery: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCQWpdTaDu4qQmkdzCHdPP1uAxTqMsfktyM6vyZMonIpki4-tvCpFmyUXtHjZ50wE0gLzNzl4lYX_M1VsbHwlGb4vr6QRjQ5I1koOU9pC_1kIIiJx6z1cvNKWFNFqA5AXFvsFPPS0Um9rlRDO2m06Yeie-w6khBlwv4iVGLgy37P4BAgYwjpw2qPjp3OSESIKUKm7iN0qD2gG4yaWjXJUm2P_GyiI1wRVkzQnhkUHb7HWm1b22xNQBYiQ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCRqqsDrUVHzmLjS6P3c5p1t_tg6nwrMiIi89htVdazQ1otc4ubllG-oDDxthIMRcCaKai-3HyHJQITLX6dSPygGxLlK3vnLahO5XpBhUU2CG8a6Ts6l6op1iDZt8vCZRnx9Gvg88wJ2yr09H6HaHE0dvljJoJDatq24ib4Ghmo8mI7jze0uHmENCJu8qLZyTaK4puJACgolb_OBGiZPEHBcCHz6GOvwOjBB44yU6Jh-3L2ItrRVU-A7Q',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAe3X6h6povZPcG-rMKtX9Hngm6bIPkB4avCKLGSDp4YxMTXC_Rby-BOBQgquQUSVy4n5okg6wFoTjnmDWi7-F077s5Q2ul3xKbPjV_i7OcEsm6JhZDSV8jHk3k2GOC8-PT3EwIDLvanCTffMVXiQXuMiMQCQL80cTOZjU_0HZUSKFFzZvgYlOPJ88zcioFVaxDAoh7pI1EqeCKwdkahr4B933chs0sGET9NqaCeGnMetVN5jfMJrsNrw',
  ],
}

export function getProductBySlug(slug: string): Product | undefined {
  if (slug === AURA_CERAMIC_VASE.slug) {
    return {
      slug: AURA_CERAMIC_VASE.slug,
      name: AURA_CERAMIC_VASE.name,
      subtitle: 'Warm Ivory Stoneware',
      price: AURA_CERAMIC_VASE.price,
      currency: AURA_CERAMIC_VASE.currency,
      image: AURA_CERAMIC_VASE.image,
      category: 'home-lifestyle',
      badge: 'Limited',
      inStock: true,
    }
  }
  return PRODUCTS.find((p) => p.slug === slug)
}
