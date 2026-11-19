import { SAMPLE_POSTS } from './samplePosts'

// THE ONLY FILE TO CHANGE when the real blog exists (see README.md in this folder).
//
// Contract (the UI relies on it, keep it when you swap the source):
//   getLatestPosts({ lang, limit }) -> Promise<Post[]>, newest first, at most `limit` items, already in the requested language.
//   Post = { id, slug, image, publishedAt (ISO date string), category, title, excerpt }
//
// Today: reads the sample posts in samplePosts.js (with a small async delay, like a real request).
// Later, for example:
//   const res = await fetch(`${import.meta.env.VITE_API_URL}/posts?lang=${lang}&limit=${limit}&sort=-publishedAt`)
//   if (!res.ok) throw new Error('Failed to load posts')
//   return (await res.json()).map(toPost)   // map the server fields to the Post shape above
export async function getLatestPosts({ lang, limit }) {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return [...SAMPLE_POSTS]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, limit)
    .map(({ translations, ...post }) => ({ ...post, ...(translations[lang] ?? translations.en) }))
}
