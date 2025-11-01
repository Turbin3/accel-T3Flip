'use client'

import React from 'react'
import { ClusterUiChecker } from '@/features/cluster/ui/cluster-ui-checker'
import { AccountUiChecker } from '@/features/account/ui/account-ui-checker'
import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/sonner'
import { AppHeader } from './app-header'
import { AppFooter } from './app-footer'

export function AppLayout({
  children,
  links,
}: {
  children: React.ReactNode
  links: { label: string; path: string }[]
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader links={links} />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <ClusterUiChecker>
            <AccountUiChecker />
          </ClusterUiChecker>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
        <AppFooter />
      </div>
      <Toaster closeButton position="top-right" richColors />
    </ThemeProvider>
  )
}
