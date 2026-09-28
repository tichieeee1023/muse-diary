import charactersJson from '../data/characters.json'
import type { CharacterDefinition, Rarity, TimeOfDay, Weather } from '../types/game'

const characters = charactersJson as unknown as CharacterDefinition[]

const rarityWeight: Record<Rarity, number> = { R: 1, SR: 0.75, SSR: 0.5 }

interface EncounterQuery {
  placeId: string
  routeId: string
  timeOfDay: TimeOfDay
  weather: Weather
  lastCharacterId: string | null
  completedCharacterIds?: string[]
  ssrMissStreak?: number
}

interface WeightedCharacter {
  character: CharacterDefinition
  weight: number
}

function buildCandidates(query: EncounterQuery, relaxed = false): WeightedCharacter[] {
  const result: WeightedCharacter[] = []
  for (const character of characters) {
    if (character.id === query.lastCharacterId) continue
    if (query.placeId === 'bar' && character.age < 19) continue

    for (const rule of character.spawnRules) {
      if (rule.placeId !== query.placeId) continue
      const routeMatches = relaxed || !rule.routeIds?.length || rule.routeIds.includes(query.routeId)
      const timeMatches = relaxed || !rule.times?.length || rule.times.includes(query.timeOfDay)
      const weatherMatches = relaxed || !rule.weather?.length || rule.weather.includes(query.weather)
      if (!routeMatches || !timeMatches || !weatherMatches) continue

      const completedPenalty = query.completedCharacterIds?.includes(character.id) ? 0.18 : 1
      result.push({
        character,
        weight: Math.max(0.02, rarityWeight[character.rarity] * (rule.weight ?? 1) * completedPenalty),
      })
      break
    }
  }
  return result
}

function pickWeighted(candidates: WeightedCharacter[]): CharacterDefinition | null {
  if (candidates.length === 0) return null
  const total = candidates.reduce((sum, item) => sum + item.weight, 0)
  let cursor = Math.random() * total
  for (const item of candidates) {
    cursor -= item.weight
    if (cursor <= 0) return item.character
  }
  return candidates[candidates.length - 1]?.character ?? null
}

function pickSsr(candidates: WeightedCharacter[]) {
  return pickWeighted(candidates.filter((item) => item.character.rarity === 'SSR'))
}

export function selectEncounter(query: EncounterQuery): CharacterDefinition | null {
  const strictCandidates = buildCandidates(query)

  // 30회 연속 SSR 미조우 이후: 현재 장소/동선 조건에 SSR이 있으면 조용히 보정합니다.
  if ((query.ssrMissStreak ?? 0) >= 30) {
    const strictSsr = pickSsr(strictCandidates)
    if (strictSsr) return strictSsr
    const relaxedSsr = pickSsr(buildCandidates(query, true))
    if (relaxedSsr) return relaxedSsr
  }

  const strictPick = pickWeighted(strictCandidates)
  if (strictPick) return strictPick

  // 날씨/시간/세부 동선 조건이 너무 빡빡한 날에도 같은 장소의 인물은 반드시 등장합니다.
  const relaxedCandidates = buildCandidates(query, true)
  const relaxedPick = pickWeighted(relaxedCandidates)
  if (relaxedPick) return relaxedPick

  // 마지막 조우자 때문에 후보가 사라진 경우에만 연속 방지 조건을 마지막 수단으로 해제합니다.
  return characters.find((character) =>
    character.spawnRules.some((rule) => rule.placeId === query.placeId) &&
    !(query.placeId === 'bar' && character.age < 19),
  ) ?? null
}

export function getCharacter(characterId: string) {
  return characters.find((character) => character.id === characterId)
}

export function getAllCharacters() {
  return characters
}
