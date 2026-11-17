// Backbone of the product tree: main section > subcategory > (later) product/service page.
// Only ids live here. All text lives in src/i18n/locales/<lang>/catalog.json:
//   catalog.sections.<id>.{short,title,text}
//   catalog.sections.<id>.items.<subcategoryId>
//
// To add a subcategory: add its id to `items` + add its text under items in every language.
// To hide something without deleting it: visible: false.
// Later (products/pages): add a `products` array per subcategory and a route using `slug`.
export const CATALOG = [
  { id: 'mining', image: '/images/card-1.webp', slug: 'mining-machinery', items: ['crushing', 'screening', 'gravity', 'conveying', 'lines'] },
  { id: 'industrial', image: '/images/card-2.webp', slug: 'industrial-equipment', items: ['molten', 'handling', 'dust', 'parts'] },
  { id: 'engineering', image: '/images/card-3.webp', slug: 'engineering-services', items: ['custom', 'reverse', 'rebuild', 'parts'] },
  // Export-only for now (no domestic market).
  { id: 'agri', image: '/images/card-4.webp', slug: 'agricultural-machinery', items: ['laserLeveler', 'gnssLeveler', 'laserScraper', 'gnssScraper'] },
]

export const getVisibleCatalog = () => CATALOG.filter((section) => section.visible !== false)
