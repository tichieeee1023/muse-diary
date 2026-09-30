import { useEffect } from 'react'
import { getCharacterThemeBgm } from '../data/themeBgm'
import { playThemeBgm, stopThemeBgm } from '../engine/soundEngine'
import { useGameStore } from '../store/useGameStore'

interface ThemeBgmControllerProps {
  characterId?: string | null
}

export function ThemeBgmController({ characterId = null }: ThemeBgmControllerProps) {
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled)

  useEffect(() => {
    const theme = characterId ? getCharacterThemeBgm(characterId) : null
    if (theme && soundEnabled) playThemeBgm(theme, soundEnabled)
    else stopThemeBgm()

    return () => stopThemeBgm()
  }, [characterId, soundEnabled])

  return null
}
