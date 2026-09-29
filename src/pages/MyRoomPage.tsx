import { useMemo, useState } from 'react'
import { BottomNav, type MainSection } from '../components/BottomNav'
import { CharacterSD } from '../components/CharacterSD'
import { getCharacterRouteProfile } from '../data/characters/index'
import { getMyRoomEndingDialogue, getMyRoomRivalryLine, getPostRouteLine } from '../data/characterFlavor'
import { getMyRoomSpecialPairDialogue } from '../data/myRoomPairDialogue'
import { getAllCharacters } from '../engine/encounterEngine'
import { getEndingContent } from '../engine/endingEngine'
import { playUiSound } from '../engine/soundEngine'
import { useGameStore } from '../store/useGameStore'

interface MyRoomPageProps {
  onNavigate: (section: MainSection) => void
}

const seasonMark: Record<string, string> = {
  SPRING: '✿',
  SUMMER: '✦',
  AUTUMN: '❧',
  WINTER: '❄',
}

export function MyRoomPage({ onNavigate }: MyRoomPageProps) {
  const progress = useGameStore((state) => state.progress)
  const collection = useGameStore((state) => state.collection)
  const player = useGameStore((state) => state.player)
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled)
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null)
  const [selectedDollId, setSelectedDollId] = useState<string | null>(null)

  const characters = useMemo(() => getAllCharacters(), [])
  if (!player) return null

  const timeOfDay = progress.actionsLeft <= 1 ? '밤' : '낮'
  const completedCharacters = characters.filter((character) => collection.completedCharacterIds.includes(character.id))
  const unlockedDolls = new Set(collection.secretReadCharacterIds)
  const seasonalRecords = Object.values(collection.seasonalEventRecords)
    .sort((a, b) => a.day - b.day)

  const visitors = (() => {
    if (completedCharacters.length === 0) return []
    if (completedCharacters.length === 1) return [completedCharacters[0]]

    // 엔딩을 본 인물 중 매일 두 명만 작업실에 방문한다.
    // 완전 랜덤 대신 DAY + 해금 목록을 seed로 써서 같은 날 새로고침해도 멤버가 바뀌지 않는다.
    const seedText = `${progress.day}:${completedCharacters.map((character) => character.id).join('|')}`
    const hash = (value: string) => Array.from(value).reduce((acc, char) => ((acc * 31) + char.charCodeAt(0)) >>> 0, 7)
    const firstIndex = hash(seedText) % completedCharacters.length
    const secondOffset = 1 + (hash(`pair:${seedText}`) % (completedCharacters.length - 1))
    const secondIndex = (firstIndex + secondOffset) % completedCharacters.length

    return [completedCharacters[firstIndex], completedCharacters[secondIndex]]
  })()

  const selectedVisitor = visitors.find((character) => character.id === selectedVisitorId) ?? visitors[0] ?? null
  const specialPairDialogue = visitors.length === 2 ? getMyRoomSpecialPairDialogue(visitors[0].id, visitors[1].id, progress.day) : null
  const selectedDollCharacter = selectedDollId ? characters.find((character) => character.id === selectedDollId) ?? null : null
  const selectedDollProfile = selectedDollCharacter ? getCharacterRouteProfile(selectedDollCharacter.id) : null
  const selectedDollEnding = selectedDollCharacter ? getEndingContent(selectedDollCharacter.id) : null

  return (
    <div className="page my-room-page">
      <header className="diary-page-header my-room-header">
        <div>
          <p className="eyebrow">PRIVATE WORKROOM · MY ROOM</p>
          <h1>마이룸</h1>
        </div>
        <div className="my-room-day"><span>DAY</span><strong>{String(progress.day).padStart(2, '0')}</strong></div>
      </header>

      <section className="my-room-stage" aria-label="작업실을 찾아온 인연들">
        <img className="my-room-stage-bg" src={`/assets/backgrounds/studio/${timeOfDay === '밤' ? 'night' : 'day'}.webp`} alt="나의 작업실" />
        <div className="my-room-stage-shade" aria-hidden="true" />
        <div className="my-room-stage-label">
          <span>{timeOfDay === '밤' ? 'NIGHT VISIT' : 'DAY VISIT'}</span>
          <strong>{visitors.length === 2 ? '오늘 작업실에 놀러 온 두 사람' : visitors.length === 1 ? '오늘 작업실에 놀러 온 사람' : '아직 조용한 작업실'}</strong>
        </div>

        {visitors.length > 0 ? (
          <div className={`my-room-visitors visitors-${visitors.length}`}>
            {visitors.map((character, index) => (
              <button
                type="button"
                key={character.id}
                className={`my-room-visitor visitor-${index}${selectedVisitor?.id === character.id ? ' is-selected' : ''}`}
                onClick={() => {
                  playUiSound('message', soundEnabled)
                  setSelectedVisitorId(character.id)
                }}
                aria-label={`${character.name}에게 말 걸기`}
              >
                <CharacterSD characterId={character.id} name={character.name} symbol={character.symbol} className="my-room-visitor-sd" />
                <span>{character.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="my-room-empty-stage">
            <span>EMPTY ROOM</span>
            <p>한 사람의 이야기를 끝까지 완성하면<br />그 이후부터 이 작업실에서 다시 만날 수 있습니다.</p>
          </div>
        )}
      </section>

      {selectedVisitor && (
        <section className="my-room-visitor-message" aria-live="polite">
          <div className="my-room-message-meta">
            <span>VISITOR · ROUTE COMPLETE</span>
            <strong>{selectedVisitor.name}</strong>
          </div>
          <p>“{getMyRoomEndingDialogue(selectedVisitor.id, progress.day)}”</p>
          <small>{getPostRouteLine(selectedVisitor.id, progress.day)}</small>
        </section>
      )}

      {visitors.length === 2 && (
        <section className="my-room-cross-talk" aria-label={`${visitors[0].name}와 ${visitors[1].name}의 대화`}>
          <div className="my-room-cross-talk-head">
            <span>TWO VISITORS</span>
            <strong>둘이 마주친 날</strong>
            <small>오늘은 둘 다 먼저 돌아갈 생각이 없어 보인다.</small>
          </div>
          <div className="my-room-cross-talk-lines">
            <div className="my-room-cross-talk-line">
              <strong>{visitors[0].name}</strong>
              <p>“{getMyRoomRivalryLine(visitors[0].id, visitors[1].name, progress.day)}”</p>
            </div>
            <div className="my-room-cross-talk-divider" aria-hidden="true">×</div>
            <div className="my-room-cross-talk-line">
              <strong>{visitors[1].name}</strong>
              <p>“{getMyRoomRivalryLine(visitors[1].id, visitors[0].name, progress.day + 1)}”</p>
            </div>
          </div>

          {specialPairDialogue && (
            <div className="my-room-special-talk">
              <div className="my-room-special-talk-title">
                <span>SPECIAL TALK</span>
                <strong>{visitors[0].name} × {visitors[1].name}</strong>
              </div>
              <div className="my-room-special-talk-script">
                {specialPairDialogue.map((line, index) => {
                  const speaker = characters.find((character) => character.id === line.speakerId)
                  return (
                    <div className="my-room-special-talk-line" key={`${line.speakerId}-${index}`}>
                      <strong>{speaker?.name ?? '???'}</strong>
                      <p>“{line.text}”</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="my-room-summary" aria-label="마이룸 수집 현황">
        <div><span>방문 가능</span><strong>{completedCharacters.length} / 12</strong></div>
        <div><span>MUSE DOLL</span><strong>{collection.secretReadCharacterIds.length} / 12</strong></div>
        <div><span>기념품</span><strong>{seasonalRecords.length} / 4</strong></div>
      </section>

      <section className="my-room-shelf-section">
        <div className="diary-section-title">
          <p className="eyebrow">MUSE SHELF</p>
          <h2>완성된 인형 선반</h2>
        </div>
        <p className="my-room-section-note">공략을 끝내고 비설까지 읽으면, 그 사람에게서 영감받은 MUSE DOLL이 작업실에 놓입니다.</p>
        <div className="my-room-doll-grid">
          {characters.map((character) => {
            const unlocked = unlockedDolls.has(character.id)
            const profile = unlocked ? getCharacterRouteProfile(character.id) : null
            const ending = unlocked ? getEndingContent(character.id) : null
            return (
              <button
                type="button"
                key={character.id}
                className={`my-room-doll-card${unlocked ? ' is-unlocked' : ' is-locked'}`}
                onClick={() => {
                  if (!unlocked) return
                  playUiSound('page', soundEnabled)
                  setSelectedDollId(character.id)
                }}
                disabled={!unlocked}
              >
                {unlocked && profile ? (
                  <img src={profile.visuals.endingDoll} alt={`${character.name} MUSE DOLL`} loading="lazy" />
                ) : (
                  <div className="my-room-doll-lock"><span>?</span></div>
                )}
                <div>
                  <strong>{unlocked ? character.name : '???'}</strong>
                  <small>{unlocked && ending ? ending.museSketchTitle : '아직 비어 있는 자리'}</small>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="my-room-keepsake-section">
        <div className="diary-section-title">
          <p className="eyebrow">SEASONAL KEEPSAKES</p>
          <h2>계절의 기념품</h2>
        </div>
        {seasonalRecords.length > 0 ? (
          <div className="my-room-keepsake-list">
            {seasonalRecords.map((record) => {
              const companion = characters.find((character) => character.id === record.companionId)
              const season = record.season ?? 'SPRING'
              return (
                <article key={record.eventId} className={`my-room-keepsake season-${season.toLowerCase()}`}>
                  <span className="my-room-keepsake-mark" aria-hidden="true">{seasonMark[season] ?? '◇'}</span>
                  <div>
                    <small>DAY {String(record.day).padStart(2, '0')} · {season}</small>
                    <strong>{record.souvenir}</strong>
                    <p>{companion?.name ?? '누군가'}와 남긴 {record.title}의 기억.</p>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="my-room-keepsake-empty"><span>EMPTY BOX</span><p>계절의 특별한 날을 보내면 여기 기념품이 쌓입니다.</p></div>
        )}
      </section>

      {selectedDollCharacter && selectedDollProfile && (
        <div className="my-room-doll-lightbox" role="dialog" aria-modal="true" aria-label={`${selectedDollCharacter.name} MUSE DOLL`} onClick={() => setSelectedDollId(null)}>
          <button type="button" aria-label="닫기" onClick={() => setSelectedDollId(null)}>×</button>
          <span>MUSE DOLL · {selectedDollCharacter.name}</span>
          <img src={selectedDollProfile.visuals.endingDoll} alt={`${selectedDollCharacter.name} MUSE DOLL 전체 이미지`} />
          {selectedDollEnding && <div><strong>{selectedDollEnding.museSketchTitle}</strong><p>{selectedDollEnding.museSketchNote}</p></div>}
        </div>
      )}

      <BottomNav active="room" onNavigate={onNavigate} />
    </div>
  )
}
