import { BottomNav, type MainSection } from '../components/BottomNav'
import { PlaceIcon } from '../components/PlaceIcon'
import { getPlace } from '../data/locations'
import { useGameStore } from '../store/useGameStore'

const weatherCopy = {
  맑음: '햇빛이 작업실 바닥까지 길게 들어온다.',
  흐림: '창밖은 흐리지만, 걷기에는 나쁘지 않은 날이다.',
  비: '창문을 두드리는 빗소리가 오늘의 분위기를 바꿔놓는다.',
  눈: '도시가 평소보다 조금 낯설어 보인다.',
} as const

const weatherMark = {
  맑음: '☀',
  흐림: '☁',
  비: '☂',
  눈: '❄',
} as const

interface HomePageProps {
  onNavigate: (section: MainSection) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  const player = useGameStore((state) => state.player)
  const progress = useGameStore((state) => state.progress)
  const nextDay = useGameStore((state) => state.nextDay)
  const enterPlace = useGameStore((state) => state.enterPlace)
  const collection = useGameStore((state) => state.collection)

  if (!player) return null

  const timeOfDay = progress.actionsLeft <= 1 ? '밤' : '낮'
  const todayPlaces = progress.dailyPlaceIds.map(getPlace).filter(Boolean)
  const oldStreetVisits = progress.placeVisits['old-street'] ?? 0
  const barUnlocked = progress.unlockedPlaceIds.includes('bar')

  return (
    <div className="page home-page">
      <header className="day-header">
        <div>
          <p className="eyebrow">WORK DIARY</p>
          <h1>DAY {String(progress.day).padStart(2, '0')}</h1>
        </div>
        <div className={`weather-badge weather-${progress.weather}`} aria-label={`오늘 날씨 ${progress.weather}`}>
          <b aria-hidden="true">{weatherMark[progress.weather]}</b>
          <span>{progress.weather}</span>
        </div>
      </header>

      <div className="day-opening-line" aria-hidden="true"><span>DAY {String(progress.day).padStart(2, '0')}</span><i /><span>{progress.weather}</span></div>

      <figure className="studio-banner">
        <img src={`/assets/backgrounds/studio/${timeOfDay === '밤' ? 'night' : 'day'}.webp`} alt="인형 디자이너의 작업실" />
        <figcaption>
          <span>MY WORKROOM</span>
          <strong>{timeOfDay === '밤' ? '하루를 정리하는 작업실' : '오늘의 영감을 찾기 전'}</strong>
        </figcaption>
      </figure>

      <section className="workroom-card">
        <div className="workroom-meta">
          <p className="workroom-caption">작업실 · {timeOfDay}</p>
          <span>{player.occupation}</span>
        </div>
        <h2>{player.name}, 오늘은 어디로 가볼까?</h2>
        <p>{weatherCopy[progress.weather]}</p>
        <div className="progress-line">
          <span>오늘의 외출</span>
          <strong>{'●'.repeat(progress.actionsLeft)}{'○'.repeat(3 - progress.actionsLeft)}</strong>
        </div>
      </section>

      <section className="place-section" aria-labelledby="place-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">TODAY'S PLACES</p>
            <h2 id="place-title">영감을 찾아 나가보자.</h2>
          </div>
          <button
            type="button"
            className="text-button"
            onClick={() => {
              const ok = window.confirm(
                '다음 날로 넘기면 아직 만나지 못한 오늘의 조우가 사라질 수 있어요. 콘텐츠를 빠르게 소모할 수 있습니다. 계속할까요?',
              )
              if (ok) nextDay()
            }}
          >
            다음 날 →
          </button>
        </div>

        {progress.actionsLeft > 0 ? (
          <div className="place-list">
            {todayPlaces.map((place, index) => {
              if (!place) return null
              const isNightLocked = Boolean(place.nightOnly && timeOfDay !== '밤')
              return (
                <button
                  key={place.id}
                  type="button"
                  className={`place-card${isNightLocked ? ' is-time-locked' : ''}`}
                  disabled={isNightLocked}
                  onClick={() => enterPlace(place.id)}
                >
                  <span className="place-icon-box"><PlaceIcon placeId={place.id} size={22} /></span>
                  <span className="place-copy">
                    <span className="place-card-kicker">0{index + 1} · {place.mark}</span>
                    <strong>{place.name}</strong>
                    <small>{isNightLocked ? '밤이 되어야 문이 열린다.' : place.note}</small>
                  </span>
                  <span className="place-card-arrow">→</span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="day-finished">
            <span>DAY COMPLETE</span>
            <strong>오늘의 외출은 여기까지.</strong>
            <p>다이어리를 정리하고 다음 날로 넘어갈 수 있어요.</p>
          </div>
        )}
      </section>

      {!barUnlocked && (
        <section className="locked-place-hint">
          <span>LOCKED PLACE</span>
          <strong>???</strong>
          <small>오래된 상가거리를 더 둘러보면 무언가 알 수 있을지도.</small>
          <em>{Math.min(oldStreetVisits, 3)} / 3</em>
        </section>
      )}

      <section className="collection-glance">
        <span>발견한 뮤즈</span>
        <strong>{collection.discoveredCharacterIds.length} / 30</strong>
        <span className="divider" aria-hidden="true" />
        <span>공략 완료</span>
        <strong>{collection.completedCharacterIds.length} / 30</strong>
      </section>

      <BottomNav active="outing" onNavigate={onNavigate} />
    </div>
  )
}
