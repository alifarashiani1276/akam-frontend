import { useEffect, useState } from 'react'
import { getLatestPosts } from './blogApi'

// Loads the newest posts in the current language. Reloads when the language changes.
// Returns { posts, loading, error }. Nothing to change here when the data source changes.
export function useLatestPosts(lang, limit) {
  const key = `${lang}:${limit}`
  const [result, setResult] = useState({ key: null, posts: [], error: false })

  useEffect(() => {
    let ignore = false
    getLatestPosts({ lang, limit })
      .then((posts) => !ignore && setResult({ key, posts, error: false }))
      .catch(() => !ignore && setResult({ key, posts: [], error: true }))
    return () => {
      ignore = true
    }
  }, [key, lang, limit])

  return { posts: result.posts, loading: result.key !== key, error: result.error }
}
