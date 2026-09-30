import { create } from 'zustand'
import { getPlace, getWeightedDailyPlaces, initialUnlockedPlaceIds } from '../data/locations'
import { MAX_DAILY_DATE_SESSIONS, type CollectionProgress, type FontFamilySetting, type GameProgress, type GameSettings, type PlayerProfile, type Rarity, type SeasonKey, type TextSizeSetting, type TextSpeedSetting, type Weather } from '../types/game'

const STORAGE_KEY = 'muse-diary-save-v13'
const LEGACY_STORAGE_KEYS = ['muse-diary-save-v12','muse-diary-save-v11','muse-diary-save-v10','muse-diary-save-v9','muse-diary-save-v8','muse-diary-save-v7','muse-diary-save-v6', 'muse-diary-save-v5', 'muse-diary-save-v4', 'muse-diary-save-v3', 'muse-diary-save-v2', 'muse-diary-save-v1']
const BAR_UNLOCK_VISITS = 3
const CHARACTER_PLACE_UNLOCKS: Record<string, string[]> = {
  char_003: ['convenience'], char_007: ['convenience'],
  char_002: ['rooftop'], char_005: ['rooftop'], char_010: ['rooftop'], char_012: ['rooftop'],
  char_004: ['night-market'], char_011: ['night-market'],
  char_006: ['aquarium'], char_008: ['aquarium'],
}

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
  consumeDateSession: (characterId: string) => boolean
  enterPlace: (placeId: string) => void
  leavePlace: () => void
  completePlaceAction: (placeId: string, consumeAction?: boolean) => { unlockedBar: boolean }
  recordEncounter: (characterId: string, rarity: Rarity) => { isNew: boolean; encounterCount: number }
  applyDialogueChoice: (characterId: string, affection: number, memoryKey?: string) => number
  completeEpisode: (characterId: string, episodeId: string, kind: 'first' | 'casual' | 'story', affectionGain: number, meeting?: { title: string; day: number; placeId: string }) => number
  completeCharacter: (characterId: string) => void
  markSecretRead: (characterId: string) => void
  markLetterRead: (letterId: string) => void
  completeAfterEndingDate: (characterId: string) => void
  resetCollectionOnly: () => void
  restartGame: () => void
  resetCharacter: (characterId: string) => void
  toggleSound: () => void
  setFontFamily: (fontFamily: FontFamilySetting) => void
  setTextSize: (textSize: TextSizeSetting) => void
  setTextSpeed: (textSpeed: TextSpeedSetting) => void
  resetSettings: () => void
  completeSeasonalEvent: (event: { eventId: string; companionId: string; title: string; season: SeasonKey; souvenir: string; souvenirNote: string; affectionGain: number; memoryKey?: string }) => number
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
    dateCharacterIdsToday: [],
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
    recentEncounterCharacterIds: [],
    affectionByCharacterId: {},
    encounterCounts: {},
    importantMemories: {},
    completedCharacterIds: [],
    secretReadCharacterIds: [],
    seenEpisodeIdsByCharacterId: {},
    completedStoryEpisodeIdsByCharacterId: {},
    recentCasualEpisodeIdsByCharacterId: {},
    lastMeetingByCharacterId: {},
    seasonalEventRecords: {},
    readLetterIds: [],
    completedAfterEndingDateCharacterIds: [],
  }
}

function createSettings(): GameSettings {
  return { soundEnabled: true, fontFamily: 'pretendard', textSize: 'large', textSpeed: 'normal' }
}

function normalizeSettings(settings?: Partial<GameSettings>): GameSettings {
  const defaults = createSettings()
  return {
    ...defaults,
    ...settings,
    fontFamily: settings?.fontFamily === 'myeongjo' ? 'myeongjo' : 'pretendard',
    textSize: settings?.textSize === 'normal' ? 'normal' : 'large',
    textSpeed: settings?.textSpeed === 'instant' ? 'instant' : 'normal',
  }
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
    dateCharacterIdsToday: Array.isArray(progress?.dateCharacterIdsToday)
      ? [...new Set(progress.dateCharacterIdsToday)].slice(0, MAX_DAILY_DATE_SESSIONS)
      : [],
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
    recentEncounterCharacterIds: Array.isArray(collection?.recentEncounterCharacterIds)
      ? [...new Set(collection.recentEncounterCharacterIds)].slice(-4)
      : collection?.lastEncounterCharacterId ? [collection.lastEncounterCharacterId] : [],
    affectionByCharacterId: collection?.affectionByCharacterId ?? {},
    encounterCounts: collection?.encounterCounts ?? {},
    importantMemories: collection?.importantMemories ?? {},
    completedCharacterIds: Array.isArray(collection?.completedCharacterIds) ? [...new Set(collection.completedCharacterIds)] : [],
    secretReadCharacterIds: Array.isArray(collection?.secretReadCharacterIds) ? [...new Set(collection.secretReadCharacterIds)] : [],
    seenEpisodeIdsByCharacterId: collection?.seenEpisodeIdsByCharacterId ?? {},
    completedStoryEpisodeIdsByCharacterId: collection?.completedStoryEpisodeIdsByCharacterId ?? {},
    recentCasualEpisodeIdsByCharacterId: collection?.recentCasualEpisodeIdsByCharacterId ?? {},
    lastMeetingByCharacterId: collection?.lastMeetingByCharacterId ?? {},
    seasonalEventRecords: collection?.seasonalEventRecords ?? {},
    readLetterIds: Array.isArray(collection?.readLetterIds) ? [...new Set(collection.readLetterIds)] : [],
    completedAfterEndingDateCharacterIds: Array.isArray(collection?.completedAfterEndingDateCharacterIds)
      ? [...new Set(collection.completedAfterEndingDateCharacterIds)]
      : [],
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
        settings: normalizeSettings(parsed.settings),
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
    dateCharacterIdsToday: [],
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

  consumeDateSession: (characterId) => {
    let consumed = false
    set((state) => {
      if (
        state.progress.dateCharacterIdsToday.length >= MAX_DAILY_DATE_SESSIONS
        || state.progress.dateCharacterIdsToday.includes(characterId)
      ) return state
      consumed = true
      const next: PersistedState = {
        player: state.player,
        progress: {
          ...state.progress,
          dateCharacterIdsToday: [...state.progress.dateCharacterIdsToday, characterId],
        },
        collection: state.collection,
        settings: state.settings,
      }
      persist(next)
      return { ...next }
    })
    return consumed
  },

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
      const recentEncounterCharacterIds = [
        ...state.collection.recentEncounterCharacterIds.filter((id) => id !== characterId),
        characterId,
      ].slice(-4)
      const nextCollection: CollectionProgress = {
        ...state.collection,
        discoveredCharacterIds: isNew ? [...state.collection.discoveredCharacterIds, characterId] : state.collection.discoveredCharacterIds,
        lastEncounterCharacterId: characterId,
        recentEncounterCharacterIds,
        encounterCounts: { ...state.collection.encounterCounts, [characterId]: encounterCount },
      }
      const newlyUnlocked = isNew ? (CHARACTER_PLACE_UNLOCKS[characterId] ?? []) : []
      const unlockedPlaceIds = [...new Set([...state.progress.unlockedPlaceIds, ...newlyUnlocked])]
      const next: PersistedState = {
        player: state.player,
        progress: { ...state.progress, unlockedPlaceIds, ssrMissStreak: rarity === 'SSR' ? 0 : state.progress.ssrMissStreak + 1 },
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

  completeEpisode: (characterId, episodeId, kind, affectionGain, meeting) => {
    let nextAffection = 0
    set((state) => {
      const current = state.collection.affectionByCharacterId[characterId] ?? 0
      nextAffection = Math.min(100, Math.max(0, current + Math.max(0, affectionGain)))
      const seen = state.collection.seenEpisodeIdsByCharacterId[characterId] ?? []
      const storyDone = state.collection.completedStoryEpisodeIdsByCharacterId[characterId] ?? []
      const recentCasual = state.collection.recentCasualEpisodeIdsByCharacterId[characterId] ?? []
      const nextRecentCasual = kind === 'casual' ? [...recentCasual, episodeId].slice(-3) : recentCasual
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
        recentCasualEpisodeIdsByCharacterId: {
          ...state.collection.recentCasualEpisodeIdsByCharacterId,
          [characterId]: nextRecentCasual,
        },
        lastMeetingByCharacterId: meeting ? {
          ...state.collection.lastMeetingByCharacterId,
          [characterId]: { episodeId, title: meeting.title, day: meeting.day, placeId: meeting.placeId, kind },
        } : state.collection.lastMeetingByCharacterId,
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

  markLetterRead: (letterId) =>
    set((state) => {
      if (state.collection.readLetterIds.includes(letterId)) return state
      const nextCollection = { ...state.collection, readLetterIds: [...state.collection.readLetterIds, letterId] }
      const next: PersistedState = { player: state.player, progress: state.progress, collection: nextCollection, settings: state.settings }
      persist(next)
      return { ...next }
    }),

  completeAfterEndingDate: (characterId) =>
    set((state) => {
      if (state.collection.completedAfterEndingDateCharacterIds.includes(characterId)) return state
      const memoryKey = `after-ending-date:${characterId}`
      const currentMemories = state.collection.importantMemories[characterId] ?? []
      const nextCollection: CollectionProgress = {
        ...state.collection,
        completedAfterEndingDateCharacterIds: [...state.collection.completedAfterEndingDateCharacterIds, characterId],
        importantMemories: {
          ...state.collection.importantMemories,
          [characterId]: currentMemories.includes(memoryKey) ? currentMemories : [...currentMemories, memoryKey],
        },
      }
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

  restartGame: () =>
    set((state) => {
      try { localStorage.removeItem('muse-diary-achievement-toast-seen-v1') } catch { /* ignore */ }
      const next: PersistedState = {
        // 이름/읽기/효과음 설정은 유지하고 게임 진행만 DAY 1로 완전히 되돌립니다.
        player: state.player,
        progress: createProgress(1),
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
      const recentCasualEpisodeIdsByCharacterId = { ...state.collection.recentCasualEpisodeIdsByCharacterId }
      const lastMeetingByCharacterId = { ...state.collection.lastMeetingByCharacterId }
      const readLetterIds = state.collection.readLetterIds.filter((id) => id !== `letter-${characterId}`)
      const completedAfterEndingDateCharacterIds = state.collection.completedAfterEndingDateCharacterIds
      const seasonalEventRecords = Object.fromEntries(
        Object.entries(state.collection.seasonalEventRecords).filter(([, record]) => record.companionId !== characterId),
      )
      delete affectionByCharacterId[characterId]
      delete encounterCounts[characterId]
      delete importantMemories[characterId]
      delete seenEpisodeIdsByCharacterId[characterId]
      delete completedStoryEpisodeIdsByCharacterId[characterId]
      delete recentCasualEpisodeIdsByCharacterId[characterId]
      delete lastMeetingByCharacterId[characterId]
      const nextCollection: CollectionProgress = {
        ...state.collection,
        discoveredCharacterIds: without(state.collection.discoveredCharacterIds),
        lastEncounterCharacterId: state.collection.lastEncounterCharacterId === characterId ? null : state.collection.lastEncounterCharacterId,
        recentEncounterCharacterIds: without(state.collection.recentEncounterCharacterIds),
        affectionByCharacterId,
        encounterCounts,
        importantMemories,
        seenEpisodeIdsByCharacterId,
        completedStoryEpisodeIdsByCharacterId,
        recentCasualEpisodeIdsByCharacterId,
        lastMeetingByCharacterId,
        seasonalEventRecords,
        completedCharacterIds: without(state.collection.completedCharacterIds),
        secretReadCharacterIds: without(state.collection.secretReadCharacterIds),
        readLetterIds,
        completedAfterEndingDateCharacterIds: without(completedAfterEndingDateCharacterIds),
      }
      const next: PersistedState = { player: state.player, progress: state.progress, collection: nextCollection, settings: state.settings }
      persist(next)
      return { ...next }
    }),

  completeSeasonalEvent: ({ eventId, companionId, title, season, souvenir, souvenirNote, affectionGain, memoryKey }) => {
    let nextAffection = 0
    set((state) => {
      if (state.collection.seasonalEventRecords[eventId]) {
        nextAffection = state.collection.affectionByCharacterId[companionId] ?? 0
        return state
      }
      const current = state.collection.affectionByCharacterId[companionId] ?? 0
      nextAffection = Math.min(100, Math.max(0, current + Math.max(0, affectionGain)))
      const existingMemories = state.collection.importantMemories[companionId] ?? []
      const nextMemories = memoryKey && !existingMemories.includes(memoryKey) ? [...existingMemories, memoryKey] : existingMemories
      const nextCollection: CollectionProgress = {
        ...state.collection,
        affectionByCharacterId: { ...state.collection.affectionByCharacterId, [companionId]: nextAffection },
        importantMemories: { ...state.collection.importantMemories, [companionId]: nextMemories },
        seasonalEventRecords: {
          ...state.collection.seasonalEventRecords,
          [eventId]: { eventId, companionId, day: state.progress.day, title, season, souvenir, souvenirNote },
        },
      }
      const next: PersistedState = {
        player: state.player,
        progress: { ...state.progress, actionsLeft: 0 },
        collection: nextCollection,
        settings: state.settings,
      }
      persist(next)
      return { ...next }
    })
    return nextAffection
  },

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

  setTextSpeed: (textSpeed) =>
    set((state) => {
      const next: PersistedState = {
        player: state.player,
        progress: state.progress,
        collection: state.collection,
        settings: { ...state.settings, textSpeed },
      }
      persist(next)
      return { ...next }
    }),

  resetSettings: () =>
    set((state) => {
      const next: PersistedState = {
        player: state.player,
        progress: state.progress,
        collection: state.collection,
        settings: createSettings(),
      }
      persist(next)
      return { ...next }
    }),
}))
