import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppHero } from '@/components/app-hero'
import { T3flipUiProgramExplorerLink } from './ui/t3flip-ui-program-explorer-link'
import { T3flipUiProgram } from '@/features/t3flip/ui/t3flip-ui-program'

export default function T3flipFeature() {
  const { account } = useSolana()

  if (!account) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="hero py-[64px]">
          <div className="hero-content text-center">
            <WalletDropdown />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <AppHero title="T3flip" subtitle={'Run the program by clicking the "Run program" button.'}>
        <p className="mb-6">
          <T3flipUiProgramExplorerLink />
        </p>
      </AppHero>
      <T3flipUiProgram />
    </div>
  )
}
