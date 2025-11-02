import { useQueryClient } from '@tanstack/react-query'
import { useT3FlipAccountsQueryKey } from './use-t3flip-accounts-query-key'

export function useT3FlipAccountsInvalidate() {
  const queryClient = useQueryClient()
  const queryKey = useT3FlipAccountsQueryKey()

  return () => queryClient.invalidateQueries({ queryKey })
}
