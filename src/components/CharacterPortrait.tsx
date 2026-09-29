import { useEffect, useState } from 'react'
import { CharacterIcon } from './CharacterIcon'
import { getCharacterRouteProfile } from '../data/characters/index'
import type { PortraitExpression } from '../types/game'

interface CharacterPortraitProps {
  characterId: string
  name: string
  symbol: Parameters<typeof CharacterIcon>[0]['symbol']
  expression?: PortraitExpression
  className?: string
  alt?: string
}

export function CharacterPortrait({ characterId, name, symbol, expression = 'main', className = '', alt }: CharacterPortraitProps) {
  const [failed, setFailed] = useState(false)
  const profile = getCharacterRouteProfile(characterId)
  const src = profile?.visuals[expression] ?? profile?.visuals.main

  useEffect(() => {
    setFailed(false)
  }, [src, expression])

  return (
    <div
      className={`character-portrait ${className}${failed || !src ? ' is-fallback' : ''}`}
      data-expression={expression}
    >
      {!failed && src ? (
        <img
          key={`${characterId}-${expression}-${src}`}
          src={src}
          alt={alt ?? `${name} ${expression} 일러스트`}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="character-portrait-fallback" aria-label={`${name} 일러스트 자리`}>
          <CharacterIcon symbol={symbol} size={42} />
          <span>ILLUSTRATION</span>
          <strong>{name}</strong>
        </div>
      )}
    </div>
  )
}
