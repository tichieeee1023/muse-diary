import { useMemo, useState } from 'react'
import { getSeasonalEventBackground } from '../data/backgroundAssets'
import { CharacterPortrait } from '../components/CharacterPortrait'
import { getSeasonalPortraitExpression } from '../data/portraitExpressions'
import { CharacterSD } from '../components/CharacterSD'
import { HeartMeter } from '../components/HeartMeter'
import { getAllCharacters } from '../engine/encounterEngine'
import { hasCompletedFirstEncounter } from '../engine/storyEngine'
import { playUiSound } from '../engine/soundEngine'
import { withJosa } from '../engine/textFormatter'
import { getWinterAffectionTier, getWinterBranch, winterEvent } from '../data/seasonalEvents'
import { useGameStore } from '../store/useGameStore'
import type { CharacterDefinition } from '../types/game'

interface WinterEventPageProps {
  onClose: () => void
}

type WinterStep = 'intro' | 'select' | 'arrival' | 'branch' | 'choice-result' | 'after' | 'complete'

export function WinterEventPage({ onClose }: WinterEventPageProps) {
  const player = useGameStore((state) => state.player)
  const progress = useGameStore((state) => state.progress)
  const collection = useGameStore((state) => state.collection)
  const applyDialogueChoice = useGameStore((state) => state.applyDialogueChoice)
  const completeSeasonalEvent = useGameStore((state) => state.completeSeasonalEvent)
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled)
  const [step, setStep] = useState<WinterStep>('intro')
  const [companionId, setCompanionId] = useState<string | null>(null)
  const [choiceResponse, setChoiceResponse] = useState<string | null>(null)
  const [choiceText, setChoiceText] = useState<string | null>(null)
  const [choiceAffection, setChoiceAffection] = useState(0)
  const [baseReward, setBaseReward] = useState(0)

  const characters = useMemo(() => getAllCharacters(), [])
  const eligibleCharacters = characters
    .filter((character) => collection.discoveredCharacterIds.includes(character.id) && hasCompletedFirstEncounter(character.id, collection))
    .sort((a, b) => (collection.affectionByCharacterId[b.id] ?? 0) - (collection.affectionByCharacterId[a.id] ?? 0))

  if (!player) return null

  const companion = companionId ? characters.find((character) => character.id === companionId) ?? null : null
  const branch = companion ? getWinterBranch(companion.id) : null
  const affection = companion ? (collection.affectionByCharacterId[companion.id] ?? 0) : 0
  const tier = getWinterAffectionTier(affection)

  const advance = (next: WinterStep) => {
    setStep(next)
    playUiSound('page', soundEnabled)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const chooseCompanion = (character: CharacterDefinition) => {
    setCompanionId(character.id)
    playUiSound('heart', soundEnabled)
    setStep('arrival')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const chooseOption = (option: { text: string; affection: number; response: string }) => {
    if (!companion || choiceResponse) return
    const before = collection.affectionByCharacterId[companion.id] ?? 0
    const after = applyDialogueChoice(companion.id, option.affection)
    setChoiceText(option.text)
    setChoiceResponse(option.response)
    setChoiceAffection(Math.max(0, after - before))
    playUiSound('heart', soundEnabled)
    setStep('choice-result')
  }

  const finishEvent = () => {
    if (!companion || !branch) return
    const before = collection.affectionByCharacterId[companion.id] ?? 0
    const after = completeSeasonalEvent({
      eventId: winterEvent.id,
      companionId: companion.id,
      title: winterEvent.title,
      season: 'WINTER',
      souvenir: winterEvent.souvenir,
      souvenirNote: branch.souvenirNote,
      affectionGain: winterEvent.baseAffection,
      memoryKey: `seasonal:${winterEvent.id}:${companion.id}`,
    })
    setBaseReward(Math.max(0, after - before))
    setStep('complete')
    playUiSound('new', soundEnabled)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hero = (
    <figure className="winter-event-hero">
      <img src={getSeasonalEventBackground('WINTER', step, companionId)} alt="눈 내리는 산림 편백 휴양관" />
      <div className="winter-snow-layer" aria-hidden="true">
        <i>❄</i><i>·</i><i>❅</i><i>·</i><i>❄</i><i>·</i><i>❅</i><i>·</i><i>❄</i>
      </div>
      <figcaption><span>WINTER SPECIAL DAY</span><strong>{winterEvent.title}</strong><small>{winterEvent.placeName}</small></figcaption>
    </figure>
  )

  if (step === 'intro') {
    return (
      <div className="page seasonal-event-page winter-event-page">
        <header className="seasonal-event-kicker"><span>SEASON 04 · WINTER</span><b>DAY {String(progress.day).padStart(2, '0')}</b></header>
        {hero}
        <section className="seasonal-event-sheet is-intro">
          <p className="eyebrow">SPECIAL DAY</p>
          <h1>{winterEvent.subtitle}</h1>
          {winterEvent.commonOpening.map((paragraph) => <p key={paragraph} className="novel-prose">{paragraph}</p>)}
          <div className="seasonal-event-rule winter-rule"><span>한 해의 마지막 특별한 외출</span><strong>한 사람과 눈 내리는 산장에서 오래 머뭅니다.</strong></div>
        </section>
        <button type="button" className="primary-button full-button seasonal-main-button winter-main-button" onClick={() => advance('select')} disabled={eligibleCharacters.length === 0}>함께 갈 사람을 고른다</button>
        {eligibleCharacters.length === 0 && <p className="seasonal-event-empty">먼저 누군가와 첫 번째 기록을 완성하면 함께 올 수 있어요.</p>}
      </div>
    )
  }

  if (step === 'select') {
    return (
      <div className="page seasonal-event-page winter-event-page">
        <header className="seasonal-event-kicker"><span>WINTER DATE</span><b>{eligibleCharacters.length} MUSES</b></header>
        <section className="seasonal-event-sheet companion-select-head">
          <p className="eyebrow">WHO WILL YOU INVITE?</p>
          <h1>누구와 첫눈을 보러 갈까?</h1>
          <p className="novel-prose">편백 향, 벽난로, 눈 덮인 산책길. 오늘은 한 사람을 직접 골라 겨울의 마지막 특별한 페이지를 남긴다.</p>
        </section>
        <div className="winter-companion-list">
          {eligibleCharacters.map((character) => {
            const value = collection.affectionByCharacterId[character.id] ?? 0
            return (
              <button key={character.id} type="button" className="winter-companion-card" onClick={() => chooseCompanion(character)}>
                <CharacterSD characterId={character.id} name={character.name} symbol={character.symbol} className="winter-companion-sd" />
                <span className="winter-companion-copy"><small>{character.rarity} · {character.occupation}</small><strong>{character.name}</strong><HeartMeter value={value} compact /></span>
                <i>→</i>
              </button>
            )
          })}
        </div>
        <button type="button" className="secondary-button full-button" onClick={() => advance('intro')}>다시 생각한다</button>
      </div>
    )
  }

  if (!companion || !branch) return null

  if (step === 'arrival') {
    return (
      <div className="page seasonal-event-page winter-event-page" data-character={companion.id}>
        <header className="seasonal-event-kicker"><span>WINTER DATE · {companion.name}</span><HeartMeter value={affection} compact /></header>
        {hero}
        <section className="seasonal-event-sheet">
          <p className="eyebrow">COMMON SCENE · 01</p>
          <h1>돌아갈 시간이 늦어진 밤</h1>
          {winterEvent.commonTurn.map((paragraph) => <p key={paragraph} className="novel-prose">{paragraph}</p>)}
        </section>
        <button type="button" className="primary-button full-button seasonal-main-button winter-main-button" onClick={() => advance('branch')}>{companion.name}와 남은 한 시간을 보낸다</button>
      </div>
    )
  }

  if (step === 'branch') {
    return (
      <div className="page seasonal-event-page winter-event-page" data-character={companion.id}>
        <header className="seasonal-event-kicker"><span>PRIVATE MOMENT · 01</span><HeartMeter value={affection} compact /></header>
        <section className="winter-character-stage">
          <CharacterPortrait characterId={companion.id} name={companion.name} symbol={companion.symbol} expression={getSeasonalPortraitExpression(companion.id, tier, 'branch')} className="winter-character-portrait" />
          <div><span>{companion.rarity} · SNOW DATE</span><h1>{companion.name}</h1><p>{companion.occupation}</p></div>
        </section>
        <article className="seasonal-event-sheet winter-branch-sheet">
          <p className="novel-prose">{branch.openingNarration}</p>
          <div className="winter-dialogue"><strong>{companion.name}</strong><blockquote>“{branch.openingLine}”</blockquote></div>
          <p className="novel-prose winter-tier-line">{branch.tierLine[tier]}</p>
          <div className="winter-choice-wrap">
            <span>셔틀을 기다리는 동안, 둘만의 겨울</span>
            <h2>{branch.choicePrompt}</h2>
            {branch.choices.map((option, index) => (
              <button key={option.id} type="button" className="choice-button winter-choice-button" onClick={() => chooseOption(option)}>
                <span className="choice-number">0{index + 1}</span><strong>{option.text}</strong>
              </button>
            ))}
          </div>
        </article>
      </div>
    )
  }

  if (step === 'choice-result') {
    return (
      <div className="page seasonal-event-page winter-event-page" data-character={companion.id}>
        <header className="seasonal-event-kicker"><span>PRIVATE MOMENT · 02</span><HeartMeter value={affection} compact /></header>
        <section className="winter-character-stage is-close">
          <CharacterPortrait characterId={companion.id} name={companion.name} symbol={companion.symbol} expression={getSeasonalPortraitExpression(companion.id, tier, 'choice-result')} className="winter-character-portrait" />
          <div><span>CHOICE RECORDED</span><h1>{companion.name}</h1><p>돌아갈 시간이 조금 더 아쉬워졌다.</p></div>
        </section>
        <article className="seasonal-event-sheet winter-branch-sheet">
          <div className="affection-feedback winter-affection-feedback"><span>WINTER HEART</span><strong>마음이 가까워졌어요 +{choiceAffection}</strong></div>
          <div className="player-choice-log"><span>{player.name}</span><p>{choiceText}</p></div>
          <p className="novel-prose">{choiceResponse}</p>
          <div className="winter-dialogue"><strong>{companion.name}</strong><blockquote>“{branch.closingLine[getWinterAffectionTier(affection)]}”</blockquote></div>
        </article>
        <button type="button" className="primary-button full-button seasonal-main-button winter-main-button" onClick={() => advance('after')}>밤눈이 쌓이는 동안 조금 더 머문다</button>
      </div>
    )
  }

  if (step === 'after') {
    return (
      <div className="page seasonal-event-page winter-event-page" data-character={companion.id}>
        <header className="seasonal-event-kicker"><span>LAST SHUTTLE</span><HeartMeter value={affection} compact /></header>
        {hero}
        <article className="seasonal-event-sheet winter-branch-sheet">
          <p className="eyebrow">둘만 남는 시간</p>
          <h1>산장을 나서기 전에</h1>
          <p className="novel-prose">{branch.afterNarration}</p>
          {winterEvent.commonEnding.map((paragraph) => <p key={paragraph} className="novel-prose">{paragraph}</p>)}
        </article>
        <button type="button" className="primary-button full-button seasonal-main-button winter-main-button" onClick={finishEvent}>오늘의 겨울을 기록한다</button>
      </div>
    )
  }

  return (
    <div className="page seasonal-event-page winter-event-page" data-character={companion.id}>
      <header className="seasonal-event-kicker"><span>WINTER MEMORY · COMPLETE</span><b>❄</b></header>
      <section className="winter-complete-card">
        <CharacterPortrait characterId={companion.id} name={companion.name} symbol={companion.symbol} expression={getSeasonalPortraitExpression(companion.id, tier, 'complete')} className="winter-complete-portrait" />
        <div className="winter-complete-copy">
          <p className="eyebrow">SPECIAL DAY RECORDED</p>
          <h1>{winterEvent.title}</h1>
          <strong>{withJosa(companion.name, '과/와')} 남긴 겨울의 마지막 한 페이지</strong>
          <div className="winter-reward-row"><span>호감도</span><b>+{baseReward + choiceAffection}</b></div>
        </div>
      </section>
      <section className="winter-souvenir-card">
        <span>SEASONAL KEEPSAKE</span>
        <div className="winter-snow-mark" aria-hidden="true">❄</div>
        <h2>{winterEvent.souvenir}</h2>
        <p>{branch.souvenirNote}</p>
        <small>기록 탭의 계절 기억에 보관되었습니다.</small>
      </section>
      <button type="button" className="primary-button full-button seasonal-main-button winter-main-button" onClick={onClose}>작업실로 돌아간다</button>
    </div>
  )
}
