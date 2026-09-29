import { useEffect, useMemo, useRef, useState } from 'react'
import { playTextBlip, playUiSound, unlockAudioContext } from '../engine/soundEngine'
import { useGameStore } from '../store/useGameStore'
import { AmbientCanvas } from '../components/AmbientCanvas'

interface TitlePageProps {
  onEnter: () => void
}

const PROLOGUE_LINES = [
  '……또 늦었네.',
  '괜찮아.',
  '이번에는, 아무것도 기억하지 않아도 돼.',
  '처음 만나는 것처럼 다시 만나면 되니까.',
  '그러니까 천천히 와.',
  '……내가 기다리고 있을게.',
]

function delayForCharacter(character: string) {
  if (character === '…') return 105
  if (/[,.]/.test(character)) return 120
  if (/[!?]/.test(character)) return 175
  return 43
}

export function TitlePage({ onEnter }: TitlePageProps) {
  const player = useGameStore((state) => state.player)
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled)
  const [ready, setReady] = useState(false)
  const [showPrologue, setShowPrologue] = useState(false)
  const [lineIndex, setLineIndex] = useState(0)
  const [typedCount, setTypedCount] = useState(0)
  const [prologueComplete, setPrologueComplete] = useState(false)
  const advanceTimerRef = useRef<number | null>(null)

  const currentLine = PROLOGUE_LINES[lineIndex] ?? ''
  const currentGlyphs = useMemo(() => Array.from(currentLine), [currentLine])
  const typedText = currentGlyphs.slice(0, typedCount).join('')
  const lineComplete = typedCount >= currentGlyphs.length

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 180)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!showPrologue || prologueComplete || lineComplete) return

    const nextCharacter = currentGlyphs[typedCount]
    const timer = window.setTimeout(() => {
      const nextCount = typedCount + 1
      setTypedCount(nextCount)
      // 모든 글자마다 울리면 기관총처럼 들리므로 2글자 간격으로 짧게 울립니다.
      if (nextCount % 2 === 0) playTextBlip(nextCharacter, soundEnabled, nextCount)
    }, delayForCharacter(nextCharacter ?? ''))

    return () => window.clearTimeout(timer)
  }, [currentGlyphs, lineComplete, prologueComplete, showPrologue, soundEnabled, typedCount])

  useEffect(() => {
    if (!showPrologue || prologueComplete || !lineComplete) return

    advanceTimerRef.current = window.setTimeout(() => {
      if (lineIndex >= PROLOGUE_LINES.length - 1) {
        setPrologueComplete(true)
        return
      }
      setLineIndex((value) => value + 1)
      setTypedCount(0)
    }, lineIndex === PROLOGUE_LINES.length - 1 ? 1050 : 760)

    return () => {
      if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current)
    }
  }, [lineComplete, lineIndex, prologueComplete, showPrologue])

  const enter = () => {
    unlockAudioContext()
    playUiSound('page', soundEnabled)

    // 저장된 게임은 바로 이어하고, 새 게임에서만 프롤로그를 한 번 보여줍니다.
    if (player) {
      onEnter()
      return
    }

    setShowPrologue(true)
  }

  const handlePrologueTap = () => {
    unlockAudioContext()

    if (prologueComplete) {
      playUiSound('page', soundEnabled)
      onEnter()
      return
    }

    if (!lineComplete) {
      setTypedCount(currentGlyphs.length)
      return
    }

    if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current)
    if (lineIndex >= PROLOGUE_LINES.length - 1) {
      setPrologueComplete(true)
      return
    }

    setLineIndex((value) => value + 1)
    setTypedCount(0)
  }

  const skipPrologue = () => {
    playUiSound('page', soundEnabled)
    onEnter()
  }

  if (showPrologue) {
    return (
      <div className={`title-prologue${prologueComplete ? ' is-complete' : ''}`} onClick={handlePrologueTap}>
        <div className="title-prologue-scene" aria-hidden="true" />
        <div className="title-prologue-vignette" aria-hidden="true" />
        <AmbientCanvas effect="dust" density="low" />

        <button
          type="button"
          className="title-prologue-skip"
          onClick={(event) => {
            event.stopPropagation()
            skipPrologue()
          }}
        >
          SKIP
        </button>

        <section className="title-prologue-dialogue" aria-label="프롤로그">
          {!prologueComplete ? (
            <>
              <span className="title-prologue-speaker">???</span>
              <p aria-hidden="true">
                {typedText}
                {!lineComplete && <i className="title-prologue-cursor" />}
              </p>
              <span className="sr-only">{currentLine}</span>
              <small>{lineComplete ? 'TAP TO CONTINUE' : 'TAP TO REVEAL'}</small>
            </>
          ) : (
            <div className="title-prologue-finale">
              <span>AN ORDINARY DAY,</span>
              <strong>MUSE DIARY</strong>
              <p>새로운 기록을 시작합니다.</p>
              <button type="button" onClick={(event) => { event.stopPropagation(); handlePrologueTap() }}>
                첫 페이지 열기 <i aria-hidden="true">→</i>
              </button>
            </div>
          )}
        </section>
      </div>
    )
  }

  return (
    <div className={`title-page${ready ? ' is-ready' : ''}`}>
      <div className="title-scene" aria-hidden="true" />
      <div className="title-grain" aria-hidden="true" />
      <AmbientCanvas effect="dust" density="low" />
      <header className="title-mark" aria-label="Muse Diary">
        <span>AN ORDINARY DAY,</span>
        <h1>MUSE<br />DIARY</h1>
        <i />
        <small>MEMORIES WORTH KEEPING</small>
      </header>

      <section className="title-diary-card">
        <span className="title-page-number">01</span>
        <p>기록하지 않으면,<br />만남은 사라진다.</p>
        <i aria-hidden="true" />
        <small>{player ? `${player.name}의 다이어리가 당신을 기다립니다.` : '오늘의 만남을 기록할 준비가 되었나요?'}</small>
      </section>

      <div className="title-actions">
        <button type="button" className="title-start-button" onClick={enter}>
          <span>{player ? 'CONTINUE' : 'START'}</span><i aria-hidden="true">→</i>
        </button>
        <p>{player ? '저장된 다이어리로 돌아갑니다' : 'TAP TO OPEN THE FIRST PAGE'}</p>
      </div>
    </div>
  )
}
