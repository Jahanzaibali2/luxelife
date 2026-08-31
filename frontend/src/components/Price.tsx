function formatAmount(amount: number) {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

type PriceVariant = 'line' | 'inline' | 'emphasis' | 'card'

interface PriceProps {
  amount: number
  variant?: PriceVariant
  className?: string
}

const variantStyles: Record<
  PriceVariant,
  { wrap: string; currency: string; amount: string }
> = {
  line: {
    wrap: 'gap-1',
    currency: 'text-[10px] tracking-[0.12em] text-secondary/80',
    amount: 'font-body-md text-body-md tabular-nums',
  },
  inline: {
    wrap: 'gap-1',
    currency: 'text-[9px] tracking-[0.14em] text-secondary/70',
    amount: 'font-body-md text-body-md tabular-nums text-primary',
  },
  emphasis: {
    wrap: 'gap-1.5',
    currency: 'text-[10px] tracking-[0.14em] text-secondary/80',
    amount: 'font-headline-md text-[22px] leading-none tabular-nums',
  },
  card: {
    wrap: 'gap-1',
    currency: 'text-[10px] tracking-[0.14em] text-secondary/70',
    amount: 'font-body-md text-body-md tabular-nums text-charcoal-grey',
  },
}

export function Price({ amount, variant = 'inline', className = '' }: PriceProps) {
  const styles = variantStyles[variant]

  return (
    <span className={`inline-flex items-baseline ${styles.wrap} ${className}`}>
      <span className={`font-label-caps uppercase shrink-0 ${styles.currency}`}>AED</span>
      <span className={`text-primary ${styles.amount}`}>{formatAmount(amount)}</span>
    </span>
  )
}

export function formatPrice(amount: number) {
  return `AED ${formatAmount(amount)}`
}
