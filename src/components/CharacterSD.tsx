import { useState } from 'react'
import type { CharacterDefinition } from '../types/game'
import { CharacterIcon } from './CharacterIcon'

interface CharacterSDProps {
  characterId: string
  name: string
  symbol: CharacterDefinition['symbol']
  className?: string
  decorative?: boolean
}

export function CharacterSD({ characterId, name, symbol, className = '', decorative = false }: CharacterSDProps) {
  const [failed, setFailed] = useState(false)
  const src = `/assets/sd/${characterId}.webp`

  return (
    <span className={`character-sd ${className}`.trim()} aria-hidden={decorative || undefined}>
      {!failed ? (
        <img src={src} alt={decorative ? '' : `${name} SD 일러스트`} onError={() => setFailed(true)} />
      ) : (
        <span className="character-sd-fallback"><CharacterIcon symbol={symbol} size={28} /></span>
      )}
    </span>
  )
}
