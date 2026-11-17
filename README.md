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

Only entries with `confirmed: true` and a `number` are shown (`CONTACTS` in `config/site.js`).
The landline and the department codes (after-sales 96, finance 97, purchasing 98) are waiting for the client's confirmation, so they are hidden. Do not publish guessed numbers.

## Adding a page

1. Create `src/pages/Foo.jsx`.
2. Add `<Route path="foo" element={<Foo />} />` inside the layout route in `src/App.jsx`.
3. Add `{ id: 'foo', path: 'foo' }` to `NAV_ITEMS` and `nav.foo` to the locales.

## Notes

- `Faq.jsx` and `Testimonials.jsx` are not used on the home page for now (no real content yet).
- Put the brand font files (Peyda) in `public/fonts`, see `public/fonts/README.txt`.
