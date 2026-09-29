import { useEffect, useMemo, useRef, useState } from 'react'
import type { AmbientEffect } from '../components/AmbientCanvas'
import { AmbientCanvas } from '../components/AmbientCanvas'
import { playTextBlip, playUiSound, unlockAudioContext } from '../engine/soundEngine'
import { useGameStore } from '../store/useGameStore'

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

const SEASON_META = {
  SPRING: { label: 'SPRING', ko: '봄', effect: 'petals' as AmbientEffect },
  SUMMER: { label: 'SUMMER', ko: '여름', effect: 'bokeh' as AmbientEffect },
  AUTUMN: { label: 'AUTUMN', ko: '가을', effect: 'leaves' as AmbientEffect },
  WINTER: { label: 'WINTER', ko: '겨울', effect: 'snow' as AmbientEffect },
}

function getSeason(day: number) {
  if (day >= 55) return SEASON_META.WINTER
  if (day >= 40) return SEASON_META.AUTUMN
  if (day >= 25) return SEASON_META.SUMMER
  return SEASON_META.SPRING
}

function getLocalTimeTheme() {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 18 ? 'day' : 'night'
}

function delayForCharacter(character: string) {
  if (character === '…') return 105
  if (/[,.]/.test(character)) return 120
  if (/[!?]/.test(character)) return 175
  return 43
}

export function TitlePage({ onEnter }: TitlePageProps) {
  const player = useGameStore((state) => state.player)
  const progress = useGameStore((state) => state.progress)
  const collection = useGameStore((state) => state.collection)
  const restartGame = useGameStore((state) => state.restartGame)
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled)
  const [ready, setReady] = useState(false)
  const [showPrologue, setShowPrologue] = useState(false)
  const [lineIndex, setLineIndex] = useState(0)
  const [typedCount, setTypedCount] = useState(0)
  const [prologueComplete, setPrologueComplete] = useState(false)
  const [timeTheme] = useState(getLocalTimeTheme)
  const advanceTimerRef = useRef<number | null>(null)

  const season = getSeason(progress.day)
  const currentLine = PROLOGUE_LINES[lineIndex] ?? ''
  const currentGlyphs = useMemo(() => Array.from(currentLine), [currentLine])
  const typedText = currentGlyphs.slice(0, typedCount).join('')
  const lineComplete = typedCount >= currentGlyphs.length
  const discoveredCount = collection.discoveredCharacterIds.length
  const completedCount = collection.completedCharacterIds.length

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

  const resetPrologue = () => {
    setLineIndex(0)
    setTypedCount(0)
    setPrologueComplete(false)
    setShowPrologue(true)
  }

  const enter = () => {
    unlockAudioContext()
    playUiSound('page', soundEnabled)

    if (player) {
      onEnter()
      return
    }

    resetPrologue()
  }

  const startNewGame = () => {
    unlockAudioContext()
    if (player) {
      const confirmed = window.confirm(
        `${player.name}의 현재 진행을 지우고 DAY 1부터 새로 시작할까요?\n이름과 읽기·효과음 설정은 유지됩니다.`,
      )
      if (!confirmed) return
      restartGame()
    }
    playUiSound('page', soundEnabled)
    resetPrologue()
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
    <div
      className={`title-page title-${timeTheme}${ready ? ' is-ready' : ''}`}
      data-season={season.label.toLowerCase()}
    >
      <div className="title-scene" aria-hidden="true" />
      <div className="title-grain" aria-hidden="true" />
      <div className="title-vignette" aria-hidden="true" />
      <AmbientCanvas effect={season.effect} density="low" />

      <header className="title-mark" aria-label="Muse Diary">
        <div className="title-season-line">
          <span>{season.label}</span>
          <i />
          <span>{timeTheme === 'day' ? 'DAYLIGHT STUDIO' : 'NIGHT STUDIO'}</span>
        </div>
        <span>AN ORDINARY DAY,</span>
        <h1>MUSE<br />DIARY</h1>
        <i />
        <small>MEMORIES WORTH KEEPING</small>
      </header>

      <section className="title-diary-card">
        <div className="title-diary-meta">
          <span>{player ? `DAY ${String(progress.day).padStart(2, '0')}` : 'NEW DIARY'}</span>
          <b>{player ? `${season.ko} · ${progress.weather}` : `${season.ko}의 첫 페이지`}</b>
        </div>
        <p>기록하지 않으면,<br />만남은 사라진다.</p>
        <i aria-hidden="true" />
        {player ? (
          <div className="title-save-summary">
            <strong>{player.name}의 다이어리</strong>
            <small>{discoveredCount}/12 MUSES · ROUTE COMPLETE {completedCount}</small>
          </div>
        ) : (
          <small>오늘의 만남을 기록할 준비가 되었나요?</small>
        )}
      </section>

      <div className={`title-actions${player ? ' has-save' : ''}`}>
        {player ? (
          <>
            <button type="button" className="title-start-button" onClick={enter}>
              <span>CONTINUE</span><i aria-hidden="true">→</i>
            </button>
            <button type="button" className="title-new-game-button" onClick={startNewGame}>
              <span>NEW GAME</span><small>DAY 1부터 다시 시작</small>
            </button>
            <p>저장된 기록은 CONTINUE에서 이어집니다.</p>
          </>
        ) : (
          <>
            <button type="button" className="title-start-button" onClick={startNewGame}>
              <span>START NEW DIARY</span><i aria-hidden="true">→</i>
            </button>
            <p>TAP TO OPEN THE FIRST PAGE</p>
          </>
        )}
      </div>
    </div>
  )
}
