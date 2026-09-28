import { useEffect, useMemo, useRef, useState } from 'react'
import { getAchievements, type AchievementResult } from '../engine/achievementEngine'
import { playUiSound } from '../engine/soundEngine'
import { useGameStore } from '../store/useGameStore'

const SEEN_KEY = 'muse-diary-achievement-toast-seen-v1'

function loadSeen() {
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    return new Set<string>(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set<string>()
  }
}

function saveSeen(ids: Set<string>) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...ids]))
  } catch {
    // 팝업 기록 저장 실패는 게임 진행에 영향을 주지 않습니다.
  }
}

export function AchievementToast() {
  const progress = useGameStore((state) => state.progress)
  const collection = useGameStore((state) => state.collection)
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled)
  const achievements = useMemo(() => getAchievements(progress, collection), [progress, collection])
  const initialized = useRef(false)
  const [toast, setToast] = useState<AchievementResult | null>(null)

  useEffect(() => {
    const seen = loadSeen()
    const unlocked = achievements.filter((item) => item.unlocked)

    if (!initialized.current) {
      initialized.current = true
      unlocked.forEach((item) => seen.add(item.id))
      saveSeen(seen)
      return
    }

    const fresh = unlocked.filter((item) => !seen.has(item.id))
    if (!fresh.length) return

    fresh.forEach((item) => seen.add(item.id))
    saveSeen(seen)
    setToast(fresh[0])
    playUiSound('new', soundEnabled)
  }, [achievements, soundEnabled])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  if (!toast) return null

  return (
    <aside className="achievement-toast" role="status" aria-live="polite">
      <span>ACHIEVEMENT</span>
      <strong>{toast.title}</strong>
      <p>{toast.description}</p>
    </aside>
  )
}
