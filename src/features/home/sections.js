import Hero from './Hero'
import LogoStrip from './LogoStrip'
import About from './About'
import Services from './Services'
import Quality from './Quality'
import Stats from './Stats'
import Process from './Process'
import Faq from './Faq'
import Feedback from './Feedback'
import BlogPreview from './BlogPreview'
import Contact from './Contact'

// Order of the home page (matches the designer's mockup). To add/remove/reorder a section, edit this list only.
// reveal: true -> fades in when scrolled into view.
// Unused for now but kept in the project: CatalogTicker, Testimonials.
export const HOME_SECTIONS = [
  { id: 'hero', Component: Hero },
  { id: 'logos', Component: LogoStrip },
  { id: 'about', Component: About, reveal: true },
  { id: 'services', Component: Services },
  { id: 'quality', Component: Quality },
  { id: 'stats', Component: Stats },
  { id: 'process', Component: Process },
  { id: 'faq', Component: Faq },
  { id: 'feedback', Component: Feedback },
  { id: 'blog', Component: BlogPreview },
  { id: 'contact', Component: Contact },
]
