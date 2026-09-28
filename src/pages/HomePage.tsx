import { useEffect, useState } from 'react'
import { BottomNav, type MainSection } from '../components/BottomNav'
import { CharacterSD } from '../components/CharacterSD'
import { MuseDollIcon } from '../components/MuseDollIcon'
import { PlaceIcon } from '../components/PlaceIcon'
import { getAllCharacters } from '../engine/encounterEngine'
import { isAffinityEventReady } from '../engine/storyEngine'
import { getPostRouteLine } from '../data/characterFlavor'
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
  const [showDayEndModal, setShowDayEndModal] = useState(false)
  const [showDayTransition, setShowDayTransition] = useState(false)
  const [placeView, setPlaceView] = useState<'map' | 'list'>('map')
  const [selectedMapPlaceId, setSelectedMapPlaceId] = useState<string | null>(null)
  useEffect(() => { if (!showDayTransition) return; const timer = window.setTimeout(() => setShowDayTransition(false), 1400); return () => window.clearTimeout(timer) }, [showDayTransition])

  if (!player) return null

  const timeOfDay = progress.actionsLeft <= 1 ? '밤' : '낮'
  const todayPlaces = progress.dailyPlaceIds.map(getPlace).filter(Boolean)
  const oldStreetVisits = progress.placeVisits['old-street'] ?? 0
  const barUnlocked = progress.unlockedPlaceIds.includes('bar')
  const characters = getAllCharacters()
  const readyEvents = characters.filter((character) => collection.discoveredCharacterIds.includes(character.id) && isAffinityEventReady(character.id, collection))
  const recommendedCharacter = readyEvents[0]
  const recommendedPlaceId = recommendedCharacter?.spawnRules.find((rule) => todayPlaces.some((place) => place?.id === rule.placeId) && progress.unlockedPlaceIds.includes(rule.placeId))?.placeId
  const recommendedPlace = recommendedPlaceId ? getPlace(recommendedPlaceId) : todayPlaces.find((place) => place && progress.unlockedPlaceIds.includes(place.id)) ?? null
  const guestId = collection.completedCharacterIds.length ? collection.completedCharacterIds[(progress.day - 1) % collection.completedCharacterIds.length] : null
  const guest = guestId ? characters.find((character) => character.id === guestId) ?? null : null
  const todayMeetings = Object.entries(collection.lastMeetingByCharacterId)
    .filter(([, meeting]) => meeting.day === progress.day)
    .map(([characterId, meeting]) => ({ character: characters.find((character) => character.id === characterId), meeting }))
    .filter((item) => item.character)


  const mapPositions: Record<string, { x: number; y: number }> = {
    rooftop: { x: 51, y: 10 },
    library: { x: 24, y: 23 },
    museum: { x: 72, y: 23 },
    bookstore: { x: 19, y: 39 },
    mall: { x: 66, y: 39 },
    cafe: { x: 33, y: 52 },
    subway: { x: 57, y: 53 },
    convenience: { x: 79, y: 57 },
    'old-street': { x: 19, y: 68 },
    bar: { x: 30, y: 83 },
    riverside: { x: 57, y: 78 },
    aquarium: { x: 80, y: 82 },
    'night-market': { x: 53, y: 92 },
  }
  const todayPlaceIds = new Set(todayPlaces.map((place) => place?.id).filter(Boolean) as string[])
  const selectedMapPlace = selectedMapPlaceId ? getPlace(selectedMapPlaceId) : null
  const isMapPlaceAvailable = (placeId: string) => {
    const place = getPlace(placeId)
    if (!place || !todayPlaceIds.has(placeId) || progress.actionsLeft <= 0) return false
    if (!progress.unlockedPlaceIds.includes(placeId)) return false
    if (place.nightOnly && timeOfDay !== '밤') return false
    return true
  }

  const getPlaceSignal = (placeId: string) => {
    if (readyEvents.some((character) => character.spawnRules.some((rule) => rule.placeId === placeId))) return 'NEW EVENT'
    if (characters.some((character) => !collection.discoveredCharacterIds.includes(character.id) && character.spawnRules.some((rule) => rule.placeId === placeId && !rule.secondaryOnly))) return '낯선 기척'
    if (characters.some((character) => collection.discoveredCharacterIds.includes(character.id) && character.spawnRules.some((rule) => rule.placeId === placeId))) return '익숙한 기척'
    return '오늘의 영감'
  }

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

      <section className="next-step-card">
        <div className="next-step-index"><span>NOW</span><strong>{readyEvents.length ? '01' : 'NEXT'}</strong></div>
        <div>
          <p className="eyebrow">TODAY'S THREAD</p>
          <strong>{recommendedCharacter ? `${recommendedCharacter.name}와의 다음 기록` : '오늘의 영감을 찾아 떠나기'}</strong>
          <small>{recommendedPlace ? `${recommendedPlace.name}에서 새로운 장면을 발견할 수 있어요.` : '지도를 열고 오늘 갈 수 있는 장소를 골라보세요.'}</small>
        </div>
        <button type="button" className="next-step-go" onClick={() => recommendedPlace ? enterPlace(recommendedPlace.id) : onNavigate('characters')} disabled={!recommendedPlace || progress.actionsLeft <= 0}>
          {recommendedPlace ? 'GO' : 'VIEW'}
        </button>
      </section>


      {readyEvents.length > 0 && (
        <section className="new-event-board">
          <div><span>NEW EVENT</span><strong>새로운 호감도 이벤트가 열렸어요.</strong></div>
          <div className="new-event-chips">{readyEvents.slice(0, 4).map((character) => <span key={character.id}><CharacterSD characterId={character.id} name={character.name} symbol={character.symbol} decorative className="new-event-chip-sd" />{character.name}</span>)}</div>
        </section>
      )}

      {guest && (
        <section className="post-route-visit">
          <CharacterSD characterId={guest.id} name={guest.name} symbol={guest.symbol} className="post-route-sd" />
          <div><span>POST ROUTE VISIT · NO ACTION</span><strong>{guest.name}<MuseDollIcon size={16} /></strong><p>{getPostRouteLine(guest.id, progress.day)}</p></div>
        </section>
      )}

      <section className="place-section" aria-labelledby="place-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">TODAY'S PLACES</p>
            <h2 id="place-title">영감을 찾아 나가보자.</h2>
          </div>
          <button
            type="button"
            className="text-button"
onClick={() => setShowDayEndModal(true)}
          >
            다음 날 →
          </button>
        </div>

        {progress.actionsLeft > 0 ? (
          <>
            <div className="place-view-switch" role="tablist" aria-label="장소 보기 방식">
              <button type="button" className={placeView === 'map' ? 'is-active' : ''} onClick={() => setPlaceView('map')}>지도</button>
              <button type="button" className={placeView === 'list' ? 'is-active' : ''} onClick={() => setPlaceView('list')}>목록</button>
            </div>

            {placeView === 'map' ? (
              <div className={`city-map weather-map-${progress.weather}`}>
                <div className="city-map-grid" aria-hidden="true" />
                <div className="city-map-river" aria-hidden="true" />
                <div className="city-map-label"><span>{timeOfDay === '밤' ? 'NIGHT MAP' : 'DAY MAP'}</span><strong>오늘의 도시</strong></div>
                {Object.entries(mapPositions).map(([placeId, position]) => {
                  const place = getPlace(placeId)
                  if (!place) return null
                  const unlocked = progress.unlockedPlaceIds.includes(placeId)
                  const today = todayPlaceIds.has(placeId)
                  const nightLocked = Boolean(place.nightOnly && timeOfDay !== '밤')
                  const available = isMapPlaceAvailable(placeId)
                  const signal = today && unlocked ? getPlaceSignal(placeId) : ''
                  return (
                    <button
                      key={placeId}
                      type="button"
                      className={`city-map-pin${available ? ' is-available' : ''}${today ? ' is-today' : ''}${!unlocked ? ' is-locked' : ''}${nightLocked ? ' is-night-locked' : ''}`}
                      style={{ left: `${position.x}%`, top: `${position.y}%` }}
                      onClick={() => setSelectedMapPlaceId(placeId)}
                      aria-label={`${place.name}${available ? ', 오늘 방문 가능' : ', 현재 방문 불가'}`}
                    >
                      <span className="city-map-pin-icon"><PlaceIcon placeId={place.id} size={18} /></span>
                      <strong>{unlocked ? place.name : '???'}</strong>
                      {signal && <em>{signal}</em>}
                    </button>
                  )
                })}
                <p className="city-map-note">밝게 표시된 장소가 오늘의 외출 후보예요.</p>
              </div>
            ) : (
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
                        <span className="place-card-kicker">0{index + 1} · {place.mark}</span><em className="place-signal">{getPlaceSignal(place.id)}</em>
                        <strong>{place.name}</strong>
                        <small>{isNightLocked ? '밤이 되어야 문이 열린다.' : place.note}</small>
                      </span>
                      <span className="place-card-arrow">→</span>
                    </button>
                  )
                })}
              </div>
            )}
          </>
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
        <strong>{collection.discoveredCharacterIds.length} / 12</strong>
        <span className="divider" aria-hidden="true" />
        <span>공략 완료</span>
        <strong>{collection.completedCharacterIds.length} / 12</strong>
      </section>

      {selectedMapPlace && (
        <div className="map-place-sheet-backdrop" role="presentation" onClick={() => setSelectedMapPlaceId(null)}>
          <section className="map-place-sheet" role="dialog" aria-modal="true" aria-label={`${selectedMapPlace.name} 장소 정보`} onClick={(event) => event.stopPropagation()}>
            <button type="button" className="map-place-close" aria-label="닫기" onClick={() => setSelectedMapPlaceId(null)}>×</button>
            <div className="map-place-sheet-head"><span className="place-icon-box"><PlaceIcon placeId={selectedMapPlace.id} size={24} /></span><div><p>{selectedMapPlace.mark}</p><h3>{selectedMapPlace.name}</h3></div></div>
            <span className="map-place-sheet-signal">{todayPlaceIds.has(selectedMapPlace.id) ? getPlaceSignal(selectedMapPlace.id) : '오늘의 외출 후보가 아님'}</span>
            <p>{selectedMapPlace.note}</p>
            <small>{selectedMapPlace.nightOnly ? '밤에만 갈 수 있는 장소' : `${timeOfDay}에도 방문 가능`}</small>
            <button
              type="button"
              className="primary-button map-place-go"
              disabled={!isMapPlaceAvailable(selectedMapPlace.id)}
              onClick={() => { if (isMapPlaceAvailable(selectedMapPlace.id)) { setSelectedMapPlaceId(null); enterPlace(selectedMapPlace.id) } }}
            >
              {isMapPlaceAvailable(selectedMapPlace.id) ? '이곳으로 간다' : !progress.unlockedPlaceIds.includes(selectedMapPlace.id) ? '아직 갈 수 없는 장소' : !todayPlaceIds.has(selectedMapPlace.id) ? '오늘은 다른 곳으로 가보자' : '지금은 갈 수 없음'}
            </button>
          </section>
        </div>
      )}

      {showDayEndModal && (
        <div className="game-modal-backdrop" role="presentation" onClick={() => setShowDayEndModal(false)}>
          <section className="game-modal day-end-modal" role="dialog" aria-modal="true" aria-labelledby="day-end-title" onClick={(event) => event.stopPropagation()}>
            <p className="eyebrow">END OF DAY</p>
            <h2 id="day-end-title">오늘을 마칠까요?</h2>
            <p>오늘의 기록을 닫고 다음 날로 넘어갑니다.</p>
            <div className="today-meeting-summary">
              <span>오늘 만난 사람</span>
              {todayMeetings.length ? todayMeetings.map(({ character, meeting }) => (
                <div key={character!.id}><strong>{character!.name}</strong><small>{getPlace(meeting.placeId)?.name ?? '어딘가'} · {meeting.title}</small></div>
              )) : <small>오늘은 아직 아무도 만나지 않았어요.</small>}
            </div>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowDayEndModal(false)}>조금 더 둘러본다</button><button type="button" className="primary-button" onClick={() => { nextDay(); setShowDayEndModal(false); setShowDayTransition(true) }}>오늘을 마친다</button></div>
          </section>
        </div>
      )}

      {showDayTransition && (
        <div className="day-transition-overlay" aria-live="polite"><span>D + 1</span><strong>DAY {String(progress.day).padStart(2, '0')}</strong><small>{weatherMark[progress.weather]} {progress.weather}</small></div>
      )}

      <BottomNav active="outing" onNavigate={onNavigate} />
    </div>
  )
}
