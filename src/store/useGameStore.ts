import { create } from 'zustand'
import { getPlace, getWeightedDailyPlaces, initialUnlockedPlaceIds } from '../data/locations'
import type { CollectionProgress, FontFamilySetting, GameProgress, GameSettings, PlayerProfile, Rarity, TextSizeSetting, Weather } from '../types/game'

const STORAGE_KEY = 'muse-diary-save-v8'
const LEGACY_STORAGE_KEYS = ['muse-diary-save-v7','muse-diary-save-v6', 'muse-diary-save-v5', 'muse-diary-save-v4', 'muse-diary-save-v3', 'muse-diary-save-v2', 'muse-diary-save-v1']
const BAR_UNLOCK_VISITS = 3

interface PersistedState {
  player: PlayerProfile | null
  progress: GameProgress
  collection: CollectionProgress
  settings: GameSettings
}

interface GameState extends PersistedState {
  activePlaceId: string | null
  setPlayerName: (name: string) => void
  nextDay: () => void
  enterPlace: (placeId: string) => void
  leavePlace: () => void
  completePlaceAction: (placeId: string, consumeAction?: boolean) => { unlockedBar: boolean }
  recordEncounter: (characterId: string, rarity: Rarity) => { isNew: boolean; encounterCount: number }
  applyDialogueChoice: (characterId: string, affection: number, memoryKey?: string) => number
  completeEpisode: (characterId: string, episodeId: string, kind: 'first' | 'casual' | 'story', affectionGain: number) => number
  completeCharacter: (characterId: string) => void
  markSecretRead: (characterId: string) => void
  resetCollectionOnly: () => void
  resetCharacter: (characterId: string) => void
  toggleSound: () => void
  setFontFamily: (fontFamily: FontFamilySetting) => void
  setTextSize: (textSize: TextSizeSetting) => void
}

const weatherPool: Weather[] = ['맑음', '흐림', '비', '눈']

function randomWeather(previous?: Weather): Weather {
  const candidates = previous ? weatherPool.filter((weather) => weather !== previous) : weatherPool
  return candidates[Math.floor(Math.random() * candidates.length)] ?? '맑음'
}

function createProgress(day = 1, weather = randomWeather()): GameProgress {
  const dailyCount = Math.random() < 0.5 ? 4 : 5
  return {
    day,
    actionsLeft: 3,
    weather,
    dailyPlaceIds: getWeightedDailyPlaces(weather, initialUnlockedPlaceIds, dailyCount),
    placeVisits: {},
    unlockedPlaceIds: [...initialUnlockedPlaceIds],
    ssrMissStreak: 0,
  }
}

function createCollection(): CollectionProgress {
  return {
    discoveredCharacterIds: [],
    lastEncounterCharacterId: null,
    affectionByCharacterId: {},
    encounterCounts: {},
    importantMemories: {},
    completedCharacterIds: [],
    secretReadCharacterIds: [],
    seenEpisodeIdsByCharacterId: {},
    completedStoryEpisodeIdsByCharacterId: {},
  }
}

function createSettings(): GameSettings {
  return { soundEnabled: true, fontFamily: 'clear', textSize: 'medium' }
}

function normalizeProgress(progress?: Partial<GameProgress>): GameProgress {
  const weather = progress?.weather ?? randomWeather()
  const unlockedPlaceIds = progress?.unlockedPlaceIds?.length
    ? progress.unlockedPlaceIds
    : [...initialUnlockedPlaceIds]
  const dailyPlaceIds = progress?.dailyPlaceIds?.length
    ? progress.dailyPlaceIds
    : getWeightedDailyPlaces(weather, unlockedPlaceIds, Math.random() < 0.5 ? 4 : 5)

  return {
    day: progress?.day ?? 1,
    actionsLeft: Math.max(0, Math.min(3, progress?.actionsLeft ?? 3)),
    weather,
    dailyPlaceIds,
    placeVisits: progress?.placeVisits ?? {},
    unlockedPlaceIds,
    ssrMissStreak: Math.max(0, progress?.ssrMissStreak ?? 0),
  }
}

function normalizeCollection(collection?: Partial<CollectionProgress>): CollectionProgress {
  return {
    discoveredCharacterIds: Array.isArray(collection?.discoveredCharacterIds) ? [...new Set(collection.discoveredCharacterIds)] : [],
    lastEncounterCharacterId: collection?.lastEncounterCharacterId ?? null,
    affectionByCharacterId: collection?.affectionByCharacterId ?? {},
    encounterCounts: collection?.encounterCounts ?? {},
    importantMemories: collection?.importantMemories ?? {},
    completedCharacterIds: Array.isArray(collection?.completedCharacterIds) ? [...new Set(collection.completedCharacterIds)] : [],
    secretReadCharacterIds: Array.isArray(collection?.secretReadCharacterIds) ? [...new Set(collection.secretReadCharacterIds)] : [],
    seenEpisodeIdsByCharacterId: collection?.seenEpisodeIdsByCharacterId ?? {},
    completedStoryEpisodeIdsByCharacterId: collection?.completedStoryEpisodeIdsByCharacterId ?? {},
  }
}

function loadState(): PersistedState {
  try {
    const keys = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS]
    for (const key of keys) {
      const saved = localStorage.getItem(key)
      if (!saved) continue
      const parsed = JSON.parse(saved) as Partial<PersistedState>
      return {
        player: parsed.player ?? null,
        progress: normalizeProgress(parsed.progress),
        collection: normalizeCollection(parsed.collection),
        settings: { ...createSettings(), ...(parsed.settings ?? {}) },
      }
    }
  } catch {
    // 저장 데이터가 깨져 있어도 새 게임으로 안전하게 복구합니다.
  }

  return { player: null, progress: createProgress(), collection: createCollection(), settings: createSettings() }
}

function persist(state: PersistedState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function makeNextDayProgress(current: GameProgress): GameProgress {
  const weather = randomWeather(current.weather)
  const dailyCount = Math.random() < 0.5 ? 4 : 5
  return {
    ...current,
    day: current.day + 1,
    actionsLeft: 3,
    weather,
    dailyPlaceIds: getWeightedDailyPlaces(weather, current.unlockedPlaceIds, dailyCount),
  }
}

const initial = loadState()

export const useGameStore = create<GameState>((set) => ({
  ...initial,
  activePlaceId: null,

  setPlayerName: (name) =>
    set((state) => {
      const next: PersistedState = {
        player: { name, occupation: '인형 디자이너' },
        progress: state.progress,
        collection: state.collection,
        settings: state.settings,
      }
      persist(next)
      return next
    }),

  nextDay: () =>
    set((state) => {
      const next: PersistedState = {
        player: state.player,
        progress: makeNextDayProgress(state.progress),
        collection: state.collection,
        settings: state.settings,
      }
      persist(next)
      return { ...next, activePlaceId: null }
    }),

  enterPlace: (placeId) =>
    set((state) => {
      const place = getPlace(placeId)
      if (!place || state.progress.actionsLeft <= 0) return state
      const isUnlocked = state.progress.unlockedPlaceIds.includes(placeId)
      const isNight = state.progress.actionsLeft === 1
      if (!isUnlocked || (place.nightOnly && !isNight)) return state
      return { activePlaceId: placeId }
    }),

  leavePlace: () => set({ activePlaceId: null }),

  completePlaceAction: (placeId, consumeAction = true) => {
    let result = { unlockedBar: false }
    set((state) => {
      if (consumeAction && state.progress.actionsLeft <= 0) return state
      const visits = { ...state.progress.placeVisits, [placeId]: (state.progress.placeVisits[placeId] ?? 0) + 1 }
      let unlockedPlaceIds = [...state.progress.unlockedPlaceIds]
      if ((visits['old-street'] ?? 0) >= BAR_UNLOCK_VISITS && !unlockedPlaceIds.includes('bar')) {
        unlockedPlaceIds = [...unlockedPlaceIds, 'bar']
        result = { unlockedBar: true }
      }
      const next: PersistedState = {
        player: state.player,
        progress: {
          ...state.progress,
          actionsLeft: consumeAction ? Math.max(0, state.progress.actionsLeft - 1) : state.progress.actionsLeft,
          placeVisits: visits,
          unlockedPlaceIds,
        },
        collection: state.collection,
        settings: state.settings,
      }
      persist(next)
      return { ...next }
    })
    return result
  },

  recordEncounter: (characterId, rarity) => {
    let result = { isNew: false, encounterCount: 0 }
    set((state) => {
      const isNew = !state.collection.discoveredCharacterIds.includes(characterId)
      const encounterCount = (state.collection.encounterCounts[characterId] ?? 0) + 1
      result = { isNew, encounterCount }
      const nextCollection: CollectionProgress = {
        ...state.collection,
        discoveredCharacterIds: isNew ? [...state.collection.discoveredCharacterIds, characterId] : state.collection.discoveredCharacterIds,
        lastEncounterCharacterId: characterId,
        encounterCounts: { ...state.collection.encounterCounts, [characterId]: encounterCount },
      }
      const next: PersistedState = {
        player: state.player,
        progress: { ...state.progress, ssrMissStreak: rarity === 'SSR' ? 0 : state.progress.ssrMissStreak + 1 },
        collection: nextCollection,
        settings: state.settings,
      }
      persist(next)
      return { ...next }
    })
    return result
  },

  applyDialogueChoice: (characterId, affection, memoryKey) => {
    let nextAffection = 0
    set((state) => {
      const current = state.collection.affectionByCharacterId[characterId] ?? 0
      nextAffection = Math.min(100, Math.max(0, current + Math.max(0, affection)))
      const existingMemories = state.collection.importantMemories[characterId] ?? []
      const nextMemories = memoryKey && !existingMemories.includes(memoryKey) ? [...existingMemories, memoryKey] : existingMemories
      const nextCollection: CollectionProgress = {
        ...state.collection,
        affectionByCharacterId: { ...state.collection.affectionByCharacterId, [characterId]: nextAffection },
        importantMemories: { ...state.collection.importantMemories, [characterId]: nextMemories },
      }
      const next: PersistedState = { player: state.player, progress: state.progress, collection: nextCollection, settings: state.settings }
      persist(next)
      return { ...next }
    })
    return nextAffection
  },

  completeEpisode: (characterId, episodeId, kind, affectionGain) => {
    let nextAffection = 0
    set((state) => {
      const current = state.collection.affectionByCharacterId[characterId] ?? 0
      nextAffection = Math.min(100, Math.max(0, current + Math.max(0, affectionGain)))
      const seen = state.collection.seenEpisodeIdsByCharacterId[characterId] ?? []
      const storyDone = state.collection.completedStoryEpisodeIdsByCharacterId[characterId] ?? []
      const nextCollection: CollectionProgress = {
        ...state.collection,
        affectionByCharacterId: { ...state.collection.affectionByCharacterId, [characterId]: nextAffection },
        seenEpisodeIdsByCharacterId: {
          ...state.collection.seenEpisodeIdsByCharacterId,
          [characterId]: seen.includes(episodeId) ? seen : [...seen, episodeId],
        },
        completedStoryEpisodeIdsByCharacterId: {
          ...state.collection.completedStoryEpisodeIdsByCharacterId,
          [characterId]: kind === 'story' && !storyDone.includes(episodeId) ? [...storyDone, episodeId] : storyDone,
        },
      }
      const next: PersistedState = { player: state.player, progress: state.progress, collection: nextCollection, settings: state.settings }
      persist(next)
      return { ...next }
    })
    return nextAffection
  },

  completeCharacter: (characterId) =>
    set((state) => {
      if (state.collection.completedCharacterIds.includes(characterId)) return state
      const nextCollection = { ...state.collection, completedCharacterIds: [...state.collection.completedCharacterIds, characterId] }
      const next: PersistedState = { player: state.player, progress: state.progress, collection: nextCollection, settings: state.settings }
      persist(next)
      return { ...next }
    }),

  markSecretRead: (characterId) =>
    set((state) => {
      if (state.collection.secretReadCharacterIds.includes(characterId)) return state
      const nextCollection = { ...state.collection, secretReadCharacterIds: [...state.collection.secretReadCharacterIds, characterId] }
      const next: PersistedState = { player: state.player, progress: state.progress, collection: nextCollection, settings: state.settings }
      persist(next)
      return { ...next }
    }),

  resetCollectionOnly: () =>
    set((state) => {
      try { localStorage.removeItem('muse-diary-achievement-toast-seen-v1') } catch { /* ignore */ }
      const next: PersistedState = {
        player: state.player,
        progress: { ...state.progress, ssrMissStreak: 0 },
        collection: createCollection(),
        settings: state.settings,
      }
      persist(next)
      return { ...next, activePlaceId: null }
    }),

  resetCharacter: (characterId) =>
    set((state) => {
      const without = (items: string[]) => items.filter((id) => id !== characterId)
      const affectionByCharacterId = { ...state.collection.affectionByCharacterId }
      const encounterCounts = { ...state.collection.encounterCounts }
      const importantMemories = { ...state.collection.importantMemories }
      const seenEpisodeIdsByCharacterId = { ...state.collection.seenEpisodeIdsByCharacterId }
      const completedStoryEpisodeIdsByCharacterId = { ...state.collection.completedStoryEpisodeIdsByCharacterId }
      delete affectionByCharacterId[characterId]
      delete encounterCounts[characterId]
      delete importantMemories[characterId]
      delete seenEpisodeIdsByCharacterId[characterId]
      delete completedStoryEpisodeIdsByCharacterId[characterId]
      const nextCollection: CollectionProgress = {
        ...state.collection,
        discoveredCharacterIds: without(state.collection.discoveredCharacterIds),
        lastEncounterCharacterId: state.collection.lastEncounterCharacterId === characterId ? null : state.collection.lastEncounterCharacterId,
        affectionByCharacterId,
        encounterCounts,
        importantMemories,
        seenEpisodeIdsByCharacterId,
        completedStoryEpisodeIdsByCharacterId,
        completedCharacterIds: without(state.collection.completedCharacterIds),
        secretReadCharacterIds: without(state.collection.secretReadCharacterIds),
      }
      const next: PersistedState = { player: state.player, progress: state.progress, collection: nextCollection, settings: state.settings }
      persist(next)
      return { ...next }
    }),

  toggleSound: () =>
    set((state) => {
      const next: PersistedState = {
        player: state.player,
        progress: state.progress,
        collection: state.collection,
        settings: { ...state.settings, soundEnabled: !state.settings.soundEnabled },
      }
      persist(next)
      return { ...next }
    }),

  setFontFamily: (fontFamily) =>
    set((state) => {
      const next: PersistedState = {
        player: state.player,
        progress: state.progress,
        collection: state.collection,
        settings: { ...state.settings, fontFamily },
      }
      persist(next)
      return { ...next }
    }),

  setTextSize: (textSize) =>
    set((state) => {
      const next: PersistedState = {
        player: state.player,
        progress: state.progress,
        collection: state.collection,
        settings: { ...state.settings, textSize },
      }
      persist(next)
      return { ...next }
    }),
}))
