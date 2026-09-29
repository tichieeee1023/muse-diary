import { BottomNav, type MainSection } from '../components/BottomNav'
import { getAchievements } from '../engine/achievementEngine'
import { getAllCharacters } from '../engine/encounterEngine'
import { getPlace } from '../data/locations'
import { useGameStore } from '../store/useGameStore'

interface RecordsPageProps { onNavigate: (section: MainSection) => void }

export function RecordsPage({ onNavigate }: RecordsPageProps) {
  const progress = useGameStore((state) => state.progress)
  const collection = useGameStore((state) => state.collection)
  const achievements = getAchievements(progress, collection)
  const unlocked = achievements.filter((item) => item.unlocked).length
  const characters = getAllCharacters()
  const recentMeetings = Object.entries(collection.lastMeetingByCharacterId)
    .sort(([, a], [, b]) => b.day - a.day)
    .slice(0, 4)
  const seasonalRecords = Object.values(collection.seasonalEventRecords).sort((a, b) => b.day - a.day)

  return (
    <div className="page records-page">
      <header className="diary-page-header">
        <div><p className="eyebrow">WORK DIARY · RECORDS</p><h1>기록</h1></div>
        <div className="diary-counter"><strong>{unlocked}</strong><span>/ {achievements.length}</span></div>
      </header>

      <section className="records-summary">
        <div><span>발견</span><strong>{collection.discoveredCharacterIds.length} / 12</strong></div>
        <div><span>완료</span><strong>{collection.completedCharacterIds.length} / 12</strong></div>
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

      {seasonalRecords.length > 0 && (
        <section className="seasonal-record-section">
          <div className="diary-section-title"><p className="eyebrow">SEASONAL MEMORIES</p><h2>계절의 기억</h2></div>
          <div className="seasonal-record-list">
            {seasonalRecords.map((record) => {
              const companion = characters.find((character) => character.id === record.companionId)
              const season = record.season ?? (record.eventId === 'summer-fireworks-night' ? 'SUMMER' : 'SPRING')
              const seasonMark = season === 'SUMMER' ? '✦' : season === 'AUTUMN' ? '❧' : season === 'WINTER' ? '❄' : '✿'
              return (
                <article key={record.eventId} className={`seasonal-record-card season-${season.toLowerCase()}`}>
                  <span className="seasonal-record-mark">{seasonMark}</span>
                  <div><small>DAY {String(record.day).padStart(2, '0')} · {season}</small><strong>{record.title} · {companion?.name ?? 'UNKNOWN MUSE'}</strong><p>{record.souvenirNote}</p></div>
                  <em>{record.souvenir}</em>
                </article>
              )
            })}
          </div>
        </section>
      )}

      <section className="recent-record-section">
        <div className="diary-section-title"><p className="eyebrow">RECENT PAGES</p><h2>최근의 만남</h2></div>
        {recentMeetings.length ? <div className="recent-record-list">{recentMeetings.map(([characterId, meeting]) => {
          const character = characters.find((item) => item.id === characterId)
          return <article key={characterId}><span>DAY {String(meeting.day).padStart(2, '0')}</span><div><strong>{character?.name ?? 'UNKNOWN MUSE'}</strong><p>{meeting.title}</p></div><small>{getPlace(meeting.placeId)?.name ?? 'UNKNOWN PLACE'}</small></article>
        })}</div> : <div className="recent-record-empty"><span>BLANK PAGE</span><p>첫 번째 만남이 이곳에 기록됩니다.</p></div>}
      </section>
      <BottomNav active="records" onNavigate={onNavigate} />
    </div>
  )
}
