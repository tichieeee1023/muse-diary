import type { CharacterDefinition } from '../types/game'

interface CharacterIconProps {
  symbol: CharacterDefinition['symbol']
  size?: number
  className?: string
}

const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function CharacterIcon({ symbol, size = 28, className = '' }: CharacterIconProps) {
  const paths = {
    bookmark: <><path d="M7 4.5h10v15l-5-3-5 3z" /><path d="M9.5 8h5" /></>,
    layout: <><rect x="4.5" y="5" width="15" height="14" rx="2" /><path d="M9.5 5v14M4.5 10h15" /><path d="m15.7 12.8.7 1.5 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2z" /></>,
    train: <><rect x="6" y="3.8" width="12" height="14.2" rx="3" /><path d="M8.5 7h7M8 13h8M9 21l2-3m4 3-2-3" /><circle cx="9" cy="14.8" r=".8" fill="currentColor" stroke="none" /><circle cx="15" cy="14.8" r=".8" fill="currentColor" stroke="none" /></>,
    cake: <><path d="M5 12h14v7H5zM7 9h10v3H7z" /><path d="M12 4v5M12 4c1.2.7 1.6 1.5 0 2.6C10.4 5.5 10.8 4.7 12 4z" /></>,
    'moon-broom': <><path d="M15.8 5.1a6.7 6.7 0 1 0 2.9 11.5 6 6 0 0 1-2.9-11.5z" /><path d="m6 19 8.5-8.5M5 17l3 3M4 18l2 2" /></>,
    wave: <><path d="M3.5 14c2.1 0 2.1-2 4.2-2s2.1 2 4.2 2 2.1-2 4.2-2 2.1 2 4.4 2M5 18c1.7 0 1.7-1.5 3.4-1.5s1.7 1.5 3.4 1.5 1.7-1.5 3.4-1.5 1.7 1.5 3.4 1.5" /><path d="M9 8c1-2 2-3 3-3s2 1 3 3" /></>,
    'sword-knot': <><path d="m6 18 11-11M14.5 5.5l4 4M5 19l-1 1 1.8-.2L8 17.5" /><path d="M8.5 13.5c-1.8-1.4-3.6-.6-3.4.8.2 1.5 2.4 1.7 3.6.4 1.2-1.3 3.2-.9 3.3.7.1 1.4-1.6 2.2-3 1.4" /></>,
    frame: <><rect x="4" y="5" width="16" height="14" rx="1.5" /><path d="m7 16 3.5-4 2.5 2.5 2-2 2 3.5M8 9h.01" /></>,
    rune: <><circle cx="12" cy="12" r="7.5" /><path d="M12 6.5v11M8.2 9l7.6 6M15.8 9l-7.6 6" /><circle cx="12" cy="12" r="1.7" /></>,
    shield: <><path d="M12 3.5 19 6v5.1c0 4.6-2.8 7.6-7 9.4-4.2-1.8-7-4.8-7-9.4V6z" /><path d="m8.5 12 2.2 2.1 4.8-5" /></>,
    star: <><path d="m12 3 1.8 5.2 5.5.1-4.4 3.3 1.6 5.3-4.5-3-4.5 3 1.6-5.3-4.4-3.3 5.5-.1z" /><path d="M18.5 4.5v3M17 6h3" /></>,
    clock: <><circle cx="12" cy="12" r="8.2" /><path d="M12 7v5l3.3 2M6 4.8 4.8 6M18 4.8 19.2 6" /></>,
  } as const

  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {paths[symbol]}
    </svg>
  )
}
