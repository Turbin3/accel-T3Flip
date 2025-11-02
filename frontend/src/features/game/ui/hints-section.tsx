import { Person } from '../types/game-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HintsSectionProps {
  person?: Person
}

export function HintsSection({ person }: HintsSectionProps) {
  if (!person) {
    return (
      <Card className="border-dashed border-transparent bg-gradient-to-br from-muted/30 to-muted/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Lightbulb className="w-4 h-4" />
            <p className="text-sm font-sans">Start the game to see hints</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-transparent shadow-lg">
      <CardHeader className="pb-3 border-b-0 border-transparent">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-lg font-sans">Hints</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {person.hints.map((hint, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg transition-all duration-300",
                "bg-background/50 hover:bg-background/80",
                "animate-in fade-in slide-in-from-left-4",
                `delay-[${index * 100}ms]`
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-primary font-sans">{index + 1}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 font-sans">
                {hint}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
