'use client'

import { Volume2, VolumeX, Music, VolumeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAudioSettings } from '@/hooks/useAudioSettings'

export function AudioSettings() {
  const { soundEnabled, musicEnabled, toggleSound, toggleMusic } = useAudioSettings()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {soundEnabled || musicEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          <span className="sr-only">Audio settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={toggleSound} className="cursor-pointer">
          {soundEnabled ? (
            <>
              <Volume2 className="mr-2 h-4 w-4" />
              Sound Effects: On
            </>
          ) : (
            <>
              <VolumeX className="mr-2 h-4 w-4" />
              Sound Effects: Off
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toggleMusic} className="cursor-pointer">
          {musicEnabled ? (
            <>
              <Music className="mr-2 h-4 w-4" />
              Background Music: On
            </>
          ) : (
            <>
              <VolumeOff className="mr-2 h-4 w-4" />
              Background Music: Off
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
