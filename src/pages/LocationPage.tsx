import { useState } from 'react'
import { CharacterPortrait } from '../components/CharacterPortrait'
import { HeartMeter } from '../components/HeartMeter'
import { PlaceIcon } from '../components/PlaceIcon'
import { SceneBanner } from '../components/SceneBanner'
import { getCharacterRouteProfile } from '../data/characters'
import { getPlace } from '../data/locations'
import { getEndingContent } from '../engine/endingEngine'
import { selectEncounter } from '../engine/encounterEngine'
import { formatGameText } from '../engine/textFormatter'
import { playUiSound } from '../engine/soundEngine'
import { getLatestPortrait, getStoryProgress, isFinalStoryEpisode, selectCharacterEpisode } from '../engine/storyEngine'
import { useGameStore } from '../store/useGameStore'
import type { CharacterDefinition, StoryBlock, StoryChoiceOption, StoryEpisode, TimeOfDay } from '../types/game'

interface EncounterViewState {
  character: CharacterDefinition
  episode: StoryEpisode
  isNew: boolean
  routeId: string
  unlockedBar: boolean
  visitTime: TimeOfDay
  encounterCount: number
  affectionAtStart: number
  completedAtStart: boolean
  freeEncounter: boolean
}

const rarityCopy = { R: 'RARE', SR: 'SUPER RARE', SSR: 'SPECIAL' } as const

function episodeLabel(episode: StoryEpisode, completedStory: number) {
  if (episode.kind === 'first') return 'FIRST ENCOUNTER'
  if (episode.kind === 'casual') return 'DAILY MOMENT'
  return `AFFINITY EVENT · ${Math.min(5, completedStory + 1)} / 5`
}

export function LocationPage() {
  const activePlaceId = useGameStore((state) => state.activePlaceId)
  const player = useGameStore((state) => state.player)
  const progress = useGameStore((state) => state.progress)
  const collection = useGameStore((state) => state.collection)
  const leavePlace = useGameStore((state) => state.leavePlace)
  const completePlaceAction = useGameStore((state) => state.completePlaceAction)
  const recordEncounter = useGameStore((state) => state.recordEncounter)
  const applyDialogueChoice = useGameStore((state) => state.applyDialogueChoice)
  const completeEpisode = useGameStore((state) => state.completeEpisode)
  const completeCharacter = useGameStore((state) => state.completeCharacter)
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled)

  const [encounter, setEncounter] = useState<EncounterViewState | null>(null)
  const [visitTime] = useState<TimeOfDay>(progress.actionsLeft === 1 ? '밤' : '낮')
  const [sectionIndex, setSectionIndex] = useState(0)
  const [choiceResponse, setChoiceResponse] = useState<StoryBlock[] | null>(null)
  const [selectedChoiceText, setSelectedChoiceText] = useState<string | null>(null)
  const [revealAcknowledged, setRevealAcknowledged] = useState(false)
  const [showEncounterClose, setShowEncounterClose] = useState(false)
  const [showEnding, setShowEnding] = useState(false)
  const [endingImageFailed, setEndingImageFailed] = useState(false)

  if (!activePlaceId || !player) return null
  const place = getPlace(activePlaceId)
  if (!place) return null

  const handleRoute = (routeId: string) => {
    if (encounter) return
    const character = selectEncounter({
      placeId: place.id,
      routeId,
      timeOfDay: visitTime,
      weather: progress.weather,
      lastCharacterId: collection.lastEncounterCharacterId,
      completedCharacterIds: collection.completedCharacterIds,
      ssrMissStreak: progress.ssrMissStreak,
    })
    if (!character) return

    const episode = selectCharacterEpisode(character.id, collection)
    if (!episode) return
    const affectionAtStart = collection.affectionByCharacterId[character.id] ?? 0
    const completedAtStart = collection.completedCharacterIds.includes(character.id)
    const actionResult = completePlaceAction(place.id, !completedAtStart)
    const encounterResult = recordEncounter(character.id, character.rarity)
    playUiSound(encounterResult.isNew ? 'new' : episode.kind === 'story' ? 'page' : 'tap', soundEnabled)

    setEncounter({
      character,
      episode,
      isNew: encounterResult.isNew,
      routeId,
      unlockedBar: actionResult.unlockedBar,
      visitTime,
      encounterCount: encounterResult.encounterCount,
      affectionAtStart,
      completedAtStart,
      freeEncounter: completedAtStart,
    })
  }

  const handleChoice = (option: StoryChoiceOption) => {
    if (!encounter || choiceResponse) return
    applyDialogueChoice(encounter.character.id, option.affection, option.memoryKey)
    setChoiceResponse(option.response)
    setSelectedChoiceText(option.text)
    playUiSound('heart', soundEnabled)
  }

  const finishEpisode = () => {
    if (!encounter) return
    const finalAffection = completeEpisode(
      encounter.character.id,
      encounter.episode.id,
      encounter.episode.kind,
      encounter.episode.completionAffection,
    )
    if (isFinalStoryEpisode(encounter.episode)) {
      completeCharacter(encounter.character.id)
      setShowEnding(true)
      playUiSound('new', soundEnabled)
      return
    }
    setShowEncounterClose(true)
    playUiSound('page', soundEnabled)
    void finalAffection
  }

  const goNextSection = () => {
    if (!encounter) return
    const last = sectionIndex >= encounter.episode.sections.length - 1
    if (last) {
      finishEpisode()
      return
    }
    setSectionIndex((value) => value + 1)
    setChoiceResponse(null)
    setSelectedChoiceText(null)
    playUiSound('page', soundEnabled)
  }

  if (encounter) {
    const { character, episode } = encounter
    const route = place.routes.find((item) => item.id === encounter.routeId)
    const section = episode.sections[sectionIndex]
    const affection = collection.affectionByCharacterId[character.id] ?? encounter.affectionAtStart
    const storyProgress = getStoryProgress(character.id, collection)
    const routeProfile = getCharacterRouteProfile(character.id)
    const ending = getEndingContent(character.id)
    const visualBlocks = [...(section?.blocks ?? []), ...(choiceResponse ?? [])]
    const portrait = getLatestPortrait(visualBlocks, episode.defaultPortrait)

    if (encounter.isNew && !revealAcknowledged) {
      return (
        <div className={`page discovery-page rarity-${character.rarity.toLowerCase()}`}>
          <div className={`discovery-seal rarity-seal-${character.rarity.toLowerCase()}`}>
            <span>{character.rarity === 'SSR' ? 'UNUSUAL SIGNAL' : character.rarity === 'SR' ? 'RARE ENCOUNTER' : 'NEW ENCOUNTER'}</span>
            <strong>{character.rarity}</strong>
            <small>{rarityCopy[character.rarity]}</small>
          </div>
          <section className="discovery-sheet discovery-sheet-with-portrait">
            <CharacterPortrait characterId={character.id} name={character.name} symbol={character.symbol} expression="main" className="discovery-portrait" />
            <div>
              <p className="eyebrow">NEW MUSE FOUND</p>
              <h1>{character.name}</h1>
              <p>{character.firstImpression}</p>
            </div>
          </section>
          <button type="button" className="primary-button full-button" onClick={() => { setRevealAcknowledged(true); playUiSound('page', soundEnabled) }}>
            첫 만남을 시작한다
          </button>
        </div>
      )
    }

    if (showEnding && ending) {
      return (
        <div className={`page ending-page rarity-${character.rarity.toLowerCase()}`}>
          <header className="ending-kicker">
            <span>ROUTE COMPLETE</span>
            <span className={`rarity-badge rarity-badge-${character.rarity.toLowerCase()}`}>{character.rarity}</span>
          </header>
          {!endingImageFailed && routeProfile?.visuals.endingCg ? (
            <figure className="ending-cg-frame">
              <img src={routeProfile.visuals.endingCg} alt={`${character.name} 엔딩 풀 일러스트`} onError={() => setEndingImageFailed(true)} />
              <figcaption>ENDING CG · UNLOCKED</figcaption>
            </figure>
          ) : (
            <figure className="ending-banner">
              <img src="/assets/backgrounds/ending/main.webp" alt="밤의 작업실 책상과 펼쳐진 스케치북" />
            </figure>
          )}
          <section className="ending-sheet">
            <p className="eyebrow">{character.name} · ENDING</p>
            <h1>{ending.endingTitle}</h1>
            <div className="ending-rule" />
            {ending.endingParagraphs.map((paragraph) => <p key={paragraph}>{formatGameText(paragraph, player.name)}</p>)}
            <div className="complete-stamp">COMPLETE</div>
          </section>
          <div className="ending-unlock-note">
            <span>GALLERY UPDATED</span>
            <strong>엔딩 CG가 기록되었습니다. 비설을 읽으면 MUSE DOLL도 해금됩니다.</strong>
          </div>
          <button type="button" className="primary-button full-button" onClick={leavePlace}>작업실로 돌아간다</button>
        </div>
      )
    }

    if (showEncounterClose) {
      const gained = Math.max(0, (collection.affectionByCharacterId[character.id] ?? affection) - encounter.affectionAtStart)
      return (
        <div className={`page encounter-close-page rarity-${character.rarity.toLowerCase()}`}>
          <SceneBanner placeId={place.id} placeName={place.name} timeOfDay={encounter.visitTime} weather={progress.weather} routeId={route?.id} routeTitle={route?.title} />
          <section className="encounter-close-sheet">
            <p className="eyebrow">{episode.kind === 'story' ? 'AFFINITY EVENT COMPLETE' : 'MEETING RECORDED'}</p>
            <h1>{episode.title}</h1>
            <p className="novel-prose">{formatGameText(episode.closing, player.name)}</p>
            <div className="encounter-close-person">
              <CharacterPortrait characterId={character.id} name={character.name} symbol={character.symbol} expression={portrait} className="close-mini-portrait" />
              <div className="encounter-close-copy">
                <strong>{character.name}</strong>
                <span>{encounter.encounterCount}번째 만남 · 호감도 +{gained}</span>
                <HeartMeter value={collection.affectionByCharacterId[character.id] ?? affection} compact />
              </div>
            </div>
            {episode.kind === 'story' && <div className="story-record-stamp">STORY {storyProgress.completed} / 5</div>}
            {encounter.unlockedBar && <div className="unlock-note"><span>NEW PLACE</span><strong>밤에만 열리는 BAR의 위치를 알아냈다.</strong></div>}
          </section>
          <button type="button" className="primary-button full-button" onClick={leavePlace}>작업실로 돌아간다</button>
        </div>
      )
    }

    if (!section) return null
    const choiceReady = Boolean(section.choice && !choiceResponse)
    const hasChoiceResponse = Boolean(section.choice && choiceResponse)
    const label = episodeLabel(episode, storyProgress.completed)

    return (
      <div className={`page story-page rarity-${character.rarity.toLowerCase()}`}>
        <header className="story-topbar">
          <div>
            <p className="eyebrow">{label}</p>
            <strong>{episode.title}</strong>
          </div>
          <HeartMeter value={affection} compact />
        </header>

        <SceneBanner placeId={place.id} placeName={place.name} timeOfDay={encounter.visitTime} weather={progress.weather} routeId={route?.id} routeTitle={route?.title} />

        <section className={`story-character-stage story-character-stage-${episode.kind}`} data-expression={portrait}>
          <CharacterPortrait characterId={character.id} name={character.name} symbol={character.symbol} expression={portrait} className="story-portrait" />
          <div className="story-character-meta">
            <span>{character.rarity} · {character.ageLabel}</span>
            <h1>{character.name}</h1>
            <p>{character.occupation}</p>
            {episode.kind === 'first' && routeProfile && <small>첫인상 · {routeProfile.initialAttitudeLabel}</small>}
            {episode.kind === 'story' && <small>중요 관계 이벤트 · 요구 호감도 {episode.threshold}</small>}
            {episode.kind === 'casual' && <small>사소한 만남이 관계에 쌓입니다.</small>}
          </div>
        </section>

        <article key={`${episode.id}-${sectionIndex}-${choiceResponse ? 'response' : 'base'}`} className="story-sheet" aria-live="polite">
          <div className="story-scene-index" aria-hidden="true"><span>SCENE</span><strong>{String(sectionIndex + 1).padStart(2, '0')}</strong><i>/</i><small>{String(episode.sections.length).padStart(2, '0')}</small></div>
          {section.blocks.map((block, index) => block.type === 'narration' ? (
            <p key={`${sectionIndex}-${index}`} className="story-narration novel-prose">{formatGameText(block.text, player.name)}</p>
          ) : (
            <div key={`${sectionIndex}-${index}`} className="story-dialogue-unit">
              <strong>{block.speaker}</strong>
              <blockquote>“{formatGameText(block.text, player.name)}”</blockquote>
            </div>
          ))}

          {choiceReady && section.choice && (
            <div className="story-choice-wrap">
              <p className="story-choice-prompt">어떻게 반응할까?</p>
              <div className="choice-list">
                {section.choice.options.map((option, index) => (
                  <button key={option.id} type="button" className="choice-button story-choice-button" onClick={() => handleChoice(option)}>
                    <span>0{index + 1}</span>
                    <strong>{formatGameText(option.text, player.name)}</strong>
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasChoiceResponse && choiceResponse && (
            <div className="story-choice-result">
              <div className="player-choice-log"><span>{player.name}</span><p>{formatGameText(selectedChoiceText ?? '', player.name)}</p></div>
              {choiceResponse.map((block, index) => block.type === 'narration' ? (
                <p key={`response-${index}`} className="story-narration novel-prose">{formatGameText(block.text, player.name)}</p>
              ) : (
                <div key={`response-${index}`} className="story-dialogue-unit is-response">
                  <strong>{block.speaker}</strong>
                  <blockquote>“{formatGameText(block.text, player.name)}”</blockquote>
                </div>
              ))}
            </div>
          )}
        </article>

        {(!section.choice || choiceResponse) && (
          <button type="button" className="primary-button full-button story-next-button" onClick={goNextSection}>
            {sectionIndex >= episode.sections.length - 1 ? (isFinalStoryEpisode(episode) ? '이 관계의 결말을 본다' : '오늘의 만남을 기록한다') : '계속 읽기'}
          </button>
        )}

        {encounter.freeEncounter && <p className="story-free-note">공략 완료 후의 재회는 오늘의 외출 횟수를 사용하지 않습니다.</p>}
      </div>
    )
  }

  return (
    <div className="page location-page">
      <header className="location-topbar">
        <button type="button" className="back-button" onClick={leavePlace} aria-label="작업실로 돌아가기">←</button>
        <div><p className="eyebrow">TODAY'S WALK</p><strong>{place.name}</strong></div>
        <span className="time-pill">{visitTime}</span>
      </header>
      <SceneBanner placeId={place.id} placeName={place.name} timeOfDay={visitTime} weather={progress.weather} />
      <section className="location-intro">
        <div className="location-intro-icon"><PlaceIcon placeId={place.id} size={28} /></div>
        <p className="place-mark-large">{place.mark}</p>
        <h1>어디로 가볼까?</h1>
        <p>{place.note}</p>
      </section>
      <div className="route-list">
        {place.routes.map((route, index) => (
          <button key={route.id} type="button" className="route-card" onClick={() => handleRoute(route.id)}>
            <span className="route-number">0{index + 1}</span>
            <span><strong>{route.title}</strong><small>{route.note}</small></span>
          </button>
        ))}
      </div>
      <p className="location-footnote">선택하면 오늘의 외출 횟수 1회가 사용되고, 누군가와 반드시 조우합니다.</p>
    </div>
  )
}
