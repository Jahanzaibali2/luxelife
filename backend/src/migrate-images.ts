import 'dotenv/config'
import { pathToFileURL } from 'url'
import * as repo from './repository.js'
import { uploadProductImageFromUrl } from './storage.js'
import { slugify } from './utils.js'

/** Reliable product photos when legacy external URLs fail */
const FALLBACK_IMAGES: Record<string, string> = {
  'aura-ceramic-vase':
    'https://images.unsplash.com/photo-1578746355630-4b1e9c5ecb8e?w=1200&q=85&auto=format',
  'essential-weekender':
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=85&auto=format',
  'sculptural-vase-trio':
    'https://images.unsplash.com/photo-1615485500908-256d38fa2d58?w=1200&q=85&auto=format',
  'titanium-chronograph':
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=85&auto=format',
  'noir-fig-amber-candle':
    'https://images.unsplash.com/photo-1602607623241-cf29a0b5be0a?w=1200&q=85&auto=format',
  'lumiere-pearl-pendant':
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=85&auto=format',
  'oversized-linen-blazer':
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=85&auto=format',
}

const GALLERY_FALLBACKS: Record<string, string[]> = {
  'aura-ceramic-vase': [
    'https://images.unsplash.com/photo-1615485500908-256d38fa2d58?w=1200&q=85&auto=format',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=85&auto=format',
  ],
}

function isStorageUrl(url: string): boolean {
  return url.includes('/storage/v1/object/public/product-images/')
}

async function uploadFromUrlWithFallback(
  slug: string,
  sourceUrl: string,
  filename: string,
): Promise<string> {
  try {
    return await uploadProductImageFromUrl(slug, sourceUrl, filename)
  } catch {
    const fallback = FALLBACK_IMAGES[slug]
    if (!fallback) throw new Error(`No fallback image for ${slug}`)
    console.warn(`  Using fallback image for ${slug}/${filename}`)
    return uploadProductImageFromUrl(slug, fallback, filename)
  }
}

export async function migrateProductImages() {
  const products = await repo.listProducts()
  let migrated = 0

  for (const product of products) {
    const slug = product.slug || slugify(product.name)
    console.log(`→ ${product.name} (${slug})`)

    let image = product.image
    if (!isStorageUrl(image)) {
      image = await uploadFromUrlWithFallback(slug, image, 'main')
      migrated++
      console.log(`  main: ${image}`)
    } else {
      console.log('  main: already in storage')
    }

    const gallery: string[] = []
    const sources = product.gallery?.length
      ? product.gallery
      : GALLERY_FALLBACKS[slug] ?? []

    for (let i = 0; i < sources.length; i++) {
      const src = sources[i]
      if (isStorageUrl(src)) {
        gallery.push(src)
        continue
      }
      try {
        const url = await uploadProductImageFromUrl(slug, src, `gallery-${i + 1}`)
        gallery.push(url)
        migrated++
        console.log(`  gallery-${i + 1}: ${url}`)
      } catch {
        const fallback = GALLERY_FALLBACKS[slug]?.[i]
        if (fallback) {
          const url = await uploadProductImageFromUrl(slug, fallback, `gallery-${i + 1}`)
          gallery.push(url)
          migrated++
          console.log(`  gallery-${i + 1} (fallback): ${url}`)
        }
      }
    }

    await repo.updateProduct(product.id, { image, gallery })
  }

  console.log(`\nDone. Uploaded ${migrated} image(s) to product-images bucket.`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  migrateProductImages().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
