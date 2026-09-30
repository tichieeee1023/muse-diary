import { useMemo, useState } from 'react'
import { CharacterPortrait } from '../components/CharacterPortrait'
import { ThemeBgmController } from '../components/ThemeBgmController'
import { getAfterEndingDateScenario } from '../data/afterEndingDates'
import { getAllCharacters } from '../engine/encounterEngine'
import { playUiSound } from '../engine/soundEngine'
import { useGameStore } from '../store/useGameStore'

interface AfterEndingDatePageProps {
  onClose: () => void
}

export function AfterEndingDatePage({ onClose }: AfterEndingDatePageProps) {
  const player = useGameStore((state) => state.player)
  const collection = useGameStore((state) => state.collection)
  const completeAfterEndingDate = useGameStore((state) => state.completeAfterEndingDate)
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled)
  const [characterId, setCharacterId] = useState<string | null>(null)
  const [beatIndex, setBeatIndex] = useState(0)
  const [resultLine, setResultLine] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const characters = useMemo(() => getAllCharacters(), [])
  const completedIds = collection.completedCharacterIds
  const finishedIds = collection.completedAfterEndingDateCharacterIds
  const availableCharacters = characters.filter((character) => completedIds.includes(character.id) && !finishedIds.includes(character.id))
  const selectedCharacter = characterId ? characters.find((character) => character.id === characterId) ?? null : null
  const scenario = selectedCharacter ? getAfterEndingDateScenario(selectedCharacter.id) : null
  const beat = scenario?.turns[beatIndex] ?? null

  if (!player) return null

  const selectCharacter = (nextCharacterId: string) => {
    setCharacterId(nextCharacterId)
    setBeatIndex(0)
    setResultLine(null)
    setIsComplete(false)
    playUiSound('page', soundEnabled)
  }

  const choose = (line: string) => {
    if (!scenario || !selectedCharacter || resultLine) return
    setResultLine(line)
    playUiSound('message', soundEnabled)
  }

  const continueScene = () => {
    if (!scenario || !selectedCharacter || !resultLine) return
    if (beatIndex >= scenario.turns.length - 1) {
      completeAfterEndingDate(selectedCharacter.id)
      setIsComplete(true)
      playUiSound('complete', soundEnabled)
      return
    }
    setBeatIndex((index) => index + 1)
    setResultLine(null)
  }

  const back = () => {
    if (isComplete || !selectedCharacter) {
      onClose()
      return
    }
    if (resultLine) {
      setResultLine(null)
      return
    }
    setCharacterId(null)
    setBeatIndex(0)
  }

  return (
    <div className="page after-ending-date-page">
      <ThemeBgmController characterId={selectedCharacter?.id} />
      <header className="date-page-header after-ending-date-header">
        <button type="button" className="date-back" onClick={back}>{selectedCharacter && !isComplete ? '←' : '×'}</button>
        <div>
          <p className="eyebrow">AFTER ENDING · PRIVATE DATE</p>
          <h1>{isComplete ? '오늘의 후일담' : selectedCharacter ? `${selectedCharacter.name}와 다시 걷는 날` : '엔딩 후 추가 데이트'}</h1>
        </div>
        <button type="button" className="date-close" onClick={onClose} aria-label="추가 데이트 닫기">×</button>
      </header>

      {!selectedCharacter && (
        <section className="after-ending-date-select">
          <div className="date-intro-note">
            <span>AFTER STORY · 3 SCENES</span>
            <strong>엔딩을 본 사람과, 이야기가 끝난 뒤의 시간을 보내세요.</strong>
            <p>한 캐릭터당 한 번만 열리는 짧은 후일담입니다. 데이트 기록은 남기지 않고, 완료한 기억만 보관합니다.</p>
          </div>
          {availableCharacters.length > 0 ? (
            <div className="after-ending-date-grid">
              {availableCharacters.map((character) => {
                const scenarioForCharacter = getAfterEndingDateScenario(character.id)
                return (
                  <button type="button" className="after-ending-date-card" key={character.id} onClick={() => selectCharacter(character.id)}>
                    <CharacterPortrait characterId={character.id} name={character.name} symbol={character.symbol} expression="main" className="after-ending-date-portrait" alt={`${character.name} 후일담 portrait`} />
                    <span>ROUTE COMPLETE</span>
                    <strong>{character.name}</strong>
                    <small>{scenarioForCharacter?.title ?? 'AFTER STORY'}</small>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="date-empty-state">
              <b>{completedIds.length === 0 ? '먼저 엔딩을 완성해 주세요.' : '모든 후일담을 읽었습니다.'}</b>
              <p>{completedIds.length === 0 ? '캐릭터 엔딩을 본 뒤, 이곳에서 새로운 데이트가 열립니다.' : '완료한 후일담은 기록장의 기억 보관함에 남아 있어요.'}</p>
            </div>
          )}
        </section>
      )}

      {selectedCharacter && scenario && !isComplete && beat && (
        <section className="after-ending-date-scene">
          <div className="after-ending-date-partner">
            <CharacterPortrait characterId={selectedCharacter.id} name={selectedCharacter.name} symbol={selectedCharacter.symbol} expression="main" className="after-ending-date-portrait large" alt={`${selectedCharacter.name} 후일담 portrait`} />
            <div><span>{scenario.placeName}</span><strong>{scenario.title}</strong><small>SCENE {String(beatIndex + 1).padStart(2, '0')} / 03</small></div>
          </div>
          <article className="after-ending-date-sheet">
            <p className="after-ending-date-opening">{beatIndex === 0 ? scenario.opening : beat.prompt}</p>
            {beatIndex === 0 && <p className="after-ending-date-prompt">{beat.prompt}</p>}
            {!resultLine ? (
              <div className="after-ending-date-choices">
                {beat.choices.map((option) => <button type="button" key={option.label} onClick={() => choose(option.line)}>{option.label}<b>→</b></button>)}
              </div>
            ) : (
              <div className="after-ending-date-result">
                <p>“{resultLine}”</p>
                <button type="button" className="primary-button full-button" onClick={continueScene}>{beatIndex === scenario.turns.length - 1 ? '오늘의 후일담을 간직한다' : '다음 장면으로'}</button>
              </div>
            )}
          </article>
        </section>
      )}

      {selectedCharacter && scenario && isComplete && (
        <section className="after-ending-date-complete">
          <span>AFTER STORY · COMPLETE</span>
          <strong>{scenario.title}</strong>
          <p>{scenario.closing}</p>
          <div className="after-ending-memory-card"><small>TEXT MEMORY UNLOCKED</small><b>{scenario.memoryTitle}</b><p>{scenario.memoryLine}</p></div>
          <button type="button" className="primary-button full-button" onClick={onClose}>기록장으로 돌아간다</button>
        </section>
      )}
    </div>
  )
}
