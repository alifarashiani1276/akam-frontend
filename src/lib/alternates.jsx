import { useMemo, useState } from 'react'
import { AlternatesContext } from './useAlternates'

export function AlternatesProvider({ children }) {
  const [alternates, setAlternates] = useState(null)
  const value = useMemo(() => ({ alternates, setAlternates }), [alternates])
  return <AlternatesContext.Provider value={value}>{children}</AlternatesContext.Provider>
}
