import { useState, useEffect } from 'react'

const STORAGE_KEY_SOUND = 't3flip-sound-enabled'
const STORAGE_KEY_MUSIC = 't3flip-music-enabled'

export function useAudioSettings() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(true)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSound = localStorage.getItem(STORAGE_KEY_SOUND)
    const savedMusic = localStorage.getItem(STORAGE_KEY_MUSIC)

    if (savedSound !== null) {
      setSoundEnabled(savedSound === 'true')
    }
    if (savedMusic !== null) {
      setMusicEnabled(savedMusic === 'true')
    }
  }, [])

  // Save settings to localStorage when they change
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const newValue = !prev
      localStorage.setItem(STORAGE_KEY_SOUND, String(newValue))
      return newValue
    })
  }

  const toggleMusic = () => {
    setMusicEnabled((prev) => {
      const newValue = !prev
      localStorage.setItem(STORAGE_KEY_MUSIC, String(newValue))
      return newValue
    })
  }

  return {
    soundEnabled,
    musicEnabled,
    toggleSound,
    toggleMusic,
  }
}

