import { Link } from 'react-router-dom'
import { BLOG, blogPostPath } from '../../config/blog'

// One blog card: photo, category + date, title, short excerpt. Used by the home preview and later by the blog list page.
// Becomes a link only when BLOG.pagesReady is true (config/blog.js).
export default function PostCard({ post, lang }) {
  const date = new Intl.DateTimeFormat(lang, { dateStyle: 'medium' }).format(new Date(post.publishedAt))
  const body = (
    <>
      <div className="aspect-[16/10] overflow-hidden bg-base-300">
        <img
          src={post.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="mt-5 flex items-center gap-3 text-sm font-semibold">
        <span className="uppercase text-primary">{post.category}</span>
        <span aria-hidden="true" className="h-3 w-px bg-white/30" />
        <time dateTime={post.publishedAt} className="text-white/60">
          {date}
        </time>
      </div>
      <h3 className="mt-3 font-sans text-xl font-extrabold uppercase leading-tight text-white md:text-2xl">{post.title}</h3>
      {post.excerpt && <p className="mt-2 line-clamp-2 text-white/60">{post.excerpt}</p>}
    </>
  )

  return BLOG.pagesReady ? (
    <Link to={blogPostPath(lang, post.slug)} className="group block">
      {body}
    </Link>
  ) : (
    <div className="group">{body}</div>
  )
}
