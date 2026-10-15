import { useTranslation } from 'react-i18next'
import Reveal from '../components/motion/Reveal'
import Marquee from '../components/ui/Marquee'
import Hero from '../features/home/Hero'
import About from '../features/home/About'
import Services from '../features/home/Services'
import Stats from '../features/home/Stats'
import Process from '../features/home/Process'
import Testimonials from '../features/home/Testimonials'
import Faq from '../features/home/Faq'
import Contact from '../features/home/Contact'

// Each section is an independent component. Wrap it in <Reveal> to animate it on scroll.
export default function Home() {
  const { t } = useTranslation()
  const tickerItems = t('services.items', { returnObjects: true }).map((s) => s.title)

  return (
    <>
      <Hero />
      <Marquee items={tickerItems} />
      <Reveal><About /></Reveal>
      <Reveal><Services /></Reveal>
      <Stats />
      <Process />
      <Reveal><Testimonials /></Reveal>
      <Reveal><Faq /></Reveal>
      <Reveal><Contact /></Reveal>
    </>
  )
}
