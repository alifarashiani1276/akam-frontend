// One place for every React Query key. The language is ALWAYS the 2nd item, so:
//   - switching language never shows the previous language's cached data
//   - queryClient.invalidateQueries({ queryKey: queryKeys.blog.all(lang) }) refreshes a whole feature in one language
//   - queryKeys.blog.root refreshes it in every language
// New feature: add a block here, keep the shape [feature, lang, ...rest].
export const queryKeys = {
  blog: {
    root: ['blog'],
    all: (lang) => ['blog', lang],
    latest: (lang, limit) => ['blog', lang, 'latest', limit],
  },
}
