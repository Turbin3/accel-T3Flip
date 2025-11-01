import React from 'react'

export function AppHero({
  children,
  subtitle,
  title,
}: {
  children?: React.ReactNode
  subtitle?: React.ReactNode
  title?: React.ReactNode
}) {
  return (
    <div className="relative flex flex-col items-center justify-center py-12 md:py-20 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent_0%,var(--background)_100%)]" />
      
      <div className="relative text-center max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          {typeof title === 'string' ? (
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
          ) : (
            title
          )}
          
          {typeof subtitle === 'string' ? (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          ) : (
            subtitle
          )}
          
          {children && (
            <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
