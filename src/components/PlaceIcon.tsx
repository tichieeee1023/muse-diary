interface PlaceIconProps {
  placeId: string
  size?: number
  className?: string
}

export function PlaceIcon({ placeId, size = 24, className = '' }: PlaceIconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className,
  }

  switch (placeId) {
    case 'subway':
      return <svg {...common}><rect x="5" y="3" width="14" height="15" rx="4"/><path d="M8 18l-2 3M16 18l2 3M8 8h8M8 13h.01M16 13h.01"/><path d="M9 21h6"/></svg>
    case 'library':
      return <svg {...common}><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z"/><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22V5.5Z"/></svg>
    case 'bookstore':
      return <svg {...common}><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z"/><path d="M8 4v16M11 8h5M11 12h5"/></svg>
    case 'convenience':
      return <svg {...common}><path d="M4 9h16v11H4zM3 9l2-5h14l2 5"/><path d="M8 13h3v7M14 13h3"/></svg>
    case 'aquarium':
      return <svg {...common}><path d="M3 12c3-5 7-7 11-4l3-2v4l4 2-4 2v4l-3-2c-4 3-8 1-11-4Z"/><circle cx="12" cy="11" r=".7"/></svg>
    case 'rooftop':
      return <svg {...common}><path d="M4 20V9l8-5 8 5v11M8 20v-6h8v6"/><path d="M3 20h18M16 5V2"/></svg>
    case 'night-market':
      return <svg {...common}><path d="M4 9h16l-2-5H6L4 9Z"/><path d="M5 9v11h14V9M8 13h8M9 4V2M15 4V2"/></svg>
    case 'cafe':
      return <svg {...common}><path d="M4 6h13v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V6Z"/><path d="M17 8h1.5a2.5 2.5 0 0 1 0 5H17M6 22h12M8 2v2M12 2v2"/></svg>
    case 'mall':
      return <svg {...common}><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/></svg>
    case 'riverside':
      return <svg {...common}><path d="M4 7c2.5-3 5.5-3 8 0s5.5 3 8 0M4 12c2.5-3 5.5-3 8 0s5.5 3 8 0M4 17c2.5-3 5.5-3 8 0s5.5 3 8 0"/></svg>
    case 'museum':
      return <svg {...common}><path d="M3 9h18M5 9V20M9 9V20M15 9V20M19 9V20M3 20h18M12 3l9 4H3l9-4Z"/></svg>
    case 'old-street':
      return <svg {...common}><path d="M4 10h16l-2-6H6l-2 6Z"/><path d="M5 10v10h14V10M9 20v-6h6v6"/><path d="M4 10c0 1.5 1 2.5 2.5 2.5S9 11.5 9 10c0 1.5 1 2.5 3 2.5s3-1 3-2.5c0 1.5 1 2.5 2.5 2.5S20 11.5 20 10"/></svg>
    case 'bar':
      return <svg {...common}><path d="M5 3h14l-5.5 7v8M10.5 21h6"/><path d="M8 7h8"/></svg>
    default:
      return <svg {...common}><circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/></svg>
  }
}
