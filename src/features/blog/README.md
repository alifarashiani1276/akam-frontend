# Blog infrastructure

The home page shows the newest posts (`features/home/BlogPreview.jsx`). Today the posts are SAMPLES; this is how to switch to real ones.

```
BlogPreview -> useLatestPosts(lang, limit) -> getLatestPosts()  (blogApi.js)  -> samplePosts.js (now)
                                                                              -> your API / CMS (later)
```

## Switching to the real blog
1. Change **only** `getLatestPosts` in `blogApi.js` (an example `fetch` is in the comment). Keep the contract: newest first, at most `limit` items, already in the requested language, shape
   `{ id, slug, image, publishedAt (ISO), category, title, excerpt }`.
2. Delete `samplePosts.js`.
3. Nothing else changes: cards, loading skeleton, language switching and the limit of 4 (`config/blog.js` -> `latestCount`) keep working.
   If there are no posts, or the request fails, the section hides itself.

## Blog pages (list + single post)
1. Create `pages/BlogList.jsx` and `pages/BlogPost.jsx` (reuse `PostCard`).
2. Add the routes in `App.jsx` inside the layout route: `blog` and `blog/:slug`.
3. Set `pagesReady: true` in `config/blog.js` -> the cards and the "learn more" button become links.
4. Optional: add `{ id: 'blog', path: 'blog' }` to `NAV_ITEMS` + `nav.blog` in the locales.

## Texts
Section label/title/button: `blog.*` in `i18n/locales/<lang>/blog.json`. Post texts come from the data source, not from the locale files.
