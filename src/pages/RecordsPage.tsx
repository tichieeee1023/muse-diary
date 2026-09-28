import { BottomNav, type MainSection } from '../components/BottomNav'
import { getAchievements } from '../engine/achievementEngine'
import { useGameStore } from '../store/useGameStore'

interface RecordsPageProps { onNavigate: (section: MainSection) => void }

export function RecordsPage({ onNavigate }: RecordsPageProps) {
  const progress = useGameStore((state) => state.progress)
  const collection = useGameStore((state) => state.collection)
  const achievements = getAchievements(progress, collection)
  const unlocked = achievements.filter((item) => item.unlocked).length

  return (
    <div className="page records-page">
      <header className="diary-page-header">
        <div><p className="eyebrow">WORK DIARY · RECORDS</p><h1>기록</h1></div>
        <div className="diary-counter"><strong>{unlocked}</strong><span>/ {achievements.length}</span></div>
      </header>

      <section className="records-summary">
        <div><span>발견</span><strong>{collection.discoveredCharacterIds.length} / 30</strong></div>
        <div><span>완료</span><strong>{collection.completedCharacterIds.length} / 30</strong></div>
        <div><span>DAY</span><strong>{String(progress.day).padStart(2, '0')}</strong></div>
      </section>

      <section className="achievement-section">
        <div className="diary-section-title"><p className="eyebrow">ACHIEVEMENTS</p><h2>작은 기록들</h2></div>
        <div className="achievement-list">
          {achievements.map((achievement) => {
            const concealed = achievement.hidden && !achievement.unlocked
            return (
              <article key={achievement.id} className={`achievement-card${achievement.unlocked ? ' is-unlocked' : ''}`}>
                <span className="achievement-stamp">{achievement.unlocked ? '✓' : '?'}</span>
                <div>
                  <strong>{concealed ? '숨겨진 기록' : achievement.title}</strong>
                  <p>{concealed ? '아직 조건을 알 수 없다.' : achievement.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>
      <BottomNav active="records" onNavigate={onNavigate} />
    </div>
  )
}
