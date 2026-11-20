// Centralized React Query keys. Language is always the second segment.
export const queryKeys = {
  settings: { byLang: (lang) => ['settings', lang] },
  catalog: {
    all: (lang) => ['catalog', lang],
    section: (lang, slug) => ['catalog', lang, 'section', slug],
    subcategory: (lang, slug, params) => ['catalog', lang, 'subcategory', slug, params],
  },
  products: { all: (lang) => ['products', lang], bySlug: (lang, slug) => ['products', lang, slug] },
  services: { all: (lang) => ['services', lang], bySlug: (lang, slug) => ['services', lang, slug] },
  projects: { all: (lang) => ['projects', lang], bySlug: (lang, slug) => ['projects', lang, slug] },
  pages: { byKey: (lang, key) => ['pages', lang, key] },
  inquiries: { root: ['inquiries'] },
  blog: {
    root: ['blog'],
    all: (lang) => ['blog', lang],
    latest: (lang, limit) => ['blog', lang, 'latest', limit],
  },
}
