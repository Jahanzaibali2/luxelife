import { Link } from 'react-router-dom'
import { LOGO_URL } from '../../data/constants'

interface LogoProps {
  to?: string
  showText?: boolean
  className?: string
  imageClassName?: string
  textClassName?: string
}

export function Logo({
  to,
  showText = true,
  className = 'flex items-center gap-2',
  imageClassName = 'h-8 w-8 object-contain shrink-0',
  textClassName = 'font-display-lg text-headline-md font-semibold tracking-tighter',
}: LogoProps) {
  const content = (
    <>
      <img src={LOGO_URL} alt="LuxeLife" className={imageClassName} />
      {showText && <span className={textClassName}>LuxeLife</span>}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    )
  }

  return <div className={className}>{content}</div>
}
