import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, HeartCrack, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GameStatsProps {
  errors: number
  maxErrors: number
  lives: number
}

export function GameStats({ errors, maxErrors, lives }: GameStatsProps) {
  const isLowHealth = lives <= 1
  const isMidHealth = lives === 2

  return (
    <Card className="bg-gradient-to-br from-card to-card/80 border-2 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: maxErrors }).map((_, index) => (
                <div key={index} className="relative">
                  {index < lives ? (
                    <Heart 
                      className={cn(
                        "w-6 h-6 transition-all duration-300",
                        isLowHealth && "fill-red-600 text-red-600 animate-pulse",
                        isMidHealth && index === 0 && "fill-orange-500 text-orange-500",
                        !isLowHealth && !isMidHealth && "fill-red-500 text-red-500"
                      )} 
                    />
                  ) : (
                    <HeartCrack className="w-6 h-6 text-muted-foreground/30" />
                  )}
                </div>
              ))}
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              {lives} {lives === 1 ? 'Life' : 'Lives'}
            </span>
          </div>
          
          <div className="h-6 w-px bg-border" />
          
          <div className="flex items-center gap-2">
            <AlertTriangle className={cn(
              "w-4 h-4",
              errors >= maxErrors ? "text-destructive" : errors > 0 ? "text-orange-500" : "text-muted-foreground"
            )} />
            <Badge 
              variant={errors >= maxErrors ? 'destructive' : errors > 0 ? 'secondary' : 'secondary'}
              className={cn(
                "font-semibold",
                errors > 0 && errors < maxErrors && "bg-orange-500/10 text-orange-600 border-orange-500/20"
              )}
            >
              {errors}/{maxErrors} Errors
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
