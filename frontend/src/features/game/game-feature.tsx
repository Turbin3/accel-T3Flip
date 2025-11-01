
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, PlayCircle, RotateCcw, Trophy, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { GameState, MOCK_PERSONS, Person, Card as CardType } from './types/game-types'
import { GameCard } from './ui/game-card'
import { HintsSection } from './ui/hints-section'
import { AnswerOptions } from './ui/answer-options'
import { GameStats } from './ui/game-stats'

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

function getRandomPersons(count: number): Person[] {
  const shuffled = shuffleArray(MOCK_PERSONS)
  return shuffled.slice(0, count)
}

function createInitialGameState(): GameState {
  const selectedPersons = getRandomPersons(5)
  const cards: CardType[] = selectedPersons.map((person, index) => ({
    id: index + 1,
    personId: person.id,
    isRevealed: false,
    isGuessed: false,
  }))

  return {
    cards,
    availablePersons: MOCK_PERSONS,
    currentCardIndex: 0,
    errors: 0,
    maxErrors: 3,
    isStarted: false,
    isComplete: false,
    isWon: false,
  }
}


export default function GameFeature() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize game on mount
  useEffect(() => {
    setGameState(createInitialGameState())
  }, [])

  const handleStartGame = () => {
    if (!gameState) return
    
    setGameState({
      ...gameState,
      isStarted: true,
    })
    toast.success('Game started! Good luck!')
  }

  const handleGuess = (personId: number) => {
    if (!gameState || isSubmitting) return
    
    setIsSubmitting(true)
    
    // Simulate async operation
    setTimeout(() => {
      const currentCard = gameState.cards[gameState.currentCardIndex]
      const isCorrect = currentCard.personId === personId

      let newGameState = { ...gameState }
      
      if (isCorrect) {
        // Update the current card
        const newCards = [...gameState.cards]
        newCards[gameState.currentCardIndex] = {
          ...currentCard,
          isRevealed: true,
          isGuessed: true,
        }
        
        // Check if all cards are guessed
        const allGuessed = newCards.every(card => card.isGuessed)
        newGameState = {
          ...gameState,
          cards: newCards,
          currentCardIndex: allGuessed ? gameState.currentCardIndex : gameState.currentCardIndex + 1,
          isComplete: allGuessed,
          isWon: allGuessed,
        }

        toast.success('Correct! Well done!')
        if (allGuessed) {
          toast.success('🎉 You won the game!')
        }
      } else {
        // Increment errors
        const newErrors = gameState.errors + 1
        const gameLost = newErrors >= gameState.maxErrors
        
        newGameState = {
          ...gameState,
          errors: newErrors,
          isComplete: gameLost,
          isWon: false,
        }

        toast.error('Wrong answer! Try again.')
        if (gameLost) {
          toast.error('Game over! You ran out of lives.')
        }
      }

      setGameState(newGameState)
      setIsSubmitting(false)
    }, 300)
  }

  const handleReset = () => {
    setGameState(createInitialGameState())
    toast.info('Game reset!')
  }

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const currentCard = gameState.cards[gameState.currentCardIndex]
  const currentPerson = gameState.availablePersons.find(
    (p) => p.id === currentCard?.personId
  )

  const lives = gameState.maxErrors - gameState.errors

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Game Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Card Guessing Game
              </h1>
              <p className="text-muted-foreground mt-1 text-base md:text-lg">
                Match the famous technologists with their cards
              </p>
            </div>
          </div>
        </div>
        {gameState.isStarted && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <GameStats
              errors={gameState.errors}
              maxErrors={gameState.maxErrors}
              lives={lives}
            />
          </div>
        )}
      </div>

      {/* Cards Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-muted-foreground">Game Cards</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {gameState.cards.map((card, index) => {
            const person = gameState.availablePersons.find(
              (p) => p.id === card.personId
            )
            return (
              <div
                key={card.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <GameCard
                  card={card}
                  person={person}
                  isActive={index === gameState.currentCardIndex}
                  cardNumber={index + 1}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Hints Section */}
      {gameState.isStarted && !gameState.isComplete && (
        <HintsSection person={currentPerson} />
      )}

      {/* Game Complete Messages */}
      {gameState.isComplete && (
        <Card 
          className={cn(
            "border-2 shadow-2xl animate-in zoom-in duration-500",
            gameState.isWon 
              ? 'bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-green-500/10 border-green-500/50' 
              : 'bg-gradient-to-br from-destructive/10 via-red-500/5 to-destructive/10 border-destructive/50'
          )}
        >
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              {gameState.isWon ? (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
                    <Trophy className="relative w-16 h-16 text-green-500 drop-shadow-lg animate-bounce" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Congratulations! You Won! 🎉
                    </h3>
                    <p className="text-base text-muted-foreground">
                      You successfully guessed all the cards correctly! Well done!
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
                      <span className="text-sm font-semibold text-green-600">
                        Final Score: {gameState.cards.length} cards • {gameState.maxErrors - gameState.errors} lives remaining
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 bg-destructive/20 rounded-full blur-2xl" />
                    <XCircle className="relative w-16 h-16 text-destructive drop-shadow-lg" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-3xl font-bold text-destructive">Game Over</h3>
                    <p className="text-base text-muted-foreground">
                      You ran out of lives. Don't worry, you can try again!
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
                      <span className="text-sm font-semibold text-muted-foreground">
                        Cards guessed: {gameState.cards.filter(c => c.isGuessed).length}/{gameState.cards.length}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Answer Options */}
      {gameState.isStarted && !gameState.isComplete && (
        <AnswerOptions
          options={gameState.availablePersons}
          onSelect={handleGuess}
          disabled={isSubmitting}
        />
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {!gameState.isStarted && (
          <Button
            onClick={handleStartGame}
            size="lg"
            className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <PlayCircle className="w-5 h-5" />
            Start Game
          </Button>
        )}
        
        {(gameState.isComplete || gameState.isStarted) && (
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="gap-2 border-2 hover:bg-accent hover:scale-105 transition-all duration-300"
          >
            <RotateCcw className="w-5 h-5" />
            New Game
          </Button>
        )}
      </div>
    </div>
  )
}
