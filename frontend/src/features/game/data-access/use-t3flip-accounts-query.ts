import { useSolana } from '@/components/solana/use-solana'
import { useQuery } from '@tanstack/react-query'
import { getT3FlipProgramAccounts } from '@project/anchor'
import { useT3FlipAccountsQueryKey } from './use-t3flip-accounts-query-key'

export function useT3FlipAccountsQuery() {
  const { client } = useSolana()

  return useQuery({
    queryKey: useT3FlipAccountsQueryKey(),
    queryFn: async () => await getT3FlipProgramAccounts(client.rpc),
  })
}
