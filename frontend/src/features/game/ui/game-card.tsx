import { Card as CardType, Person } from '../types/game-types'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface GameCardProps {
  card: CardType
  person?: Person
  isActive: boolean
  cardNumber: number
}

export function GameCard({ card, person, isActive, cardNumber }: GameCardProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        isActive ? 'ring-2 ring-primary' : '',
        card.isGuessed ? 'opacity-100' : 'opacity-90'
      )}
    >
      <CardContent className="p-4 flex flex-col items-center justify-center h-32">
        {card.isRevealed && person ? (
          <div className="flex flex-col items-center gap-2">
            <img
              src={person.imageUrl}
              alt={person.name}
              className="w-16 h-16 rounded-full"
            />
            <p className="text-sm font-medium text-center">{person.name}</p>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <div className="text-4xl font-bold text-muted-foreground/30">
              {cardNumber}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
