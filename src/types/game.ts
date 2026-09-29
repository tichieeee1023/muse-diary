export type Weather = '맑음' | '흐림' | '비' | '눈'
export type TimeOfDay = '낮' | '밤'
export type Rarity = 'R' | 'SR' | 'SSR'
export type CharacterCategory = 'reality' | 'unusual'

export type BasePortraitExpression = 'main' | 'smile' | 'troubled' | 'hmm'
export type PortraitExpression = BasePortraitExpression | 'shy' | 'sulking' | 'sly' | 'sad' | 'angry' | 'faintSmile' | 'genuineSmile' | 'dim' | 'eyesClosedSmile' | 'confident' | 'desolate' | 'love' | 'glasses' | 'loveSmile' | 'thinking' | 'busted' | 'interested' | 'exhausted' | 'loveShy' | 'deepLove' | 'blank' | 'tearful' | 'sorrowful' | 'serious' | 'eyesClosedSad'
export type StoryEpisodeKind = 'first' | 'casual' | 'story'

export interface StoryNarrationBlock {
  type: 'narration'
  text: string
}

export interface StoryDialogueBlock {
  type: 'dialogue'
  speaker: string
  text: string
  portrait?: PortraitExpression
}

export type StoryBlock = StoryNarrationBlock | StoryDialogueBlock

export interface StoryChoiceOption {
  id: string
  text: string
  affection: number
  memoryKey?: string
  response: StoryBlock[]
}

export interface StoryChoice {
  id: string
  options: StoryChoiceOption[]
}

export interface StorySection {
  blocks: StoryBlock[]
  choice?: StoryChoice
}

export interface StoryEpisode {
  id: string
  kind: StoryEpisodeKind
  times?: TimeOfDay[]
  weather?: Weather[]
  title: string
  threshold?: number
  purpose?: string
  minAffection?: number
  maxAffection?: number
  defaultPortrait: PortraitExpression
  completionAffection: number
  repeatable?: boolean
  placeIds?: string[]
  sections: StorySection[]
  closing: string
}

export interface CharacterRouteProfile {
  characterId: string
  name: string
  initialAttitude: string
  initialAttitudeLabel: string
  surface: string
  gapMoe: string
  weakness: string
  lateChange: string
  voiceNote: string
  specialFromFirstMeet: boolean
  visuals: Record<BasePortraitExpression, string> & Partial<Record<PortraitExpression, string>> & {
    endingCg: string
    endingDoll: string
  }
}

export interface PlayerProfile {
  name: string
  occupation: '인형 디자이너'
}

export interface PlaceRoute {
  id: string
  title: string
  note: string
}

export interface PlaceDefinition {
  id: string
  name: string
  mark: string
  note: string
  routes: [PlaceRoute, PlaceRoute]
  weatherWeights: Record<Weather, number>
  nightOnly?: boolean
  locked?: boolean
}

export interface CharacterFirstEncounterRule {
  placeId: string
  times?: TimeOfDay[]
  weather?: Weather[]
}

export interface CharacterSpawnRule {
  placeId: string
  routeIds?: string[]
  times?: TimeOfDay[]
  weather?: Weather[]
  weight?: number
  secondaryOnly?: boolean
}

export interface DiaryFactUnlock {
  encounterCount?: number
  affection?: number
  memoryKey?: string
}

export interface DiaryFact {
  id: string
  label: string
  value: string
  unlock: DiaryFactUnlock
}

export interface CharacterDefinition {
  id: string
  name: string
  rarity: Rarity
  age: number
  ageLabel: string
  category: CharacterCategory
  occupation: string
  firstImpression: string
  introNarration: string
  introLine: string
  secondRunHint: string
  symbol: 'bookmark' | 'layout' | 'train' | 'cake' | 'moon-broom' | 'wave' | 'sword-knot' | 'frame' | 'rune' | 'shield' | 'star' | 'clock'
  diaryFacts: DiaryFact[]
  firstEncounterRule: CharacterFirstEncounterRule
  spawnRules: CharacterSpawnRule[]
}

export interface DialogueChoice {
  id: string
  text: string
  reply: string
  replyNarration?: string
  affection: number
  memoryKey?: string
}

export interface DialogueTurn {
  id: string
  narration?: string
  narrationExtra?: string
  line: string
  choices: [DialogueChoice, DialogueChoice, DialogueChoice]
}

export interface CharacterDialogue {
  characterId: string
  turns: DialogueTurn[]
}

export interface ReencounterDialogueVariant {
  introNarration: string
  introLine: string
  turns: DialogueTurn[]
}

export interface CharacterReencounterDialogue {
  characterId: string
  familiar: ReencounterDialogueVariant
  close: ReencounterDialogueVariant
}

export interface DialogueExperience {
  introNarration?: string
  introLine?: string
  turns: DialogueTurn[]
  phase: 'first' | 'familiar' | 'close'
}

export interface CharacterEndingContent {
  characterId: string
  endingTitle: string
  endingParagraphs: string[]
  secretTitle: string
  secretParagraphs: string[]
  museSketchTitle: string
  museSketchNote: string
}

export interface GameProgress {
  day: number
  actionsLeft: number
  weather: Weather
  dailyPlaceIds: string[]
  placeVisits: Record<string, number>
  unlockedPlaceIds: string[]
  ssrMissStreak: number
}

export type SeasonKey = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER'

export interface SeasonalEventRecord {
  eventId: string
  companionId: string
  day: number
  title: string
  season?: SeasonKey
  souvenir: string
  souvenirNote: string
}

export interface CollectionProgress {
  discoveredCharacterIds: string[]
  lastEncounterCharacterId: string | null
  recentEncounterCharacterIds: string[]
  affectionByCharacterId: Record<string, number>
  encounterCounts: Record<string, number>
  importantMemories: Record<string, string[]>
  completedCharacterIds: string[]
  secretReadCharacterIds: string[]
  seenEpisodeIdsByCharacterId: Record<string, string[]>
  completedStoryEpisodeIdsByCharacterId: Record<string, string[]>
  recentCasualEpisodeIdsByCharacterId: Record<string, string[]>
  lastMeetingByCharacterId: Record<string, { episodeId: string; title: string; day: number; placeId: string; kind: StoryEpisodeKind }>
  seasonalEventRecords: Record<string, SeasonalEventRecord>
}

export type FontFamilySetting = 'clear' | 'pretendard' | 'system'
export type TextSizeSetting = 'normal' | 'medium' | 'large'
export type TextSpeedSetting = 'instant' | 'normal' | 'slow'

export interface GameSettings {
  soundEnabled: boolean
  fontFamily: FontFamilySetting
  textSize: TextSizeSetting
  textSpeed: TextSpeedSetting
}
