import { Person } from '../types/game-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface AnswerOptionsProps {
  options: Person[]
  onSelect: (personId: number) => void
  disabled: boolean
}

export function AnswerOptions({ options, onSelect, disabled }: AnswerOptionsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
          Options to choose who the person is behind the card
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {options.map((person) => (
            <Button
              key={person.id}
              onClick={() => onSelect(person.id)}
              disabled={disabled}
              variant="outline"
              className="h-auto py-3 px-4 text-left justify-start hover:bg-accent"
            >
              <span className="text-sm">{person.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}