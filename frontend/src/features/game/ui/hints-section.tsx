import { Person } from '../types/game-types'
import { Card, CardContent } from '@/components/ui/card'
import { Lightbulb } from 'lucide-react'

interface HintsSectionProps {
  person?: Person
}

export function HintsSection({ person }: HintsSectionProps) {
  if (!person) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground text-center">
            Start the game to see hints
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div className="space-y-2 flex-1">
            <p className="text-sm font-semibold">Hints</p>
            {person.hints.map((hint, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                • {hint}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
