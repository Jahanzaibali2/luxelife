import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { LazyImage } from './LazyImage'
import { EASE_EDITORIAL } from './motion/ease'

interface PageHeroProps {
  image: string
  /** Each entry is revealed as its own line. */
  lines: string[]
  eyebrow?: string
  aside?: ReactNode
  /** 'full' = 100svh (home), 'tall' = 78svh (collections). */
  size?: 'full' | 'tall'
}

/** Full-bleed image hero that sits under the transparent header: slow zoom-in, parallax, masked line reveal. */
export function PageHero({ image, lines, eyebrow, aside, size = 'full' }: PageHeroProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={ref}
      className={`relative -mt-16 overflow-hidden bg-ink md:-mt-20 ${size === 'full' ? 'h-[100svh] min-h-[560px]' : 'h-[78svh] min-h-[480px]'}`}
    >
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <motion.div
          className="h-full w-full"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: EASE_EDITORIAL }}
        >
          {image && <LazyImage eager src={image} alt="" className="h-full w-full object-cover object-[50%_60%]" />}
        </motion.div>
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/35 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute inset-x-0 bottom-0 mx-auto flex max-w-container-max flex-col gap-8 px-margin-mobile pb-14 text-white md:flex-row md:items-end md:justify-between md:px-margin-desktop md:pb-20"
      >
        <div>
          {eyebrow && (
            <motion.p
              className="mb-5 font-label-caps text-label-caps text-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {eyebrow}
            </motion.p>
          )}
          <h1 className="font-display-lg text-display-lg">
            {lines.map((line, i) => (
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
        </div>
        {aside && (
          <motion.div
            className="flex max-w-xs flex-col gap-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_EDITORIAL, delay: 0.8 }}
          >
            {aside}
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
