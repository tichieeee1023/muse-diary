import type { TimeOfDay, Weather } from '../types/game'

const ROOT = '/assets/backgrounds'

export type StoryEpisodeKind = 'first' | 'casual' | 'story'
export type SeasonalEventStep = 'intro' | 'select' | 'arrival' | 'branch' | 'choice-result' | 'after' | 'complete'
export type SeasonKey = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER'

interface SceneBackgroundContext {
  placeId: string
  routeId?: string
  timeOfDay: TimeOfDay
  weather: Weather
  characterId?: string
  episodeKind?: StoryEpisodeKind
}

function asset(path: string) {
  return `${ROOT}/${path}`
}

/**
 * 장소 화면에서 사용할 배경 후보를 우선순위대로 반환한다.
 *
 * 우선순위
 * 1. 캐릭터 전용 공간(해당 장소 + 중요 스토리)
 * 2. 세부 동선 + 날씨/시간에 정확히 맞는 이미지
 * 3. 세부 동선 전용 이미지
 * 4. 장소의 날씨/시간 이미지
 * 5. main fallback
 */
export function getSceneBackgroundCandidates({
  placeId,
  routeId,
  timeOfDay,
  weather,
  characterId,
  episodeKind,
}: SceneBackgroundContext) {
  const list: string[] = []
  const push = (path: string) => {
    const full = asset(path)
    if (!list.includes(full)) list.push(full)
  }
  const night = timeOfDay === '밤'

  // 캐릭터 전용 공간. DAILY 전체에 강제하지 않고 FIRST/AFFINITY에서만 우선 사용한다.
  if (placeId === 'museum' && characterId === 'char_008' && episodeKind === 'story') {
    push('museum/secret-art-studio-sehyun.webp')
  }
  if (placeId === 'old-street' && characterId === 'char_009' && episodeKind === 'story') {
    push('old-street/consultation-office-igyeom.webp')
  }
  if (placeId === 'mall' && characterId === 'char_011') {
    if (episodeKind === 'story') push('mall/event-stage-star-yurian.webp')
    if (episodeKind === 'first') push('mall/event-stage-yurian.webp')
  }
  if (placeId === 'old-street' && characterId === 'char_012' && (episodeKind === 'first' || episodeKind === 'story')) {
    push('old-street/clock-room-ihyeon.webp')
  }

  // 장소별 세부 동선.
  if (placeId === 'subway') {
    if (routeId === 'underground-exit') {
      if (night && weather === '비') push('subway/night-rain.webp')
      if (night) push('subway/night.webp')
      if (!night) push('subway/day.webp')
    }
    if (routeId === 'platform-end') push(night ? 'subway/main.webp' : 'subway/day.webp')
  }

  if (placeId === 'library') {
    if (routeId === 'history-floor') push('library/history.webp')
    if (routeId === 'window-seat' && weather === '비') push('library/rain.webp')
  }

  if (placeId === 'bookstore' && routeId === 'backroom') push('bookstore/backroom.webp')

  if (placeId === 'cafe') {
    if (routeId === 'takeout-alley' && !night) {
      push(weather === '맑음' ? 'cafe/street-day-02.webp' : 'cafe/street-day-01.webp')
    }
    if (routeId === 'old-cafe' && weather === '비') push('cafe/rain.webp')
  }

  if (placeId === 'convenience') {
    if (routeId === 'drink-aisle') push('convenience/main.webp')
    if (routeId === 'window-table') push(night ? 'convenience/outdoor-night.webp' : 'convenience/outdoor-day.webp')
  }

  if (placeId === 'mall') {
    if (routeId === 'popup-floor') push('mall/exhibition.webp')
    if (routeId === 'living-floor') push('mall/exhibition2.webp')
  }

  if (placeId === 'riverside') {
    if (routeId === 'bench-zone' && night) push('riverside/bench-night.webp')
    if (routeId === 'water-path' && weather === '흐림') push('riverside/cloudy.webp')
  }

  if (placeId === 'museum') {
    if (routeId === 'special-exhibit') push(night ? 'museum/exhibition2.webp' : 'museum/exhibition.webp')
  }

  if (placeId === 'aquarium') {
    if (routeId === 'tunnel') push('aquarium/tunnel.webp')
    if (routeId === 'jellyfish') push('aquarium/main.webp')
  }

  if (placeId === 'bar' && routeId === 'back-seat') push('bar/seating.webp')

  // 장소/날씨 공통 후보.
  if (placeId === 'night-market') push('night-market/night.webp')
  if (placeId === 'old-street' && weather === '비' && night) push('old-street/night-rain.webp')
  if (placeId === 'riverside' && weather === '흐림') push('riverside/cloudy.webp')
  if (placeId === 'convenience') push('convenience/main.webp')
  if (placeId === 'aquarium') push('aquarium/main.webp')
  if (weather === '비') push(`${placeId}/rain.webp`)
  if (weather === '눈') push(`${placeId}/snow.webp`)
  push(`${placeId}/${night ? 'night' : 'day'}.webp`)
  push(`${placeId}/main.webp`)

  return list
}

/** 계절 이벤트의 진행 단계에 맞춰 전용 배경을 교체한다. */
export function getSeasonalEventBackground(season: SeasonKey, step: SeasonalEventStep, companionId?: string | null) {
  if (season === 'SPRING') {
    return asset(step === 'intro' || step === 'select' || step === 'arrival'
      ? 'event/spring-night-bloom-01.webp'
      : 'event/spring-night-bloom-02.webp')
  }

  if (season === 'SUMMER') {
    return asset(step === 'intro' || step === 'select' || step === 'arrival'
      ? 'event/summer-fireworks-01.webp'
      : 'event/summer-fireworks-02.webp')
  }

  if (season === 'AUTUMN') {
    return asset(step === 'intro' || step === 'select' || step === 'arrival'
      ? 'event/autumn-garden-01.webp'
      : 'event/autumn-garden-02.webp')
  }

  // 겨울은 장면 진행에 따라 외관 → 통창 라운지 → 따뜻한 실내로 이동한다.
  // 진이현의 PRIVATE MOMENT에서만 편백탕 직후의 맥락을 살릴 수 있는 별도 컷을 사용한다.
  if (companionId === 'char_012' && (step === 'branch' || step === 'choice-result')) {
    return asset('event/winter-hinoki-bath.webp')
  }
  if (step === 'intro' || step === 'select' || step === 'complete') return asset('event/winter-lodge-01.webp')
  if (step === 'arrival' || step === 'after') return asset('event/winter-lodge-02.webp')
  return asset('event/winter-lodge-03.webp')
}
