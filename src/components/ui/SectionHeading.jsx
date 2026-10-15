export default function SectionHeading({ label, title, className = '' }) {
  return (
    <div className={className}>
      <span className="section-label">{label}</span>
      <h2 className="section-title">{title}</h2>
    </div>
  )
}
