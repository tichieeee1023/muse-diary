import { BottomNav, type MainSection } from '../components/BottomNav'
import { getAchievements } from '../engine/achievementEngine'
import { getAllCharacters } from '../engine/encounterEngine'
import { getPlace } from '../data/locations'
import { datePlaces, getDateRecordTitle, getDateTouchStateLabel } from '../data/dateScenarios'
import { formatGameText } from '../engine/textFormatter'
import { useGameStore } from '../store/useGameStore'

interface RecordsPageProps { onNavigate: (section: MainSection) => void }

export function RecordsPage({ onNavigate }: RecordsPageProps) {
  const progress = useGameStore((state) => state.progress)
  const collection = useGameStore((state) => state.collection)
  const player = useGameStore((state) => state.player)
  const achievements = getAchievements(progress, collection)
  const unlocked = achievements.filter((item) => item.unlocked).length
  const characters = getAllCharacters()
  const recentMeetings = Object.entries(collection.lastMeetingByCharacterId)
    .sort(([, a], [, b]) => b.day - a.day)
    .slice(0, 4)
  const seasonalRecords = Object.values(collection.seasonalEventRecords).sort((a, b) => b.day - a.day)
  const dateRecords = [...collection.dateRecords].sort((a, b) => b.createdAt - a.createdAt)

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

      {dateRecords.length > 0 && (
        <section className="date-record-section">
          <div className="diary-section-title"><p className="eyebrow">DATE MEMORIES</p><h2>데이트 기록</h2></div>
          <div className="date-record-list">
            {dateRecords.map((record) => {
              const companion = characters.find((character) => character.id === record.characterId)
              const datePlace = datePlaces.find((place) => place.id === record.placeId)
              return (
                <details className="date-record-card" key={record.id}>
                  <summary>
                    <div className="date-record-summary-copy">
                      <small>DAY {String(record.day).padStart(2, '0')} · {companion?.name ?? 'UNKNOWN MUSE'} · {datePlace?.name ?? 'DATE'}</small>
                      <strong>{getDateRecordTitle(record.placeId, record.finalHeart)}</strong>
                    </div>
                    <span>{'♥'.repeat(record.finalHeart)}{'♡'.repeat(5 - record.finalHeart)}</span>
                    <em>{record.turns.length} PAGES</em>
                  </summary>
                  <div className="date-record-body">
                    {record.turns.some((turn) => turn.weakDiscovery && turn.weakSpotLabel) && (
                      <div className="date-record-found">
                        <span>오늘 알게 된 것</span>
                        <strong>유난히 반응이 컸던 곳 · {record.turns.find((turn) => turn.weakDiscovery && turn.weakSpotLabel)?.weakSpotLabel}</strong>
                      </div>
                    )}
                    {record.turns.map((turn) => (
                      <article className="date-record-turn" key={`${record.id}-${turn.turn}`}>
                        <div className="date-record-turn-head">
                          <strong>TURN {String(turn.turn).padStart(2, '0')}</strong>
                          <small>{getDateTouchStateLabel(turn.touchState)} · {'♥'.repeat(turn.heartAfter)}{'♡'.repeat(5 - turn.heartAfter)}</small>
                        </div>
                        {turn.lines.map((line, index) => <p key={`${record.id}-${turn.turn}-${index}`}>{formatGameText(line, player?.name ?? '')}</p>)}
                        {turn.reactionLine && (
                          <div className={`date-record-reaction${turn.isWeak ? ' is-weak' : ''}`}>
                            <strong>{companion?.name ?? 'MUSE'}{turn.isWeak && turn.weakSpotLabel ? ` · ✦ ${turn.weakSpotLabel}` : ''}</strong>
                            <p>“{formatGameText(turn.reactionLine, player?.name ?? '')}”</p>
                            {turn.reactionNarration && <small>{formatGameText(turn.reactionNarration, player?.name ?? '')}</small>}
                            {turn.innerThought && <em className="date-record-thought">({formatGameText(turn.innerThought, player?.name ?? '')})</em>}
                          </div>
                        )}
                        {turn.returnTouch && <p className="date-record-return">{formatGameText(turn.returnTouch, player?.name ?? '')}</p>}
                      </article>
                    ))}
                    <p className="date-record-closing">{formatGameText(record.closing, player?.name ?? '')}</p>
                  </div>
                </details>
              )
            })}
          </div>
        </section>
      )}

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
