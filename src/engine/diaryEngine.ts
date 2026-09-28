import type { CharacterDefinition, CollectionProgress, DiaryFact } from '../types/game'

export function getRelationshipLabel(affection: number) {
  if (affection >= 100) return '마음이 닿은 사이'
  if (affection >= 80) return '특별한 사이'
  if (affection >= 60) return '가까운 사이'
  if (affection >= 40) return '익숙한 사이'
  if (affection >= 20) return '안면 있음'
  return '낯선 사이'
}

export function isFactUnlocked(
  fact: DiaryFact,
  characterId: string,
  collection: CollectionProgress,
) {
  const affection = collection.affectionByCharacterId[characterId] ?? 0
  const encounterCount = collection.encounterCounts[characterId] ?? 0
  const memories = collection.importantMemories[characterId] ?? []

  if (fact.unlock.encounterCount && encounterCount < fact.unlock.encounterCount) return false
  if (fact.unlock.affection && affection < fact.unlock.affection) return false
  if (fact.unlock.memoryKey && !memories.includes(fact.unlock.memoryKey)) return false
  return true
}

export function getUnlockedFactCount(character: CharacterDefinition, collection: CollectionProgress) {
  return character.diaryFacts.filter((fact) => isFactUnlocked(fact, character.id, collection)).length
}

export function hasReachedFirstCompletion(collection: CollectionProgress) {
  return Object.values(collection.affectionByCharacterId).some((value) => value >= 100)
}
