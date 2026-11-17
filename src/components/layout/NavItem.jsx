import { Link, useParams } from 'react-router-dom'

// One link from NAV_ITEMS (see config/site.js): { hash } = home page section, { path } = a real page.
// Hash links always point to /<lang>#section, so they also work from other pages.
export default function NavItem({ item, children, ...rest }) {
  const { lang } = useParams()
  if (item.path !== undefined) {
    return (
      <Link to={`/${lang}${item.path ? `/${item.path}` : ''}`} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <a href={`/${lang}#${item.hash}`} {...rest}>
      {children}
    </a>
  )
}
