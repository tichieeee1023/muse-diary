import type { PortraitExpression } from '../types/game'

export type DateTouchKey = 'hand' | 'hair' | 'lean' | 'cheek' | 'tickle' | 'sleeve' | 'face'
export type DatePlaceMood = 'cozy' | 'open' | 'quiet' | 'playful' | 'intimate'
export type DateDistanceState = 'space' | 'normal' | 'close'
export type DateSpeechIntent = 'quiet' | 'gentle' | 'playful'
export type DateTurnTouchKey = 'none' | 'hand' | 'sleeve' | 'hair' | 'cheek' | 'tickle' | 'shoulder'
export type DateTouchState = 'none' | 'holdingHands' | 'interlockedHands' | 'sleeveHeld' | 'shoulderContact'
export type DateRelationshipStage = 'opening' | 'close' | 'deep' | 'complete'

export interface DateReaction {
  line: string
  narration: string
  expression?: PortraitExpression
}

export interface CharacterDateProfile {
  characterId: string
  weakSpot: DateTouchKey
  weakSpotLabel: string
  weakReaction: DateReaction
  reactions: Record<DateTouchKey, DateReaction>
  returnTouch: string
  favoritePlaceId: string
  favoritePlaceLine: string
  speechReactions: Record<DateSpeechIntent, DateReaction>
}

export interface DatePlaceTurnEvent {
  turn: number
  cue: string
  touchKey: DateTurnTouchKey
  touchLabel: string
  touchHint: string
  actionLine: string
}

export interface DatePlaceScenario {
  id: string
  name: string
  subtitle: string
  background: string
  minAffection: number
  mood: DatePlaceMood
  moodLabel: string
  intro: string
  closing: string
  ambientLines: [string, string, string]
  initialDistance: DateDistanceState
  distanceLines: Record<DateDistanceState, string>
  touchPool: DateTurnTouchKey[]
  speechLines: Record<DateSpeechIntent, string>
  touchLines: Partial<Record<DateTurnTouchKey, string>>
  turnEvents: DatePlaceTurnEvent[]
  tags: string[]
}

export interface DateTurnOption<T extends string> {
  id: T
  label: string
  hint: string
}


export interface DateConditionalChoiceContext {
  characterId: string
  dateHeart: number
  touchState: DateTouchState
  relationshipStage: DateRelationshipStage
  discoveredWeakness: boolean
}

export const dateSpeechOptions: DateTurnOption<DateSpeechIntent>[] = [
  { id: 'quiet', label: '아무 말도 하지 않는다', hint: '말보다 지금의 분위기를 지켜본다' },
  { id: 'gentle', label: '다정하게 말을 건넨다', hint: '부드럽고 솔직하게 말을 건넨다' },
  { id: 'playful', label: '조금 장난스럽게 말한다', hint: '가볍게 상대의 반응을 떠본다' },
]

const dateTouchDefinitions: Record<DateTurnTouchKey, DateTurnOption<DateTurnTouchKey> & { minDistance: DateDistanceState }> = {
  none: { id: 'none', label: '아무것도 하지 않는다', hint: '손은 그대로 둔다', minDistance: 'space' },
  hand: { id: 'hand', label: '손을 잡는다', hint: '손을 찾아 조심스럽게 잡는다', minDistance: 'normal' },
  sleeve: { id: 'sleeve', label: '소매 끝을 잡는다', hint: '손 대신 옷자락을 가볍게 붙잡는다', minDistance: 'space' },
  hair: { id: 'hair', label: '머리카락을 정리해준다', hint: '얼굴 옆으로 내려온 머리카락에 손을 뻗는다', minDistance: 'close' },
  cheek: { id: 'cheek', label: '볼을 살짝 건드린다', hint: '장난스럽게 얼굴 가까이 손을 뻗는다', minDistance: 'close' },
  tickle: { id: 'tickle', label: '옆구리를 살짝 찌른다', hint: '가볍게 장난을 걸어본다', minDistance: 'close' },
  shoulder: { id: 'shoulder', label: '어깨에 손을 얹는다', hint: '가까운 거리에서 조심스럽게 손을 올린다', minDistance: 'normal' },
}

const distanceRank: Record<DateDistanceState, number> = { space: 0, normal: 1, close: 2 }

export function getDateTouchOptions(placeId: string, distance: DateDistanceState) {
  const place = datePlaces.find((item) => item.id === placeId)
  if (!place) return [dateTouchDefinitions.none]
  return place.touchPool
    .map((key) => dateTouchDefinitions[key])
    .filter((option) => distanceRank[distance] >= distanceRank[option.minDistance])
}


export function getDateRelationshipStage(affection: number, completed: boolean): DateRelationshipStage {
  if (completed) return 'complete'
  if (affection >= 60) return 'deep'
  if (affection >= 40) return 'close'
  return 'opening'
}

const reactionKeyToTurnTouch: Partial<Record<DateTouchKey, DateTurnTouchKey>> = {
  hand: 'hand',
  hair: 'hair',
  lean: 'shoulder',
  cheek: 'cheek',
  tickle: 'tickle',
  sleeve: 'sleeve',
  face: 'cheek',
}

export function getDateWeakTurnTouchKey(characterId: string): DateTurnTouchKey | null {
  const profile = characterDateProfiles[characterId]
  if (!profile) return null
  return reactionKeyToTurnTouch[profile.weakSpot] ?? null
}

function isDeepRelationship(stage: DateRelationshipStage) {
  return stage === 'deep' || stage === 'complete'
}

export function getDateConditionalSpeechOptions(context: DateConditionalChoiceContext) {
  return dateSpeechOptions.map((option) => {
    if (option.id === 'gentle' && context.dateHeart >= 4 && isDeepRelationship(context.relationshipStage)) {
      return {
        ...option,
        label: '조금 더 솔직하게 말한다 ✦',
        hint: '분위기가 깊어진 만큼 숨기지 않고 마음을 전한다',
      }
    }
    if (option.id === 'playful' && context.discoveredWeakness && context.dateHeart >= 2) {
      return {
        ...option,
        label: '아까 반응을 살짝 놀린다 ✦',
        hint: '이미 알아버린 반응을 가볍게 떠본다',
      }
    }
    return option
  })
}

export function getDateConditionalTouchOptions(
  placeId: string,
  distance: DateDistanceState,
  context: DateConditionalChoiceContext,
  specialTouchKey?: DateTurnTouchKey,
) {
  const profile = characterDateProfiles[context.characterId]
  const weakTouchKey = getDateWeakTurnTouchKey(context.characterId)
  const deepRelationship = isDeepRelationship(context.relationshipStage)
  const base = getDateTouchOptions(placeId, distance)

  return base
    .filter((option) => {
      if (option.id === 'none') return true
      if (option.id === specialTouchKey) return true
      if (option.id === 'hand' || option.id === 'sleeve') return true

      // Persistent contact narrows the next move until the mood is high enough
      // to deliberately change the kind of touch.
      if (context.touchState !== 'none' && context.dateHeart < 4) {
        if (context.touchState === 'shoulderContact' && option.id === 'shoulder') return true
        return false
      }

      if (option.id === 'shoulder') {
        return context.dateHeart >= 2 || context.relationshipStage !== 'opening'
      }

      if (option.id === 'hair') {
        if (context.discoveredWeakness && weakTouchKey === 'hair') return true
        return context.relationshipStage !== 'opening' && context.dateHeart >= 2
      }

      if (option.id === 'cheek') {
        if (context.discoveredWeakness && weakTouchKey === 'cheek') return true
        return deepRelationship && context.dateHeart >= 3
      }

      if (option.id === 'tickle') {
        if (context.discoveredWeakness && weakTouchKey === 'tickle') return true
        return deepRelationship && context.dateHeart >= 2
      }

      return true
    })
    .map((option) => {
      let next = getDateTouchOptionCopy(option, context.touchState)

      if (option.id === 'hand') {
        if (context.touchState === 'holdingHands' && context.dateHeart >= 4) {
          next = { ...next, label: '손깍지를 낀다 ✦', hint: '잡고 있던 손에서 한 단계 더 가까워진다' }
        } else if (
          context.touchState === 'none'
          && context.dateHeart >= 4
          && deepRelationship
          && distance === 'close'
        ) {
          next = { ...next, label: '먼저 손깍지를 청한다 ✦', hint: '충분히 가까워진 분위기에 기대 손가락을 맞물린다' }
        } else if (context.touchState === 'sleeveHeld') {
          next = { ...next, label: '소매 대신 손을 잡는다', hint: '옷자락을 놓고 손으로 접촉을 옮긴다' }
        }
      }

      if (context.discoveredWeakness && weakTouchKey === option.id && option.id !== 'none') {
        next = {
          ...next,
          label: `아까 반응이 컸던 곳을 다시 건드린다 ✦`,
          hint: profile ? `${profile.weakSpotLabel} 쪽의 반응을 다시 확인한다` : next.hint,
        }
      }

      return next
    })
}

export function getDateTurnActionLog(
  placeId: string,
  speech: DateSpeechIntent,
  distance: DateDistanceState,
  touch: DateTurnTouchKey,
  currentTouchState: DateTouchState = 'none',
  nextTouchState: DateTouchState = currentTouchState,
) {
  const place = datePlaces.find((item) => item.id === placeId)
  if (!place) return []

  let touchLine = place.touchLines[touch] ?? place.touchLines.none ?? '손은 그대로 두었다.'

  if (touch === 'none' && currentTouchState !== 'none') {
    touchLine = '이어져 있던 접촉을 천천히 풀고 손을 거두었다.'
  } else if (touch === 'hand' && nextTouchState === 'interlockedHands' && currentTouchState === 'holdingHands') {
    touchLine = '잡고 있던 손을 놓지 않은 채 천천히 손가락을 맞물렸다.'
  } else if (touch === 'hand' && nextTouchState === 'interlockedHands' && currentTouchState === 'none') {
    touchLine = '손을 찾아 잡은 뒤, 망설이지 않고 천천히 손가락을 맞물렸다.'
  } else if (touch === 'hand' && currentTouchState === 'holdingHands') {
    touchLine = '잡고 있던 손을 놓지 않고 조금 더 단단히 맞잡았다.'
  } else if (touch === 'hand' && currentTouchState === 'interlockedHands') {
    touchLine = '맞물린 손가락을 풀지 않은 채 그대로 두었다.'
  } else if (touch === 'hand' && currentTouchState === 'sleeveHeld') {
    touchLine = '잡고 있던 소매 끝을 놓고, 이번에는 손을 직접 잡았다.'
  } else if (touch === 'sleeve' && currentTouchState === 'sleeveHeld') {
    touchLine = '잡고 있던 소매 끝을 놓지 않은 채 그대로 곁에 머물렀다.'
  } else if (touch === 'shoulder' && currentTouchState === 'shoulderContact') {
    touchLine = '어깨에 닿아 있던 손을 거두지 않고 그대로 두었다.'
  } else if (
    currentTouchState === 'holdingHands'
    || currentTouchState === 'interlockedHands'
    || currentTouchState === 'sleeveHeld'
    || currentTouchState === 'shoulderContact'
  ) {
    if (touch === 'hair' || touch === 'cheek' || touch === 'tickle' || touch === 'shoulder' || touch === 'sleeve') {
      const nextLine = place.touchLines[touch] ?? touchLine
      touchLine = `이어져 있던 접촉을 잠시 풀고, ${nextLine}`
    }
  }

  return [
    place.speechLines[speech],
    place.distanceLines[distance],
    touchLine,
  ].filter(Boolean)
}


export const datePlaces: DatePlaceScenario[] = [
  {
    id: 'cafe-date',
    name: '작은 카페',
    subtitle: '한 뼘 안에서 시작되는 오후',
    background: '/assets/backgrounds/cafe/day.webp',
    minAffection: 20,
    mood: 'cozy',
    moodLabel: 'COZY · DAY',
    intro: '창가 자리에 마주 앉았다. 테이블이 생각보다 작아서 컵을 내려놓을 때마다 서로의 손이 가까워졌다.',
    closing: '카페를 나설 때는 들어올 때보다 걸음이 조금 느렸다. 작은 테이블 위에 남겨둔 거리도 함께 사라진 것 같았다.',
    ambientLines: [
      '잔잔한 음악 사이로 컵이 접시에 닿는 소리가 작게 울렸다.',
      '창문으로 들어온 빛이 테이블 위를 천천히 옮겨갔다.',
      '대화가 잠깐 끊겨도 이상하게 어색하지 않았다.',
    ],
    initialDistance: 'normal',
    distanceLines: {
      space: '의자를 조금 뒤로 당겼다. 작은 테이블 너머로 한 뼘의 여유가 생겼다.',
      normal: '작은 테이블을 사이에 두고 편하게 마주 앉았다.',
      close: '의자를 조금 당겼다. 테이블 위의 컵보다 서로의 손이 더 가까워졌다.',
    },
    touchPool: ['none', 'hand', 'sleeve', 'cheek'],
    speechLines: {
      quiet: '대화를 억지로 이어가지 않았다. 컵 너머의 짧은 침묵을 그대로 두었다.',
      gentle: '낮은 목소리로 다정하게 말을 건넸다. 작은 테이블 위로 목소리가 가까이 머물렀다.',
      playful: '컵을 만지작거리며 가볍게 장난을 던졌다. 조용했던 분위기가 조금 느슨해졌다.',
    },
    touchLines: {
      none: '손은 컵 곁에 그대로 두었다. 가까운 거리만 의식했다.',
      hand: '테이블 위에서 가까워진 손을 조심스럽게 잡았다.',
      sleeve: '손 대신 소매 끝을 살짝 붙잡았다.',
      cheek: '테이블 너머로 손을 뻗어 볼을 가볍게 건드렸다.',
    },
    turnEvents: [
      { turn: 2, cue: '디저트를 먹던 중 입가에 크림이 아주 조금 묻었다.', touchKey: 'cheek', touchLabel: '입가의 크림을 직접 닦아준다 ✦', touchHint: '테이블 너머로 손을 뻗어 조심스럽게 닦아준다', actionLine: '테이블 너머로 손을 뻗어 입가에 묻은 크림을 조심스럽게 닦아주었다.' },
    ],
    tags: ['table', 'hand', 'face', 'quiet'],
  },
  {
    id: 'bookstore-date',
    name: '서점',
    subtitle: '조용해서 더 또렷해지는 거리',
    background: '/assets/backgrounds/bookstore/day.webp',
    minAffection: 20,
    mood: 'quiet',
    moodLabel: 'QUIET · DAY',
    intro: '책장 사이에는 작은 소리도 크게 들렸다. 같은 선반을 바라보며 서 있으니 평소보다 서로의 움직임이 선명했다.',
    closing: '서점을 나와서도 한동안 목소리가 작았다. 조용했던 만큼 오늘의 작은 움직임들이 오래 기억에 남았다.',
    ambientLines: [
      '누군가 책장을 넘기는 소리가 멀리서 한 번 들렸다.',
      '종이 냄새와 낮은 조명 탓인지 목소리도 자연스럽게 작아졌다.',
      '같은 제목을 바라보다가 시선이 잠깐 겹쳤다.',
    ],
    initialDistance: 'normal',
    distanceLines: {
      space: '옆 책장으로 반걸음 비켜 섰다. 서로의 움직임이 시야 끝에만 걸렸다.',
      normal: '같은 선반 앞에 나란히 섰다. 고개를 돌리면 바로 옆이 보이는 거리였다.',
      close: '같은 책등을 보려 조금 더 다가섰다. 낮춘 목소리까지 선명하게 들렸다.',
    },
    touchPool: ['none', 'hand', 'sleeve', 'hair'],
    speechLines: {
      quiet: '말을 아끼고 같은 책장을 바라봤다. 종이 넘기는 소리만 잠깐 사이를 채웠다.',
      gentle: '주변을 방해하지 않을 만큼 작은 목소리로 말을 건넸다.',
      playful: '목소리를 낮춘 채 짧은 장난을 건넸다. 조용한 공간이라 웃음도 더 가까이 들렸다.',
    },
    touchLines: {
      none: '손은 책등 근처에 그대로 두었다.',
      hand: '책장 사이에서 손을 찾아 가볍게 잡았다.',
      sleeve: '다음 칸으로 움직이려는 소매 끝을 살짝 붙잡았다.',
      hair: '얼굴 옆으로 내려온 머리카락을 조심스럽게 정리해주었다.',
    },
    turnEvents: [
      { turn: 2, cue: '같은 책을 동시에 집으려다 손등이 아주 살짝 겹쳤다.', touchKey: 'hand', touchLabel: '겹친 손을 바로 떼지 않는다 ✦', touchHint: '책등 위에서 닿은 손을 잠깐 그대로 둔다', actionLine: '같은 책 위에서 겹친 손을 곧바로 떼지 않고 잠깐 그대로 두었다.' },
    ],
    tags: ['quiet', 'close', 'hand', 'whisper'],
  },
  {
    id: 'riverside-date',
    name: '강변 산책',
    subtitle: '핑계 없이 나란히 걷는 시간',
    background: '/assets/backgrounds/riverside/bench-night.webp',
    minAffection: 40,
    mood: 'open',
    moodLabel: 'OPEN AIR · NIGHT',
    intro: '강바람은 생각보다 선선했다. 특별한 목적 없이 나란히 걷다 보니 어느새 말보다 발소리가 더 길게 이어졌다.',
    closing: '돌아갈 시간이 되었지만 누구도 먼저 시간을 확인하지 않았다. 강바람 사이로 나란한 발소리가 조금 더 이어졌다.',
    ambientLines: [
      '강 건너 불빛이 물 위에서 길게 흔들렸다.',
      '사람이 뜸해질수록 둘의 보폭은 조금씩 비슷해졌다.',
      '바람이 한 번 지나가고, 한동안 누구도 먼저 말을 꺼내지 않았다.',
    ],
    initialDistance: 'normal',
    distanceLines: {
      space: '보폭을 조금 벌렸다. 강바람이 둘 사이로 한 번 지나갔다.',
      normal: '나란히 걷는 보폭을 맞췄다. 팔을 흔들 때마다 서로의 존재가 가까이 느껴졌다.',
      close: '반걸음 안쪽으로 붙어 걸었다. 팔꿈치가 스칠 듯 말 듯한 거리였다.',
    },
    touchPool: ['none', 'hand', 'sleeve', 'shoulder'],
    speechLines: {
      quiet: '말을 멈추고 한동안 같은 속도로 걸었다. 강물 소리가 대화 대신 이어졌다.',
      gentle: '걷는 속도를 맞추며 편안한 목소리로 말을 건넸다.',
      playful: '바람에 섞일 만큼 가볍게 장난을 던졌다.',
    },
    touchLines: {
      none: '팔을 자연스럽게 흔들며 그대로 걸었다.',
      hand: '나란히 걷던 손을 찾아 잡았다.',
      sleeve: '한 걸음 앞서려는 소매 끝을 가볍게 붙잡았다.',
      shoulder: '걷는 동안 어깨에 손을 가볍게 얹었다.',
    },
    turnEvents: [
      { turn: 3, cue: '강바람이 갑자기 세게 불어 둘의 옷자락을 한꺼번에 흔들었다.', touchKey: 'shoulder', touchLabel: '바람을 피하듯 어깨를 감싼다 ✦', touchHint: '가까이 붙으며 어깨 쪽을 가볍게 감싸준다', actionLine: '세게 불어온 바람을 피하듯 한 걸음 붙어 어깨를 가볍게 감쌌다.' },
    ],
    tags: ['walk', 'hand', 'lean', 'open'],
  },
  {
    id: 'aquarium-date',
    name: '수족관',
    subtitle: '푸른빛 아래 오래 머무는 거리',
    background: '/assets/backgrounds/aquarium/main.webp',
    minAffection: 40,
    mood: 'intimate',
    moodLabel: 'BLUE · QUIET',
    intro: '큰 수조의 푸른빛이 얼굴 위를 천천히 지나갔다. 말을 하지 않아도 이상할 만큼 어색하지 않았다.',
    closing: '수족관을 나서자 푸른빛은 사라졌지만 가까워졌던 감각은 쉽게 가라앉지 않았다.',
    ambientLines: [
      '유리에는 물고기와 함께 나란히 선 두 사람의 모습이 희미하게 비쳤다.',
      '머리 위를 지나간 물결 그림자가 잠깐 서로의 얼굴을 겹쳐 놓았다.',
      '주변의 목소리가 멀어지고 수조의 낮은 물소리만 남았다.',
    ],
    initialDistance: 'normal',
    distanceLines: {
      space: '수조를 사이에 두듯 한 사람 정도의 여유를 남겼다.',
      normal: '같은 수조 앞에 나란히 섰다. 유리에 비친 두 사람 사이가 자연스럽게 붙어 보였다.',
      close: '푸른빛을 따라 조금 더 가까이 섰다. 어깨가 닿을 듯한 거리였다.',
    },
    touchPool: ['none', 'hand', 'shoulder', 'hair'],
    speechLines: {
      quiet: '말을 하지 않고 푸른 수조를 함께 바라봤다. 침묵이 어색하지 않았다.',
      gentle: '수조를 바라본 채 조용하고 다정한 목소리로 말을 건넸다.',
      playful: '푸른빛 아래서 작게 웃으며 장난스럽게 말을 걸었다.',
    },
    touchLines: {
      none: '손은 그대로 두고 가까워진 거리만 느꼈다.',
      hand: '수조 앞에서 손을 찾아 천천히 잡았다.',
      shoulder: '나란히 선 어깨 위에 손을 조심스럽게 얹었다.',
      hair: '푸른빛에 비친 머리카락을 얼굴 옆에서 살짝 정리해주었다.',
    },
    turnEvents: [
      { turn: 2, cue: '수조 조명이 잠깐 어두워졌다. 유리 너머의 푸른빛만 희미하게 남았다.', touchKey: 'hand', touchLabel: '어둠 속에서 손을 찾는다 ✦', touchHint: '잠깐 어두워진 틈에 가까운 손을 찾아 잡는다', actionLine: '조명이 어두워진 순간 가까운 손을 찾아 조심스럽게 잡았다.' },
    ],
    tags: ['quiet', 'close', 'shoulder', 'hand'],
  },
  {
    id: 'museum-date',
    name: '전시관',
    subtitle: '작품보다 서로를 의식하게 되는 곳',
    background: '/assets/backgrounds/museum/exhibition.webp',
    minAffection: 40,
    mood: 'quiet',
    moodLabel: 'GALLERY · DAY',
    intro: '전시실에는 낮은 목소리와 발소리만 흘렀다. 작품 설명을 같이 읽으려다 자연스럽게 거리가 가까워졌다.',
    closing: '마지막 전시실을 빠져나왔다. 오늘 가장 오래 바라본 것이 정말 작품이었는지는 잘 모르겠다.',
    ambientLines: [
      '한 작품 앞에서 둘의 발이 동시에 멈췄다.',
      '조용한 공간에서는 짧은 웃음도 평소보다 크게 들렸다.',
      '다음 작품으로 옮기려다 누가 먼저랄 것도 없이 같은 방향을 바라봤다.',
    ],
    initialDistance: 'normal',
    distanceLines: {
      space: '작품을 보기 편하도록 한 발 옆으로 물러났다.',
      normal: '같은 설명문을 읽을 수 있을 만큼 가까이 나란히 섰다.',
      close: '작은 캡션을 함께 읽으려 몸을 조금 기울였다. 목소리를 낮추지 않아도 될 만큼 가까웠다.',
    },
    touchPool: ['none', 'hand', 'sleeve', 'shoulder'],
    speechLines: {
      quiet: '작품을 바라본 채 말을 덧붙이지 않았다. 서로의 시선이 어디에 머무는지만 느껴졌다.',
      gentle: '작품 설명보다 조금 더 작은 목소리로 다정하게 말을 건넸다.',
      playful: '전시실 분위기를 깨지 않을 만큼 조용히 장난을 던졌다.',
    },
    touchLines: {
      none: '손은 그대로 두고 다음 작품을 함께 바라봤다.',
      hand: '사람들 시선이 닿지 않는 쪽에서 손을 가볍게 잡았다.',
      sleeve: '다음 작품으로 움직이는 소매 끝을 살짝 잡았다.',
      shoulder: '설명문을 함께 읽으며 어깨에 손을 가볍게 얹었다.',
    },
    turnEvents: [
      { turn: 2, cue: '작은 작품 설명을 같이 읽으려니 자연스럽게 서로의 어깨가 가까워졌다.', touchKey: 'shoulder', touchLabel: '그대로 어깨를 가까이 둔다 ✦', touchHint: '설명문을 읽는 척하며 가까워진 거리를 유지한다', actionLine: '작은 설명문 앞에서 가까워진 어깨를 굳이 다시 떼지 않았다.' },
    ],
    tags: ['quiet', 'close', 'sleeve', 'whisper'],
  },
  {
    id: 'night-date',
    name: '늦은 밤거리',
    subtitle: '발소리만 남은 귀갓길',
    background: '/assets/backgrounds/old-street/night.webp',
    minAffection: 40,
    mood: 'intimate',
    moodLabel: 'CITY · NIGHT',
    intro: '가게들이 하나둘 문을 닫은 뒤의 거리는 낮보다 훨씬 조용했다. 두 사람의 발소리가 나란히 이어졌다.',
    closing: '헤어질 골목이 가까워질수록 걸음이 느려졌다. 밤은 끝나가는데 둘 사이의 거리는 쉽게 원래대로 돌아가지 않았다.',
    ambientLines: [
      '골목으로 들어서자 가로등 사이의 어둠이 조금 짙어졌다.',
      '늦은 버스 한 대가 지나가고 다시 둘만의 발소리가 남았다.',
      '신호를 기다리는 동안 평소보다 서로의 숨소리가 가까웠다.',
    ],
    initialDistance: 'normal',
    distanceLines: {
      space: '조금 바깥쪽으로 걸음을 옮겼다. 발소리가 둘로 나뉘었다.',
      normal: '같은 보폭으로 나란히 걸었다. 가로등 아래에서 그림자가 나란히 길어졌다.',
      close: '조금 더 안쪽으로 붙어 걸었다. 발소리 사이의 간격까지 짧아졌다.',
    },
    touchPool: ['none', 'hand', 'sleeve', 'shoulder'],
    speechLines: {
      quiet: '말을 하지 않은 채 발소리를 맞췄다. 늦은 밤의 정적이 둘 사이에 오래 남았다.',
      gentle: '귀갓길의 조용한 분위기에 맞춰 부드럽게 말을 건넸다.',
      playful: '가로등 아래서 살짝 웃으며 장난을 던졌다.',
    },
    touchLines: {
      none: '손은 주머니 가까이에 둔 채 나란히 걸었다.',
      hand: '걸음을 맞춘 채 자연스럽게 손을 잡았다.',
      sleeve: '어두운 길목에서 소매 끝을 가볍게 붙잡았다.',
      shoulder: '가까이 걷다가 어깨에 손을 조심스럽게 얹었다.',
    },
    turnEvents: [
      { turn: 2, cue: '좁은 골목 옆으로 차 한 대가 지나오며 헤드라이트가 가까워졌다.', touchKey: 'sleeve', touchLabel: '소매를 잡아 안쪽으로 당긴다 ✦', touchHint: '차가 지나가는 쪽을 피해 자연스럽게 가까이 당긴다', actionLine: '차가 지나가는 쪽을 피해 소매를 잡아 안쪽으로 가볍게 당겼다.' },
    ],
    tags: ['walk', 'hand', 'sleeve', 'close'],
  },
  {
    id: 'festival-date',
    name: '밤의 축제',
    subtitle: '평소보다 조금 유치해도 되는 밤',
    background: '/assets/backgrounds/night-market/night.webp',
    minAffection: 60,
    mood: 'playful',
    moodLabel: 'FESTIVAL · NIGHT',
    intro: '음악과 웃음소리가 뒤섞여 있었다. 평소보다 조금 유치하게 굴어도 아무도 신경 쓰지 않을 것 같은 밤이었다.',
    closing: '축제의 불빛이 멀어지고 나서도 웃음이 조금 남아 있었다. 오늘 알게 된 반응 하나가 자꾸 생각났다.',
    ambientLines: [
      '조명이 한 번 번쩍일 때마다 사람들의 그림자가 길 위에서 뒤섞였다.',
      '어딘가에서 웃음이 터지고 달콤한 냄새가 바람을 타고 흘러왔다.',
      '사진을 찍는 사람들 사이를 지나며 둘의 거리가 몇 번이나 가까워졌다.',
    ],
    initialDistance: 'normal',
    distanceLines: {
      space: '사람들 사이에서 한 걸음 정도의 여유를 두었다.',
      normal: '놓치지 않을 만큼 가까이 나란히 걸었다.',
      close: '몰려드는 사람들을 피해 바짝 붙었다. 웃음소리보다 서로의 목소리가 더 가까워졌다.',
    },
    touchPool: ['none', 'hand', 'hair', 'cheek', 'tickle'],
    speechLines: {
      quiet: '한동안 말없이 축제 풍경을 바라봤다. 주변이 시끄러워도 둘 사이의 침묵은 이상하게 또렷했다.',
      gentle: '웃음소리 사이로 다정하게 말을 건넸다.',
      playful: '축제 분위기에 기대 평소보다 한층 장난스럽게 말을 걸었다.',
    },
    touchLines: {
      none: '손은 그대로 두고 사람들 사이를 함께 걸었다.',
      hand: '사람들 사이에서 놓치지 않도록 손을 잡았다.',
      hair: '흐트러진 머리카락을 장난스럽게 정리해주었다.',
      cheek: '사진을 확인하는 틈에 볼을 살짝 찔렀다.',
      tickle: '방심한 틈을 타 옆구리를 가볍게 찔렀다.',
    },
    turnEvents: [
      { turn: 2, cue: '둘이 찍은 사진을 확인하느라 잠시 화면에 정신이 팔려 있다.', touchKey: 'cheek', touchLabel: '사진 보는 틈에 볼을 찌른다 ✦', touchHint: '방심한 순간 장난스럽게 볼을 한 번 건드린다', actionLine: '사진을 확인하는 틈을 타 장난스럽게 볼을 한 번 찔렀다.' },
    ],
    tags: ['playful', 'tease', 'hair', 'tickle'],
  },
]

export function getDatePlaceAmbient(placeId: string, day: number) {
  const place = datePlaces.find((item) => item.id === placeId)
  if (!place) return ''
  return place.ambientLines[Math.abs(day - 1) % place.ambientLines.length] ?? place.ambientLines[0]
}

export function getDatePlaceTurnEvent(placeId: string, turn: number) {
  const place = datePlaces.find((item) => item.id === placeId)
  return place?.turnEvents.find((event) => event.turn === turn) ?? null
}

const dateRecordTitles: Record<string, [string, string]> = {
  'cafe-date': ['창가 자리의 오후', '작은 테이블 위의 거리'],
  'bookstore-date': ['책장 사이의 조용한 시간', '책장 사이에 남은 손끝'],
  'riverside-date': ['강바람과 나란한 발소리', '돌아갈 시간을 잊은 산책'],
  'aquarium-date': ['푸른빛 아래의 침묵', '푸른빛 아래 놓지 않은 손'],
  'museum-date': ['같은 작품 앞에 선 오후', '작품보다 오래 바라본 것'],
  'night-date': ['늦은 밤의 귀갓길', '헤어질 골목 앞에서'],
  'festival-date': ['축제의 불빛 사이에서', '불빛이 꺼진 뒤에도'],
}

export function getDateRecordTitle(placeId: string, finalHeart: number) {
  const titles = dateRecordTitles[placeId]
  if (!titles) return '오늘의 데이트 기록'
  return finalHeart >= 4 ? titles[1] : titles[0]
}

const r = (line: string, narration: string, expression: PortraitExpression = 'shy'): DateReaction => ({ line, narration, expression })

export const characterDateProfiles: Record<string, CharacterDateProfile> = {
  char_001: {
    characterId: 'char_001', weakSpot: 'hair', weakSpotLabel: '머리와 귓가', favoritePlaceId: 'bookstore-date',
    favoritePlaceLine: '책이 많은 곳은 오래 있어도 피곤하지 않습니다. …당신과 같이 있으면 더 그렇고요.',
    speechReactions: {
      quiet: r('조용한 게 편하네요. 같이 있으면 더 그렇고요.', '도윤은 침묵을 재촉하지 않고 같은 쪽을 바라봤다.', 'smile'),
      gentle: r('그런 말은 오래 기억하게 됩니다.', '도윤의 시선이 잠깐 머물렀다가 천천히 부드러워졌다.', 'smile'),
      playful: r('오늘은 장난이 많으시네요.', '도윤은 작게 웃었다. 싫지는 않은 모양이었다.', 'smile'),
    },
    weakReaction: r('……잠깐만요. 거긴 좀, 생각보다 간지럽습니다.', '도윤이 아주 미세하게 어깨를 움츠렸다. 평소보다 반응이 커서 오히려 눈에 띄었다.'),
    reactions: {
      hand: r('손이 차갑네요. 조금만 이대로 있을까요.', '도윤은 손을 빼지 않았다. 오히려 손가락 끝이 천천히 힘을 주었다.', 'smile'),
      hair: r('꽃잎이라도 붙었습니까?', '말은 태연했지만 손이 머리 근처에 머무는 동안 시선이 자꾸 옆으로 흐른다.'),
      lean: r('편하게 있어요.', '몸이 잠깐 굳었다가 곧 어깨를 조금 낮춰준다.', 'smile'),
      cheek: r('……이건 무슨 의미입니까?', '볼을 만진 자리만 의식하는 듯 눈을 한 번 느리게 깜빡였다.'),
      tickle: r('하, 잠깐…… 그런 장난도 하시는군요.', '도윤이 예상보다 쉽게 웃음을 터뜨리고는 곧 입을 다물었다.'),
      sleeve: r('안 가고 있습니다.', '붙잡힌 소매를 내려다보고도 굳이 빼내지 않는다.', 'smile'),
      face: r('직접 해주실 필요까진 없었는데.', '도윤이 뒤늦게 얼굴을 조금 돌렸다.'),
    }, returnTouch: '잠시 뒤 도윤이 먼저 손을 고쳐 잡았다. 말 대신 엄지손가락이 손등을 한 번 조용히 쓸었다.',
  },
  char_002: {
    characterId: 'char_002', weakSpot: 'cheek', weakSpotLabel: '얼굴과 목 가까이', favoritePlaceId: 'museum-date',
    favoritePlaceLine: '전시 동선은 나쁘지 않네요. 오늘은 작품보다 다른 쪽에 더 눈이 가지만.',
    speechReactions: {
      quiet: r('말이 없어도 불편하진 않네요.', '주원은 잠시 이쪽을 훑어보고는 굳이 침묵을 깨지 않았다.', 'sly'),
      gentle: r('그렇게 정면으로 말하면 반응하기 곤란한데요.', '태연한 말투와 달리 시선이 아주 잠깐 비껴갔다.', 'sly'),
      playful: r('저한테 장난을 거는 건 꽤 자신 있는 선택이네요.', '주원의 입꼬리가 올라갔다. 받아칠 생각인 얼굴이었다.', 'sly'),
    },
    weakReaction: r('……사람 얼굴을 이렇게 아무렇지 않게 만지는 취미가 있었습니까?', '주원은 비꼬는 말을 골랐지만 목 끝까지 올라온 붉은 기는 숨기지 못했다.'),
    reactions: {
      hand: r('이 정도는 예상했습니다.', '말과 달리 손을 잡히는 순간 손가락이 아주 조금 굳었다.', 'sly'),
      hair: r('망가뜨렸으면 원상복구까지 하세요.', '주원이 머리를 바로잡으려다 손을 멈췄다. 괜히 다시 만져주길 기다리는 얼굴이다.'),
      lean: r('오늘은 꽤 적극적이네요.', '한쪽 눈썹이 살짝 올라갔지만 피하지 않는다.', 'sly'),
      cheek: r('……지금 재미있습니까?', '볼을 찌른 손가락을 잡을 듯하다가 결국 놓아준다.'),
      tickle: r('잠깐—. {name} 씨.', '주원이 몸을 피하고는 드물게 진짜 당황한 표정을 지었다.'),
      sleeve: r('도망갈 생각 없으니까 놓으셔도 됩니다.', '그렇게 말하면서도 소매는 그대로 잡혀 있게 둔다.', 'smile'),
      face: r('그렇게 가까이 오면 제가 가만히 있을 거라고 생각했습니까?', '이번에는 주원이 오히려 거리를 조금 좁혔다.'),
    }, returnTouch: '주원은 잡힌 손을 자연스럽게 뒤집더니 이번에는 자신이 먼저 손가락을 맞물렸다. “이쪽이 더 낫네요.”',
  },
  char_003: {
    characterId: 'char_003', weakSpot: 'tickle', weakSpotLabel: '옆구리', favoritePlaceId: 'night-date',
    favoritePlaceLine: '밤길은 제가 익숙합니다. 천천히 걸어도 됩니다. 오늘은 운행 시간이 정해져 있는 것도 아니니까요.',
    speechReactions: {
      quiet: r('조용히 있어도 괜찮습니다.', '해준은 보폭이나 자세만 맞추며 옆에 그대로 있었다.', 'smile'),
      gentle: r('……감사합니다. 그런 말은.', '해준은 짧게 대답한 뒤 평소보다 조금 부드러운 기색을 보였다.', 'smile'),
      playful: r('오늘은 평소보다 장난이 많으시군요.', '말은 단정했지만 웃음을 참는 기색이 보였다.', 'smile'),
    },
    weakReaction: r('……! {name} 씨. 그건 정말 하지 마십시오.', '해준이 눈에 띄게 몸을 움츠렸다. 평소의 침착한 표정이 순식간에 무너졌다.'),
    reactions: {
      hand: r('놓치지 않게 잡겠습니다.', '손을 잡자 해준은 잠깐 내려다본 뒤 제대로 손바닥을 맞댔다.', 'smile'),
      hair: r('머리가 이상합니까?', '해준은 이유를 확인하면서도 얌전히 손길을 받아들였다.'),
      lean: r('불편하면 말씀하세요.', '말과 반대로 기대기 편하도록 어깨를 조금 낮춰준다.', 'smile'),
      cheek: r('……왜 그러십니까.', '해준이 굳은 얼굴로 묻지만 귓바퀴가 먼저 붉어진다.'),
      tickle: r('잠깐. 거긴 안 됩니다.', '해준이 정말 빠르게 한 걸음 물러났다.'),
      sleeve: r('여기 있습니다.', '소매를 잡은 손을 보고 목소리가 눈에 띄게 부드러워졌다.'),
      face: r('제가 닦겠습니다.', '그러면서도 이미 가까워진 손길을 피하지 못했다.'),
    }, returnTouch: '횡단보도를 건넌 뒤에도 해준은 손을 놓지 않았다. 오히려 차도 반대편으로 자리를 바꾸며 그대로 잡고 있었다.',
  },
  char_004: {
    characterId: 'char_004', weakSpot: 'tickle', weakSpotLabel: '허리 옆', favoritePlaceId: 'cafe-date',
    favoritePlaceLine: '카페는 직업 때문에 질릴 줄 알았는데. 같이 오는 사람이 다르면 또 다르네요.',
    speechReactions: {
      quiet: r('이렇게 조용한 것도 나쁘지 않네요.', '로운은 먼저 말을 채우지 않고 이쪽의 표정을 살폈다.', 'faintSmile'),
      gentle: r('그런 말 들으면 제가 좀 착각하는데.', '웃으면서 받아쳤지만 마지막에는 목소리가 조금 작아졌다.', 'faintSmile'),
      playful: r('좋아요. 그럼 저도 봐주지 않을게요.', '로운의 눈이 금세 장난스럽게 휘었다.', 'sly'),
    },
    weakReaction: r('아, 잠깐. 그건 진짜 반칙인데요?', '로운이 웃으며 받아치려다 허리를 급하게 피했다. 이번 웃음은 영업용이 아니었다.'),
    reactions: {
      hand: r('오, 오늘은 {name}{이가} 먼저네요.', '로운이 능숙하게 웃으면서도 손가락을 천천히 맞물렸다.', 'sly'),
      hair: r('이런 서비스도 포함되어 있었어요?', '농담하면서도 고개를 살짝 낮춰준다.', 'faintSmile'),
      lean: r('이러면 제가 착각해도 돼요?', '로운은 장난스럽게 묻고는 어깨를 빼지 않는다.', 'sly'),
      cheek: r('제 볼이 디저트는 아닌데.', '말끝에서 웃더니 이번엔 반대로 손가락을 들어 {name} 쪽을 겨눈다.'),
      tickle: r('잠깐, 잠깐! 저 이건 약해요.', '로운이 드물게 준비되지 않은 웃음을 터뜨렸다.'),
      sleeve: r('잡으려면 손을 잡지, 왜 소매예요?', '그러면서도 손을 먼저 내민다.', 'smile'),
      face: r('직접 닦아주면 좀 위험한데.', '장난스러운 말과 달리 눈길이 잠깐 흔들렸다.'),
    }, returnTouch: '로운은 손을 놓는 대신 손가락 끝으로 {name}{의} 손바닥을 살짝 간질였다. “이건 복수.”',
  },
  char_005: {
    characterId: 'char_005', weakSpot: 'hair', weakSpotLabel: '귀 뒤', favoritePlaceId: 'night-date',
    favoritePlaceLine: '밤은 조용해서 좋습니다. 굳이 말을 계속하지 않아도 되니까요.',
    speechReactions: {
      quiet: r('굳이 말하지 않아도 됩니다.', '태겸은 침묵을 불편해하지 않고 그대로 곁에 있었다.', 'faintSmile'),
      gentle: r('……그런 말은 익숙하지 않습니다.', '태겸이 잠깐 시선을 피했다가 다시 돌아봤다.', 'faintSmile'),
      playful: r('저한테 장난을 거시는 겁니까.', '무표정은 그대로였지만 눈빛이 아주 조금 누그러졌다.', 'faintSmile'),
    },
    weakReaction: r('……거긴 건드리지 마십시오.', '태겸의 어깨가 아주 작게 움찔했다. 표정 변화가 적은 사람이라 그 작은 반응이 더 선명했다.'),
    reactions: {
      hand: r('손이 차갑습니다.', '태겸은 짧게 말하고는 자신의 손으로 완전히 감싸버렸다.', 'genuineSmile'),
      hair: r('머리에 뭐가 붙었습니까?', '손이 귀 뒤를 스치자 시선이 순간 옆으로 달아난다.'),
      lean: r('괜찮습니다. 기대세요.', '태겸은 움직이지 않고 단단하게 자리를 내어준다.', 'genuineSmile'),
      cheek: r('……장난입니까.', '대답은 무덤덤한데 얼굴을 돌리는 속도가 평소보다 빠르다.'),
      tickle: r('{name} 씨.', '태겸이 웃지는 않았지만 몸이 먼저 피했다. 목소리에 난감함이 섞였다.'),
      sleeve: r('안 갑니다.', '한 번 내려다본 뒤 그대로 걸음을 맞춘다.'),
      face: r('가까우십니다.', '그 말 뒤에도 한 발 물러서지 않았다.'),
    }, returnTouch: '잠시 뒤 태겸이 먼저 {name} 쪽 손을 찾았다. 큰 손이 조심스러울 정도로 가볍게 감겼다.',
  },
  char_006: {
    characterId: 'char_006', weakSpot: 'tickle', weakSpotLabel: '목 옆과 옆구리', favoritePlaceId: 'aquarium-date',
    favoritePlaceLine: '여긴 좋죠? 물 보고 있으면 시간 가는 줄 모르겠어요. 오늘은 혼자 보는 것도 아니고.',
    speechReactions: {
      quiet: r('왜 이렇게 조용해요? 그래도 싫진 않아요.', '시온은 잠깐 옆을 보다가 같은 속도로 자리를 맞췄다.', 'genuineSmile'),
      gentle: r('그런 말은 좋네요. 한 번 더 해줘도 돼요.', '시온은 숨기지 않고 환하게 웃었다.', 'genuineSmile'),
      playful: r('오, 지금 저랑 장난치자는 거죠?', '시온은 바로 신이 난 얼굴로 몸을 돌렸다.', 'smile'),
    },
    weakReaction: r('아하, 잠깐! 거긴 진짜 간지러워요!', '시온은 숨기려는 시도조차 없이 웃음을 터뜨리며 한 발 옆으로 도망갔다.'),
    reactions: {
      hand: r('잡았으면 안 놓기예요.', '시온은 바로 손가락을 끼워 잡고 신나게 흔들었다.', 'smile'),
      hair: r('머리 만지는 거 좋아해요?', '시온이 오히려 고개를 숙여 손바닥 쪽으로 가까이 온다.', 'shy'),
      lean: r('오, 이건 좋다.', '기대자 자연스럽게 머리를 살짝 맞대온다.', 'smile'),
      cheek: r('왜요? 제 볼 재밌어요?', '웃으면서도 은근히 얼굴이 붉어졌다.', 'shy'),
      tickle: r('으악, 잠깐! 저 거기 약해요!', '몸을 피하면서도 웃음이 멈추지 않는다.'),
      sleeve: r('손 잡아도 되는데.', '시온이 소매를 잡은 손 아래로 자기 손을 슬쩍 밀어 넣었다.', 'smile'),
      face: r('직접 닦아주는 거예요? 좀 설레는데.', '평소처럼 웃다가 마지막 말에서만 시선을 피했다.', 'shy'),
    }, returnTouch: '시온이 한 걸음 앞서가다 다시 돌아와 먼저 손을 잡았다. “이번엔 제가 먼저.”',
  },
  char_007: {
    characterId: 'char_007', weakSpot: 'tickle', weakSpotLabel: '옆구리', favoritePlaceId: 'festival-date',
    favoritePlaceLine: '이런 곳은 아직도 신기합니다. 시끄러운데… 이상하게 싫지는 않아요.',
    speechReactions: {
      quiet: r('……말이 없어도 뜻은 알 것 같습니다.', '휘람은 괜히 자세를 고쳐 세우며 같은 곳을 바라봤다.', 'smile'),
      gentle: r('그런 말씀을 들으면 제가 어떻게 대답해야 합니까.', '말은 곧았지만 귓가가 먼저 붉어졌다.', 'shy'),
      playful: r('저도 이제 그런 장난에는 익숙합니다.', '자신 있게 말한 뒤 아주 조금 늦게 웃었다.', 'confident'),
    },
    weakReaction: r('읏—! 자, 잠깐만요! 그건 비겁합니다!', '휘람이 거의 반사적으로 허리를 접었다. 얼굴이 순식간에 새빨개졌다.'),
    reactions: {
      hand: r('……요즘은 이런 것도 자연스럽게 하는군요.', '말은 진지한데 잡힌 손을 유난히 신경 쓰고 있다.', 'shy'),
      hair: r('어린애 취급은 아니죠?', '조금 불만스러운 척하지만 손길을 피하지 않는다.', 'shy'),
      lean: r('무겁지는 않습니다.', '휘람이 괜히 자세를 더 곧게 세웠다.', 'confident'),
      cheek: r('제 얼굴이 그렇게 만지기 쉽습니까?', '입술을 꾹 다물고 버티지만 뺨이 금세 붉어진다.', 'shy'),
      tickle: r('잠깐, 진짜 잠깐만요!', '휘람이 또래다운 웃음을 터뜨리며 급히 옆으로 피했다.', 'shy'),
      sleeve: r('먼저 가려고 한 건 아닙니다.', '소매를 내려다보다가 보폭을 조금 줄인다.', 'smile'),
      face: r('제가 닦으면 되는데…….', '휘람이 고개를 아주 조금 숙였다.', 'shy'),
    }, returnTouch: '조금 뒤 휘람이 망설이다 손을 먼저 내밀었다. “이번엔 제가 잡아도 됩니까?”',
  },
  char_008: {
    characterId: 'char_008', weakSpot: 'cheek', weakSpotLabel: '볼', favoritePlaceId: 'museum-date',
    favoritePlaceLine: '전시 보러 온 건 맞는데요. 지금은 옆이 더 신경 쓰여서 큰일이네.',
    speechReactions: {
      quiet: r('어, 오늘은 관찰하는 쪽이에요?', '세현도 따라 조용해졌지만 자꾸 이쪽을 흘끗거렸다.', 'glasses'),
      gentle: r('그렇게 말하면 제가 되게 신경 쓰이잖아요.', '세현의 웃음이 평소보다 작고 진지해졌다.', 'shy'),
      playful: r('좋아요. 저 이런 건 안 져요.', '세현은 바로 장난을 받아칠 준비를 했다.', 'smile'),
    },
    weakReaction: r('잠깐, 볼은 좀……! 왜 하필 거기예요?', '세현이 웃다가도 금세 얼굴을 감싸며 고개를 돌렸다.'),
    reactions: {
      hand: r('어, 손 잡는 거예요?', '세현은 놀란 다음 바로 웃었지만 손바닥은 생각보다 긴장해 있었다.', 'shy'),
      hair: r('저 머리 이상해요? 아니면 그냥 만진 거예요?', '질문이 빨라질수록 당황했다는 뜻이다.', 'shy'),
      lean: r('잠깐만요. 저 지금 되게 의식되는데.', '말하면서도 어깨를 빼지 않는다.', 'shy'),
      cheek: r('아, 진짜! 볼은 반칙이에요.', '세현이 즉시 얼굴을 붉히며 손으로 볼을 가렸다.', 'shy'),
      tickle: r('하하, 뭐예요 갑자기!', '세현이 몸을 피하면서도 같이 장난칠 타이밍을 노린다.', 'smile'),
      sleeve: r('어디 안 가요.', '세현이 웃으며 붙잡힌 쪽 팔을 오히려 조금 가까이 가져온다.', 'smile'),
      face: r('아니, 이렇게 가까이서 보면 민망한데.', '평소의 사교적인 웃음이 사라지고 진짜 당황한 얼굴이 남았다.', 'shy'),
    }, returnTouch: '세현은 잠깐 머뭇거리다가 {name}{의} 볼을 똑같이 한 번 찔렀다. “공평해야죠.”',
  },
  char_009: {
    characterId: 'char_009', weakSpot: 'sleeve', weakSpotLabel: '손목 안쪽', favoritePlaceId: 'bookstore-date',
    favoritePlaceLine: '책이 있는 공간은 마음이 안정됩니다. 오늘은 평소보다 집중이 조금 어렵지만요.',
    speechReactions: {
      quiet: r('침묵도 충분한 대화가 될 수 있습니다.', '이겸은 말을 채우지 않은 채 편안한 간격을 유지했다.', 'thinking'),
      gentle: r('……그 말씀은 기쁘다고 표현하는 게 맞겠군요.', '스스로 감정을 확인하듯 말한 뒤 아주 옅게 웃었다.', 'smile'),
      playful: r('장난이라는 것은 알겠습니다. 반응은 아직 어렵군요.', '이겸은 진지하게 분석하다가 스스로도 조금 웃었다.', 'thinking'),
    },
    weakReaction: r('……그쪽은 조금 민감합니다.', '이겸의 손목이 반사적으로 뒤로 빠졌다. 곧 침착하게 돌아왔지만 귀 끝이 옅게 붉었다.'),
    reactions: {
      hand: r('손을 잡는 것이군요.', '마치 감정을 분석하듯 말했지만 손은 부드럽게 맞잡았다.', 'shy'),
      hair: r('제 머리가 흐트러졌습니까?', '이겸이 가만히 있다가 뒤늦게 지금 상황을 의식한 듯 시선을 내렸다.', 'shy'),
      lean: r('편하시면 그대로 계셔도 됩니다.', '문장은 평온하지만 숨을 한 번 고르는 게 느껴진다.', 'shy'),
      cheek: r('……이 행동의 의도를 물어봐도 됩니까?', '대답을 기다리는 동안 뺨이 서서히 붉어진다.', 'shy'),
      tickle: r('잠깐. 그건 예상하지 못했습니다.', '이겸이 드물게 웃음을 참지 못하고 짧게 숨을 흘렸다.', 'shy'),
      sleeve: r('손목은…… 조금 조심해주십시오.', '붙잡힌 쪽 손을 의식하며 눈길이 흔들렸다.', 'shy'),
      face: r('너무 가까우면 제가 평정을 유지하기 어렵습니다.', '정확한 문장과 달리 목소리가 아주 조금 낮아졌다.', 'shy'),
    }, returnTouch: '이겸은 잠시 뒤 스스로 {name}{의} 손을 잡았다. “이 정도는 제가 먼저 해도 괜찮겠군요.”',
  },
  char_010: {
    characterId: 'char_010', weakSpot: 'hair', weakSpotLabel: '목덜미', favoritePlaceId: 'night-date',
    favoritePlaceLine: '밤에는 사람이 적어서 좋습니다. 주변을 확인하기도 쉽고… 같이 걷기도 편합니다.',
    speechReactions: {
      quiet: r('말하지 않아도 괜찮습니다.', '재하는 주변을 한 번 살핀 뒤 다시 곁에 시선을 두었다.', 'main'),
      gentle: r('……알겠습니다. 기억하겠습니다.', '짧은 대답이었지만 목소리가 눈에 띄게 부드러워졌다.', 'love'),
      playful: r('장난입니까.', '재하는 무표정하게 묻다가 아주 늦게 입꼬리를 움직였다.', 'busted'),
    },
    weakReaction: r('……목 쪽은 피하십시오.', '재하의 어깨가 순간 단단하게 굳었다. 곧 긴장을 풀었지만 반응은 숨길 수 없었다.'),
    reactions: {
      hand: r('잡으십시오.', '재하는 망설임 없이 손을 내주고, 위험한 쪽에서 {name}{을를} 자연스럽게 안쪽으로 옮겼다.', 'love'),
      hair: r('……그쪽은 익숙하지 않습니다.', '재하가 드물게 시선을 피했다.', 'shy'),
      lean: r('괜찮습니다.', '어깨를 내어주는 움직임이 말보다 먼저였다.', 'love'),
      cheek: r('장난이군요.', '무표정하게 말하면서도 귀 끝이 붉다.', 'busted'),
      tickle: r('그만.', '재하가 손목을 잡아 막았지만 힘은 놀랄 만큼 조심스러웠다.', 'shy'),
      sleeve: r('여기 있습니다.', '재하는 붙잡힌 소매를 보더니 아예 손을 내밀었다.', 'love'),
      face: r('직접 하실 필요 없습니다.', '그렇게 말하면서도 {name}{의} 손이 닿는 동안 움직이지 않았다.', 'shy'),
    }, returnTouch: '재하는 손을 놓는 대신 자신의 엄지로 {name}{의} 손등을 한 번 눌렀다. 짧지만 확실한 답이었다.',
  },
  char_011: {
    characterId: 'char_011', weakSpot: 'hair', weakSpotLabel: '귀', favoritePlaceId: 'festival-date',
    favoritePlaceLine: '이런 데는 제가 익숙할 것 같죠? 오늘은 무대 위가 아니라서 오히려 더 긴장되는데.',
    speechReactions: {
      quiet: r('오늘은 제가 먼저 떠들 필요 없나 보네요.', '유리안은 농담처럼 말했지만 잠깐의 침묵을 그대로 즐겼다.', 'interested'),
      gentle: r('그런 말은 무대 밖에서 들으면 더 위험한데.', '웃고 있었지만 눈빛이 먼저 진지해졌다.', 'loveShy'),
      playful: r('좋아요. 오늘은 누가 먼저 당황하나 해봐요.', '유리안이 익숙한 장난기 어린 미소를 지었다.', 'interested'),
    },
    weakReaction: r('잠깐. ……거긴 좀 반칙인데요.', '늘 먼저 웃던 유리안이 이번에는 웃음을 잃었다. 귀 끝이 눈에 띄게 붉어졌다.'),
    reactions: {
      hand: r('와, 오늘은 먼저 잡아주네요?', '능숙하게 받아치다가 손가락을 맞물리는 순간만 조용해졌다.', 'loveShy'),
      hair: r('머리 만지는 건 좋은데…… 귀 근처는 조심해요.', '농담처럼 말했지만 시선이 슬쩍 도망간다.', 'shy'),
      lean: r('이 정도면 데이트 같네요.', '웃으면서도 {name}{이가} 편하도록 자연스럽게 자세를 바꾼다.', 'love'),
      cheek: r('볼 찌르기? 그럼 저도 한 번.', '유리안이 바로 손가락을 들었다가 {name} 눈앞에서 멈춰 장난스럽게 웃었다.', 'interested'),
      tickle: r('하하, 잠깐! 이건 공연에도 없는 애드리브인데!', '유리안이 웃음을 터뜨리며 몸을 피했다.', 'shy'),
      sleeve: r('그렇게 잡으면 제가 진짜 안 갈 수도 있는데.', '말끝이 장난스럽지만 소매를 빼지 않는다.', 'loveShy'),
      face: r('……이건 가까워도 너무 가까운 거 아닌가.', '유리안이 드물게 먼저 말을 잃었다.', 'shy'),
    }, returnTouch: '유리안이 웃다가 {name}{의} 손을 살짝 끌어 자기 쪽으로 다시 가져왔다. “한 번 더 해도 된다는 뜻인데.”',
  },
  char_012: {
    characterId: 'char_012', weakSpot: 'sleeve', weakSpotLabel: '손목과 시계', favoritePlaceId: 'night-date',
    favoritePlaceLine: '밤길은 시간이 조금 느리게 가는 것처럼 느껴질 때가 있습니다. …오늘은 그래도 괜찮군요.',
    speechReactions: {
      quiet: r('……조용한 건 익숙합니다.', '이현은 침묵을 깨지 않고 오래 같은 곳을 바라봤다.', 'main'),
      gentle: r('그렇게 말해주면, 오늘은 조금 덜 늦은 기분이 드네요.', '이현이 한참 뒤에야 아주 옅게 웃었다.', 'love'),
      playful: r('저한테 그런 장난도 하는군요.', '놀란 듯 멈췄다가 뒤늦게 희미하게 웃었다.', 'shy'),
    },
    weakReaction: r('……그 시계 쪽은.', '이현이 반사적으로 손목을 감쌌다. 잠시 뒤 천천히 힘을 풀었다. “괜찮습니다. 이제는.”'),
    reactions: {
      hand: r('손을 잡으려는 거면 그냥 잡으세요.', '무심하게 말했지만 손을 내미는 동작은 이상할 만큼 익숙했다.', 'shy'),
      hair: r('머리에 뭐라도 있습니까?', '이현이 가만히 손길을 받다가 아주 늦게 눈을 피했다.', 'shy'),
      lean: r('……편한 쪽으로 하세요.', '이현은 움직이지 않았다. 잠시 뒤 오히려 아주 조금 가까이 기울었다.', 'love'),
      cheek: r('그런 장난도 하는군요.', '희미하게 웃더니 한동안 볼을 만진 자리를 의식했다.', 'shy'),
      tickle: r('잠깐. 그건 예상에 없었는데.', '이현이 드물게 짧게 웃으며 몸을 피했다.', 'shy'),
      sleeve: r('그쪽은 조심해 주세요.', '시계가 있는 손목을 스친 순간 표정이 아주 잠깐 멎었다.', 'shy'),
      face: r('……가까이 있군요.', '당연한 사실을 말한 뒤 이현은 더 이상 뒤로 물러서지 않았다.', 'shy'),
    }, returnTouch: '이현은 잡은 손을 한 번 내려다보고 천천히 손가락을 맞물렸다. “이번에는 먼저 놓지 않을 겁니다.”',
  },
}


const turnTouchToReactionKey: Partial<Record<DateTurnTouchKey, DateTouchKey>> = {
  hand: 'hand',
  sleeve: 'sleeve',
  hair: 'hair',
  cheek: 'cheek',
  tickle: 'tickle',
  shoulder: 'lean',
}

export function getDateCharacterTurnReaction(
  characterId: string,
  speech: DateSpeechIntent,
  touch: DateTurnTouchKey,
): DateReaction | null {
  const profile = characterDateProfiles[characterId]
  if (!profile) return null

  if (touch === 'none') return profile.speechReactions[speech]

  const reactionKey = turnTouchToReactionKey[touch]
  if (!reactionKey) return profile.speechReactions[speech]

  const touchReaction = profile.reactions[reactionKey]
  if (!touchReaction) return profile.speechReactions[speech]

  const speechLead = profile.speechReactions[speech]
  const bridge = speech === 'quiet'
    ? ''
    : speech === 'gentle'
      ? `${speechLead.narration} `
      : `${speechLead.narration} `

  return {
    ...touchReaction,
    narration: `${bridge}${touchReaction.narration}`.trim(),
  }
}


interface DateCharacterTurnPreference {
  preferredSpeech: DateSpeechIntent[]
  likedTouches: DateTurnTouchKey[]
  dislikedTouches: DateTurnTouchKey[]
  boundaryReaction: DateReaction
}

export interface DateTurnEvaluation {
  heartDelta: -1 | 0 | 1 | 2
  isWeak: boolean
  weakSpotLabel: string | null
  reaction: DateReaction | null
}

const dateCharacterTurnPreferences: Record<string, DateCharacterTurnPreference> = {
  char_001: { preferredSpeech: ['quiet', 'gentle'], likedTouches: ['hand', 'sleeve'], dislikedTouches: ['tickle', 'cheek'], boundaryReaction: r('……조금 갑작스럽네요.', '도윤은 피하지는 않았지만 한 박자 늦게 시선을 들었다.', 'troubled') },
  char_002: { preferredSpeech: ['playful', 'gentle'], likedTouches: ['hand', 'cheek'], dislikedTouches: ['tickle'], boundaryReaction: r('하나씩 하시죠.', '주원이 손목을 가볍게 막고는 눈썹을 아주 조금 올렸다.', 'hmm') },
  char_003: { preferredSpeech: ['gentle', 'quiet'], likedTouches: ['hand', 'shoulder'], dislikedTouches: ['tickle', 'cheek'], boundaryReaction: r('잠깐만요. 지금은 이 정도로 하죠.', '해준이 단호하게 말했지만 목소리를 높이지는 않았다.', 'hmm') },
  char_004: { preferredSpeech: ['playful', 'gentle'], likedTouches: ['hand', 'shoulder'], dislikedTouches: ['tickle'], boundaryReaction: r('……그건 조금 예상 못 했네요.', '로운이 드물게 눈을 깜빡이며 거리를 한 번 확인했다.', 'troubled') },
  char_005: { preferredSpeech: ['quiet', 'gentle'], likedTouches: ['hand', 'shoulder'], dislikedTouches: ['tickle'], boundaryReaction: r('오늘은 꽤 과감하시네요.', '태겸이 평소보다 오래 이쪽을 바라보며 거리를 한 번 확인했다.', 'hmm') },
  char_006: { preferredSpeech: ['playful', 'gentle'], likedTouches: ['hand', 'shoulder', 'tickle'], dislikedTouches: ['cheek'], boundaryReaction: r('그건 조금 간지럽다기보다 당황스러운데요.', '시온이 웃음을 거두진 않았지만 한 걸음만 숨을 고르듯 멈췄다.', 'shy') },
  char_007: { preferredSpeech: ['gentle', 'playful'], likedTouches: ['hand', 'sleeve'], dislikedTouches: ['cheek'], boundaryReaction: r('자, 잠깐만요. 그건 아직 익숙하지 않습니다.', '휘람이 당황을 숨기지 못하고 똑바로 굳었다.', 'troubled') },
  char_008: { preferredSpeech: ['playful', 'gentle'], likedTouches: ['hand', 'hair', 'cheek'], dislikedTouches: ['shoulder'], boundaryReaction: r('어, 잠깐. 그건 생각보다 진지해서 긴장되는데요.', '세현이 웃다가 어깨에 힘을 살짝 줬다.', 'troubled') },
  char_009: { preferredSpeech: ['gentle', 'quiet'], likedTouches: ['hand', 'sleeve'], dislikedTouches: ['tickle', 'cheek'], boundaryReaction: r('……조금 천천히 해주시면 좋겠습니다.', '이겸은 정중하게 말하면서도 숨을 한 번 고른다.', 'hmm') },
  char_010: { preferredSpeech: ['quiet', 'gentle'], likedTouches: ['hand', 'shoulder'], dislikedTouches: ['cheek', 'tickle'], boundaryReaction: r('그건 불시에 하면 반사적으로 막습니다.', '재하가 손을 멈춰 세우고 천천히 놓아주었다.', 'hmm') },
  char_011: { preferredSpeech: ['playful', 'gentle'], likedTouches: ['hand', 'hair', 'cheek'], dislikedTouches: ['sleeve'], boundaryReaction: r('어라. 오늘은 거기부터예요?', '유리안이 웃기는 했지만 이번에는 먼저 속도를 늦췄다.', 'interested') },
  char_012: { preferredSpeech: ['quiet', 'gentle'], likedTouches: ['hand', 'sleeve'], dislikedTouches: ['tickle', 'cheek'], boundaryReaction: r('……그건 아직 조금 낯섭니다.', '이현이 짧게 시선을 내리고 다시 평소의 거리를 찾았다.', 'hmm') },
}

export function getDateTurnEvaluation(
  characterId: string,
  speech: DateSpeechIntent,
  touch: DateTurnTouchKey,
): DateTurnEvaluation {
  const profile = characterDateProfiles[characterId]
  if (!profile) {
    return { heartDelta: 0, isWeak: false, weakSpotLabel: null, reaction: null }
  }

  const preference = dateCharacterTurnPreferences[characterId]
  const reactionKey = turnTouchToReactionKey[touch]
  const isWeak = Boolean(reactionKey && reactionKey === profile.weakSpot)
  const speechHit = Boolean(preference?.preferredSpeech.includes(speech))
  const touchHit = touch !== 'none' && Boolean(preference?.likedTouches.includes(touch))
  const touchMiss = touch !== 'none' && Boolean(preference?.dislikedTouches.includes(touch))

  let heartDelta: -1 | 0 | 1 | 2 = 0
  if (isWeak) heartDelta = 2
  else if (touchMiss && !speechHit) heartDelta = -1
  else if (speechHit || touchHit) heartDelta = 1

  const reaction = isWeak
    ? { ...profile.weakReaction, expression: 'shy' as PortraitExpression }
    : touchMiss && !speechHit
      ? preference?.boundaryReaction ?? getDateCharacterTurnReaction(characterId, speech, touch)
      : getDateCharacterTurnReaction(characterId, speech, touch)

  return {
    heartDelta,
    isWeak,
    weakSpotLabel: isWeak ? profile.weakSpotLabel : null,
    reaction,
  }
}



export type DateReactionPop = '!' | '!!' | '!?' | '?' | '…' | '…?' | '♡' | '♥' | '♡♡' | '♪' | '♪♪' | '✦' | '✧' | '☆' | '💧' | '💦' | '💢' | '///' | '☁' | '↯' | '!♡'

const dateReactionPopStyles: Record<string, {
  positive: DateReactionPop[][]
  weak: DateReactionPop[][]
  neutral: DateReactionPop[][]
  negative: DateReactionPop[][]
}> = {
  char_001: { positive: [['…', '♡'], ['✧', '♡']], weak: [['!', '…', '///'], ['!?', '💧']], neutral: [['…'], ['?']], negative: [['…?', '☁']] },
  char_002: { positive: [['✦', '♡'], ['…', '!♡']], weak: [['!', '…', '💢'], ['!?', '///']], neutral: [['?'], ['…']], negative: [['?', '💢']] },
  char_003: { positive: [['…', '♡'], ['!', '♡']], weak: [['!?', '💦', '///'], ['!!', '…']], neutral: [['…'], ['?']], negative: [['!', '…']] },
  char_004: { positive: [['♪', '♡'], ['✦', '♪']], weak: [['!?', '💦', '💢'], ['!', '///']], neutral: [['♪'], ['?']], negative: [['…?', '💧']] },
  char_005: { positive: [['…', '♡'], ['✧']], weak: [['!', '…'], ['!?', '💧']], neutral: [['…']], negative: [['…', '☁']] },
  char_006: { positive: [['♪♪', '♡'], ['☆', '♪']], weak: [['!?', '💦', '♪'], ['!!', '♡']], neutral: [['♪'], ['?']], negative: [['?', '💧']] },
  char_007: { positive: [['!', '♡'], ['✦', '♡']], weak: [['!?', '💦', '///'], ['!!', '💢']], neutral: [['?'], ['…']], negative: [['!', '☁']] },
  char_008: { positive: [['♪', '♡'], ['✧', '♡']], weak: [['!?', '///', '💦'], ['!', '♡']], neutral: [['♪'], ['?']], negative: [['…?', '💧']] },
  char_009: { positive: [['…', '♡'], ['✧']], weak: [['!', '…', '///'], ['!?', '💧']], neutral: [['…'], ['?']], negative: [['…', '☁']] },
  char_010: { positive: [['…', '♡'], ['!', '♡']], weak: [['!', '…'], ['!?', '///']], neutral: [['…']], negative: [['!', '💢']] },
  char_011: { positive: [['✦', '♪', '♡'], ['!♡', '✧']], weak: [['!?', '💦', '///'], ['!!', '♡♡']], neutral: [['♪'], ['?']], negative: [['?', '💧']] },
  char_012: { positive: [['…', '♡'], ['✧', '♡']], weak: [['!', '…', '♡'], ['!?', '💧']], neutral: [['…'], ['…?']], negative: [['…', '☁']] },
}

export function getDateReactionPopSequence(
  characterId: string,
  heartDelta: number,
  isWeak: boolean,
  turn: number,
): DateReactionPop[] {
  const style = dateReactionPopStyles[characterId] ?? dateReactionPopStyles.char_001
  const pool = isWeak
    ? style.weak
    : heartDelta > 0
      ? style.positive
      : heartDelta < 0
        ? style.negative
        : style.neutral
  return pool[Math.abs(turn - 1) % pool.length] ?? ['…']
}

const dateInnerThoughts: Record<string, {
  positive: [string, string]
  weak: [string, string]
  negative: string
}> = {
  char_001: { positive: ['……이런 건 오래 기억하게 될 것 같다.', '조금 더 이대로 있어도 괜찮겠지.'], weak: ['잠깐, 생각보다 진짜 간지러운데.', '티 내면 또 건드릴 것 같은데…….'], negative: '조금 빠른 것 같지만, 싫다는 건 아니다.' },
  char_002: { positive: ['……이렇게 나오면 계산이 안 맞는데.', '먼저 흔들리는 쪽은 되고 싶지 않은데.'], weak: ['잠깐. 여기서 티 내면 지는 건데.', '표정 관리부터 해야겠군.'], negative: '속도를 조금만 늦추면 될 텐데.' },
  char_003: { positive: ['손을 놓을 이유는 없겠지.', '이 정도 거리는…… 괜찮다.'], weak: ['안 됩니다. 웃으면 더 놀릴 텐데.', '진짜 거긴 약한데…….'], negative: '조금만 천천히 하면 괜찮을 것 같다.' },
  char_004: { positive: ['어라, 이건 내가 먼저 할 생각이었는데.', '오늘은 생각보다 더 설레는데.'], weak: ['잠깐, 진짜 거긴 안 되는데.', '웃음 참는 건 포기해야 하나.'], negative: '조금만 분위기를 다시 잡아볼까.' },
  char_005: { positive: ['……조금 더 가까워도 괜찮겠군.', '이 사람 앞에서는 긴장을 늦춰도 될 것 같다.'], weak: ['반응하지 마. 티 난다.', '……이미 들킨 것 같은데.'], negative: '놀라게 하고 싶지는 않다.' },
  char_006: { positive: ['좋다. 좀 더 가까이 가도 되겠지?', '이 분위기, 꽤 마음에 드는데.'], weak: ['아, 진짜 웃음 나와!', '또 하면 진짜 못 참을 것 같은데.'], negative: '이건 타이밍이 조금 아니었나?' },
  char_007: { positive: ['이 정도는 아무렇지도…… 않다.', '손, 계속 잡고 있어도 되는 거겠지.'], weak: ['읏, 들키면 계속 놀릴 텐데!', '아니, 왜 하필 거길……!'], negative: '당황한 티를 너무 냈나.' },
  char_008: { positive: ['와, 이거 진짜 데이트 같다.', '조금만 더 가까워져도 좋을 것 같은데.'], weak: ['아니 잠깐, 얼굴 빨개지는 거 보이면 안 되는데.', '이 반응까지 관찰당하면 너무 억울한데!'], negative: '어색하게 만들고 싶진 않은데.' },
  char_009: { positive: ['이 감정은…… 굳이 분석하지 않아도 되겠군.', '조금 편해져도 괜찮을 것 같다.'], weak: ['평정을 유지해야 하는데.', '반응을 들키지 않는 건 이미 늦었군.'], negative: '지금은 천천히 가는 편이 좋다.' },
  char_010: { positive: ['이 정도 거리는 나쁘지 않다.', '곁에 있는 걸 경계하지 않아도 된다.'], weak: ['반사적으로 피하면 놀라겠지. 참자.', '……약한 곳을 알아버렸군.'], negative: '막을 필요는 없지만, 조금 빠르다.' },
  char_011: { positive: ['이쪽이 더 능숙해야 하는데.', '왜 내가 더 긴장하고 있지?'], weak: ['그, 거긴 진짜 안 돼. 표정 관리 안 되잖아.', '잠깐, 이건 웃어서 넘길 수가 없는데.'], negative: '농담으로 넘기기 전에 숨부터 고르자.' },
  char_012: { positive: ['……이 순간은 기억하고 싶다.', '이번에는 오래 남았으면 좋겠는데.'], weak: ['또 기억날 것 같다. 그래도 피하고 싶지는 않아.', '손목은…… 아직 조금 어렵다.'], negative: '서두르지 않아도 된다. 이번에는.' },
}

export function getDateInnerThought(
  characterId: string,
  heartDelta: number,
  isWeak: boolean,
  turn: number,
): string | null {
  const thoughts = dateInnerThoughts[characterId]
  if (!thoughts) return null
  if (isWeak) return thoughts.weak[Math.abs(turn - 1) % thoughts.weak.length]
  if (heartDelta >= 2) return thoughts.positive[Math.abs(turn - 1) % thoughts.positive.length]
  if (heartDelta < 0) return thoughts.negative
  // +1 thoughts appear every other turn so the character does not narrate every feeling.
  if (heartDelta > 0 && turn % 2 === 0) return thoughts.positive[Math.floor(turn / 2) % thoughts.positive.length]
  return null
}

const dateExpressionFlows: Record<string, [PortraitExpression, PortraitExpression, PortraitExpression, PortraitExpression, PortraitExpression, PortraitExpression]> = {
  char_001: ['main', 'main', 'smile', 'troubled', 'shy', 'shy'],
  char_002: ['main', 'sly', 'sly', 'troubled', 'shy', 'shy'],
  char_003: ['main', 'main', 'smile', 'troubled', 'shy', 'shy'],
  char_004: ['main', 'smile', 'smile', 'troubled', 'shy', 'shy'],
  char_005: ['main', 'faintSmile', 'sly', 'troubled', 'shy', 'shy'],
  char_006: ['main', 'smile', 'genuineSmile', 'eyesClosedSmile', 'shy', 'genuineSmile'],
  char_007: ['main', 'smile', 'confident', 'troubled', 'shy', 'love'],
  char_008: ['main', 'smile', 'smile', 'troubled', 'shy', 'loveSmile'],
  char_009: ['main', 'main', 'thinking', 'troubled', 'shy', 'shy'],
  char_010: ['main', 'smile', 'love', 'busted', 'shy', 'love'],
  char_011: ['main', 'interested', 'smile', 'loveShy', 'shy', 'deepLove'],
  char_012: ['main', 'main', 'smile', 'troubled', 'shy', 'love'],
}

export function getDateMoodExpression(characterId: string, heart: number): PortraitExpression {
  const flow = dateExpressionFlows[characterId] ?? dateExpressionFlows.char_001
  return flow[Math.max(0, Math.min(5, heart))] ?? 'main'
}

export function getDateExpressionSequence(
  characterId: string,
  fromHeart: number,
  toHeart: number,
  reactionExpression?: PortraitExpression,
): PortraitExpression[] {
  const flow = dateExpressionFlows[characterId] ?? dateExpressionFlows.char_001
  const sequence: PortraitExpression[] = []
  if (toHeart > fromHeart) {
    for (let heart = fromHeart + 1; heart <= toHeart; heart += 1) {
      const expression = flow[Math.max(0, Math.min(5, heart))]
      if (expression && sequence[sequence.length - 1] !== expression) sequence.push(expression)
    }
  } else if (toHeart < fromHeart) {
    if (reactionExpression && reactionExpression !== sequence[sequence.length - 1]) sequence.push(reactionExpression)
    const expression = flow[Math.max(0, Math.min(5, toHeart))]
    if (expression && sequence[sequence.length - 1] !== expression) sequence.push(expression)
  } else if (reactionExpression) {
    sequence.push(reactionExpression)
    const settle = flow[Math.max(0, Math.min(5, toHeart))]
    if (settle && settle !== reactionExpression) sequence.push(settle)
  }
  return sequence.length ? sequence : [flow[Math.max(0, Math.min(5, toHeart))] ?? 'main']
}

const returnTouchStateByCharacterId: Record<string, DateTouchState> = {
  char_001: 'holdingHands',
  char_002: 'interlockedHands',
  char_003: 'holdingHands',
  char_004: 'holdingHands',
  char_005: 'holdingHands',
  char_006: 'holdingHands',
  char_007: 'holdingHands',
  char_008: 'none',
  char_009: 'holdingHands',
  char_010: 'holdingHands',
  char_011: 'holdingHands',
  char_012: 'interlockedHands',
}

export function getDateReturnTouch(characterId: string) {
  const profile = characterDateProfiles[characterId]
  if (!profile) return null
  return {
    line: profile.returnTouch,
    touchState: returnTouchStateByCharacterId[characterId] ?? 'holdingHands',
  }
}

export function getDateTouchStateLabel(state: DateTouchState) {
  const labels: Record<DateTouchState, string> = {
    none: '접촉 없음',
    holdingHands: '손을 잡고 있음',
    interlockedHands: '손깍지를 끼고 있음',
    sleeveHeld: '소매를 잡고 있음',
    shoulderContact: '어깨에 손을 얹고 있음',
  }
  return labels[state]
}

export function getDateTouchOptionCopy(
  option: DateTurnOption<DateTurnTouchKey>,
  state: DateTouchState,
): DateTurnOption<DateTurnTouchKey> {
  if (option.id === 'none' && state !== 'none') {
    return { ...option, label: '접촉을 풀고 손을 거둔다', hint: '이어져 있던 스킨십을 마무리한다' }
  }
  if (option.id === 'hand' && state === 'holdingHands') {
    return { ...option, label: '잡은 손을 그대로 맞잡는다', hint: '손을 놓지 않고 접촉을 이어간다' }
  }
  if (option.id === 'hand' && state === 'interlockedHands') {
    return { ...option, label: '맞물린 손을 놓지 않는다', hint: '손깍지를 유지한다' }
  }
  if (option.id === 'sleeve' && state === 'sleeveHeld') {
    return { ...option, label: '소매 끝을 계속 잡고 있는다', hint: '잡은 옷자락을 놓지 않는다' }
  }
  if (option.id === 'shoulder' && state === 'shoulderContact') {
    return { ...option, label: '어깨에 둔 손을 그대로 둔다', hint: '가까운 접촉을 유지한다' }
  }
  return option
}

export function getDatePlace(placeId: string) {
  return datePlaces.find((place) => place.id === placeId)
}

export function getDateProfile(characterId: string) {
  return characterDateProfiles[characterId]
}
