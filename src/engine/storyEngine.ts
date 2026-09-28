import { getCharacterStoryBundle } from '../data/characters/index'
import type { CollectionProgress, PortraitExpression, StoryBlock, StoryEpisode } from '../types/game'

function pick<T>(items: T[]): T | null {
  if (!items.length) return null
  return items[Math.floor(Math.random() * items.length)] ?? null
}

export function selectCharacterEpisode(characterId: string, collection: CollectionProgress, placeId?: string): StoryEpisode | null {
  const bundle = getCharacterStoryBundle(characterId)
  if (!bundle) return null

  const seen = collection.seenEpisodeIdsByCharacterId[characterId] ?? []
  const storyDone = collection.completedStoryEpisodeIdsByCharacterId[characterId] ?? []
  const affection = collection.affectionByCharacterId[characterId] ?? 0

  if (!seen.includes(bundle.first.id)) return bundle.first

  const nextStory = bundle.story.find((episode) =>
    !storyDone.includes(episode.id) && affection >= (episode.threshold ?? 0),
  )
  if (nextStory) return nextStory

  const eligible = bundle.casual.filter((episode) => {
    const min = episode.minAffection ?? 0
    const max = episode.maxAffection ?? 100
    return affection >= min && affection <= max
  })

  const placeMatched = placeId ? eligible.filter((episode) => episode.placeIds?.includes(placeId)) : []
  const unseenPlaceMatched = placeMatched.filter((episode) => !seen.includes(episode.id))
  if (unseenPlaceMatched.length) return pick(unseenPlaceMatched)
  if (placeMatched.length) return pick(placeMatched)

  const unseenEligible = eligible.filter((episode) => !seen.includes(episode.id) && !episode.placeIds?.length)
  const genericEligible = eligible.filter((episode) => !episode.placeIds?.length)
  return pick(unseenEligible) ?? pick(genericEligible) ?? pick(eligible) ?? pick(bundle.casual)
}

export function isFinalStoryEpisode(episode: StoryEpisode) {
  return episode.kind === 'story' && (episode.threshold ?? 0) >= 100
}

export function getLatestPortrait(blocks: StoryBlock[], fallback: PortraitExpression): PortraitExpression {
  for (let index = blocks.length - 1; index >= 0; index -= 1) {
    const block = blocks[index]
    if (block.type === 'dialogue' && block.portrait) return block.portrait
  }
  return fallback
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
