// Blog settings (the home page preview + the future blog pages).
// latestCount: how many of the newest posts the home page shows.
// pagesReady:  false -> the cards and the "learn more" button are NOT links (there is no blog page yet).
//              true  -> they link to /<lang>/blog and /<lang>/blog/<slug>. Before turning it on, add the routes
//                       <Route path="blog" element={<BlogList />} /> and <Route path="blog/:slug" element={<BlogPost />} /> in App.jsx.
export const BLOG = {
  latestCount: 4,
  pagesReady: false,
  basePath: 'blog',
}

export const blogListPath = (lang) => `/${lang}/${BLOG.basePath}`
export const blogPostPath = (lang, slug) => `/${lang}/${BLOG.basePath}/${slug}`
