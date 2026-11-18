// Business info. Everything here is optional: a missing value is simply not rendered.
export const SITE = {
  wordmark: 'AKAM', // giant word in the hero
  heroImage: '/images/hero.webp', // hero background photo (public/images)
  email: null, // set when the client confirms it, the contact section + footer pick it up
  postalCode: '3614949151',
  social: [], // e.g. { label: 'Instagram', href: 'https://instagram.com/...' }
}

// Client / partner logos under the hero (auto-scrolling strip). These are PLACEHOLDERS: replace with real clients.
// { name, icon } shows an icon + name (icons: Cog, Factory, Flame, Gem, Hexagon, Layers, Mountain, see LogoStrip.jsx)
// { name, src: '/images/logos/x.png' } shows a real logo image instead.
export const PARTNERS = [
  { name: 'Nova Steel', icon: 'Layers' },
  { name: 'Karan Mining', icon: 'Mountain' },
  { name: 'Zagros Cement', icon: 'Factory' },
  { name: 'Persia Alloy', icon: 'Flame' },
  { name: 'Alborz Industrial', icon: 'Cog' },
  { name: 'Tabas Minerals', icon: 'Gem' },
  { name: 'Sahand Ferro', icon: 'Hexagon' },
]

// Contact channels. Only entries with confirmed: true AND a number are shown on the site.
// The client has NOT confirmed the landline or the dialing of the department codes yet,
// so those stay hidden. When confirmed: fill `number`, set `confirmed: true`.
// `ext` is the department code from the client's letter (code 99 has no title yet: add it when it does).
// Labels come from contactLabels.<id> in src/i18n/locales/<lang>/common.json.
export const CONTACTS = [
  { id: 'sales', number: '09200953320', confirmed: true },
  { id: 'landline', number: null, confirmed: false },
  { id: 'afterSales', number: null, ext: '96', confirmed: false },
  { id: 'finance', number: null, ext: '97', confirmed: false },
  { id: 'purchase', number: null, ext: '98', confirmed: false },
]
export const getVisibleContacts = () => CONTACTS.filter((c) => c.confirmed && c.number)

// Navbar + footer links (labels come from nav.<id> in locales).
// { id, hash }  -> section on the home page
// { id, path }  -> a real page, e.g. { id: 'projects', path: 'projects' } -> /<lang>/projects
export const NAV_ITEMS = [
  { id: 'home', path: '' },
  { id: 'services', hash: 'services' },
  { id: 'products', hash: 'services' }, // point to real pages later: { id: 'products', path: 'products' }
  { id: 'about', hash: 'about' },
  { id: 'contact', hash: 'contact' },
]
