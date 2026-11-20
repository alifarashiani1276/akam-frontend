import { Link, useParams } from 'react-router-dom'

// A localized navigation link. Hash links remain supported for legacy home sections.
export default function NavItem({ item, children, ...rest }) {
  const { lang } = useParams()
  if (item.path !== undefined) {
    return <Link to={`/${lang}${item.path ? `/${item.path}` : ''}`} {...rest}>{children}</Link>
  }
  return <a href={`/${lang}#${item.hash}`} {...rest}>{children}</a>
}
