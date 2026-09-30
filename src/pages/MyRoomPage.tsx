import { useMemo, useState } from 'react'
import { BottomNav, type MainSection } from '../components/BottomNav'
import { CharacterPortrait } from '../components/CharacterPortrait'
import { getCharacterRouteProfile } from '../data/characters/index'
import { getMyRoomEndingDialogue, getMyRoomRivalryLine, getPostRouteLine } from '../data/characterFlavor'
import { getMyRoomPairMood, getMyRoomSpecialPairDialogue } from '../data/myRoomPairDialogue'
import { getMuseDollDialogue } from '../data/myRoomDollDialogue'
import { getMyRoomNextVisit, getMyRoomVisitPlan } from '../data/myRoomSchedule'
import { getDateRelationshipCopy } from '../data/dateScenarios'
import { getAllCharacters } from '../engine/encounterEngine'
import { getEndingContent } from '../engine/endingEngine'
import { playUiSound } from '../engine/soundEngine'
import { useGameStore } from '../store/useGameStore'
import { MAX_DAILY_DATE_SESSIONS } from '../types/game'

interface MyRoomPageProps {
  onNavigate: (section: MainSection) => void
  onStartDate: () => void
  onStartAfterEndingDate: () => void
}

const seasonMark: Record<string, string> = {
  SPRING: '✿',
  SUMMER: '✦',
  AUTUMN: '❧',
  WINTER: '❄',
}

export function MyRoomPage({ onNavigate, onStartDate, onStartAfterEndingDate }: MyRoomPageProps) {
  const progress = useGameStore((state) => state.progress)
  const collection = useGameStore((state) => state.collection)
  const player = useGameStore((state) => state.player)
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled)
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null)
  const [visitorTalkIndex, setVisitorTalkIndex] = useState(0)
  const [selectedDollId, setSelectedDollId] = useState<string | null>(null)
  const [dollDialogueIndex, setDollDialogueIndex] = useState(0)

  const characters = useMemo(() => getAllCharacters(), [])
  if (!player) return null

  const timeOfDay = progress.actionsLeft <= 1 ? '밤' : '낮'
  const datesRemaining = Math.max(0, MAX_DAILY_DATE_SESSIONS - progress.dateCharacterIdsToday.length)
  const completedCharacters = characters.filter((character) => collection.completedCharacterIds.includes(character.id))
  const afterEndingCharacters = completedCharacters.filter((character) => !collection.completedAfterEndingDateCharacterIds.includes(character.id))
  const unlockedDolls = new Set(collection.secretReadCharacterIds)
  const seasonalRecords = Object.values(collection.seasonalEventRecords)
    .sort((a, b) => a.day - b.day)

  const visitPlans = getMyRoomVisitPlan(completedCharacters.map((character) => character.id), progress.day)
  const upcomingVisits = completedCharacters
    .map((character) => ({ character, visit: getMyRoomNextVisit(character.id, progress.day) }))
    .sort((a, b) => a.visit.daysUntil - b.visit.daysUntil)
  const visitors = visitPlans
    .map((plan) => characters.find((character) => character.id === plan.characterId))
    .filter((character): character is typeof characters[number] => Boolean(character))

  const selectedVisitor = visitors.find((character) => character.id === selectedVisitorId) ?? visitors[0] ?? null
  const selectedVisitorPlan = selectedVisitor ? visitPlans.find((plan) => plan.characterId === selectedVisitor.id) : null
  const selectedVisitorRelationship = selectedVisitor ? getDateRelationshipCopy(selectedVisitor.id, 'complete') : null
  const specialPairDialogue = visitors.length === 2 ? getMyRoomSpecialPairDialogue(visitors[0].id, visitors[1].id, progress.day) : null
  const pairMood = visitors.length === 2 ? getMyRoomPairMood(progress.day) : null
  const selectedDollCharacter = selectedDollId ? characters.find((character) => character.id === selectedDollId) ?? null : null
  const selectedDollProfile = selectedDollCharacter ? getCharacterRouteProfile(selectedDollCharacter.id) : null
  const selectedDollEnding = selectedDollCharacter ? getEndingContent(selectedDollCharacter.id) : null
  const selectedDollDialogue = selectedDollCharacter ? getMuseDollDialogue(selectedDollCharacter.id, progress.day, dollDialogueIndex) : null

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
          {visitPlans.length > 0 && <small>{visitPlans.map((plan) => `${plan.periodLabel} · ${plan.note}`).join('  /  ')}</small>}
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
                  setVisitorTalkIndex(0)
                }}
                aria-label={`${character.name}에게 말 걸기`}
              >
                <CharacterPortrait characterId={character.id} name={character.name} symbol={character.symbol} expression="main" className="my-room-visitor-portrait" alt={`${character.name} 방문 portrait`} />
                <span>{character.name}</span>
                <small>{visitPlans.find((plan) => plan.characterId === character.id)?.isScheduled ? '오늘의 약속' : '잠깐 들름'}</small>
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

      {upcomingVisits.length > 0 && (
        <details className="my-room-fold my-room-schedule-fold">
          <summary>
            <span><small>VISIT SCHEDULE · 7 DAY CYCLE</small><strong>다음에 들를 사람들</strong></span>
            <b aria-hidden="true">＋</b>
          </summary>
          <section className="my-room-schedule-section" aria-label="캐릭터별 방문 일정">
            <div className="my-room-schedule-head">
              <div>
                <p className="eyebrow">VISIT SCHEDULE · 7 DAY CYCLE</p>
                <h2>다음에 들를 사람들</h2>
              </div>
              <span>매주 같은 리듬으로<br />다시 만나요</span>
            </div>
            <div className="my-room-schedule-list">
              {upcomingVisits.map(({ character, visit }) => (
                <article key={character.id} className={visit.daysUntil === 0 ? 'is-today' : ''}>
                  <strong>{character.name}</strong>
                  <small>{visit.daysUntil === 0 ? 'TODAY' : `D-${visit.daysUntil}`}</small>
                  <span>{visit.plan.periodLabel}</span>
                </article>
              ))}
            </div>
          </section>
        </details>
      )}

      {selectedVisitor && (
        <section className="my-room-visitor-message" aria-live="polite">
          <div className="my-room-message-meta">
            <span>{selectedVisitorPlan?.isScheduled ? 'VISITOR · TODAY SCHEDULE' : 'VISITOR · DROP-IN'}</span>
            <strong>{selectedVisitor.name}</strong>
          </div>
          {selectedVisitorRelationship && (
            <div className="my-room-relationship-badge">
              <span>RELATIONSHIP</span>
              <strong>{selectedVisitorRelationship.label}</strong>
              <small>{selectedVisitorRelationship.note}</small>
            </div>
          )}
          <p>“{getMyRoomEndingDialogue(selectedVisitor.id, progress.day + visitorTalkIndex)}”</p>
          <small>{getPostRouteLine(selectedVisitor.id, progress.day + visitorTalkIndex)}</small>
          <button
            type="button"
            className="my-room-talk-again"
            onClick={() => {
              playUiSound('message', soundEnabled)
              setVisitorTalkIndex((index) => index + 1)
            }}
          >
            한마디 더 듣기 <b aria-hidden="true">↗</b>
          </button>
        </section>
      )}

      {visitors.length === 2 && (
        <details className="my-room-fold my-room-cross-talk-fold">
          <summary>
            <span><small>{pairMood?.label ?? 'TWO VISITORS'}</small><strong>{visitors[0].name} × {visitors[1].name} 특수 대화</strong></span>
            <b aria-hidden="true">＋</b>
          </summary>
          <section className="my-room-cross-talk" aria-label={`${visitors[0].name}와 ${visitors[1].name}의 대화`}>
            <div className="my-room-cross-talk-head">
              <span>{pairMood?.label ?? 'TWO VISITORS'}</span>
              <strong>{pairMood?.title ?? '둘이 마주친 날'}</strong>
              <small>{pairMood?.note ?? '오늘은 둘 다 먼저 돌아갈 생각이 없어 보인다.'}</small>
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
        </details>
      )}

      {completedCharacters.length > 0 && (
        <section className={`my-room-date-entry${datesRemaining === 0 ? ' is-depleted' : ''}`} aria-label="데이트 다이어리">
          <div className="my-room-date-entry-mark" aria-hidden="true">♡</div>
          <div>
            <p className="eyebrow">DATE DIARY · PRIVATE TIME</p>
            <h2>오늘은 조금 더 가까이</h2>
            <p>{datesRemaining > 0 ? `오늘 ${datesRemaining}명까지 데이트할 수 있어요.` : '오늘의 데이트는 모두 마무리했어요. 내일 다시 만나요.'}</p>
          </div>
          <button type="button" disabled={datesRemaining === 0} onClick={() => { if (datesRemaining === 0) return; playUiSound('page', soundEnabled); onStartDate() }}>
            데이트 입장 <span>오늘 {progress.dateCharacterIdsToday.length} / {MAX_DAILY_DATE_SESSIONS}</span><b aria-hidden="true">→</b>
          </button>
        </section>
      )}

      {completedCharacters.length > 0 && (
        <details className="my-room-fold my-room-after-ending-fold">
          <summary>
            <span><small>AFTER ENDING · EXTRA DATE</small><strong>끝난 뒤에도, 한 번 더</strong></span>
            <b aria-hidden="true">＋</b>
          </summary>
          <section className="my-room-after-ending-entry" aria-label="엔딩 후 추가 데이트">
            <div className="my-room-after-ending-copy">
              <p className="eyebrow">AFTER ENDING · EXTRA DATE</p>
              <h2>끝난 뒤에도, 한 번 더</h2>
              <p>{afterEndingCharacters.length > 0 ? `${afterEndingCharacters.length}명의 후일담이 기다리고 있어요.` : '모든 후일담을 기록했어요.'}</p>
            </div>
            <button type="button" disabled={afterEndingCharacters.length === 0} onClick={() => { if (afterEndingCharacters.length === 0) return; playUiSound('special', soundEnabled); onStartAfterEndingDate() }}>
              후일담 입장 <span>{afterEndingCharacters.length}개 남음</span><b aria-hidden="true">→</b>
            </button>
          </section>
        </details>
      )}

      <details className="my-room-fold my-room-collection-fold">
        <summary>
          <span><small>COLLECTION · MUSE SHELF</small><strong>수집품과 계절의 기록</strong></span>
          <b aria-hidden="true">＋</b>
        </summary>
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
                    setDollDialogueIndex(0)
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
      </details>

      {selectedDollCharacter && selectedDollProfile && (
        <div className="my-room-doll-lightbox" role="dialog" aria-modal="true" aria-label={`${selectedDollCharacter.name} MUSE DOLL`} onClick={(event) => { if (event.target === event.currentTarget) setSelectedDollId(null) }}>
          <button type="button" className="my-room-doll-close" aria-label="닫기" onClick={() => setSelectedDollId(null)}>×</button>
          <span>MUSE DOLL · {selectedDollCharacter.name}</span>
          <button
            type="button"
            className="my-room-doll-interaction"
            onClick={(event) => {
              event.stopPropagation()
              playUiSound('message', soundEnabled)
              setDollDialogueIndex((index) => index + 1)
            }}
            aria-label={`${selectedDollCharacter.name} MUSE DOLL과 대화하기`}
          >
            <img src={selectedDollProfile.visuals.endingDoll} alt={`${selectedDollCharacter.name} MUSE DOLL 전체 이미지`} />
            <span>TOUCH TO TALK</span>
          </button>
          {selectedDollDialogue && <div className="my-room-doll-voice"><span>DOLL VOICE · {selectedDollCharacter.name}</span><p>“{selectedDollDialogue}”</p></div>}
          {selectedDollEnding && <div><strong>{selectedDollEnding.museSketchTitle}</strong><p>{selectedDollEnding.museSketchNote}</p></div>}
        </div>
      )}

      <BottomNav active="room" onNavigate={onNavigate} />
    </div>
  )
}
