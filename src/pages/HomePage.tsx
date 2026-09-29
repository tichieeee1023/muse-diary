import { useEffect, useState } from 'react'
import { BottomNav, type MainSection } from '../components/BottomNav'
import { CharacterSD } from '../components/CharacterSD'
import { PlaceIcon } from '../components/PlaceIcon'
import { getAllCharacters, hasEncounterCandidate, isFirstEncounterAvailable } from '../engine/encounterEngine'
import { hasCompletedFirstEncounter, isAffinityEventReady } from '../engine/storyEngine'
import { getPlace } from '../data/locations'
import { getWorkroomDialogue } from '../data/characterFlavor'
import { formatGameText } from '../engine/textFormatter'
import { playUiSound } from '../engine/soundEngine'
import { AUTUMN_EVENT_DAY, AUTUMN_EVENT_ID, SPRING_EVENT_DAY, SPRING_EVENT_ID, SUMMER_EVENT_DAY, SUMMER_EVENT_ID, WINTER_EVENT_DAY, WINTER_EVENT_ID, autumnEvent, springEvent, summerEvent, winterEvent } from '../data/seasonalEvents'
import { useGameStore } from '../store/useGameStore'

const weatherCopy = {
  맑음: { 낮: '햇빛이 작업실 바닥까지 길게 들어온다.', 밤: '창밖의 불빛이 작업실 바닥에 옅게 번진다.' },
  흐림: { 낮: '창밖은 흐리지만, 걷기에는 나쁘지 않은 날이다.', 밤: '흐린 밤공기 너머로 창문에 실내 불빛이 비친다.' },
  비: { 낮: '창문을 두드리는 빗소리가 오늘의 분위기를 바꿔놓는다.', 밤: '창문을 두드리는 빗소리가 조용한 작업실에 남는다.' },
  눈: { 낮: '도시가 평소보다 조금 낯설어 보인다.', 밤: '가로등 아래 눈발이 천천히 쌓인다.' },
} as const

const weatherMark = {
  맑음: '☀',
  흐림: '☁',
  비: '☂',
  눈: '❄',
} as const

interface HomePageProps {
  onNavigate: (section: MainSection) => void
  onStartSeasonalEvent: (eventId: string) => void
}

export function HomePage({ onNavigate, onStartSeasonalEvent }: HomePageProps) {
  const player = useGameStore((state) => state.player)
  const progress = useGameStore((state) => state.progress)
  const nextDay = useGameStore((state) => state.nextDay)
  const enterPlace = useGameStore((state) => state.enterPlace)
  const collection = useGameStore((state) => state.collection)
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled)
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
  const firstEncounterCompletedCharacterIds = characters
    .filter((character) => hasCompletedFirstEncounter(character.id, collection))
    .map((character) => character.id)
  const seasonalEligibleCharacters = characters.filter((character) =>
    collection.discoveredCharacterIds.includes(character.id) && hasCompletedFirstEncounter(character.id, collection),
  )
  const springRecord = collection.seasonalEventRecords[SPRING_EVENT_ID]
  const summerRecord = collection.seasonalEventRecords[SUMMER_EVENT_ID]
  const autumnRecord = collection.seasonalEventRecords[AUTUMN_EVENT_ID]
  const winterRecord = collection.seasonalEventRecords[WINTER_EVENT_ID]
  const springEventComplete = Boolean(springRecord)
  const summerEventComplete = Boolean(summerRecord)
  const autumnEventComplete = Boolean(autumnRecord)
  const winterEventComplete = Boolean(winterRecord)
  const isSpringSpecialDay = progress.day >= SPRING_EVENT_DAY && !springEventComplete && seasonalEligibleCharacters.length >= 2
  const isSummerSpecialDay = progress.day >= SUMMER_EVENT_DAY
    && springEventComplete
    && !summerEventComplete
    && seasonalEligibleCharacters.length >= 2
    && (springRecord?.day ?? 0) < progress.day
  const isAutumnSpecialDay = progress.day >= AUTUMN_EVENT_DAY
    && summerEventComplete
    && !autumnEventComplete
    && seasonalEligibleCharacters.length >= 2
    && (summerRecord?.day ?? 0) < progress.day
  const isWinterSpecialDay = progress.day >= WINTER_EVENT_DAY
    && autumnEventComplete
    && !winterEventComplete
    && seasonalEligibleCharacters.length >= 2
    && (autumnRecord?.day ?? 0) < progress.day

  const canEncounterAtPlace = (placeId: string) => {
    const place = getPlace(placeId)
    if (!place) return false
    if (place.nightOnly && timeOfDay !== '밤') return false
    return hasEncounterCandidate({
      placeId,
      routeId: place.routes[0]?.id ?? '',
      timeOfDay,
      weather: progress.weather,
      lastCharacterId: collection.lastEncounterCharacterId,
      recentEncounterCharacterIds: collection.recentEncounterCharacterIds,
      completedCharacterIds: collection.completedCharacterIds,
      ssrMissStreak: progress.ssrMissStreak,
      discoveredCharacterIds: collection.discoveredCharacterIds,
      firstEncounterCompletedCharacterIds,
      seenEpisodeIdsByCharacterId: collection.seenEpisodeIdsByCharacterId,
    })
  }

  const readyEvents = characters.filter((character) => collection.discoveredCharacterIds.includes(character.id) && isAffinityEventReady(character.id, collection))
  const recommendedReadyCharacter = readyEvents[0]
  const recommendedReadyPlaceId = recommendedReadyCharacter?.spawnRules.find((rule) =>
    todayPlaces.some((place) => place?.id === rule.placeId)
    && progress.unlockedPlaceIds.includes(rule.placeId)
    && canEncounterAtPlace(rule.placeId),
  )?.placeId

  const recommendedFirstCharacter = characters.find((character) =>
    !hasCompletedFirstEncounter(character.id, collection)
    && todayPlaces.some((place) => place?.id === character.firstEncounterRule.placeId)
    && progress.unlockedPlaceIds.includes(character.firstEncounterRule.placeId)
    && isFirstEncounterAvailable(character, { placeId: character.firstEncounterRule.placeId, timeOfDay, weather: progress.weather }),
  )

  const recommendedPlaceId = recommendedReadyPlaceId ?? recommendedFirstCharacter?.firstEncounterRule.placeId
  const recommendedPlace = recommendedPlaceId
    ? getPlace(recommendedPlaceId)
    : todayPlaces.find((place) => place && progress.unlockedPlaceIds.includes(place.id) && canEncounterAtPlace(place.id)) ?? null
  const todayMeetings = Object.entries(collection.lastMeetingByCharacterId)
    .filter(([, meeting]) => meeting.day === progress.day)
    .map(([characterId, meeting]) => ({ character: characters.find((character) => character.id === characterId), meeting }))
    .filter((item) => item.character)

  const messageCharacters = characters.filter((character) =>
    collection.discoveredCharacterIds.includes(character.id) && hasCompletedFirstEncounter(character.id, collection),
  )
  const dailyMessageCharacter = messageCharacters.length
    ? messageCharacters[(Math.max(1, progress.day) - 1) % messageCharacters.length]
    : null
  const dailyMessageAffection = dailyMessageCharacter ? (collection.affectionByCharacterId[dailyMessageCharacter.id] ?? 0) : 0
  const dailyMessageCompleted = dailyMessageCharacter ? collection.completedCharacterIds.includes(dailyMessageCharacter.id) : false
  const dailyMessage = dailyMessageCharacter
    ? formatGameText(getWorkroomDialogue(dailyMessageCharacter.id, dailyMessageAffection, dailyMessageCompleted, progress.day), player.name)
    : ''

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
    return canEncounterAtPlace(placeId)
  }

  const getPlaceSignal = (placeId: string) => {
    if (readyEvents.some((character) => character.spawnRules.some((rule) => rule.placeId === placeId))) return 'NEW EVENT'
    if (characters.some((character) =>
      !hasCompletedFirstEncounter(character.id, collection)
      && isFirstEncounterAvailable(character, { placeId, timeOfDay, weather: progress.weather }),
    )) return '낯선 기척'
    if (characters.some((character) =>
      hasCompletedFirstEncounter(character.id, collection)
      && character.spawnRules.some((rule) => rule.placeId === placeId),
    )) return '익숙한 기척'
    return '오늘의 영감'
  }

  return (
    <div className={`page home-page${isSpringSpecialDay || isSummerSpecialDay || isAutumnSpecialDay || isWinterSpecialDay ? ' is-special-day' : ''}`}>
      <header className="day-header">
        <div>
          <p className="eyebrow">WORK DIARY</p>
          <h1>DAY {String(progress.day).padStart(2, '0')}</h1>
        </div>
        <div className={`weather-badge weather-${progress.weather}`} aria-label={`오늘 날씨 ${progress.weather}`}>
          <b aria-hidden="true">{timeOfDay === '밤' ? '☾' : weatherMark[progress.weather]}</b>
          <span>{timeOfDay === '밤' ? `${progress.weather} · 밤` : progress.weather}</span>
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
        <p>{weatherCopy[progress.weather][timeOfDay]}</p>
        <div className="progress-line">
          <span>오늘의 외출</span>
          <strong>{'●'.repeat(progress.actionsLeft)}{'○'.repeat(3 - progress.actionsLeft)}</strong>
        </div>
      </section>

      {dailyMessageCharacter && (
        <section className={`workroom-message${dailyMessageCompleted ? ' is-complete' : ''}`} aria-label={`${dailyMessageCharacter.name}에게서 온 오늘의 메시지`}>
          <CharacterSD
            characterId={dailyMessageCharacter.id}
            name={dailyMessageCharacter.name}
            symbol={dailyMessageCharacter.symbol}
            className="workroom-message-sd"
            decorative
          />
          <div className="workroom-message-copy">
            <div className="workroom-message-meta">
              <span>TODAY'S MESSAGE</span>
              <small>{dailyMessageCompleted ? 'ROUTE COMPLETE' : `HEART ${dailyMessageAffection}`}</small>
            </div>
            <strong>{dailyMessageCharacter.name}</strong>
            <p>“{dailyMessage}”</p>
          </div>
        </section>
      )}

      {isSpringSpecialDay && (
        <section className="spring-special-home">
          <div className="spring-special-home-petals" aria-hidden="true">✿ · ✿ · ✿</div>
          <div className="spring-special-home-copy">
            <p className="eyebrow">SPECIAL DAY · SPRING</p>
            <span>SEASON 01</span>
            <h2>{springEvent.title}</h2>
            <strong>{springEvent.subtitle}</strong>
            <p>오늘은 평소의 외출을 쉬고, 지금까지 만난 사람 중 한 명과 봄꽃 야간 개장에 갑니다.</p>
            <small>동행 가능 {seasonalEligibleCharacters.length}명 · 선택한 사람과 특별한 봄 기록이 남아요.</small>
          </div>
          <button type="button" className="spring-special-home-button" onClick={() => { playUiSound('special', soundEnabled); onStartSeasonalEvent(SPRING_EVENT_ID) }}>함께 갈 사람 고르기 <b>→</b></button>
        </section>
      )}

      {isSummerSpecialDay && (
        <section className="summer-special-home">
          <div className="summer-special-home-sparks" aria-hidden="true">✦ · ✹ · ✦</div>
          <div className="summer-special-home-copy">
            <p className="eyebrow">SPECIAL DAY · SUMMER</p>
            <span>SEASON 02</span>
            <h2>{summerEvent.title}</h2>
            <strong>{summerEvent.subtitle}</strong>
            <p>오늘은 평소의 외출을 쉬고, 한 사람과 강변 불꽃축제의 가장 밝은 밤을 보냅니다.</p>
            <small>동행 가능 {seasonalEligibleCharacters.length}명 · 불꽃 아래에서 둘만의 여름 기록이 남아요.</small>
          </div>
          <button type="button" className="summer-special-home-button" onClick={() => { playUiSound('special', soundEnabled); onStartSeasonalEvent(SUMMER_EVENT_ID) }}>함께 불꽃 볼 사람 고르기 <b>→</b></button>
        </section>
      )}

      {isAutumnSpecialDay && (
        <section className="autumn-special-home">
          <div className="autumn-special-home-leaves" aria-hidden="true">❧ · ◆ · ❧</div>
          <div className="autumn-special-home-copy">
            <p className="eyebrow">SPECIAL DAY · AUTUMN</p>
            <span>SEASON 03</span>
            <h2>{autumnEvent.title}</h2>
            <strong>{autumnEvent.subtitle}</strong>
            <p>오늘은 평소의 외출을 쉬고, 한 사람과 조용한 늦가을 정원을 천천히 걷습니다.</p>
            <small>동행 가능 {seasonalEligibleCharacters.length}명 · 익숙한 얼굴과도 잠깐 스쳐 지나갈 수 있어요.</small>
          </div>
          <button type="button" className="autumn-special-home-button" onClick={() => { playUiSound('special', soundEnabled); onStartSeasonalEvent(AUTUMN_EVENT_ID) }}>함께 걸을 사람 고르기 <b>→</b></button>
        </section>
      )}

      {isWinterSpecialDay && (
        <section className="winter-special-home">
          <div className="winter-special-home-snow" aria-hidden="true">❄ · ❅ · ❄</div>
          <div className="winter-special-home-copy">
            <p className="eyebrow">SPECIAL DAY · WINTER</p>
            <span>SEASON 04</span>
            <h2>{winterEvent.title}</h2>
            <strong>{winterEvent.subtitle}</strong>
            <p>오늘은 평소의 외출을 쉬고, 한 사람과 편백 향이 나는 산장으로 겨울 나들이를 갑니다.</p>
            <small>동행 가능 {seasonalEligibleCharacters.length}명 · 돌아갈 시간이 늦어진 만큼 둘만의 겨울이 길어져요.</small>
          </div>
          <button type="button" className="winter-special-home-button" onClick={() => { playUiSound('special', soundEnabled); onStartSeasonalEvent(WINTER_EVENT_ID) }}>함께 눈 보러 갈 사람 고르기 <b>→</b></button>
        </section>
      )}

      <section className={`next-step-card${readyEvents.length > 0 ? ' has-ready-event' : ''}`}>
        <div className="next-step-icon" aria-hidden="true">{readyEvents.length > 0 ? '♥' : '✦'}</div>
        <div>
          <p className="eyebrow">{readyEvents.length > 0 ? 'NEW AFFINITY EVENT' : '오늘의 추천'}</p>
          <strong>{recommendedReadyCharacter ? `${recommendedReadyCharacter.name}와의 다음 기록` : recommendedFirstCharacter ? '낯선 인연의 기척' : '오늘의 영감을 찾아 떠나기'}</strong>
          <small>{recommendedPlace ? `${recommendedPlace.name}에서 ${recommendedFirstCharacter && !recommendedReadyCharacter ? '새로운 만남을' : '새로운 장면을'} 발견할 수 있어요.` : '지도를 열고 오늘 갈 수 있는 장소를 골라보세요.'}</small>
          {readyEvents.length > 0 && (
            <div className="next-step-event-chips" aria-label="열린 호감도 이벤트">
              {readyEvents.slice(0, 4).map((character) => <span key={character.id}><CharacterSD characterId={character.id} name={character.name} symbol={character.symbol} decorative className="new-event-chip-sd" />{character.name}</span>)}
              {readyEvents.length > 4 && <em>+{readyEvents.length - 4}</em>}
            </div>
          )}
        </div>
        <button type="button" className="next-step-go" onClick={() => { playUiSound(recommendedPlace ? 'travel' : 'tap', soundEnabled); recommendedPlace ? enterPlace(recommendedPlace.id) : onNavigate('characters') }} disabled={!recommendedPlace || progress.actionsLeft <= 0}>
          {recommendedPlace ? (readyEvents.length > 0 ? '이벤트 장소' : '장소 보기') : '도감 보기'}
        </button>
      </section>

      <section className="place-section" aria-labelledby="place-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">오늘의 장소</p>
            <h2 id="place-title">영감을 찾아 나가보자.</h2>
          </div>
          <button
            type="button"
            className={`next-day-button${progress.actionsLeft === 0 ? ' is-ready' : ''}`}
            onClick={() => { playUiSound('tap', soundEnabled); setShowDayEndModal(true) }}
          >
            <span>{progress.actionsLeft === 0 ? 'DAY COMPLETE' : `외출 ${3 - progress.actionsLeft} / 3`}</span>
            <strong>다음 날 <b>→</b></strong>
          </button>
        </div>

        {progress.actionsLeft > 0 ? (
          <>
            <div className="place-view-switch" role="tablist" aria-label="장소 보기 방식">
              <button type="button" className={placeView === 'map' ? 'is-active' : ''} onClick={() => { playUiSound('tap', soundEnabled); setPlaceView('map') }}>지도</button>
              <button type="button" className={placeView === 'list' ? 'is-active' : ''} onClick={() => { playUiSound('tap', soundEnabled); setPlaceView('list') }}>목록</button>
            </div>

            {placeView === 'map' ? (
              <>
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
                      onClick={() => { playUiSound('map', soundEnabled); setSelectedMapPlaceId(placeId) }}
                      aria-label={`${place.name}${available ? ', 오늘 방문 가능' : ', 현재 방문 불가'}`}
                    >
                      <span className="city-map-pin-icon"><PlaceIcon placeId={place.id} size={18} /></span>
                      <strong>{unlocked ? place.name : '???'}</strong>
                      {(signal === 'NEW EVENT' || signal === '낯선 기척') && <em className="city-map-signal">NEW</em>}
                    </button>
                  )
                })}
              </div>
              <div className="city-map-meta">
                <div className="city-map-legend" aria-label="지도 표시 안내">
                  <span><i className="is-available" />오늘 방문 가능</span>
                  <span><i className="is-event" />새 이벤트</span>
                  <span><i className="is-locked" />아직 잠김</span>
                </div>
                <p className="city-map-note">밝게 표시된 장소가 오늘의 외출 후보예요.</p>
              </div>
              </>
            ) : (
              <div className="place-list">
                {todayPlaces.map((place, index) => {
                  if (!place) return null
                  const isNightLocked = Boolean(place.nightOnly && timeOfDay !== '밤')
                  const hasEncounter = canEncounterAtPlace(place.id)
                  const isUnavailable = !isNightLocked && !hasEncounter
                  return (
                    <button
                      key={place.id}
                      type="button"
                      className={`place-card${isNightLocked || isUnavailable ? ' is-time-locked' : ''}`}
                      disabled={isNightLocked || isUnavailable}
                      onClick={() => { playUiSound('travel', soundEnabled); enterPlace(place.id) }}
                    >
                      <span className="place-icon-box"><PlaceIcon placeId={place.id} size={22} /></span>
                      <span className="place-copy">
                        <span className="place-card-kicker">0{index + 1} · {place.mark}</span><em className="place-signal">{getPlaceSignal(place.id)}</em>
                        <strong>{place.name}</strong>
                        <small>{isNightLocked ? '밤이 되어야 문이 열린다.' : isUnavailable ? '지금은 특별한 기척이 없다.' : place.note}</small>
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
            <small>{selectedMapPlace.nightOnly && timeOfDay !== '밤' ? '밤에만 갈 수 있는 장소' : !canEncounterAtPlace(selectedMapPlace.id) ? '지금은 특별한 기척이 없다.' : `${timeOfDay}에도 방문 가능`}</small>
            <button
              type="button"
              className="primary-button map-place-go"
              disabled={!isMapPlaceAvailable(selectedMapPlace.id)}
              onClick={() => { if (isMapPlaceAvailable(selectedMapPlace.id)) { playUiSound('travel', soundEnabled); setSelectedMapPlaceId(null); enterPlace(selectedMapPlace.id) } }}
            >
              {isMapPlaceAvailable(selectedMapPlace.id) ? '이곳으로 간다' : !progress.unlockedPlaceIds.includes(selectedMapPlace.id) ? '아직 갈 수 없는 장소' : !todayPlaceIds.has(selectedMapPlace.id) ? '오늘은 다른 곳으로 가보자' : !canEncounterAtPlace(selectedMapPlace.id) ? '지금은 특별한 기척이 없다' : '지금은 갈 수 없음'}
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
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => { playUiSound('tap', soundEnabled); setShowDayEndModal(false) }}>조금 더 둘러본다</button><button type="button" className="primary-button" onClick={() => { playUiSound('day', soundEnabled); nextDay(); setShowDayEndModal(false); setShowDayTransition(true) }}>오늘을 마친다</button></div>
          </section>
        </div>
      )}

      {showDayTransition && (
        <div className="day-transition-overlay" aria-live="polite"><span>NEW DAY</span><strong>DAY {String(progress.day).padStart(2, '0')}</strong><small>{weatherMark[progress.weather]} {progress.weather} · 새로운 하루가 시작되었습니다.</small></div>
      )}

      <BottomNav active="outing" onNavigate={onNavigate} />
    </div>
  )
}
