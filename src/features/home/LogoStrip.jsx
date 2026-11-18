import { Cog, Factory, Flame, Gem, Hexagon, Layers, Mountain } from 'lucide-react'
import { PARTNERS } from '../../config/site'

// Add an icon here if you use a new one in PARTNERS.
const ICONS = { Cog, Factory, Flame, Gem, Hexagon, Layers, Mountain }

function PartnerCard({ partner }) {
  const Icon = ICONS[partner.icon] ?? Hexagon
  return (
    <div className="fade-border mr-4 flex h-28 w-60 shrink-0 items-center justify-center gap-3 px-6 text-white/55 md:h-32 md:w-72">
      {partner.src ? (
        <img src={partner.src} alt={partner.name} className="max-h-10 object-contain opacity-70" />
      ) : (
        <>
          <Icon size={30} strokeWidth={1.75} />
          <span className="text-xl font-bold">{partner.name}</span>
        </>
      )}
    </div>
  )
}

// Auto-scrolling strip of client/partner cards under the hero. Pauses on hover.
// Always LTR so the loop is seamless in every language. Data: PARTNERS in config/site.js.
export default function LogoStrip() {
  if (!PARTNERS.length) return null
  return (
    <div className="bg-base-100 py-8">
      <div dir="ltr" className="logo-marquee">
        <div className="logo-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex" aria-hidden={copy === 1}>
              {PARTNERS.map((partner) => (
                <PartnerCard key={partner.name} partner={partner} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
