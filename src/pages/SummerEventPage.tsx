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
import { getSummerAffectionTier, getSummerBranch, summerEvent } from '../data/seasonalEvents'
import { useGameStore } from '../store/useGameStore'
import type { CharacterDefinition } from '../types/game'
import { AmbientCanvas } from '../components/AmbientCanvas'

interface SummerEventPageProps {
  onClose: () => void
}

type SummerStep = 'intro' | 'select' | 'arrival' | 'branch' | 'choice-result' | 'after' | 'complete'

export function SummerEventPage({ onClose }: SummerEventPageProps) {
  const player = useGameStore((state) => state.player)
  const progress = useGameStore((state) => state.progress)
  const collection = useGameStore((state) => state.collection)
  const applyDialogueChoice = useGameStore((state) => state.applyDialogueChoice)
  const completeSeasonalEvent = useGameStore((state) => state.completeSeasonalEvent)
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled)
  const [step, setStep] = useState<SummerStep>('intro')
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
  const branch = companion ? getSummerBranch(companion.id) : null
  const affection = companion ? (collection.affectionByCharacterId[companion.id] ?? 0) : 0
  const tier = getSummerAffectionTier(affection)

  const advance = (next: SummerStep) => {
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
      eventId: summerEvent.id,
      companionId: companion.id,
      title: summerEvent.title,
      season: 'SUMMER',
      souvenir: summerEvent.souvenir,
      souvenirNote: branch.souvenirNote,
      affectionGain: summerEvent.baseAffection,
      memoryKey: `seasonal:${summerEvent.id}:${companion.id}`,
    })
    setBaseReward(Math.max(0, after - before))
    setStep('complete')
    playUiSound('special', soundEnabled)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hero = (
    <figure className="summer-event-hero">
      <img src={getSeasonalEventBackground('SUMMER', step, companionId)} alt="여름 불꽃축제가 열린 강변" />
      <AmbientCanvas effect="bokeh" density="medium" className="seasonal-ambient-soft" />
      <AmbientCanvas effect="sparkle" density="low" className="seasonal-ambient" />
      <figcaption><span>SUMMER SPECIAL DAY</span><strong>{summerEvent.title}</strong><small>{summerEvent.placeName}</small></figcaption>
    </figure>
  )

  if (step === 'intro') {
    return (
      <div className="page seasonal-event-page summer-event-page">
        <header className="seasonal-event-kicker"><span>SEASON 02 · SUMMER</span><b>DAY {String(progress.day).padStart(2, '0')}</b></header>
        {hero}
        <section className="seasonal-event-sheet is-intro">
          <p className="eyebrow">SPECIAL DAY</p>
          <h1>{summerEvent.subtitle}</h1>
          {summerEvent.commonOpening.map((paragraph) => <p key={paragraph} className="novel-prose">{paragraph}</p>)}
          <div className="seasonal-event-rule summer-rule"><span>오늘은 평소의 외출 대신</span><strong>한 사람과 가장 밝은 여름밤을 보냅니다.</strong></div>
        </section>
        <button type="button" className="primary-button full-button seasonal-main-button summer-main-button" onClick={() => advance('select')} disabled={eligibleCharacters.length === 0}>함께 불꽃을 볼 사람을 고른다</button>
        {eligibleCharacters.length === 0 && <p className="seasonal-event-empty">먼저 누군가와 첫 번째 기록을 완성하면 함께 올 수 있어요.</p>}
      </div>
    )
  }

  if (step === 'select') {
    return (
      <div className="page seasonal-event-page summer-event-page">
        <header className="seasonal-event-kicker"><span>SUMMER DATE</span><b>{eligibleCharacters.length} MUSES</b></header>
        <section className="seasonal-event-sheet companion-select-head">
          <p className="eyebrow">WHO WILL YOU INVITE?</p>
          <h1>누구와 불꽃을 볼까?</h1>
          <p className="novel-prose">지금까지 만난 사람에게 연락할 수 있다. 오늘 밤만큼은 가장 좋아하는 사람을 직접 고른다.</p>
        </section>
        <div className="summer-companion-list">
          {eligibleCharacters.map((character) => {
            const value = collection.affectionByCharacterId[character.id] ?? 0
            return (
              <button key={character.id} type="button" className="summer-companion-card" onClick={() => chooseCompanion(character)}>
                <CharacterSD characterId={character.id} name={character.name} symbol={character.symbol} className="summer-companion-sd" />
                <span className="summer-companion-copy"><small>{character.rarity} · {character.occupation}</small><strong>{character.name}</strong><HeartMeter value={value} compact /></span>
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
      <div className="page seasonal-event-page summer-event-page" data-character={companion.id}>
        <header className="seasonal-event-kicker"><span>SUMMER DATE · {companion.name}</span><HeartMeter value={affection} compact /></header>
        {hero}
        <section className="seasonal-event-sheet">
          <p className="eyebrow">COMMON SCENE · 01</p>
          <h1>첫 불꽃이 터지는 순간</h1>
          {summerEvent.commonTurn.map((paragraph) => <p key={paragraph} className="novel-prose">{paragraph}</p>)}
        </section>
        <button type="button" className="primary-button full-button seasonal-main-button summer-main-button" onClick={() => advance('branch')}>{companion.name} 쪽을 바라본다</button>
      </div>
    )
  }

  if (step === 'branch') {
    return (
      <div className="page seasonal-event-page summer-event-page" data-character={companion.id}>
        <header className="seasonal-event-kicker"><span>PRIVATE MOMENT · 01</span><HeartMeter value={affection} compact /></header>
        <section className="summer-character-stage">
          <CharacterPortrait characterId={companion.id} name={companion.name} symbol={companion.symbol} expression={getSeasonalPortraitExpression(companion.id, tier, 'branch')} className="summer-character-portrait" />
          <div><span>{companion.rarity} · FIREWORK DATE</span><h1>{companion.name}</h1><p>{companion.occupation}</p></div>
        </section>
        <article className="seasonal-event-sheet summer-branch-sheet">
          <p className="novel-prose">{branch.openingNarration}</p>
          <div className="summer-dialogue"><strong>{companion.name}</strong><blockquote>“{branch.openingLine}”</blockquote></div>
          <p className="novel-prose summer-tier-line">{branch.tierLine[tier]}</p>
          <div className="summer-choice-wrap">
            <span>불꽃 아래, 둘만 가까운 거리</span>
            <h2>{branch.choicePrompt}</h2>
            {branch.choices.map((option, index) => (
              <button key={option.id} type="button" className="choice-button summer-choice-button" onClick={() => chooseOption(option)}>
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
      <div className="page seasonal-event-page summer-event-page" data-character={companion.id}>
        <header className="seasonal-event-kicker"><span>PRIVATE MOMENT · 02</span><HeartMeter value={affection} compact /></header>
        <section className="summer-character-stage is-close">
          <CharacterPortrait characterId={companion.id} name={companion.name} symbol={companion.symbol} expression={getSeasonalPortraitExpression(companion.id, tier, 'choice-result')} className="summer-character-portrait" />
          <div><span>CHOICE RECORDED</span><h1>{companion.name}</h1><p>불꽃보다 가까운 쪽을 바라봤다.</p></div>
        </section>
        <article className="seasonal-event-sheet summer-branch-sheet">
          <div className="affection-feedback summer-affection-feedback"><span>SUMMER HEART</span><strong>마음이 가까워졌어요 +{choiceAffection}</strong></div>
          <div className="player-choice-log"><span>{player.name}</span><p>{choiceText}</p></div>
          <p className="novel-prose">{choiceResponse}</p>
          <div className="summer-dialogue"><strong>{companion.name}</strong><blockquote>“{branch.closingLine[getSummerAffectionTier(affection)]}”</blockquote></div>
        </article>
        <button type="button" className="primary-button full-button seasonal-main-button summer-main-button" onClick={() => advance('after')}>마지막 불꽃까지 함께 본다</button>
      </div>
    )
  }

  if (step === 'after') {
    return (
      <div className="page seasonal-event-page summer-event-page" data-character={companion.id}>
        <header className="seasonal-event-kicker"><span>AFTER FIREWORKS</span><HeartMeter value={affection} compact /></header>
        {hero}
        <article className="seasonal-event-sheet summer-branch-sheet">
          <p className="eyebrow">둘만 남는 시간</p>
          <h1>불꽃이 모두 꺼진 뒤</h1>
          <p className="novel-prose">{branch.afterNarration}</p>
          {summerEvent.commonEnding.map((paragraph) => <p key={paragraph} className="novel-prose">{paragraph}</p>)}
        </article>
        <button type="button" className="primary-button full-button seasonal-main-button summer-main-button" onClick={finishEvent}>오늘의 여름을 기록한다</button>
      </div>
    )
  }

  return (
    <div className="page seasonal-event-page summer-event-page" data-character={companion.id}>
      <header className="seasonal-event-kicker"><span>SUMMER MEMORY · COMPLETE</span><b>✦</b></header>
      <section className="summer-complete-card">
        <CharacterPortrait characterId={companion.id} name={companion.name} symbol={companion.symbol} expression={getSeasonalPortraitExpression(companion.id, tier, 'complete')} className="summer-complete-portrait" />
        <div className="summer-complete-copy">
          <p className="eyebrow">SPECIAL DAY RECORDED</p>
          <h1>{summerEvent.title}</h1>
          <strong>{withJosa(companion.name, '과/와')} 남긴 여름밤의 한 페이지</strong>
          <div className="summer-reward-row"><span>호감도</span><b>+{baseReward + choiceAffection}</b></div>
        </div>
      </section>
      <section className="summer-souvenir-card">
        <span>SEASONAL KEEPSAKE</span>
        <div className="summer-firework-mark" aria-hidden="true">✦</div>
        <h2>{summerEvent.souvenir}</h2>
        <p>{branch.souvenirNote}</p>
        <small>기록 탭의 계절 기억에 보관되었습니다.</small>
      </section>
      <button type="button" className="primary-button full-button seasonal-main-button summer-main-button" onClick={onClose}>작업실로 돌아간다</button>
    </div>
  )
}
