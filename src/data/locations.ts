import type { PlaceDefinition, Weather } from '../types/game'

export const places: PlaceDefinition[] = [
  {
    id: 'subway', name: '지하철역', mark: 'SUBWAY',
    note: '익숙한 노선도 오늘은 조금 다르게 보인다.',
    routes: [
      { id: 'platform-end', title: '사람이 적은 승강장 끝으로 간다', note: '전광판 소리가 멀어진다.' },
      { id: 'underground-exit', title: '지하상가 쪽 출구로 돌아간다', note: '문 닫을 준비를 하는 가게들이 보인다.' },
    ],
    weatherWeights: { 맑음: 1, 흐림: 1, 비: 1.35, 눈: 1.15 },
  },
  {
    id: 'library', name: '시립 도서관', mark: 'LIBRARY',
    note: '책장 사이에는 낮과 밤이 서로 다른 표정을 숨기고 있다.',
    routes: [
      { id: 'history-floor', title: '오래된 자료가 모인 층으로 올라간다', note: '기록과 고전 자료가 유난히 많은 곳이다.' },
      { id: 'window-seat', title: '창가 열람실 쪽으로 간다', note: '밤에는 유리창에 실내가 거울처럼 비친다.' },
    ],
    weatherWeights: { 맑음: 1, 흐림: 1.15, 비: 1.25, 눈: 1.1 },
  },
  {
    id: 'bookstore', name: '독립서점', mark: 'BOOKSTORE',
    note: '작은 출판물과 오래된 책 사이에 누군가의 취향이 남아 있다.',
    routes: [
      { id: 'front-shelf', title: '신간과 독립출판 진열대를 본다', note: '손때가 덜 탄 책들이 반듯하게 놓여 있다.' },
      { id: 'backroom', title: '안쪽의 오래된 책 코너로 간다', note: '직원만 들어갈 것 같은 좁은 문 너머로 종이 냄새가 짙어진다.' },
    ],
    weatherWeights: { 맑음: 1.05, 흐림: 1.1, 비: 1.35, 눈: 1.15 },
  },
  {
    id: 'cafe', name: '카페 거리', mark: 'CAFE',
    note: '커피보다 사람 구경이 더 좋은 영감일 때도 있다.',
    routes: [
      { id: 'old-cafe', title: '조용한 개인 카페에 들어간다', note: '오래된 목재 문을 밀자 작은 종이 울린다.' },
      { id: 'takeout-alley', title: '음료를 들고 골목 쪽으로 걷는다', note: '사람이 많은 큰길에서 한 발 비켜난다.' },
    ],
    weatherWeights: { 맑음: 1.1, 흐림: 1, 비: 1.2, 눈: 1.05 },
  },
  {
    id: 'convenience', name: '편의점', mark: 'CONVENIENCE',
    note: '별일 없을 것 같은 장소에서 가장 사소한 얼굴을 보게 된다.',
    routes: [
      { id: 'drink-aisle', title: '음료와 디저트 코너를 천천히 본다', note: '취향은 사소한 데서 티가 난다.' },
      { id: 'window-table', title: '창가 테이블에 잠깐 앉는다', note: '야식과 영수증, 지나가는 사람들의 그림자가 겹친다.' },
    ],
    weatherWeights: { 맑음: 1, 흐림: 1.05, 비: 1.25, 눈: 1.2 }, locked: true,
  },
  {
    id: 'mall', name: '대형 쇼핑몰', mark: 'MALL',
    note: '진열대와 사람들 사이를 천천히 훑어본다.',
    routes: [
      { id: 'popup-floor', title: '팝업과 전시가 모인 층으로 간다', note: '주말도 아닌데 유난히 사람이 많다.' },
      { id: 'living-floor', title: '생활·인테리어 매장을 둘러본다', note: '원단과 소품을 보는 건 일의 연장 같기도 하다.' },
    ],
    weatherWeights: { 맑음: 0.95, 흐림: 1.05, 비: 1.35, 눈: 1.3 },
  },
  {
    id: 'riverside', name: '강변 공원', mark: 'RIVERSIDE',
    note: '바람이 좋은 날엔 조금 멀리 걸어도 괜찮다.',
    routes: [
      { id: 'water-path', title: '물가 가까운 산책로로 내려간다', note: '자전거 소리가 멀어지고 물소리가 가까워진다.' },
      { id: 'bench-zone', title: '편의점 근처 벤치 쪽으로 간다', note: '간단한 간식을 먹는 사람들이 드문드문 보인다.' },
    ],
    weatherWeights: { 맑음: 1.45, 흐림: 1.05, 비: 0.35, 눈: 0.65 },
  },
  {
    id: 'museum', name: '미술관', mark: 'MUSEUM',
    note: '누군가의 시선을 빌리면 새로운 모양이 보일지도 모른다.',
    routes: [
      { id: 'special-exhibit', title: '기간 한정 특별전으로 향한다', note: '낯선 작가의 이름이 크게 적혀 있다.' },
      { id: 'museum-shop', title: '전시보다 먼저 기념품숍을 둘러본다', note: '작은 오브제들이 빼곡하게 진열되어 있다.' },
    ],
    weatherWeights: { 맑음: 1, 흐림: 1.1, 비: 1.2, 눈: 1.15 },
  },
  {
    id: 'aquarium', name: '아쿠아리움', mark: 'AQUARIUM',
    note: '푸른 빛 아래에서는 평소와 다른 표정이 더 잘 보인다.',
    routes: [
      { id: 'tunnel', title: '수중 터널 쪽으로 천천히 걷는다', note: '머리 위로 물결 그림자가 흐른다.' },
      { id: 'jellyfish', title: '해파리 전시실에 오래 머문다', note: '말수가 적어지는 푸른 방이다.' },
    ],
    weatherWeights: { 맑음: 1, 흐림: 1.05, 비: 1.25, 눈: 1.2 }, locked: true,
  },
  {
    id: 'rooftop', name: '루프탑', mark: 'ROOFTOP',
    note: '도시를 조금 멀리서 보면 말하기 쉬워지는 것도 있다.',
    routes: [
      { id: 'railing', title: '난간 가까이에서 도시를 내려다본다', note: '바람이 세고 아래의 소음은 멀다.' },
      { id: 'bench', title: '조명이 닿지 않는 벤치 쪽으로 간다', note: '둘이 앉아도 조금 남는 자리다.' },
    ],
    weatherWeights: { 맑음: 1.35, 흐림: 1.1, 비: 0.25, 눈: 0.55 }, locked: true,
  },
  {
    id: 'old-street', name: '오래된 상가거리', mark: 'OLD STREET',
    note: '새 간판 사이로 오래된 가게들이 아직 남아 있다.',
    routes: [
      { id: 'inner-alley', title: '간판이 적은 안쪽 골목으로 들어간다', note: '낮인데도 유난히 그늘이 깊다.' },
      { id: 'old-shops', title: '오래된 가게들을 천천히 구경한다', note: '문을 연 곳보다 닫힌 곳이 더 많다.' },
    ],
    weatherWeights: { 맑음: 0.95, 흐림: 1.25, 비: 1.4, 눈: 1.05 },
  },
  {
    id: 'night-market', name: '야시장', mark: 'NIGHT MARKET',
    note: '조명과 냄새와 사람 목소리가 한꺼번에 몰려드는 밤의 거리.',
    routes: [
      { id: 'food-stalls', title: '먹거리 노점 사이를 걷는다', note: '달고 맵고 뜨거운 냄새가 번갈아 따라온다.' },
      { id: 'game-stalls', title: '게임과 소품 노점 쪽으로 간다', note: '싸구려 장난감과 반짝이는 조명이 가득하다.' },
    ],
    weatherWeights: { 맑음: 1.3, 흐림: 1.05, 비: 0.4, 눈: 0.7 }, nightOnly: true, locked: true,
  },
  {
    id: 'bar', name: 'BAR', mark: 'BAR',
    note: '낮에는 찾기 어려운 문이 밤이 되면 불을 밝힌다.',
    routes: [
      { id: 'counter', title: '바 테이블 끝자리에 앉는다', note: '낯선 사람과도 말이 섞이기 쉬운 자리다.' },
      { id: 'back-seat', title: '안쪽의 조용한 자리를 고른다', note: '음악 소리가 조금 멀게 들린다.' },
    ],
    weatherWeights: { 맑음: 1, 흐림: 1.05, 비: 1.15, 눈: 1.1 }, nightOnly: true, locked: true,
  },
]

export const initialUnlockedPlaceIds = places.filter((place) => !place.locked).map((place) => place.id)
export function getPlace(placeId: string) { return places.find((place) => place.id === placeId) }
const featuredUnlockedPlaceIds = new Set(['convenience', 'aquarium', 'rooftop', 'night-market'])

export function getWeightedDailyPlaces(weather: Weather, unlockedPlaceIds: string[], count: number): string[] {
  const pool = places.filter((place) => unlockedPlaceIds.includes(place.id)).map((place) => ({
    place,
    weight: place.weatherWeights[weather] * (featuredUnlockedPlaceIds.has(place.id) ? 1.3 : 1),
  }))
  const selected: string[] = []; const mutable = [...pool]
  while (mutable.length > 0 && selected.length < count) {
    const total = mutable.reduce((sum, item) => sum + item.weight, 0); let cursor = Math.random() * total; let index = 0
    for (; index < mutable.length; index += 1) { cursor -= mutable[index].weight; if (cursor <= 0) break }
    const picked = mutable.splice(Math.min(index, mutable.length - 1), 1)[0]; selected.push(picked.place.id)
  }
  return selected
}
