import { useState } from 'react'
import { CharacterIcon } from './CharacterIcon'
import type { CharacterDefinition } from '../types/game'

interface CollectionArtProps {
  src?: string
  alt: string
  label: string
  symbol: CharacterDefinition['symbol']
  className?: string
}

export function CollectionArt({ src, alt, label, symbol, className = '' }: CollectionArtProps) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`collection-art ${className}${failed || !src ? ' is-fallback' : ''}`}>
      {!failed && src ? <img src={src} alt={alt} onError={() => setFailed(true)} /> : (
        <div className="collection-art-fallback">
          <CharacterIcon symbol={symbol} size={40} />
          <strong>{label}</strong>
          <span>asset placeholder</span>
        </div>
      )}
    </div>
  )
}
