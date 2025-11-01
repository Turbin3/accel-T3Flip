import { Card as CardType, Person } from '../types/game-types'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'

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
        'relative overflow-hidden transition-all duration-500 cursor-pointer group',
        'hover:scale-105 hover:shadow-lg',
        isActive 
          ? 'ring-2 ring-primary shadow-lg scale-105 shadow-primary/20' 
          : 'ring-1 ring-border',
        card.isGuessed 
          ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30' 
          : card.isRevealed
          ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10'
          : 'bg-gradient-to-br from-muted/50 to-muted/30'
      )}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50" />
      )}
      
      {/* Success indicator */}
      {card.isGuessed && (
        <div className="absolute top-2 right-2 z-10">
          <CheckCircle2 className="w-5 h-5 text-green-500 drop-shadow-lg" />
        </div>
      )}

      <CardContent className="p-4 flex flex-col items-center justify-center min-h-[140px] md:min-h-[160px]">
        {card.isRevealed && person ? (
          <div className="flex flex-col items-center gap-3 animate-in zoom-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-xl" />
              <img
                src={person.imageUrl}
                alt={person.name}
                className="relative w-16 h-16 md:w-20 md:h-20 rounded-full ring-2 ring-primary/20 shadow-lg object-cover"
              />
            </div>
            <p className="text-sm md:text-base font-semibold text-center text-foreground">
              {person.name}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-muted-foreground/20 to-muted-foreground/10 rounded-full blur-lg animate-pulse" />
              <div className="relative text-4xl md:text-5xl font-bold text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors">
                {cardNumber}
              </div>
            </div>
            <div className="text-xs text-muted-foreground/60 font-medium">
              Card {cardNumber}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
