
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, PlayCircle, RotateCcw, Trophy, XCircle } from 'lucide-react'
import { toast } from 'sonner'
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Game Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Card Guessing Game</h1>
          <p className="text-muted-foreground">
            Match the famous technologists with their cards
          </p>
        </div>
        {gameState.isStarted && (
          <GameStats
            errors={gameState.errors}
            maxErrors={gameState.maxErrors}
            lives={lives}
          />
        )}
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-5 gap-3">
        {gameState.cards.map((card, index) => {
          const person = gameState.availablePersons.find(
            (p) => p.id === card.personId
          )
          return (
            <GameCard
              key={card.id}
              card={card}
              person={person}
              isActive={index === gameState.currentCardIndex}
              cardNumber={index + 1}
            />
          )
        })}
      </div>

      {/* Hints Section */}
      {gameState.isStarted && !gameState.isComplete && (
        <HintsSection person={currentPerson} />
      )}

      {/* Game Complete Messages */}
      {gameState.isComplete && (
        <Card className={gameState.isWon ? 'border-green-500' : 'border-destructive'}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              {gameState.isWon ? (
                <>
                  <Trophy className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="text-xl font-bold text-green-500">
                      Congratulations! You Won!
                    </h3>
                    <p className="text-muted-foreground">
                      You guessed all the cards correctly!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-8 h-8 text-destructive" />
                  <div>
                    <h3 className="text-xl font-bold text-destructive">Game Over</h3>
                    <p className="text-muted-foreground">
                      You ran out of lives. Better luck next time!
                    </p>
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
      <div className="flex gap-3">
        {!gameState.isStarted && (
          <Button
            onClick={handleStartGame}
            size="lg"
            className="gap-2"
          >
            <PlayCircle className="w-4 h-4" />
            Start Game
          </Button>
        )}
        
        {(gameState.isComplete || gameState.isStarted) && (
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            New Game
          </Button>
        )}
      </div>
    </div>
  )
}
