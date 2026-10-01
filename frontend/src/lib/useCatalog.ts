import { useEffect, useState } from 'react'
import { api } from './api'
import { PRODUCTS as FALLBACK_PRODUCTS } from '../data/products'
import { FALLBACK_CATEGORIES } from '../data/categories'
import type { Category, Product } from '../types/api'

export interface Catalog {
  products: Product[]
  /** Visible categories that have at least one product, in sort order. */
  categories: Category[]
}

// ponytail: one fetch per page load, shared by every page and menu; refresh the tab to see admin edits.
let pending: Promise<Catalog> | null = null

export function loadCatalog(): Promise<Catalog> {
  pending ??= Promise.all([
    api.getProducts().catch(() => FALLBACK_PRODUCTS as Product[]),
    api.getCategories().catch(() => FALLBACK_CATEGORIES),
  ]).then(([products, all]) => ({
    products,
    categories: all.filter((c) => c.visible && products.some((p) => p.category === c.slug)),
  }))
  return pending
}

export function useCatalog() {
  const [catalog, setCatalog] = useState<Catalog | null>(null)

  useEffect(() => {
    let alive = true
    loadCatalog().then((c) => alive && setCatalog(c))
    return () => {
      alive = false
    }
  }, [])

  const products = catalog?.products ?? []
  return {
    loading: catalog === null,
    products,
    categories: catalog?.categories ?? [],
    countIn: (slug: string) => products.filter((p) => p.category === slug).length,
    /** Category hero, falling back to its first product's image. */
    heroFor: (c: Category) => c.heroImage || products.find((p) => p.category === c.slug)?.image || '',
    nameOf: (slug: string) => catalog?.categories.find((c) => c.slug === slug)?.name ?? slug.replace(/-/g, ' '),
  }
}
