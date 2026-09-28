import { useEffect, useState } from 'react'
import { playUiSound } from '../engine/soundEngine'
import { useGameStore } from '../store/useGameStore'
import { AmbientCanvas } from '../components/AmbientCanvas'

interface TitlePageProps {
  onEnter: () => void
}

export function TitlePage({ onEnter }: TitlePageProps) {
  const player = useGameStore((state) => state.player)
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 180)
    return () => window.clearTimeout(timer)
  }, [])

  const enter = () => {
    playUiSound('page', soundEnabled)
    onEnter()
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
