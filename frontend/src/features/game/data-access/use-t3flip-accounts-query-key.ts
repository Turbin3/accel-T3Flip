import { useSolana } from '@/components/solana/use-solana'

export function useT3FlipAccountsQueryKey() {
  const { cluster } = useSolana()

  return ['t3flip', 'accounts', { cluster }]
}
