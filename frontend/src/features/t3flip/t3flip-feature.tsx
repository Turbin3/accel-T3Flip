import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppHero } from '@/components/app-hero'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Wallet } from 'lucide-react'
import { T3flipUiProgramExplorerLink } from './ui/t3flip-ui-program-explorer-link'
import { T3flipUiProgram } from '@/features/t3flip/ui/t3flip-ui-program'

export default function T3flipFeature() {
  const { account } = useSolana()

  if (!account) {
    return (
      <div className="max-w-4xl mx-auto">
        <AppHero 
          title="Connect Your Wallet" 
          subtitle="Please connect your Solana wallet to interact with the T3Flip program"
        >
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-gradient-to-br from-card to-card/80 border-2 shadow-xl">
              <CardContent className="p-8">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
                    <div className="relative p-6 rounded-full bg-primary/10">
                      <Wallet className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold">Get Started</h3>
                    <p className="text-muted-foreground max-w-md">
                      Connect your wallet to start interacting with the T3Flip program on Solana
                    </p>
                  </div>
                  <WalletDropdown />
                </div>
              </CardContent>
            </Card>
          </div>
        </AppHero>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <AppHero 
        title="T3Flip Program" 
        subtitle="Interact with the T3Flip program deployed on Solana blockchain"
      >
        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <T3flipUiProgramExplorerLink />
        </div>
      </AppHero>
      <div className="max-w-5xl mx-auto">
        <T3flipUiProgram />
      </div>
    </div>
  )
}
