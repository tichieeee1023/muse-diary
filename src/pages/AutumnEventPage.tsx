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
import { autumnEvent, getAutumnAffectionTier, getAutumnBranch } from '../data/seasonalEvents'
import { useGameStore } from '../store/useGameStore'
import type { CharacterDefinition } from '../types/game'
import { AmbientCanvas } from '../components/AmbientCanvas'

interface AutumnEventPageProps {
  onClose: () => void
}

type AutumnStep = 'intro' | 'select' | 'arrival' | 'branch' | 'choice-result' | 'after' | 'complete'

export function AutumnEventPage({ onClose }: AutumnEventPageProps) {
  const player = useGameStore((state) => state.player)
  const progress = useGameStore((state) => state.progress)
  const collection = useGameStore((state) => state.collection)
  const applyDialogueChoice = useGameStore((state) => state.applyDialogueChoice)
  const completeSeasonalEvent = useGameStore((state) => state.completeSeasonalEvent)
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled)
  const [step, setStep] = useState<AutumnStep>('intro')
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
  const branch = companion ? getAutumnBranch(companion.id) : null
  const cameo = branch ? characters.find((character) => character.id === branch.cameoCharacterId) ?? null : null
  const affection = companion ? (collection.affectionByCharacterId[companion.id] ?? 0) : 0
  const tier = getAutumnAffectionTier(affection)

  const advance = (next: AutumnStep) => {
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
      eventId: autumnEvent.id,
      companionId: companion.id,
      title: autumnEvent.title,
      season: 'AUTUMN',
      souvenir: autumnEvent.souvenir,
      souvenirNote: branch.souvenirNote,
      affectionGain: autumnEvent.baseAffection,
      memoryKey: `seasonal:${autumnEvent.id}:${companion.id}`,
    })
    setBaseReward(Math.max(0, after - before))
    setStep('complete')
    playUiSound('special', soundEnabled)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hero = (
    <>
      <ThemeBgmController characterId={companion?.id} />
      <figure className="autumn-event-hero">
        <img src={getSeasonalEventBackground('AUTUMN', step, companionId)} alt="늦가을 특별 개방 중인 수변 정원" />
        <AmbientCanvas effect="leaves" density="medium" className="seasonal-ambient" />
        <AmbientCanvas effect="dust" density="low" className="seasonal-ambient-soft" />
        <figcaption><span>AUTUMN SPECIAL DAY</span><strong>{autumnEvent.title}</strong><small>{autumnEvent.placeName}</small></figcaption>
      </figure>
    </>
  )

  if (step === 'intro') {
    return (
      <div className="page seasonal-event-page autumn-event-page">
        <header className="seasonal-event-kicker"><span>SEASON 03 · AUTUMN</span><b>DAY {String(progress.day).padStart(2, '0')}</b></header>
        {hero}
        <section className="seasonal-event-sheet is-intro">
          <p className="eyebrow">SPECIAL DAY</p>
          <h1>{autumnEvent.subtitle}</h1>
          {autumnEvent.commonOpening.map((paragraph) => <p key={paragraph} className="novel-prose">{paragraph}</p>)}
          <div className="seasonal-event-rule autumn-rule"><span>오늘은 평소의 외출 대신</span><strong>한 사람과 늦가을을 천천히 걷습니다.</strong></div>
        </section>
        <button type="button" className="primary-button full-button seasonal-main-button autumn-main-button" onClick={() => advance('select')} disabled={eligibleCharacters.length === 0}>함께 걸을 사람을 고른다</button>
        {eligibleCharacters.length === 0 && <p className="seasonal-event-empty">먼저 누군가와 첫 번째 기록을 완성하면 함께 올 수 있어요.</p>}
      </div>
    )
  }

  if (step === 'select') {
    return (
      <div className="page seasonal-event-page autumn-event-page">
        <header className="seasonal-event-kicker"><span>AUTUMN DATE</span><b>{eligibleCharacters.length} MUSES</b></header>
        <section className="seasonal-event-sheet companion-select-head">
          <p className="eyebrow">WHO WILL YOU INVITE?</p>
          <h1>누구와 낙엽길을 걸을까?</h1>
          <p className="novel-prose">화려한 행사도 정해진 코스도 없다. 오늘은 한 사람을 직접 골라, 조금 느린 오후를 함께 보낸다.</p>
        </section>
        <div className="autumn-companion-list">
          {eligibleCharacters.map((character) => {
            const value = collection.affectionByCharacterId[character.id] ?? 0
            return (
              <button key={character.id} type="button" className="autumn-companion-card" onClick={() => chooseCompanion(character)}>
                <CharacterSD characterId={character.id} name={character.name} symbol={character.symbol} className="autumn-companion-sd" />
                <span className="autumn-companion-copy"><small>{character.rarity} · {character.occupation}</small><strong>{character.name}</strong><HeartMeter value={value} compact /></span>
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
      <div className="page seasonal-event-page autumn-event-page" data-character={companion.id}>
        <header className="seasonal-event-kicker"><span>AUTUMN DATE · {companion.name}</span><HeartMeter value={affection} compact /></header>
        {hero}
        <section className="seasonal-event-sheet">
          <p className="eyebrow">COMMON SCENE · 01</p>
          <h1>낙엽이 한꺼번에 날린 순간</h1>
          {autumnEvent.commonTurn.map((paragraph) => <p key={paragraph} className="novel-prose">{paragraph}</p>)}
        </section>
        <button type="button" className="primary-button full-button seasonal-main-button autumn-main-button" onClick={() => advance('branch')}>{companion.name}와 안쪽 길로 들어간다</button>
      </div>
    )
  }

  if (step === 'branch') {
    return (
      <div className="page seasonal-event-page autumn-event-page" data-character={companion.id}>
        <header className="seasonal-event-kicker"><span>PRIVATE MOMENT · 01</span><HeartMeter value={affection} compact /></header>
        {cameo && (
          <section className="autumn-cameo-card">
            <CharacterSD characterId={cameo.id} name={cameo.name} symbol={cameo.symbol} className="autumn-cameo-sd" />
            <div><span>CAMEO · {cameo.name}</span><p>{branch.cameoNarration}</p><strong>“{branch.cameoLine}”</strong></div>
          </section>
        )}
        <section className="autumn-character-stage">
          <CharacterPortrait characterId={companion.id} name={companion.name} symbol={companion.symbol} expression={getSeasonalPortraitExpression(companion.id, tier, 'branch')} className="autumn-character-portrait" />
          <div><span>{companion.rarity} · SLOW DATE</span><h1>{companion.name}</h1><p>{companion.occupation}</p></div>
        </section>
        <article className="seasonal-event-sheet autumn-branch-sheet">
          <p className="novel-prose">{branch.openingNarration}</p>
          <div className="autumn-dialogue"><strong>{companion.name}</strong><blockquote>“{branch.openingLine}”</blockquote></div>
          <p className="novel-prose autumn-tier-line">{branch.tierLine[tier]}</p>
          <div className="autumn-choice-wrap">
            <span>낙엽길 끝, 익숙해진 두 사람</span>
            <h2>{branch.choicePrompt}</h2>
            {branch.choices.map((option, index) => (
              <button key={option.id} type="button" className="choice-button autumn-choice-button" onClick={() => chooseOption(option)}>
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
      <div className="page seasonal-event-page autumn-event-page" data-character={companion.id}>
        <header className="seasonal-event-kicker"><span>PRIVATE MOMENT · 02</span><HeartMeter value={affection} compact /></header>
        <section className="autumn-character-stage is-close">
          <CharacterPortrait characterId={companion.id} name={companion.name} symbol={companion.symbol} expression={getSeasonalPortraitExpression(companion.id, tier, 'choice-result')} className="autumn-character-portrait" />
          <div><span>CHOICE RECORDED</span><h1>{companion.name}</h1><p>조금 더 연인 같은 속도로 걸었다.</p></div>
        </section>
        <article className="seasonal-event-sheet autumn-branch-sheet">
          <div className="affection-feedback autumn-affection-feedback"><span>AUTUMN HEART</span><strong>마음이 가까워졌어요 +{choiceAffection}</strong></div>
          <div className="player-choice-log"><span>{player.name}</span><p>{choiceText}</p></div>
          <p className="novel-prose">{choiceResponse}</p>
          <div className="autumn-dialogue"><strong>{companion.name}</strong><blockquote>“{branch.closingLine[getAutumnAffectionTier(affection)]}”</blockquote></div>
        </article>
        <button type="button" className="primary-button full-button seasonal-main-button autumn-main-button" onClick={() => advance('after')}>폐장 시간까지 조금 더 걷는다</button>
      </div>
    )
  }

  if (step === 'after') {
    return (
      <div className="page seasonal-event-page autumn-event-page" data-character={companion.id}>
        <header className="seasonal-event-kicker"><span>AFTER CLOSING</span><HeartMeter value={affection} compact /></header>
        {hero}
        <article className="seasonal-event-sheet autumn-branch-sheet">
          <p className="eyebrow">둘만 남는 시간</p>
          <h1>출구 앞 벤치에서</h1>
          <p className="novel-prose">{branch.afterNarration}</p>
          {autumnEvent.commonEnding.map((paragraph) => <p key={paragraph} className="novel-prose">{paragraph}</p>)}
        </article>
        <button type="button" className="primary-button full-button seasonal-main-button autumn-main-button" onClick={finishEvent}>오늘의 가을을 기록한다</button>
      </div>
    )
  }

  return (
    <div className="page seasonal-event-page autumn-event-page" data-character={companion.id}>
      <header className="seasonal-event-kicker"><span>AUTUMN MEMORY · COMPLETE</span><b>❧</b></header>
      <section className="autumn-complete-card">
        <CharacterPortrait characterId={companion.id} name={companion.name} symbol={companion.symbol} expression={getSeasonalPortraitExpression(companion.id, tier, 'complete')} className="autumn-complete-portrait" />
        <div className="autumn-complete-copy">
          <p className="eyebrow">SPECIAL DAY RECORDED</p>
          <h1>{autumnEvent.title}</h1>
          <strong>{withJosa(companion.name, '과/와')} 남긴 늦가을의 한 페이지</strong>
          <div className="autumn-reward-row"><span>호감도</span><b>+{baseReward + choiceAffection}</b></div>
        </div>
      </section>
      <section className="autumn-souvenir-card">
        <span>SEASONAL KEEPSAKE</span>
        <div className="autumn-leaf-mark" aria-hidden="true">❧</div>
        <h2>{autumnEvent.souvenir}</h2>
        <p>{branch.souvenirNote}</p>
        <small>기록 탭의 계절 기억에 보관되었습니다.</small>
      </section>
      <button type="button" className="primary-button full-button seasonal-main-button autumn-main-button" onClick={onClose}>작업실로 돌아간다</button>
    </div>
  )
}
