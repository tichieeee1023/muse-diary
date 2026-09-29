import charactersJson from '../data/characters.json'
import { getCharacterStoryBundle } from '../data/characters/index'
import type { CharacterDefinition, CharacterFirstEncounterRule, CharacterSpawnRule, Rarity, TimeOfDay, Weather } from '../types/game'

const characters = charactersJson as unknown as CharacterDefinition[]

const rarityWeight: Record<Rarity, number> = { R: 1, SR: 0.75, SSR: 0.5 }

interface EncounterQuery {
  placeId: string
  routeId: string
  timeOfDay: TimeOfDay
  weather: Weather
  lastCharacterId: string | null
  recentEncounterCharacterIds?: string[]
  completedCharacterIds?: string[]
  ssrMissStreak?: number
  discoveredCharacterIds?: string[]
  firstEncounterCompletedCharacterIds?: string[]
  seenEpisodeIdsByCharacterId?: Record<string, string[]>
}

interface FirstEncounterContext {
  placeId: string
  timeOfDay: TimeOfDay
  weather: Weather
}

interface WeightedCharacter {
  character: CharacterDefinition
  weight: number
}

function matchesFirstEncounterRule(rule: CharacterFirstEncounterRule, context: FirstEncounterContext) {
  if (rule.placeId !== context.placeId) return false
  if (rule.times?.length && !rule.times.includes(context.timeOfDay)) return false
  if (rule.weather?.length && !rule.weather.includes(context.weather)) return false
  return true
}

export function isFirstEncounterAvailable(character: CharacterDefinition, context: FirstEncounterContext) {
  return matchesFirstEncounterRule(character.firstEncounterRule, context)
}

function matchesSpawnRule(rule: CharacterSpawnRule, query: EncounterQuery, relaxed: boolean) {
  if (rule.placeId !== query.placeId) return false
  const routeMatches = relaxed || !rule.routeIds?.length || rule.routeIds.includes(query.routeId)
  const timeMatches = relaxed || !rule.times?.length || rule.times.includes(query.timeOfDay)
  const weatherMatches = relaxed || !rule.weather?.length || rule.weather.includes(query.weather)
  return routeMatches && timeMatches && weatherMatches
}


function recentEncounterPenalty(characterId: string, recentIds?: string[]) {
  if (!recentIds?.length) return 1
  const indexFromEnd = [...recentIds].reverse().indexOf(characterId)
  if (indexFromEnd < 0) return 1
  // 직전 조우자는 buildCandidates 단계에서 우선 제외합니다.
  // 그 이전 3명도 잠시 숨을 고르게 해서 같은 얼굴이 지도에 몰리는 느낌을 줄입니다.
  if (indexFromEnd === 1) return 0.38
  if (indexFromEnd === 2) return 0.62
  if (indexFromEnd === 3) return 0.82
  return 1
}

function hasUnseenCasualForContext(characterId: string, query: EncounterQuery) {
  const bundle = getCharacterStoryBundle(characterId)
  if (!bundle) return false
  const seen = query.seenEpisodeIdsByCharacterId?.[characterId] ?? []
  return bundle.casual.some((episode) => {
    if (seen.includes(episode.id)) return false
    if (episode.placeIds?.length && !episode.placeIds.includes(query.placeId)) return false
    if (episode.times?.length && !episode.times.includes(query.timeOfDay)) return false
    if (episode.weather?.length && !episode.weather.includes(query.weather)) return false
    return true
  })
}

function completedCharacterPenalty(characterId: string, query: EncounterQuery) {
  if (!query.completedCharacterIds?.includes(characterId)) return 1
  // 엔딩 후에도 아직 못 본 DAILY가 현재 장소/시간/날씨에 남아 있으면
  // 재회 가치가 있으므로 완전히 밀어내지 않습니다. 모두 본 뒤에는 훨씬 드물게 등장합니다.
  return hasUnseenCasualForContext(characterId, query) ? 0.4 : 0.1
}

function buildCandidates(query: EncounterQuery, relaxed = false, ignoreLastCharacter = false): WeightedCharacter[] {
  const result: WeightedCharacter[] = []
  for (const character of characters) {
    if (!ignoreLastCharacter && character.id === query.lastCharacterId) continue
    if (query.placeId === 'bar' && character.age < 19) continue

    const firstEncounterCompleted = query.firstEncounterCompletedCharacterIds?.includes(character.id) ?? false

    if (!firstEncounterCompleted) {
      if (!matchesFirstEncounterRule(character.firstEncounterRule, query)) continue
      result.push({
        character,
        weight: Math.max(0.02, rarityWeight[character.rarity]),
      })
      continue
    }

    for (const rule of character.spawnRules) {
      if (rule.placeId !== query.placeId) continue
      if (rule.secondaryOnly && !query.discoveredCharacterIds?.includes(character.id)) continue
      if (!matchesSpawnRule(rule, query, relaxed)) continue

      const completedPenalty = completedCharacterPenalty(character.id, query)
      const recencyPenalty = recentEncounterPenalty(character.id, query.recentEncounterCharacterIds)
      result.push({
        character,
        weight: Math.max(0.02, rarityWeight[character.rarity] * (rule.weight ?? 1) * completedPenalty * recencyPenalty),
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

  // 30회 연속 SSR 미조우 이후: 현재 조건에서 만날 수 있는 SSR이 있으면 조용히 보정합니다.
  // 아직 첫 만남을 완료하지 않은 캐릭터는 대표 장소/시간/날씨 조건을 절대 완화하지 않습니다.
  if ((query.ssrMissStreak ?? 0) >= 30) {
    const strictSsr = pickSsr(strictCandidates)
    if (strictSsr) return strictSsr
    const relaxedSsr = pickSsr(buildCandidates(query, true))
    if (relaxedSsr) return relaxedSsr
  }

  const strictPick = pickWeighted(strictCandidates)
  if (strictPick) return strictPick

  // 이미 첫 만남을 마친 인물만 날씨/시간/세부 동선 조건을 완화합니다.
  const relaxedCandidates = buildCandidates(query, true)
  const relaxedPick = pickWeighted(relaxedCandidates)
  if (relaxedPick) return relaxedPick

  // 직전 조우자 때문에 후보가 사라진 경우에만 '완전 제외'를 해제합니다.
  // 최근 조우 2~4순위 감산은 그대로 유지되며, 첫 만남 고유 조건도 유지됩니다.
  return pickWeighted(buildCandidates(query, true, true))
}

export function hasEncounterCandidate(query: EncounterQuery) {
  return buildCandidates(query, true, true).length > 0
}

export function getCharacter(characterId: string) {
  return characters.find((character) => character.id === characterId)
}

export function getAllCharacters() {
  return characters
}
