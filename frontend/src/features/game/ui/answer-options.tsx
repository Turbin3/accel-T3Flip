import { Person } from '../types/game-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnswerOptionsProps {
  options: Person[]
  onSelect: (personId: number) => void
  disabled: boolean
}

export function AnswerOptions({ options, onSelect, disabled }: AnswerOptionsProps) {
  return (
    <Card className="border-2 shadow-xl bg-gradient-to-br from-card to-card/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Who is behind the card?</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Select the correct person from the options below
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {options.map((person, index) => (
            <Button
              key={person.id}
              onClick={() => onSelect(person.id)}
              disabled={disabled}
              variant="outline"
              className={cn(
                "h-auto py-4 px-4 text-left justify-start transition-all duration-300",
                "hover:scale-105 hover:shadow-md hover:border-primary/50",
                "hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                "border-2 animate-in fade-in slide-in-from-bottom-4"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{index + 1}</span>
                </div>
                <span className="text-sm font-medium flex-1">{person.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}