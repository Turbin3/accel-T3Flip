import { Badge } from '@/components/ui/badge'
import { Heart, HeartCrack } from 'lucide-react'

interface GameStatsProps {
  errors: number
  maxErrors: number
  lives: number
}

export function GameStats({ errors, maxErrors, lives }: GameStatsProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Lives:</span>
        <div className="flex gap-1">
          {Array.from({ length: maxErrors }).map((_, index) => (
            <div key={index}>
              {index < lives ? (
                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
              ) : (
                <HeartCrack className="w-5 h-5 text-muted-foreground/30" />
              )}
            </div>
          ))}
        </div>
      </div>
      <Badge variant={errors >= maxErrors ? 'destructive' : 'secondary'}>
        {errors}/{maxErrors} errors
      </Badge>
    </div>
  )
}
