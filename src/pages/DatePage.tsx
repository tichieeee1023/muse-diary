import { useEffect, useMemo, useRef, useState } from 'react'
import { CharacterPortrait } from '../components/CharacterPortrait'
import { CharacterSD } from '../components/CharacterSD'
import { HeartMeter } from '../components/HeartMeter'
import {
  datePlaces,
  getDateTurnEvaluation,
  getDatePlaceAmbient,
  getDatePlaceTurnEvent,
  getDateProfile,
  getDateConditionalSpeechOptions,
  getDateConditionalTouchOptions,
  getDateRelationshipStage,
  getDateTurnActionLog,
  getDateReturnTouch,
  getDateReactionPopSequence,
  getDateInnerThought,
  getDateMoodExpression,
  getDateExpressionSequence,
  getDateTouchStateLabel,
  type DateDistanceState,
  type DateSpeechIntent,
  type DateTurnTouchKey,
  type DateTouchState,
  type DateReaction,
  type DateReactionPop,
} from '../data/dateScenarios'
import { getAllCharacters } from '../engine/encounterEngine'
import { hasCompletedFirstEncounter } from '../engine/storyEngine'
import { formatGameText } from '../engine/textFormatter'
import { useGameStore } from '../store/useGameStore'
import type { DateRecord, PortraitExpression } from '../types/game'

interface DatePageProps {
  onClose: () => void
}

type DateStep = 'character' | 'place' | 'scene'
type DistanceIntent = 'back' | 'stay' | 'forward'
type DatePlayPhase = 'action' | 'result'
type DateControlKey = 'say' | 'distance' | 'touch'

interface DateTurnLog {
  distanceState: DateDistanceState
  lines: string[]
  reaction: DateReaction | null
  heartDelta: number
  heartAfter: number
  isWeak: boolean
  weakSpotLabel: string | null
  weakDiscovery: boolean
  returnTouch: string | null
  touchState: DateTouchState
  reactionPops: DateReactionPop[]
  innerThought: string | null
  expressionSequence: PortraitExpression[]
}

const MAX_DATE_TURNS = 4

const distanceOrder: DateDistanceState[] = ['space', 'normal', 'close']

const distanceStateLabel: Record<DateDistanceState, string> = {
  space: '여유 있는 거리',
  normal: '자연스러운 거리',
  close: '아주 가까운 거리',
}

const distanceIntentCopy: Record<DistanceIntent, { label: string; hint: string }> = {
  back: { label: '조금 거리를 둔다', hint: '한 단계 멀어진다' },
  stay: { label: '지금 거리를 유지한다', hint: '현재 거리를 이어간다' },
  forward: { label: '조금 더 가까이 간다', hint: '한 단계 가까워진다' },
}

function moveDistance(current: DateDistanceState, intent: DistanceIntent) {
  const index = distanceOrder.indexOf(current)
  if (intent === 'back') return distanceOrder[Math.max(0, index - 1)]
  if (intent === 'forward') return distanceOrder[Math.min(distanceOrder.length - 1, index + 1)]
  return current
}

function resolveTouchState(
  current: DateTouchState,
  touch: DateTurnTouchKey,
  distance: DateDistanceState,
  dateHeart: number,
  relationshipStage: 'opening' | 'close' | 'deep' | 'complete',
) {
  if (distance === 'space') return 'none' as DateTouchState
  if (touch === 'none') return 'none' as DateTouchState
  if (touch === 'hand') {
    if (current === 'interlockedHands') return 'interlockedHands' as DateTouchState
    if (current === 'holdingHands' && dateHeart >= 4) return 'interlockedHands' as DateTouchState
    if (
      current === 'none'
      && dateHeart >= 4
      && distance === 'close'
      && (relationshipStage === 'deep' || relationshipStage === 'complete')
    ) return 'interlockedHands' as DateTouchState
    return 'holdingHands' as DateTouchState
  }
  if (touch === 'sleeve') return 'sleeveHeld' as DateTouchState
  if (touch === 'shoulder') return 'shoulderContact' as DateTouchState
  // Hair / cheek / tickle are momentary touches rather than persistent states.
  return 'none' as DateTouchState
}


function getReactionPopTone(pop: DateReactionPop) {
  if (pop.includes('♡') || pop === '♥') return 'affection'
  if (pop === '💢' || pop === '↯') return 'sharp'
  if (pop === '💧' || pop === '💦' || pop === '///') return 'fluster'
  if (pop.includes('!')) return 'surprise'
  if (pop === '♪' || pop === '♪♪' || pop === '✦' || pop === '✧' || pop === '☆') return 'bright'
  return 'quiet'
}


export function DatePage({ onClose }: DatePageProps) {
  const player = useGameStore((state) => state.player)
  const progress = useGameStore((state) => state.progress)
  const collection = useGameStore((state) => state.collection)
  const saveDateRecord = useGameStore((state) => state.saveDateRecord)
  const [step, setStep] = useState<DateStep>('character')
  const [characterId, setCharacterId] = useState<string | null>(null)
  const [placeId, setPlaceId] = useState<string | null>(null)
  const [distanceState, setDistanceState] = useState<DateDistanceState>('normal')
  const [distanceIntent, setDistanceIntent] = useState<DistanceIntent>('stay')
  const [speechIntent, setSpeechIntent] = useState<DateSpeechIntent>('quiet')
  const [touchIntent, setTouchIntent] = useState<DateTurnTouchKey>('none')
  const [turnLogs, setTurnLogs] = useState<DateTurnLog[]>([])
  const [dateHeart, setDateHeart] = useState(1)
  const [touchState, setTouchState] = useState<DateTouchState>('none')
  const [returnTouchTriggered, setReturnTouchTriggered] = useState(false)
  const [discoveredWeaknesses, setDiscoveredWeaknesses] = useState<Set<string>>(() => new Set())
  const [dateSaved, setDateSaved] = useState(false)
  const [isResolving, setIsResolving] = useState(false)
  const [playPhase, setPlayPhase] = useState<DatePlayPhase>('action')
  const [openControl, setOpenControl] = useState<DateControlKey | null>(null)
  const [displayExpression, setDisplayExpression] = useState<PortraitExpression>('main')
  const stageRef = useRef<HTMLDivElement | null>(null)
  const expressionTimersRef = useRef<number[]>([])

  const characters = useMemo(() => getAllCharacters(), [])


  useEffect(() => () => {
    expressionTimersRef.current.forEach((timer) => window.clearTimeout(timer))
  }, [])
  const eligibleCharacters = characters.filter((character) => {
    const affection = collection.affectionByCharacterId[character.id] ?? 0
    return hasCompletedFirstEncounter(character.id, collection) && affection >= 20
  })

  if (!player) return null

  const character = characterId ? characters.find((item) => item.id === characterId) ?? null : null
  const affection = character ? collection.affectionByCharacterId[character.id] ?? 0 : 0
  const completed = character ? collection.completedCharacterIds.includes(character.id) : false
  const profile = character ? getDateProfile(character.id) : null
  const place = placeId ? datePlaces.find((item) => item.id === placeId) ?? null : null
  const unlockedPlaces = character
    ? datePlaces.filter((item) => completed || affection >= item.minAffection)
    : []
  const ambientLine = place ? getDatePlaceAmbient(place.id, progress.day) : ''
  const isFavoritePlace = Boolean(place && profile && profile.favoritePlaceId === place.id)

  const distanceIndex = distanceOrder.indexOf(distanceState)
  const canStepBack = distanceIndex > 0
  const canStepForward = distanceIndex < distanceOrder.length - 1
  const previewDistance = moveDistance(distanceState, distanceIntent)
  const relationshipStage = getDateRelationshipStage(affection, completed)
  const weaknessDiscovered = Boolean(character && discoveredWeaknesses.has(character.id))
  const conditionalChoiceContext = character ? {
    characterId: character.id,
    dateHeart,
    touchState,
    relationshipStage,
    discoveredWeakness: weaknessDiscovered,
  } : null
  const currentTurn = turnLogs.length + 1
  const turnEvent = place && turnLogs.length < MAX_DATE_TURNS ? getDatePlaceTurnEvent(place.id, currentTurn) : null
  const speechOptions = conditionalChoiceContext
    ? getDateConditionalSpeechOptions(conditionalChoiceContext)
    : []
  const touchOptions = place && conditionalChoiceContext
    ? getDateConditionalTouchOptions(place.id, previewDistance, conditionalChoiceContext, turnEvent?.touchKey)
        .map((option) => turnEvent && option.id === turnEvent.touchKey
          ? { ...option, label: turnEvent.touchLabel, hint: turnEvent.touchHint }
          : option)
    : []
  const selectedSpeech = speechOptions.find((option) => option.id === speechIntent) ?? speechOptions[0]
  const selectedTouch = touchOptions.find((option) => option.id === touchIntent) ?? touchOptions[0]
  const latestLog = turnLogs.length ? turnLogs[turnLogs.length - 1] ?? null : null
  const latestReaction = latestLog?.reaction ?? null
  const latestHeartDelta = latestLog?.heartDelta ?? 0
  const moodDirection = latestHeartDelta > 0 ? 'up' : latestHeartDelta < 0 ? 'down' : 'steady'
  const previousHeart = latestLog ? latestLog.heartAfter - latestLog.heartDelta : dateHeart
  const reactionMotion = latestLog?.isWeak ? 'weak' : latestHeartDelta > 0 ? 'positive' : latestHeartDelta < 0 ? 'negative' : 'neutral'
  const dateComplete = turnLogs.length >= MAX_DATE_TURNS
  const displayTurn = playPhase === 'result' && turnLogs.length
    ? turnLogs.length
    : Math.min(currentTurn, MAX_DATE_TURNS)

  const resetTurnInputs = () => {
    setDistanceIntent('stay')
    setSpeechIntent('quiet')
    setTouchIntent('none')
  }

  const resetDateInteraction = () => {
    resetTurnInputs()
    setPlayPhase('action')
    setOpenControl(null)
    setIsResolving(false)
  }

  const chooseCharacter = (id: string) => {
    setCharacterId(id)
    setPlaceId(null)
    setDistanceState('normal')
    setTurnLogs([])
    setDateHeart(1)
    setTouchState('none')
    setReturnTouchTriggered(false)
    setDateSaved(false)
    setDisplayExpression('main')
    resetDateInteraction()
    setStep('place')
  }

  const choosePlace = (id: string) => {
    if (!character) return
    const selectedPlace = datePlaces.find((item) => item.id === id)
    const initialDistance = selectedPlace?.initialDistance ?? 'normal'
    setPlaceId(id)
    setDistanceState(initialDistance)
    setTurnLogs([])
    setDateHeart(1)
    setTouchState('none')
    setReturnTouchTriggered(false)
    setDateSaved(false)
    setDisplayExpression(getDateMoodExpression(character.id, 1))
    resetDateInteraction()
    setStep('scene')
  }

  const chooseDistanceIntent = (intent: DistanceIntent) => {
    if (!place || !character) return
    const nextDistance = moveDistance(distanceState, intent)
    const nextTouchOptions = getDateConditionalTouchOptions(place.id, nextDistance, {
      characterId: character.id,
      dateHeart,
      touchState,
      relationshipStage,
      discoveredWeakness: discoveredWeaknesses.has(character.id),
    }, turnEvent?.touchKey)
    if (!nextTouchOptions.some((option) => option.id === touchIntent)) setTouchIntent('none')
    setDistanceIntent(intent)
  }

  const applyTurn = () => {
    if (isResolving || dateComplete || !place || !selectedSpeech || !selectedTouch || !character) return
    const nextDistance = moveDistance(distanceState, distanceIntent)

    const evaluation = getDateTurnEvaluation(character.id, speechIntent, selectedTouch.id)
    const specialHit = Boolean(turnEvent && selectedTouch.id === turnEvent.touchKey)
    const rawHeartDelta = specialHit && evaluation.heartDelta >= 0
      ? Math.min(2, evaluation.heartDelta + 1)
      : evaluation.heartDelta
    const nextHeart = Math.max(0, Math.min(5, dateHeart + rawHeartDelta))
    const effectiveHeartDelta = nextHeart - dateHeart
    const weakDiscovery = evaluation.isWeak && !discoveredWeaknesses.has(character.id)

    let nextTouchState = resolveTouchState(touchState, selectedTouch.id, nextDistance, dateHeart, relationshipStage)
    const baseLines = getDateTurnActionLog(
      place.id,
      speechIntent,
      nextDistance,
      selectedTouch.id,
      touchState,
      nextTouchState,
    )
    const lines = turnEvent
      ? specialHit
        ? [turnEvent.cue, ...baseLines.slice(0, -1), turnEvent.actionLine]
        : [turnEvent.cue, ...baseLines]
      : baseLines
    const shouldReturnTouch = Boolean(
      !returnTouchTriggered
      && nextDistance !== 'space'
      && selectedTouch.id !== 'none'
      && effectiveHeartDelta > 0
      && nextHeart >= 3
    )
    const returnTouch = shouldReturnTouch ? getDateReturnTouch(character.id) : null
    if (returnTouch && returnTouch.touchState !== 'none') nextTouchState = returnTouch.touchState

    const turnNumber = turnLogs.length + 1
    const reactionPops = getDateReactionPopSequence(character.id, effectiveHeartDelta, evaluation.isWeak, turnNumber)
    const innerThought = getDateInnerThought(character.id, effectiveHeartDelta, evaluation.isWeak, turnNumber)
    const expressionSequence = getDateExpressionSequence(
      character.id,
      dateHeart,
      nextHeart,
      evaluation.reaction?.expression,
    )

    expressionTimersRef.current.forEach((timer) => window.clearTimeout(timer))
    expressionTimersRef.current = []
    expressionSequence.forEach((expression, index) => {
      const timer = window.setTimeout(() => setDisplayExpression(expression), 170 + index * 270)
      expressionTimersRef.current.push(timer)
    })

    setIsResolving(true)

    setTurnLogs((current) => [
      ...current,
      {
        distanceState: nextDistance,
        lines,
        reaction: evaluation.reaction,
        heartDelta: effectiveHeartDelta,
        heartAfter: nextHeart,
        isWeak: evaluation.isWeak,
        weakSpotLabel: evaluation.weakSpotLabel,
        weakDiscovery,
        returnTouch: returnTouch?.line ?? null,
        touchState: nextTouchState,
        reactionPops,
        innerThought,
        expressionSequence,
      },
    ])

    if (evaluation.isWeak) {
      setDiscoveredWeaknesses((current) => {
        if (current.has(character.id)) return current
        const next = new Set(current)
        next.add(character.id)
        return next
      })
    }

    if (returnTouch) setReturnTouchTriggered(true)
    setDateHeart(nextHeart)
    setDistanceState(nextDistance)
    setTouchState(nextTouchState)
    setOpenControl(null)
    setPlayPhase('result')
    window.setTimeout(() => {
      stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 70)
    window.setTimeout(() => setIsResolving(false), 1180)
  }

  const continueFromResult = () => {
    resetTurnInputs()
    setOpenControl(null)
    setPlayPhase('action')
    window.setTimeout(() => {
      stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 30)
  }


  const finishDate = () => {
    if (!place || !character || dateSaved || turnLogs.length === 0) return

    const record: DateRecord = {
      id: `date-${progress.day}-${character.id}-${place.id}-${Date.now()}`,
      day: progress.day,
      createdAt: Date.now(),
      characterId: character.id,
      placeId: place.id,
      finalHeart: dateHeart,
      closing: place.closing,
      turns: turnLogs.map((log, index) => ({
        turn: index + 1,
        distanceState: log.distanceState,
        touchState: log.touchState,
        lines: log.lines,
        reactionLine: log.reaction?.line,
        reactionNarration: log.reaction?.narration,
        innerThought: log.innerThought ?? undefined,
        heartDelta: log.heartDelta,
        heartAfter: log.heartAfter,
        isWeak: log.isWeak,
        weakSpotLabel: log.weakSpotLabel ?? undefined,
        weakDiscovery: log.weakDiscovery,
        returnTouch: log.returnTouch ?? undefined,
      })),
    }

    saveDateRecord(record)
    setDateSaved(true)
  }

  const back = () => {
    if (step === 'scene') {
      setPlaceId(null)
      setDistanceState('normal')
      setTurnLogs([])
      setDateHeart(1)
      setTouchState('none')
      setReturnTouchTriggered(false)
      setDateSaved(false)
      setDisplayExpression('main')
      resetDateInteraction()
      setStep('place')
      return
    }
    if (step === 'place') {
      setCharacterId(null)
      setPlaceId(null)
      setDistanceState('normal')
      setTurnLogs([])
      setDateHeart(1)
      setTouchState('none')
      setReturnTouchTriggered(false)
      setDateSaved(false)
      setDisplayExpression('main')
      resetDateInteraction()
      setStep('character')
      return
    }
    onClose()
  }

  return (
    <div className="page date-page">
      <header className="date-page-header">
        <button type="button" className="date-back" onClick={back}>←</button>
        <div>
          <p className="eyebrow">DATE DIARY</p>
          <h1>{step === 'character' ? '오늘 누구와 데이트할까?' : character ? `${character.name}와의 데이트` : '데이트'}</h1>
        </div>
        <button type="button" className="date-close" onClick={onClose}>닫기</button>
      </header>

      {step === 'character' && (
        <section className="date-select-panel">
          <div className="date-intro-note">
            <span>♡ DATE MODE</span>
            <strong>같은 사람도, 어디에서 만나느냐에 따라 다른 기록이 됩니다.</strong>
            <p>호감도 20 이상부터 데이트할 수 있어요. 먼저 오늘 함께 나갈 사람을 골라주세요.</p>
          </div>

          {eligibleCharacters.length ? (
            <div className="date-character-grid">
              {eligibleCharacters.map((item) => {
                const itemAffection = collection.affectionByCharacterId[item.id] ?? 0
                const itemProfile = getDateProfile(item.id)
                return (
                  <button type="button" className="date-character-card" key={item.id} onClick={() => chooseCharacter(item.id)}>
                    <CharacterSD characterId={item.id} name={item.name} symbol={item.symbol} decorative className="date-character-sd" />
                    <span>{item.occupation}</span>
                    <strong>{item.name}</strong>
                    <HeartMeter value={itemAffection} compact interactive={false} />
                    <small>{itemProfile ? `좋아하는 장소 · ${datePlaces.find((p) => p.id === itemProfile.favoritePlaceId)?.name ?? '비밀'}` : '데이트 가능'}</small>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="date-empty-state">
              <b>아직 데이트할 수 있는 사람이 없어요.</b>
              <p>첫 만남을 마치고 호감도 20 이상이 되면 데이트 약속을 잡을 수 있습니다.</p>
            </div>
          )}
        </section>
      )}

      {step === 'place' && character && profile && (
        <section className="date-place-panel">
          <div className="date-partner-strip">
            <CharacterSD characterId={character.id} name={character.name} symbol={character.symbol} decorative className="date-partner-sd" />
            <div>
              <span>DATE PARTNER</span>
              <strong>{character.name}</strong>
              <small>{completed ? 'ROUTE COMPLETE · 모든 장소 해금' : `HEART ${affection} · 현재 ${unlockedPlaces.length}곳 해금`}</small>
            </div>
          </div>

          <div className="date-place-heading">
            <span>PLACE</span>
            <strong>오늘의 장소를 고르세요.</strong>
            <p>장소는 데이트의 배경과 분위기, 그리고 그곳에서만 나오는 문장을 바꿉니다.</p>
          </div>

          <div className="date-place-grid">
            {datePlaces.map((item) => {
              const unlocked = completed || affection >= item.minAffection
              const favorite = profile.favoritePlaceId === item.id
              return (
                <button
                  type="button"
                  key={item.id}
                  className={`date-place-card${unlocked ? '' : ' is-locked'}${favorite ? ' is-favorite' : ''}`}
                  onClick={() => unlocked && choosePlace(item.id)}
                  disabled={!unlocked}
                >
                  <img src={item.background} alt="" />
                  <div className="date-place-card-shade" />
                  <div className="date-place-card-copy">
                    <span>{favorite ? '♥ FAVORITE' : unlocked ? item.moodLabel : `HEART ${item.minAffection}`}</span>
                    <strong>{item.name}</strong>
                    <small>{unlocked ? item.subtitle : `호감도 ${item.minAffection}부터`}</small>
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {step === 'scene' && character && profile && place && (
        <section className="date-experience">
          <div className="date-place-banner">
            <img src={place.background} alt="" />
            <div className="date-place-banner-shade" aria-hidden="true" />
            <div className="date-place-banner-copy">
              <span>{place.moodLabel}</span>
              <strong>{place.name}</strong>
              <small>{place.subtitle}</small>
            </div>
          </div>

          <section className="date-current-scene" aria-label="현재 데이트 상황">
            <div className="date-current-scene-head">
              <span>NOW · DAY {String(progress.day).padStart(2, '0')}</span>
              <small>{distanceStateLabel[distanceState]} · {getDateTouchStateLabel(touchState)}</small>
            </div>
            <p>{formatGameText(place.intro, player.name)}</p>
            <p>{formatGameText(ambientLine, player.name)}</p>
            {isFavoritePlace && turnLogs.length === 0 && (
              <div className="date-place-favorite-line">
                <strong>{character.name}</strong>
                <span>“{formatGameText(profile.favoritePlaceLine, player.name)}”</span>
              </div>
            )}
            {playPhase === 'action' && turnEvent && (
              <div className="date-current-cue">
                <span>✦</span>
                <p>{formatGameText(turnEvent.cue, player.name)}</p>
              </div>
            )}
          </section>

          <div ref={stageRef} className={`date-camera-card is-${playPhase} is-reaction-${reactionMotion}${latestLog?.returnTouch ? ' has-return-touch' : ''}${isResolving ? ' is-resolving' : ''}`}>
            <div className="date-camera-topbar">
              <span className="date-rec"><i aria-hidden="true" /> REC</span>
              <strong>MOMENT {String(displayTurn).padStart(2, '0')}</strong>
              <span>{character.name}</span>
            </div>

            <div className="date-camera-view">
              <CharacterPortrait
                characterId={character.id}
                name={character.name}
                symbol={character.symbol}
                expression={displayExpression}
                className="date-camera-portrait"
              />
              <div className={`date-camera-mood is-${moodDirection}`} key={`mood-${turnLogs.length}-${dateHeart}`}>
                <span>DATE MOOD</span>
                <div aria-label={`데이트 분위기 ${dateHeart} / 5`}>
                  {[0, 1, 2, 3, 4].map((index) => {
                    const gained = playPhase === 'result' && latestHeartDelta > 0 && index >= previousHeart && index < dateHeart
                    const lost = playPhase === 'result' && latestHeartDelta < 0 && index >= dateHeart && index < previousHeart
                    return (
                      <b
                        key={`${turnLogs.length}-${index}`}
                        className={`${index < dateHeart ? 'is-filled' : ''}${gained ? ' is-gained' : ''}${lost ? ' is-lost' : ''}`}
                        style={gained ? { animationDelay: `${0.82 + Math.max(0, index - previousHeart) * 0.16}s` } : lost ? { animationDelay: '.82s' } : undefined}
                      >{index < dateHeart ? '♥' : '♡'}</b>
                    )
                  })}
                </div>
                {playPhase === 'result' && latestHeartDelta !== 0 && (
                  <small className={latestHeartDelta < 0 ? 'is-down' : ''}>{latestHeartDelta > 0 ? '+' : ''}{latestHeartDelta}</small>
                )}
              </div>

              {playPhase === 'result' && latestLog && (
                <div className="date-reaction-pops" aria-hidden="true">
                  {latestLog.reactionPops.map((pop, index) => (
                    <span
                      key={`${turnLogs.length}-${pop}-${index}`}
                      className={`date-reaction-pop is-${getReactionPopTone(pop)} pos-${index % 3}`}
                      style={{ animationDelay: `${index * 0.22}s` }}
                    >{pop}</span>
                  ))}
                </div>
              )}

              {playPhase === 'result' && latestReaction && latestLog && (
                <>
                  <div className="date-camera-speech" aria-live="polite">
                    <strong>{character.name}</strong>
                    <p>“{formatGameText(latestReaction.line, player.name)}”</p>
                  </div>
                  {latestLog.innerThought && (
                    <div className="date-camera-thought">
                      <p>({formatGameText(latestLog.innerThought, player.name)})</p>
                    </div>
                  )}
                </>
              )}

              <span className="date-camera-distance">{distanceStateLabel[distanceState]}</span>
            </div>

            {playPhase === 'result' && latestReaction && latestLog && (
              <section key={`result-${turnLogs.length}`} className={`date-result-sheet${latestLog.isWeak ? ' is-weak' : ''}`} aria-live="polite">
                {latestLog.isWeak && (
                  <div className="date-result-weak">
                    <span>{latestLog.weakDiscovery ? '✦ 예상보다 큰 반응' : '✦ 알고 있는 약점'}</span>
                    <strong>{latestLog.weakSpotLabel}</strong>
                  </div>
                )}
                <div className="date-result-narration">
                  {latestLog.lines.slice(-2).map((line, index) => (
                    <p key={`${turnLogs.length}-result-${index}`}>{formatGameText(line, player.name)}</p>
                  ))}
                  <p>{formatGameText(latestReaction.narration, player.name)}</p>
                  {latestLog.returnTouch && <p className="is-return">{formatGameText(latestLog.returnTouch, player.name)}</p>}
                </div>
                <div className="date-result-footer">
                  <button type="button" onClick={continueFromResult} disabled={isResolving}>
                    {isResolving ? '잠깐, 반응을 보고 있어요…' : dateComplete ? '데이트 마무리  →' : '다음 순간  →'}
                  </button>
                </div>
              </section>
            )}
          </div>

          {playPhase === 'action' && !dateComplete && (
            <section className="date-action-panel">
              <div className="date-action-heading">
                <div>
                  <span>TURN {String(currentTurn).padStart(2, '0')} / {String(MAX_DATE_TURNS).padStart(2, '0')}</span>
                  <strong>이번엔 어떻게 할까?</strong>
                </div>
                <small>바꾸고 싶은 항목만 고르면 돼요.</small>
              </div>

              <div className="date-action-slots">
                <section className={`date-action-slot${openControl === 'say' ? ' is-open' : ''}`}>
                  <button type="button" className="date-action-slot-head" onClick={() => setOpenControl((current) => current === 'say' ? null : 'say')}>
                    <span>SAY</span>
                    <strong>{selectedSpeech?.label}</strong>
                    <i aria-hidden="true">{openControl === 'say' ? '−' : '+'}</i>
                  </button>
                  {openControl === 'say' && (
                    <div className="date-action-slot-options" role="radiogroup" aria-label="말의 태도 선택">
                      {speechOptions.map((option) => {
                        const selected = speechIntent === option.id
                        return (
                          <button
                            type="button"
                            key={option.id}
                            role="radio"
                            aria-checked={selected}
                            className={`${selected ? 'is-selected' : ''}${option.label.includes('✦') ? ' is-conditional' : ''}`}
                            onClick={() => { setSpeechIntent(option.id); setOpenControl(null) }}
                          >
                            <i aria-hidden="true" />
                            <span><strong>{option.label}</strong><small>{option.hint}</small></span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </section>

                <section className={`date-action-slot${openControl === 'distance' ? ' is-open' : ''}`}>
                  <button type="button" className="date-action-slot-head" onClick={() => setOpenControl((current) => current === 'distance' ? null : 'distance')}>
                    <span>DISTANCE</span>
                    <strong>{distanceIntentCopy[distanceIntent].label}</strong>
                    <i aria-hidden="true">{openControl === 'distance' ? '−' : '+'}</i>
                  </button>
                  {openControl === 'distance' && (
                    <div className="date-action-slot-options" role="radiogroup" aria-label="거리 선택">
                      {(Object.keys(distanceIntentCopy) as DistanceIntent[]).map((intent) => {
                        const disabled = (intent === 'back' && !canStepBack) || (intent === 'forward' && !canStepForward)
                        const selected = distanceIntent === intent
                        return (
                          <button
                            type="button"
                            key={intent}
                            role="radio"
                            aria-checked={selected}
                            disabled={disabled}
                            className={selected ? 'is-selected' : ''}
                            onClick={() => { chooseDistanceIntent(intent); setOpenControl(null) }}
                          >
                            <i aria-hidden="true" />
                            <span>
                              <strong>{distanceIntentCopy[intent].label}</strong>
                              <small>{disabled ? '지금은 더 이동할 수 없다' : distanceIntentCopy[intent].hint}</small>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </section>

                <section className={`date-action-slot is-touch${openControl === 'touch' ? ' is-open' : ''}`}>
                  <button type="button" className="date-action-slot-head" onClick={() => setOpenControl((current) => current === 'touch' ? null : 'touch')}>
                    <span>♡ TOUCH</span>
                    <strong>{selectedTouch?.label}</strong>
                    <i aria-hidden="true">{openControl === 'touch' ? '−' : '+'}</i>
                  </button>
                  {openControl === 'touch' && (
                    <div className="date-action-slot-options" role="radiogroup" aria-label="스킨십 선택">
                      {touchOptions.map((option) => {
                        const selected = touchIntent === option.id
                        return (
                          <button
                            type="button"
                            key={option.id}
                            role="radio"
                            aria-checked={selected}
                            className={`${selected ? 'is-selected' : ''}${option.label.includes('✦') ? ' is-conditional' : ''}`}
                            onClick={() => { setTouchIntent(option.id); setOpenControl(null) }}
                          >
                            <i aria-hidden="true" />
                            <span><strong>{option.label}</strong><small>{option.hint}</small></span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </section>
              </div>

              <button type="button" className="date-action-apply" onClick={applyTurn} disabled={isResolving}>
                {isResolving ? '반응을 기다리는 중…' : '이대로 행동한다  →'}
              </button>
            </section>
          )}

          {playPhase === 'action' && dateComplete && (
            <section className={`date-finish-card${dateSaved ? ' is-saved' : ''}`}>
              <span>{dateSaved ? 'DATE RECORD SAVED' : 'DATE COMPLETE'}</span>
              <strong>{dateSaved ? '오늘의 데이트가 다이어리에 남았습니다.' : `${character.name}와의 오늘을 마무리할 시간.`}</strong>
              <p>{formatGameText(place.closing, player.name)}</p>
              <div className="date-finish-heart" aria-label={`최종 데이트 분위기 ${dateHeart} / 5`}>
                {'♥'.repeat(dateHeart)}{'♡'.repeat(5 - dateHeart)}
              </div>
              {!dateSaved ? (
                <button type="button" className="date-finish-save" onClick={finishDate}>오늘을 다이어리에 기록한다</button>
              ) : (
                <small>기록 메뉴의 DATE MEMORIES에서 오늘의 전체 기록을 다시 읽을 수 있어요.</small>
              )}
            </section>
          )}

          <div className="date-experience-actions">
            <button type="button" onClick={() => { setPlaceId(null); setDateSaved(false); resetDateInteraction(); setStep('place') }}>
              {dateSaved ? '다른 데이트를 고른다' : '장소를 다시 고른다'}
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
