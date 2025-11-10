import { useRef, useEffect, useCallback } from 'react'

interface SoundEffects {
  [key: string]: HTMLAudioElement
}

interface UseGameSoundsProps {
  soundEnabled: boolean
  musicEnabled: boolean
  onMusicStateChange?: (isPlaying: boolean) => void
}

export const useGameSounds = ({ soundEnabled, musicEnabled, onMusicStateChange }: UseGameSoundsProps) => {
  const audioRef = useRef<SoundEffects>({})
  const bgMusicRef = useRef<HTMLAudioElement | null>(null)

  const startBackgroundMusic = useCallback(() => {
    if (bgMusicRef.current && musicEnabled) {
      bgMusicRef.current.play().catch((e) => {
        console.log('Could not autoplay background music:', e)
        if (onMusicStateChange) {
          onMusicStateChange(false)
        }
      })
      if (onMusicStateChange) {
        onMusicStateChange(true)
      }
    }
  }, [musicEnabled, onMusicStateChange])

  useEffect(() => {
    const sounds = {
      'card-select': new Audio('/audio/card-select.mp3'),
      'card-play': new Audio('/audio/card-play.mp3'),
      'end-turn': new Audio('/audio/end-turn.mp3'),
      'game-start': new Audio('/audio/game-start.mp3'),
      'game-over': new Audio('/audio/game-over.mp3'),
      error: new Audio('/audio/error.mp3'),
      'new-turn': new Audio('/audio/new-turn.mp3'),
      win: new Audio('/audio/win.mp3'),
      lose: new Audio('/audio/lose.mp3'),
    }

    audioRef.current = sounds

    const bgMusic = new Audio('/audio/bg-music.mp3')
    bgMusic.loop = true
    bgMusic.volume = 0.3
    bgMusicRef.current = bgMusic

    if (musicEnabled) {
      startBackgroundMusic()
    }

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause()
        bgMusicRef.current = null
      }
    }
  }, [musicEnabled, startBackgroundMusic])

  useEffect(() => {
    if (bgMusicRef.current) {
      if (musicEnabled && bgMusicRef.current.paused) {
        startBackgroundMusic()
      } else if (!musicEnabled && !bgMusicRef.current.paused) {
        bgMusicRef.current.pause()
        if (onMusicStateChange) {
          onMusicStateChange(false)
        }
      }
    }
  }, [musicEnabled, onMusicStateChange, startBackgroundMusic])

  const playSoundEffect = useCallback(
    (soundName: string) => {
      if (!soundEnabled || !audioRef.current[soundName]) return

      const sound = audioRef.current[soundName]
      sound.currentTime = 0
      sound.play().catch((e) => console.log('Audio play failed:', e))
    },
    [soundEnabled],
  )

  return { playSoundEffect, startBackgroundMusic }
}
