# AKAM Machine website

React 19 + Vite + Tailwind 4 + daisyUI, 4 languages (fa, ar, ru, en), design reference: movora.framer.website.

```
npm install
npm run dev
```

## Where things live

| What | Where |
| --- | --- |
| Business info, contact numbers, navbar links | `src/config/site.js` |
| Languages (code, label, direction) | `src/config/languages.js` |
| Product tree (4 sections > subcategories), ids only | `src/config/catalog.js` |
| Home page sections and their order | `src/features/home/sections.js` |
| Texts | `src/i18n/locales/<lang>/*.json` |

## Translations

Every `src/i18n/locales/<lang>/<name>.json` is merged automatically into one bundle per language, so components just use `t('hero.title')`.
Split texts by feature (`common.json`, `home.json`, `catalog.json`, later `blog.json`, `products.json` ...) and keep top-level keys unique across files.
In dev, missing keys and duplicate keys are logged in the browser console (English is the fallback).

- **New language:** add it to `config/languages.js`, copy `locales/en/` to `locales/<code>/`, translate. Nothing else to register.
- **New text file:** drop a new JSON in each language folder.

## Product tree

`config/catalog.js` holds only ids. The texts are in `locales/<lang>/catalog.json` under `catalog.sections.<id>`.

- **New subcategory:** add its id to `items` and its text under `items` in every language.
- **New main section:** add an entry to `CATALOG` and a `catalog.sections.<id>` block in every language.
- **Hide without deleting:** `visible: false`.

## Contact numbers

`CONTACTS` remains in `src/config/site.js` as the legacy/static reference and must not be deleted.
The rendered Contact section and Footer read phone channels from `useSettings()` and show
only records with both `confirmed: true` and a non-empty `number`. If settings cannot be
loaded, no phone, email, address, or postal details are rendered. Never publish guessed numbers.

## Adding a page

1. Create `src/pages/Foo.jsx`.
2. Add `<Route path="foo" element={<Foo />} />` inside the layout route in `src/App.jsx`.
3. Add `{ id: 'foo', path: 'foo' }` to `NAV_ITEMS` and `nav.foo` to the locales.

## Notes

- `Faq.jsx` and `Testimonials.jsx` are not used on the home page for now (no real content yet).
- Put the brand font files (Peyda) in `public/fonts`, see `public/fonts/README.txt`.


## Data layer

The API layer is organized by feature under `src/features/`. Each feature has an
`<feature>Api.js` module for async requests and React Query hooks for components.
All requests use `src/lib/http.js`; the API base URL is `VITE_API_URL` and endpoints
are prefixed with `v1/<lang>/` (the `/api` prefix is included in `VITE_API_URL`) (`fa`, `en`, `ru`, `ar`).

### Mock / real API switch

Set these values in `.env` (restart Vite after changing them):

```env
VITE_API_URL=http://localhost:8000/api
VITE_USE_MOCK=true
```

- `VITE_USE_MOCK=true`: read local JSON fixtures from `src/mocks/<lang>/`.
- `VITE_USE_MOCK=false`: call the Laravel API at `${VITE_API_URL}/v1/<lang>/...`.
- The mock and real modes share the same API functions and response shapes. Missing mock slugs throw an HTTP-style `HttpError` with status `404`.
- React Query keys include the language so cached content is not mixed when the visitor changes language.

### Mock fixture coverage

Each of `fa`, `en`, `ru`, and `ar` has `settings.json`, `catalog.json`,
`products.json`, `services.json`, `projects.json`, and `pages.json`.
The catalog contains the four configured sections and their current subcategories.
Products, services, projects, and the `about` / `capabilities` pages are localized.
The agriculture project and agriculture catalog section are marked `export_only`.

**Placeholders requiring client confirmation:** product capacity and other detailed
technical specifications, model lists, product/service project galleries, before/after
media, downloadable catalogs, project client names, exact project locations and dates,
contact email, postal address, postal code, social links, and chat availability.
These values are intentionally empty or marked `[نیازمند تأیید]`; they must be replaced
only with approved source information. No phone number has been invented: the only
confirmed mock contact is Sales `09200953320` (`confirmed: true`). Other phone channels
remain `confirmed: false` with no number.

## Multilingual SEO

- Page metadata (title, description, canonical URL, Open Graph, Twitter cards and `hreflang`) is managed by `src/lib/useSeo.js`. Route pages pass their translated API metadata and alternate slugs; `MainLayout` only synchronizes the document language and direction.
- JSON-LD is added for the organization on the home page, product detail pages, and page breadcrumbs.
- `public/robots.txt` allows crawling. Generate a mock-based sitemap and add its absolute URL to `robots.txt` by running:

  ```bash
  SITE_URL=https://www.your-real-domain.com npm run sitemap
  ```

  The script reads localized catalog, product, service, and project mock files plus the sample blog posts. Do not publish the generated mock sitemap as the definitive production sitemap. Once the Laravel backend is live, the sitemap should be generated from the real, published and indexable backend records (including their actual language alternates), ideally as part of deployment or a backend endpoint/job.
- This project is a client-rendered SPA. Metadata updates after React loads, but crawlers and social preview bots may not execute the app consistently. For reliable SEO, plan SSR or prerendering (for example with `vite-plugin-ssr`/Vike or a prerender solution). This is documentation only; SSR/prerender has not been implemented in this step.
