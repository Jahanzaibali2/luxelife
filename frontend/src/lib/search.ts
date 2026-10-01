import type { Product } from '../types/api'

/** Every word in `q` must appear in the product's name, subtitle, description or category name. */
export function matchesQuery(p: Product, q: string, categoryName: string) {
  const hay = `${p.name} ${p.subtitle} ${p.description ?? ''} ${categoryName}`.toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word))
}
