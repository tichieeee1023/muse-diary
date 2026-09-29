import { getCharacterStoryBundle } from '../data/characters/index'
import { enrichStoryPortrait } from '../data/portraitExpressions'
import type { CollectionProgress, PortraitExpression, StoryBlock, StoryEpisode, TimeOfDay, Weather } from '../types/game'

function pick<T>(items: T[]): T | null {
  if (!items.length) return null
  return items[Math.floor(Math.random() * items.length)] ?? null
}

function matchesContext(episode: StoryEpisode, timeOfDay?: TimeOfDay, weather?: Weather) {
  const timeMatches = !timeOfDay || !episode.times?.length || episode.times.includes(timeOfDay)
  const weatherMatches = !weather || !episode.weather?.length || episode.weather.includes(weather)
  return timeMatches && weatherMatches
}

export function selectCharacterEpisode(characterId: string, collection: CollectionProgress, placeId?: string, timeOfDay?: TimeOfDay, weather?: Weather): StoryEpisode | null {
  const bundle = getCharacterStoryBundle(characterId)
  if (!bundle) return null

  const seen = collection.seenEpisodeIdsByCharacterId[characterId] ?? []
  const storyDone = collection.completedStoryEpisodeIdsByCharacterId[characterId] ?? []
  const recentCasual = collection.recentCasualEpisodeIdsByCharacterId[characterId] ?? []
  const affection = collection.affectionByCharacterId[characterId] ?? 0

  if (!seen.includes(bundle.first.id)) return bundle.first

  const nextStory = bundle.story.find((episode) =>
    !storyDone.includes(episode.id) && affection >= (episode.threshold ?? 0) && matchesContext(episode, timeOfDay, weather),
  )
  if (nextStory) return nextStory

  const canReplay = (episode: StoryEpisode) => episode.repeatable !== false || !seen.includes(episode.id)
  const isRecent = (episode: StoryEpisode) => recentCasual.includes(episode.id)
  const preferFresh = (episodes: StoryEpisode[]) => {
    const unseen = episodes.filter((episode) => !seen.includes(episode.id))
    if (unseen.length) return pick(unseen)

    const notRecent = episodes.filter((episode) => !isRecent(episode))
    if (notRecent.length) return pick(notRecent)

    return pick(episodes)
  }

  const eligible = bundle.casual.filter((episode) => {
    const min = episode.minAffection ?? 0
    const max = episode.maxAffection ?? 100
    return affection >= min && affection <= max && matchesContext(episode, timeOfDay, weather) && canReplay(episode)
  })

  const placeMatched = placeId ? eligible.filter((episode) => episode.placeIds?.includes(placeId)) : []
  const placePick = preferFresh(placeMatched)
  if (placePick) return placePick

  const genericEligible = eligible.filter((episode) => !episode.placeIds?.length)
  const genericPick = preferFresh(genericEligible)
  if (genericPick) return genericPick

  // 호감도 범위에 맞는 이벤트가 잠시 비더라도 현재 장소/시간/날씨와 모순되는 장면은 재생하지 않습니다.
  // 이미 본 1회성 이벤트(repeatable: false)는 fallback에서도 다시 재생하지 않습니다.
  const contextMatched = bundle.casual.filter((episode) => matchesContext(episode, timeOfDay, weather) && canReplay(episode))
  const placeMatchedAny = placeId ? contextMatched.filter((episode) => episode.placeIds?.includes(placeId)) : []
  const placeAnyPick = preferFresh(placeMatchedAny)
  if (placeAnyPick) return placeAnyPick

  const genericAny = contextMatched.filter((episode) => !episode.placeIds?.length)
  return preferFresh(genericAny)
}


export function hasCompletedFirstEncounter(characterId: string, collection: CollectionProgress) {
  const bundle = getCharacterStoryBundle(characterId)
  if (!bundle) return false
  const seen = collection.seenEpisodeIdsByCharacterId[characterId] ?? []
  return seen.includes(bundle.first.id)
}

export function isFinalStoryEpisode(episode: StoryEpisode) {
  return episode.kind === 'story' && (episode.threshold ?? 0) >= 100
}

export function getLatestPortrait(
  characterId: string,
  blocks: StoryBlock[],
  fallback: PortraitExpression,
  context: { kind?: StoryEpisode['kind']; threshold?: number } = {},
): PortraitExpression {
  for (let index = blocks.length - 1; index >= 0; index -= 1) {
    const block = blocks[index]
    if (block.type === 'dialogue' && block.portrait) {
      return enrichStoryPortrait(characterId, block.portrait, { text: block.text, kind: context.kind, threshold: context.threshold })
    }
  }
  return enrichStoryPortrait(characterId, fallback, { kind: context.kind, threshold: context.threshold })
}

export function getStoryProgress(characterId: string, collection: CollectionProgress) {
  const bundle = getCharacterStoryBundle(characterId)
  if (!bundle) return { completed: 0, total: 5, nextThreshold: 20 }
  const completedIds = collection.completedStoryEpisodeIdsByCharacterId[characterId] ?? []
  const completed = bundle.story.filter((episode) => completedIds.includes(episode.id)).length
  const next = bundle.story.find((episode) => !completedIds.includes(episode.id))
  return { completed, total: bundle.story.length, nextThreshold: next?.threshold ?? 100 }
}

export function isAffinityEventReady(characterId: string, collection: CollectionProgress) {
  const progress = getStoryProgress(characterId, collection)
  const affection = collection.affectionByCharacterId[characterId] ?? 0
  const completed = collection.completedCharacterIds.includes(characterId)
  return !completed && progress.completed < progress.total && affection >= progress.nextThreshold
}
