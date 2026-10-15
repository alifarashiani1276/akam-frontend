import TrianglePattern from './TrianglePattern'

// Stand-in for real photos until the client provides them.
export default function MediaPlaceholder({ className = '' }) {
  return (
    <div className={`media-placeholder ${className}`}>
      <TrianglePattern className="absolute inset-0 text-black/30" />
    </div>
  )
}
