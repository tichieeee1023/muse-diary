import type { ReactNode } from 'react'

/**
 * Manga-style reaction marks drawn as inline SVG.
 *
 * Why not emoji / text: emoji change art style per OS (💦 on Apple vs Samsung),
 * and a white pill around a glyph reads as a UI badge, not as part of the
 * illustration. These marks are bare strokes with a white "sticker" outline
 * (the halo layer) so they stay legible on hair and backgrounds, and they take
 * their colour from the pop's tone via `currentColor`.
 *
 * Shape classes (styled in global.css under `.date-mark`):
 *   m-solid  filled with the ink colour
 *   m-soft   outlined, with a faint ink fill
 *   m-closed closed shape (the halo layer fills it; open strokes stay unfilled)
 */

interface Glyph {
  width: number
  shapes: ReactNode
}

const HEART = 'M12 21 C5.2 16 2.6 12.4 2.6 8.8 C2.6 6 4.7 4 7.4 4 C9.3 4 10.9 5 12 6.8 C13.1 5 14.7 4 16.6 4 C19.3 4 21.4 6 21.4 8.8 C21.4 12.4 18.8 16 12 21 Z'
const DROP = 'M8 2 C8 2 3.2 8 3.2 12.4 C3.2 15.4 5.3 17.8 8 17.8 C10.7 17.8 12.8 15.4 12.8 12.4 C12.8 8 8 2 8 2 Z'
const SPARK = 'M12 2 C12.9 8.2 15.8 11.1 22 12 C15.8 12.9 12.9 15.8 12 22 C11.1 15.8 8.2 12.9 2 12 C8.2 11.1 11.1 8.2 12 2 Z'

const glyphs: Record<string, Glyph> = {
  '♡': { width: 24, shapes: <path className="m-soft m-closed" d={HEART} /> },
  '♥': { width: 24, shapes: <path className="m-solid m-closed" d={HEART} /> },
  '!': {
    width: 10,
    shapes: (
      <>
        <path className="m-solid m-closed" d="M2.4 3.2 Q5 1.6 7.6 3.2 L6.4 15 Q5 15.8 3.6 15 Z" />
        <circle className="m-solid" cx="5" cy="20.2" r="1.9" />
      </>
    ),
  },
  '?': {
    width: 17,
    shapes: (
      <>
        <path d="M3.4 8.2 C3.4 4.6 6.2 2.8 9 2.8 C12 2.8 14.2 4.8 14.2 7.6 C14.2 10.4 11.6 11.2 10 12.8 C9.3 13.5 9 14.4 9 15.6" />
        <circle className="m-solid" cx="9" cy="20.2" r="1.9" />
      </>
    ),
  },
  '…': {
    width: 22,
    shapes: (
      <>
        <circle className="m-solid" cx="3.5" cy="19.5" r="2.1" />
        <circle className="m-solid" cx="11" cy="19.5" r="2.1" />
        <circle className="m-solid" cx="18.5" cy="19.5" r="2.1" />
      </>
    ),
  },
  '♪': {
    width: 18,
    shapes: (
      <>
        <ellipse className="m-solid" cx="6.5" cy="18" rx="4" ry="3" transform="rotate(-20 6.5 18)" />
        <path d="M10.2 17 L10.2 4" />
        <path d="M10.2 4 C11.5 8.5 16.5 7 16 12.5" />
      </>
    ),
  },
  '✦': { width: 24, shapes: <path className="m-solid m-closed" d={SPARK} /> },
  '✧': { width: 24, shapes: <path className="m-closed" d={SPARK} /> },
  '☆': {
    width: 24,
    shapes: <path className="m-closed" d="M12 3 L14.6 9 L21 9.6 L16.1 13.9 L17.6 20.3 L12 16.9 L6.4 20.3 L7.9 13.9 L3 9.6 L9.4 9 Z" />,
  },
  '💧': { width: 16, shapes: <path className="m-soft m-closed" d={DROP} /> },
  '💦': {
    width: 28,
    shapes: (
      <>
        <path className="m-soft m-closed" d={DROP} transform="translate(0 7) scale(.62)" />
        <path className="m-soft m-closed" d={DROP} transform="translate(13 0) scale(.54)" />
        <path className="m-soft m-closed" d={DROP} transform="translate(15 11) scale(.5)" />
      </>
    ),
  },
  '💢': {
    width: 24,
    shapes: (
      <>
        <path d="M3.5 9.5 C7.4 9.5 9.5 7.4 9.5 3.5" />
        <path d="M20.5 9.5 C16.6 9.5 14.5 7.4 14.5 3.5" />
        <path d="M3.5 14.5 C7.4 14.5 9.5 16.6 9.5 20.5" />
        <path d="M20.5 14.5 C16.6 14.5 14.5 16.6 14.5 20.5" />
      </>
    ),
  },
  '↯': { width: 20, shapes: <path className="m-solid m-closed" d="M13 2 L5 13.2 L10.6 13.2 L8.6 22 L17.2 10.2 L11.6 10.2 Z" /> },
  '☁': {
    width: 27,
    shapes: (
      <path
        className="m-soft m-closed"
        d="M8 19 C4.5 19 3 16.8 3 14.6 C3 12.2 4.8 10.6 7 10.6 C7.4 7.6 9.8 5.6 12.8 5.6 C15.8 5.6 18 7.6 18.4 10.4 C21 10.6 22.6 12.4 22.6 14.8 C22.6 17.2 20.8 19 18.2 19 Z"
      />
    ),
  },
  '///': {
    width: 24,
    shapes: (
      <>
        <path d="M5 18.5 L8 5.5" />
        <path d="M11 18.5 L14 5.5" />
        <path d="M17 18.5 L20 5.5" />
      </>
    ),
  },
}

const GAP = 2

function tokenize(pop: string) {
  if (glyphs[pop]) return [pop]
  return Array.from(pop).filter((char) => glyphs[char])
}

export function ReactionMark({ pop }: { pop: string }) {
  const tokens = tokenize(pop)
  if (!tokens.length) return <span className="date-mark-text">{pop}</span>

  let cursor = 0
  const placed = tokens.map((token, index) => {
    const glyph = glyphs[token]
    const x = cursor
    cursor += glyph.width + GAP
    return (
      <g key={`${token}-${index}`} transform={`translate(${x} 0)`}>
        {glyph.shapes}
      </g>
    )
  })
  const width = cursor - GAP

  return (
    <svg
      className="date-mark"
      viewBox={`-4 -4 ${width + 8} 32`}
      aria-hidden="true"
      focusable="false"
    >
      <g className="halo">{placed}</g>
      <g className="ink">{placed}</g>
    </svg>
  )
}
