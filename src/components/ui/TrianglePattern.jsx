import { useId } from 'react'

// Brand "super graphic" (stroke version). Color comes from the text color: className="text-primary/20".
export default function TrianglePattern({ className = '' }) {
  const id = `tri-${useId().replace(/:/g, '')}`
  return (
    <svg className={`pointer-events-none ${className}`} width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <path d="M8 6v26l22-13z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M34 30v22l18-11z" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
