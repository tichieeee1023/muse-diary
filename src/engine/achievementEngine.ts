import type { CollectionProgress, GameProgress } from '../types/game'
import { getAllCharacters } from './encounterEngine'

export interface AchievementResult {
  id: string
  title: string
  description: string
  unlocked: boolean
  hidden?: boolean
}

export function getAchievements(progress: GameProgress, collection: CollectionProgress): AchievementResult[] {
  const characters = getAllCharacters()
  const byId = new Map(characters.map((character) => [character.id, character]))
  const discovered = collection.discoveredCharacterIds.length
  const completed = collection.completedCharacterIds.length
  const hasRComplete = collection.completedCharacterIds.some((id) => byId.get(id)?.rarity === 'R')
  const hasSrComplete = collection.completedCharacterIds.some((id) => byId.get(id)?.rarity === 'SR')
  const hasSsr = collection.discoveredCharacterIds.some((id) => byId.get(id)?.rarity === 'SSR')
  const maxEncounter = Math.max(0, ...Object.values(collection.encounterCounts))
  const maxVisits = Math.max(0, ...Object.values(progress.placeVisits))

  return [
    { id: 'first-muse', title: '첫 번째 영감', description: '처음으로 한 명의 뮤즈를 발견했다.', unlocked: discovered >= 1 },
    { id: 'five-muses', title: '작업 노트가 붐빈다', description: '5명의 뮤즈를 발견했다.', unlocked: discovered >= 5 },
    { id: 'all-current', title: '빈칸이 사라졌다', description: '현재 공개된 12명의 뮤즈를 모두 발견했다.', unlocked: discovered >= Math.min(12, characters.length) },
    { id: 'first-complete', title: '한 페이지의 완성', description: '처음으로 한 사람의 이야기를 끝까지 보았다.', unlocked: completed >= 1 },
    { id: 'three-complete', title: '뮤즈 수집가', description: '3명의 공략을 완료했다.', unlocked: completed >= 3 },
    { id: 'r-love', title: '평범한 남자가 좋아', description: 'R 캐릭터의 공략을 완료했다.', unlocked: hasRComplete },
    { id: 'sr-love', title: '조금 특별한 취향', description: 'SR 캐릭터의 공략을 완료했다.', unlocked: hasSrComplete },
    { id: 'ssr-found', title: '전설은 실재한다', description: 'SSR 캐릭터를 처음 발견했다.', unlocked: hasSsr },
    { id: 'secret-reader', title: '그가 말하지 않은 것', description: '비설을 처음으로 끝까지 읽었다.', unlocked: collection.secretReadCharacterIds.length >= 1 },
    { id: 'repeat-visitor', title: '거기 또 가요?', description: '한 장소를 5번 이상 방문했다.', unlocked: maxVisits >= 5 },
    { id: 'persistent', title: '철벽도 두드리면 열린다', description: '한 사람을 8번 이상 만났다.', unlocked: maxEncounter >= 8 },
    { id: 'bar-open', title: '퇴근 후의 세계', description: '밤에만 열리는 장소를 발견했다.', unlocked: progress.unlockedPlaceIds.includes('bar'), hidden: true },
    { id: 'day-ten', title: '영감은 발로 뛰는 것', description: 'DAY 10에 도달했다.', unlocked: progress.day >= 10 },
  ]
}
