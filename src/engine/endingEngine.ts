import endingData from '../data/endings.json'
import type { CharacterEndingContent } from '../types/game'

const endings = endingData as CharacterEndingContent[]

export function getEndingContent(characterId: string) {
  return endings.find((item) => item.characterId === characterId) ?? null
}
