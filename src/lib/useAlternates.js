import { createContext, useContext, useEffect } from 'react'

export const AlternatesContext = createContext({ alternates: null, setAlternates: () => {} })

export function useAlternates() {
  return useContext(AlternatesContext).alternates
}

export function useSetAlternates(alternates) {
  const { setAlternates } = useContext(AlternatesContext)
  useEffect(() => {
    setAlternates(alternates ?? null)
    return () => setAlternates(null)
  }, [alternates, setAlternates])
}
