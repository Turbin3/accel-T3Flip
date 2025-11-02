'use client'

import Link from 'next/link'
import { Github, ExternalLink } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function AppFooter() {
  const pathname = usePathname()
  
  const footerLinks = [
    { label: 'Home', path: '/' },
    { label: 'Account', path: '/account' },
    { label: 'T3Flip Program', path: '/t3flip' },
  ]

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                T3Flip
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Built on <span className="font-semibold text-foreground">Solana</span> blockchain. 
              Match cards and test your knowledge.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-all hover:scale-110 p-2 rounded-lg hover:bg-accent"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground">Navigation</h3>
            <nav className="flex flex-col gap-2">
              {footerLinks.map(({ label, path }) => (
                <Link
                  key={path}
                  href={path}
                  className={`text-sm transition-colors hover:text-foreground flex items-center gap-2 group ${
                    pathname === path || (path !== '/' && pathname.startsWith(path))
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                  }`}
                >
                  {label}
                  {pathname === path && (
                    <div className="w-1 h-1 rounded-full bg-primary" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="https://github.com/solana-foundation/create-solana-dapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
              >
                create-solana-dapp
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="https://solana.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
              >
                Solana Docs
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} T3Flip. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60 text-center sm:text-right">
            Powered by Solana
          </p>
        </div>
      </div>
    </footer>
  )
}
