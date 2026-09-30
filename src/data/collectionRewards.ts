import type { CollectionProgress, GameProgress } from '../types/game'

export interface CollectionReward {
  id: string
  title: string
  description: string
  rewardLabel: string
  current: number
  goal: number
  unlocked: boolean
}

function reward(
  id: string,
  title: string,
  description: string,
  rewardLabel: string,
  current: number,
  goal: number,
): CollectionReward {
  return { id, title, description, rewardLabel, current: Math.min(current, goal), goal, unlocked: current >= goal }
}

export function getCollectionRewards(progress: GameProgress, collection: CollectionProgress): CollectionReward[] {
  const completed = collection.completedCharacterIds.length
  const discovered = collection.discoveredCharacterIds.length
  const secretRead = collection.secretReadCharacterIds.length
  const seasonalCount = Object.keys(collection.seasonalEventRecords).length
  const lettersRead = collection.readLetterIds.length
  const afterEndingDates = collection.completedAfterEndingDateCharacterIds.length

  return [
    reward('first-completion', '첫 번째 서랍', '한 사람의 이야기를 끝까지 완성하세요.', '기록 스탬프 · FIRST MUSE', completed, 1),
    reward('room-regular', '작업실 단골', '완성된 인연을 세 명의 자리까지 늘리세요.', '마이룸 명패 · WELCOME HOME', completed, 3),
    reward('all-names', '열두 개의 이름', '작업실에 등장하는 모든 뮤즈를 발견하세요.', '기록 스탬프 · ALL NAMES', discovered, 12),
    reward('secret-keeper', '비밀 보관함', '세 사람의 비설을 끝까지 읽으세요.', 'MUSE SHELF 리본 · SECRET KEEPER', secretRead, 3),
    reward('four-seasons', '네 계절의 우리', '계절의 특별한 날을 모두 기록하세요.', `계절 표지 · DAY ${String(progress.day).padStart(2, '0')}`, seasonalCount, 4),
    reward('letter-keeper', '편지를 읽는 사람', '도착한 편지 세 통을 끝까지 읽으세요.', '우편함 스탬프 · LETTER KEEPER', lettersRead, 3),
    reward('after-story-keeper', '끝난 뒤의 우리', '엔딩 후 추가 데이트 세 편을 완성하세요.', '기억 리본 · AFTER STORY', afterEndingDates, 3),
  ]
}
