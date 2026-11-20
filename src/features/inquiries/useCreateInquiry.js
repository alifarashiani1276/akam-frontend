import { useMutation } from '@tanstack/react-query'
import { createInquiry } from './inquiriesApi'

export function useCreateInquiry(options = {}) {
  return useMutation({ mutationFn: createInquiry, ...options })
}
