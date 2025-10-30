import { T3_FLIP_PROGRAM_ADDRESS } from '@project/anchor'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'

export function T3flipUiProgramExplorerLink() {
  return <AppExplorerLink address={T3_FLIP_PROGRAM_ADDRESS} label={ellipsify(T3_FLIP_PROGRAM_ADDRESS)} />
}
