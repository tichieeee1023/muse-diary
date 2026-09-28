import { useId, useMemo, useState } from 'react'

interface HeartMeterProps {
  value: number
  compact?: boolean
  interactive?: boolean
  className?: string
}

interface HeartGlyphProps {
  fill: number
  id: string
}

function HeartGlyph({ fill, id }: HeartGlyphProps) {
  const safeFill = Math.max(0, Math.min(100, fill))
  return (
    <svg className="heart-svg" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width={(24 * safeFill) / 100} height="24" />
        </clipPath>
      </defs>
      <path className="heart-svg-empty" d="M12 20.6 4.3 13A5.2 5.2 0 0 1 11.7 5.7L12 6l.3-.3A5.2 5.2 0 0 1 19.7 13z" />
      <path className="heart-svg-fill" clipPath={`url(#${id})`} d="M12 20.6 4.3 13A5.2 5.2 0 0 1 11.7 5.7L12 6l.3-.3A5.2 5.2 0 0 1 19.7 13z" />
    </svg>
  )
}

export function HeartRow({ value, compact = false }: Pick<HeartMeterProps, 'value' | 'compact'>) {
  const uid = useId().replace(/:/g, '')
  const safeValue = Math.max(0, Math.min(100, value))
  const rounded = Math.round(safeValue / 10) * 10
  const fills = useMemo(
    () => Array.from({ length: 5 }, (_, index) => Math.max(0, Math.min(100, ((rounded - index * 20) / 20) * 100))),
    [rounded],
  )

  return (
    <span className={`heart-row${compact ? ' is-compact' : ''}`} aria-hidden="true">
      {fills.map((fill, index) => <HeartGlyph key={index} fill={fill} id={`${uid}-${index}`} />)}
    </span>
  )
}

export function HeartMeter({ value, compact = false, interactive = true, className = '' }: HeartMeterProps) {
  const [showNumber, setShowNumber] = useState(false)
  const safeValue = Math.max(0, Math.min(100, value))
  const classes = `heart-meter${compact ? ' is-compact' : ''}${interactive ? '' : ' is-static'}${className ? ` ${className}` : ''}`

  if (!interactive) {
    return (
      <span className={classes} aria-label={`호감도 ${safeValue}점`}>
        <HeartRow value={safeValue} compact={compact} />
      </span>
    )
  }

  return (
    <button
      type="button"
      className={classes}
      onClick={() => setShowNumber((open) => !open)}
      aria-label={`호감도 ${safeValue}점. 탭하면 수치를 ${showNumber ? '숨깁니다' : '표시합니다'}.`}
    >
      <HeartRow value={safeValue} compact={compact} />
      {showNumber && <span className="heart-number">{safeValue} / 100</span>}
    </button>
  )
}
