import { useMemo, useState } from 'react'
import { getSeasonalEventBackground } from '../data/backgroundAssets'
import { CharacterPortrait } from '../components/CharacterPortrait'
import { ThemeBgmController } from '../components/ThemeBgmController'
import { getSeasonalPortraitExpression } from '../data/portraitExpressions'
import { CharacterSD } from '../components/CharacterSD'
import { HeartMeter } from '../components/HeartMeter'
import { getAllCharacters } from '../engine/encounterEngine'
import { hasCompletedFirstEncounter } from '../engine/storyEngine'
import { playUiSound } from '../engine/soundEngine'
import { withJosa } from '../engine/textFormatter'
import { getSpringAffectionTier, getSpringBranch, springEvent } from '../data/seasonalEvents'
import { useGameStore } from '../store/useGameStore'
import type { CharacterDefinition } from '../types/game'
import { AmbientCanvas } from '../components/AmbientCanvas'

interface SpringEventPageProps {
  onClose: () => void
}

type SpringStep = 'intro' | 'select' | 'arrival' | 'branch' | 'choice-result' | 'after' | 'complete'

export function SpringEventPage({ onClose }: SpringEventPageProps) {
  const player = useGameStore((state) => state.player)
  const progress = useGameStore((state) => state.progress)
  const collection = useGameStore((state) => state.collection)
  const applyDialogueChoice = useGameStore((state) => state.applyDialogueChoice)
  const completeSeasonalEvent = useGameStore((state) => state.completeSeasonalEvent)
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled)
  const [step, setStep] = useState<SpringStep>('intro')
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
  const branch = companion ? getSpringBranch(companion.id) : null
  const affection = companion ? (collection.affectionByCharacterId[companion.id] ?? 0) : 0
  const tier = getSpringAffectionTier(affection)

  const advance = (next: SpringStep) => {
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
      eventId: springEvent.id,
      companionId: companion.id,
      title: springEvent.title,
      season: 'SPRING',
      souvenir: springEvent.souvenir,
      souvenirNote: branch.souvenirNote,
      affectionGain: springEvent.baseAffection,
      memoryKey: `seasonal:${springEvent.id}:${companion.id}`,
    })
    setBaseReward(Math.max(0, after - before))
    setStep('complete')
    playUiSound('special', soundEnabled)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hero = (
    <>
      <ThemeBgmController characterId={companion?.id} />
      <figure className="spring-event-hero">
        <img src={getSeasonalEventBackground('SPRING', step, companionId)} alt="봄꽃 야간 개장이 열린 강변" />
        <AmbientCanvas effect="petals" density="medium" className="seasonal-ambient" />
        <AmbientCanvas effect="bokeh" density="low" className="seasonal-ambient-soft" />
        <figcaption><span>SPRING SPECIAL DAY</span><strong>{springEvent.title}</strong><small>{springEvent.placeName}</small></figcaption>
      </figure>
    </>
  )

  if (step === 'intro') {
    return (
      <div className="page seasonal-event-page spring-event-page">
        <header className="seasonal-event-kicker"><span>SEASON 01 · SPRING</span><b>DAY {String(progress.day).padStart(2, '0')}</b></header>
        {hero}
        <section className="seasonal-event-sheet is-intro">
          <p className="eyebrow">SPECIAL DAY</p>
          <h1>{springEvent.subtitle}</h1>
          {springEvent.commonOpening.map((paragraph) => <p key={paragraph} className="novel-prose">{paragraph}</p>)}
          <div className="seasonal-event-rule"><span>오늘은 평소의 외출 대신</span><strong>한 사람과 봄밤을 보냅니다.</strong></div>
        </section>
        <button type="button" className="primary-button full-button seasonal-main-button" onClick={() => advance('select')} disabled={eligibleCharacters.length === 0}>함께 갈 사람을 고른다</button>
        {eligibleCharacters.length === 0 && <p className="seasonal-event-empty">먼저 누군가와 첫 번째 기록을 완성하면 함께 올 수 있어요.</p>}
      </div>
    )
  }

  if (step === 'select') {
    return (
      <div className="page seasonal-event-page spring-event-page">
        <header className="seasonal-event-kicker"><span>SPRING DATE</span><b>{eligibleCharacters.length} MUSES</b></header>
        <section className="seasonal-event-sheet companion-select-head">
          <p className="eyebrow">WHO WILL YOU INVITE?</p>
          <h1>누구와 봄밤을 걸을까?</h1>
          <p className="novel-prose">지금까지 만난 사람에게 연락할 수 있다. 오늘만큼은 호감도가 가장 높은 사람을 게임이 대신 정하지 않는다.</p>
        </section>
        <div className="spring-companion-list">
          {eligibleCharacters.map((character) => {
            const value = collection.affectionByCharacterId[character.id] ?? 0
            return (
              <button key={character.id} type="button" className="spring-companion-card" onClick={() => chooseCompanion(character)}>
                <CharacterSD characterId={character.id} name={character.name} symbol={character.symbol} className="spring-companion-sd" />
                <span className="spring-companion-copy"><small>{character.rarity} · {character.occupation}</small><strong>{character.name}</strong><HeartMeter value={value} compact /></span>
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
      <div className="page seasonal-event-page spring-event-page" data-character={companion.id}>
        <header className="seasonal-event-kicker"><span>SPRING DATE · {companion.name}</span><HeartMeter value={affection} compact /></header>
        {hero}
        <section className="seasonal-event-sheet">
          <p className="eyebrow">COMMON SCENE · 01</p>
          <h1>꽃이 쏟아지는 시간</h1>
          {springEvent.commonTurn.map((paragraph) => <p key={paragraph} className="novel-prose">{paragraph}</p>)}
        </section>
        <button type="button" className="primary-button full-button seasonal-main-button" onClick={() => advance('branch')}>{companion.name} 쪽을 바라본다</button>
      </div>
    )
  }

  if (step === 'branch') {
    return (
      <div className="page seasonal-event-page spring-event-page" data-character={companion.id}>
        <header className="seasonal-event-kicker"><span>PRIVATE MOMENT · 01</span><HeartMeter value={affection} compact /></header>
        <section className="spring-character-stage">
          <CharacterPortrait characterId={companion.id} name={companion.name} symbol={companion.symbol} expression={getSeasonalPortraitExpression(companion.id, tier, 'branch')} className="spring-character-portrait" />
          <div><span>{companion.rarity} · SPRING DATE</span><h1>{companion.name}</h1><p>{companion.occupation}</p></div>
        </section>
        <article className="seasonal-event-sheet spring-branch-sheet">
          <p className="novel-prose">{branch.openingNarration}</p>
          <div className="spring-dialogue"><strong>{companion.name}</strong><blockquote>“{branch.openingLine}”</blockquote></div>
          <p className="novel-prose spring-tier-line">{branch.tierLine[tier]}</p>
          <div className="spring-choice-wrap">
            <span>둘만 남은 봄밤</span>
            <h2>{branch.choicePrompt}</h2>
            {branch.choices.map((option, index) => (
              <button key={option.id} type="button" className="choice-button spring-choice-button" onClick={() => chooseOption(option)}>
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
      <div className="page seasonal-event-page spring-event-page" data-character={companion.id}>
        <header className="seasonal-event-kicker"><span>PRIVATE MOMENT · 02</span><HeartMeter value={affection} compact /></header>
        <section className="spring-character-stage is-close">
          <CharacterPortrait characterId={companion.id} name={companion.name} symbol={companion.symbol} expression={getSeasonalPortraitExpression(companion.id, tier, 'choice-result')} className="spring-character-portrait" />
          <div><span>CHOICE RECORDED</span><h1>{companion.name}</h1><p>오늘은 조금 더 가까워졌다.</p></div>
        </section>
        <article className="seasonal-event-sheet spring-branch-sheet">
          <div className="affection-feedback"><span>SPRING HEART</span><strong>마음이 가까워졌어요 +{choiceAffection}</strong></div>
          <div className="player-choice-log"><span>{player.name}</span><p>{choiceText}</p></div>
          <p className="novel-prose">{choiceResponse}</p>
          <div className="spring-dialogue"><strong>{companion.name}</strong><blockquote>“{branch.closingLine[getSpringAffectionTier(affection)]}”</blockquote></div>
        </article>
        <button type="button" className="primary-button full-button seasonal-main-button" onClick={() => advance('after')}>조금 더 걷는다</button>
      </div>
    )
  }

  if (step === 'after') {
    return (
      <div className="page seasonal-event-page spring-event-page" data-character={companion.id}>
        <header className="seasonal-event-kicker"><span>LAST WALK</span><HeartMeter value={affection} compact /></header>
        {hero}
        <article className="seasonal-event-sheet spring-branch-sheet">
          <p className="eyebrow">둘만 남는 시간</p>
          <h1>행사가 끝난 뒤</h1>
          <p className="novel-prose">{branch.afterNarration}</p>
          {springEvent.commonEnding.map((paragraph) => <p key={paragraph} className="novel-prose">{paragraph}</p>)}
        </article>
        <button type="button" className="primary-button full-button seasonal-main-button" onClick={finishEvent}>오늘의 봄을 기록한다</button>
      </div>
    )
  }

  return (
    <div className="page seasonal-event-page spring-event-page" data-character={companion.id}>
      <header className="seasonal-event-kicker"><span>SPRING MEMORY · COMPLETE</span><b>✿</b></header>
      <section className="spring-complete-card">
        <CharacterPortrait characterId={companion.id} name={companion.name} symbol={companion.symbol} expression={getSeasonalPortraitExpression(companion.id, tier, 'complete')} className="spring-complete-portrait" />
        <div className="spring-complete-copy">
          <p className="eyebrow">SPECIAL DAY RECORDED</p>
          <h1>{springEvent.title}</h1>
          <strong>{withJosa(companion.name, '과/와')} 남긴 봄의 한 페이지</strong>
          <div className="spring-reward-row"><span>호감도</span><b>+{baseReward + choiceAffection}</b></div>
        </div>
      </section>
      <section className="spring-souvenir-card">
        <span>SEASONAL KEEPSAKE</span>
        <div className="spring-flower-mark" aria-hidden="true">✿</div>
        <h2>{springEvent.souvenir}</h2>
        <p>{branch.souvenirNote}</p>
        <small>기록 탭의 계절 기억에 보관되었습니다.</small>
      </section>
      <button type="button" className="primary-button full-button seasonal-main-button" onClick={onClose}>작업실로 돌아간다</button>
    </div>
  )
}
