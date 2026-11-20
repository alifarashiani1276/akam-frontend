import { useQuery } from '@tanstack/react-query'
import { getProduct, getProducts } from './productsApi'

export function useProduct(lang = 'fa', slug, options = {}) {
  return useQuery({ queryKey: ['products', lang, slug], queryFn: ({ signal }) => getProduct({ lang, slug, signal }), enabled: Boolean(slug), ...options })
}
export function useProducts(lang = 'fa', options = {}) {
  return useQuery({ queryKey: ['products', lang], queryFn: ({ signal }) => getProducts({ lang, signal }), ...options })
}
