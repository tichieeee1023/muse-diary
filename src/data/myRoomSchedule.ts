export type MyRoomVisitPeriod = 'day' | 'evening'

export interface MyRoomVisitPlan {
  characterId: string
  weekday: number
  period: MyRoomVisitPeriod
  periodLabel: string
  note: string
  isScheduled: boolean
}

export interface MyRoomNextVisit {
  daysUntil: number
  plan: MyRoomVisitPlan
}

interface CharacterSchedule {
  weekdays: number[]
  period: MyRoomVisitPeriod
  note: string
}

const scheduleByCharacter: Record<string, CharacterSchedule> = {
  char_001: { weekdays: [1, 4], period: 'day', note: '정리되지 않은 노트를 들고 오는 날' },
  char_002: { weekdays: [2, 5], period: 'day', note: '일정표보다 조금 일찍 도착하는 날' },
  char_003: { weekdays: [3, 6], period: 'evening', note: '작업실의 문단속을 확인하는 날' },
  char_004: { weekdays: [4, 7], period: 'day', note: '간식 봉투가 함께 오는 날' },
  char_005: { weekdays: [1, 5], period: 'evening', note: '늦은 귀가를 걱정하는 날' },
  char_006: { weekdays: [2, 6], period: 'day', note: '먼저 놀자고 조르는 날' },
  char_007: { weekdays: [3, 7], period: 'evening', note: '조심스럽게 자리를 잡는 날' },
  char_008: { weekdays: [1, 4], period: 'day', note: '작업실 풍경을 스케치하는 날' },
  char_009: { weekdays: [2, 5], period: 'evening', note: '차 한 잔을 권하는 날' },
  char_010: { weekdays: [3, 6], period: 'evening', note: '도착 전에 주변을 확인하는 날' },
  char_011: { weekdays: [4, 7], period: 'day', note: '별 스티커를 하나 챙겨 오는 날' },
  char_012: { weekdays: [1, 3, 6], period: 'evening', note: '시간을 오래 쓰고 싶은 날' },
}

const periodLabels: Record<MyRoomVisitPeriod, string> = {
  day: '오후 방문',
  evening: '저녁 방문',
}

function getWeekday(day: number) {
  return ((Math.max(1, day) - 1) % 7) + 1
}

function hash(value: string) {
  return Array.from(value).reduce((acc, char) => ((acc * 31) + char.charCodeAt(0)) >>> 0, 7)
}

export function getMyRoomVisitSchedule(characterId: string, day: number): MyRoomVisitPlan {
  const weekday = getWeekday(day)
  const schedule = scheduleByCharacter[characterId] ?? { weekdays: [], period: 'day' as const, note: '잠깐 들를 시간이 생긴 날' }
  const isScheduled = schedule.weekdays.includes(weekday)

  return {
    characterId,
    weekday,
    period: schedule.period,
    periodLabel: periodLabels[schedule.period],
    note: isScheduled ? schedule.note : '오늘은 예고 없이 잠깐 들렀습니다',
    isScheduled,
  }
}

export function getMyRoomVisitPlan(characterIds: string[], day: number): MyRoomVisitPlan[] {
  if (characterIds.length === 0) return []

  const plans = characterIds.map((characterId) => getMyRoomVisitSchedule(characterId, day))
  const scheduled = plans
    .filter((plan) => plan.isScheduled)
    .sort((a, b) => hash(`${day}:scheduled:${a.characterId}`) - hash(`${day}:scheduled:${b.characterId}`))
  const dropIns = plans
    .filter((plan) => !plan.isScheduled)
    .sort((a, b) => hash(`${day}:drop-in:${a.characterId}`) - hash(`${day}:drop-in:${b.characterId}`))

  return [...scheduled, ...dropIns]
    .slice(0, Math.min(2, plans.length))
    .map((plan, index) => index === 0 || plan.isScheduled ? plan : { ...plan, note: '오늘은 이 사람도 함께 들렀습니다' })
}

export function getMyRoomNextVisit(characterId: string, day: number): MyRoomNextVisit {
  for (let daysUntil = 0; daysUntil <= 7; daysUntil += 1) {
    const plan = getMyRoomVisitSchedule(characterId, day + daysUntil)
    if (plan.isScheduled) return { daysUntil, plan }
  }

  return { daysUntil: 7, plan: getMyRoomVisitSchedule(characterId, day + 7) }
}
