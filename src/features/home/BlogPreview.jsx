import { ArrowUpRight, Play } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import TextReveal from '../../components/motion/TextReveal'
import { BLOG, blogListPath } from '../../config/blog'
import PostCard from '../blog/PostCard'
import { useLatestPosts } from '../blog/useLatestPosts'

const EASE = [0.22, 1, 0.36, 1]
const BG = '#121212'

// Home page blog preview (Movora "Blog" section): label + huge title + "learn more" button, then the newest posts in a 2-column grid.
// Data: features/blog (useLatestPosts -> blogApi.js). Settings: config/blog.js. Texts: blog.* in locales/<lang>/blog.json.
// With no posts (or a failed request) the whole section is hidden.
export default function BlogPreview() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { posts, loading, error } = useLatestPosts(lang, BLOG.latestCount)

  if (error || (!loading && posts.length === 0)) return null

  return (
    <section id="blog" className="relative scroll-mt-20 pb-16 pt-8 md:pb-24 md:pt-12" style={{ backgroundColor: BG }}>
      <div className="container-page">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-8 md:mb-16">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 text-sm font-semibold uppercase text-primary">
              <Play size={22} className="animate-[spin_2.5s_linear_infinite] [transform-origin:44.4%_50%] motion-reduce:animate-none" aria-hidden="true" />
              {t('blog.label')}
            </span>
            <TextReveal
              as="h2"
              text={t('blog.title')}
              className="block max-w-4xl font-sans text-6xl font-extrabold uppercase leading-[0.9] tracking-tight text-white md:text-8xl lg:text-9xl"
            />
          </div>
          {BLOG.pagesReady && (
            <Link
              to={blogListPath(lang)}
              className="group inline-flex items-stretch border border-white/70 bg-black text-sm font-extrabold uppercase text-white"
            >
              <span className="grid w-10 place-items-center bg-primary text-primary-content">
                <ArrowUpRight size={18} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
              </span>
              <span className="px-4 py-3">{t('blog.more')}</span>
            </Link>
          )}
        </div>

        <div className="grid gap-x-5 gap-y-12 md:grid-cols-2">
          {loading
            ? Array.from({ length: BLOG.latestCount }, (_, i) => <div key={i} className="aspect-[16/10] animate-pulse bg-white/5" />)
            : posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 48 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.8, delay: (i % 2) * 0.12, ease: EASE }}
                >
                  <PostCard post={post} lang={lang} />
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  )
}
