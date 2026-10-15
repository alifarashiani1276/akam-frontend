import { ArrowUpRight } from 'lucide-react'

const VARIANTS = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  dark: 'btn-neutral',
  ghost: 'btn-ghost',
}
const SIZES = { sm: 'btn-sm', md: '', lg: 'btn-lg' }

export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  icon = true,
  className = '',
  children,
  ...rest
}) {
  const classes = ['btn', VARIANTS[variant], SIZES[size], className].filter(Boolean).join(' ')
  return (
    <a href={href} className={classes} {...rest}>
      {children}
      {icon && <ArrowUpRight size={18} className="rtl:-scale-x-100" />}
    </a>
  )
}
