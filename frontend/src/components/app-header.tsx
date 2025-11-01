'use client'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { ThemeSelect } from '@/components/theme-select'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { cn } from '@/lib/utils'

const ClusterDropdown = dynamic(() => import('@/components/cluster-dropdown').then((m) => m.ClusterDropdown), {
  ssr: false,
})

export function AppHeader({ links = [] }: { links: { label: string; path: string }[] }) {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)

  function isActive(path: string) {
    return path === '/' ? pathname === '/' : pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link 
            href="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <span className="relative text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                T3Flip
              </span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ label, path }) => (
              <Link
                key={path}
                href={path}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-all rounded-md",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive(path)
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground"
                )}
              >
                {label}
                {isActive(path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <WalletDropdown />
            <ClusterDropdown />
            <ThemeSelect />
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {showMenu && (
          <>
            <div 
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setShowMenu(false)}
            />
            <div className="fixed inset-x-0 top-16 z-50 md:hidden border-b bg-background">
              <div className="container mx-auto px-4 py-6 space-y-4">
                <nav className="flex flex-col space-y-2">
                  {links.map(({ label, path }) => (
                    <Link
                      key={path}
                      href={path}
                      onClick={() => setShowMenu(false)}
                      className={cn(
                        "px-4 py-3 text-base font-medium rounded-lg transition-all",
                        "hover:bg-accent hover:text-accent-foreground",
                        isActive(path)
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-3 pt-4 border-t">
                  <WalletDropdown />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Network</span>
                    <ClusterDropdown />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ThemeSelect />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
