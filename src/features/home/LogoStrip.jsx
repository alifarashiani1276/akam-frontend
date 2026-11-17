import { SITE } from '../../config/site'

const EMPTY_FRAMES = 7

// Row of logo frames under the hero. Fill SITE.logos (config/site.js) with image paths when the client sends them.
export default function LogoStrip() {
  const items = SITE.logos.length ? SITE.logos : Array.from({ length: EMPTY_FRAMES }, () => null)
  return (
    <div className="bg-base-100 py-6">
      <div className="container-page flex gap-4 overflow-x-auto">
        {items.map((src, i) => (
          <div key={src ?? i} className="flex h-20 min-w-32 flex-1 items-center justify-center border-2 border-accent/60 p-3">
            {src && <img src={src} alt="" className="max-h-full object-contain" />}
          </div>
        ))}
      </div>
    </div>
  )
}
