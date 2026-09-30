import { useEffect, useState } from 'react'
import { BottomNav, type MainSection } from '../components/BottomNav'
import { CharacterPortrait } from '../components/CharacterPortrait'
import { getAchievements } from '../engine/achievementEngine'
import { getAfterEndingDateScenario } from '../data/afterEndingDates'
import { getCollectionRewards } from '../data/collectionRewards'
import { museLetters, type MuseLetter } from '../data/letters'
import { characterThemeBgms, getCharacterThemeBgm } from '../data/themeBgm'
import { getAllCharacters } from '../engine/encounterEngine'
import { getPlace } from '../data/locations'
import { playThemeBgm, playUiSound, stopThemeBgm } from '../engine/soundEngine'
import { useGameStore } from '../store/useGameStore'

interface RecordsPageProps { onNavigate: (section: MainSection) => void }

export function RecordsPage({ onNavigate }: RecordsPageProps) {
  const progress = useGameStore((state) => state.progress)
  const collection = useGameStore((state) => state.collection)
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled)
  const markLetterRead = useGameStore((state) => state.markLetterRead)
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null)
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null)
  const achievements = getAchievements(progress, collection)
  const collectionRewards = getCollectionRewards(progress, collection)
  const unlockedRewards = collectionRewards.filter((reward) => reward.unlocked).length
  const unlocked = achievements.filter((item) => item.unlocked).length
  const characters = getAllCharacters()
  const recentMeetings = Object.entries(collection.lastMeetingByCharacterId)
    .sort(([, a], [, b]) => b.day - a.day)
    .slice(0, 4)
  const seasonalRecords = Object.values(collection.seasonalEventRecords).sort((a, b) => b.day - a.day)
  const availableLetters = museLetters.filter((letter) => collection.completedCharacterIds.includes(letter.characterId))
  const unreadLetters = availableLetters.filter((letter) => !collection.readLetterIds.includes(letter.id))
  const selectedLetter = availableLetters.find((letter) => letter.id === selectedLetterId) ?? null
  const completedThemes = characterThemeBgms.filter((theme) => collection.completedCharacterIds.includes(theme.characterId))
  const completedAfterEndingDates = collection.completedAfterEndingDateCharacterIds
    .map((characterId) => getAfterEndingDateScenario(characterId))
    .filter((scenario): scenario is NonNullable<ReturnType<typeof getAfterEndingDateScenario>> => Boolean(scenario))

  useEffect(() => () => stopThemeBgm(), [])
  useEffect(() => {
    if (!soundEnabled) {
      stopThemeBgm()
      setActiveThemeId(null)
    }
  }, [soundEnabled])

  const openLetter = (letter: MuseLetter) => {
    setSelectedLetterId(letter.id)
    if (!collection.readLetterIds.includes(letter.id)) markLetterRead(letter.id)
    playUiSound('message', soundEnabled)
  }

  const toggleTheme = (characterId: string) => {
    const theme = getCharacterThemeBgm(characterId)
    if (!theme || !soundEnabled) return
    if (activeThemeId === characterId) {
      stopThemeBgm()
      setActiveThemeId(null)
      return
    }
    playThemeBgm(theme, soundEnabled)
    setActiveThemeId(characterId)
  }

  return (
    <div className="page records-page">
      <header className="diary-page-header">
        <div><p className="eyebrow">WORK DIARY · RECORDS</p><h1>기록</h1></div>
        <div className="diary-counter"><strong>{unlocked}</strong><span>/ {achievements.length}</span></div>
      </header>

      <section className="records-summary">
        <div><span>발견</span><strong>{collection.discoveredCharacterIds.length} / 12</strong></div>
        <div><span>완료</span><strong>{collection.completedCharacterIds.length} / 12</strong></div>
        <div><span>DAY</span><strong>{String(progress.day).padStart(2, '0')}</strong></div>
      </section>

      <section className="collection-reward-section" aria-label="컬렉션 보상">
        <div className="diary-section-title collection-reward-heading">
          <div>
            <p className="eyebrow">COLLECTION REWARDS</p>
            <h2>기록이 쌓이면 열리는 것들</h2>
          </div>
          <strong>{unlockedRewards} / {collectionRewards.length}</strong>
        </div>
        <p className="collection-reward-note">선물이나 재화가 아니라, 작업실과 기록장을 채우는 작은 표식입니다.</p>
        <div className="collection-reward-list">
          {collectionRewards.map((item) => {
            const progressPercent = Math.round((item.current / item.goal) * 100)
            return (
              <article key={item.id} className={`collection-reward-card${item.unlocked ? ' is-unlocked' : ''}`}>
                <span className="collection-reward-mark">{item.unlocked ? '✦' : '·'}</span>
                <div className="collection-reward-copy">
                  <div className="collection-reward-title-row">
                    <strong>{item.title}</strong>
                    <small>{item.current} / {item.goal}</small>
                  </div>
                  <p>{item.description}</p>
                  <div className="collection-reward-track" aria-label={`${item.title} ${item.current} / ${item.goal}`}>
                    <i style={{ width: `${progressPercent}%` }} />
                  </div>
                  <span className="collection-reward-label">{item.rewardLabel}</span>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="letter-section" aria-label="편지함">
        <div className="diary-section-title letter-section-heading">
          <div><p className="eyebrow">LETTER BOX</p><h2>엔딩 뒤에 도착한 편지</h2></div>
          <strong>{unreadLetters.length ? `${unreadLetters.length} NEW` : `${availableLetters.length} / ${museLetters.length}`}</strong>
        </div>
        <p className="letter-section-note">한 사람의 이야기를 끝까지 읽으면, 작업실 우편함에 그 사람의 편지가 도착합니다.</p>
        {availableLetters.length ? (
          <>
            <div className="letter-list">
              {availableLetters.map((letter) => {
                const sender = characters.find((character) => character.id === letter.characterId)
                const isRead = collection.readLetterIds.includes(letter.id)
                return (
                  <button type="button" key={letter.id} className={`letter-card${isRead ? ' is-read' : ' is-new'}${selectedLetterId === letter.id ? ' is-selected' : ''}`} onClick={() => openLetter(letter)}>
                    <span className="letter-card-mark">{isRead ? '✉' : '•'}</span>
                    <span><small>{letter.envelope} · {sender?.name ?? 'UNKNOWN MUSE'}</small><strong>{letter.title}</strong></span>
                    {!isRead && <em>NEW</em>}
                  </button>
                )
              })}
            </div>
            {selectedLetter && (
              <article className="letter-reader" aria-live="polite">
                <div className="letter-reader-meta"><span>{selectedLetter.envelope}</span><b>TO THE WORKROOM</b></div>
                <h3>{selectedLetter.title}</h3>
                {selectedLetter.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                <strong className="letter-postscript">{selectedLetter.postscript}</strong>
              </article>
            )}
          </>
        ) : (
          <div className="letter-empty"><span>EMPTY MAILBOX</span><p>엔딩을 완성하면 누군가의 첫 편지가 도착합니다.</p></div>
        )}
      </section>

      <section className="theme-bgm-section" aria-label="캐릭터별 테마 BGM">
        <div className="diary-section-title theme-bgm-heading">
          <div><p className="eyebrow">MUSE THEME BGM</p><h2>그 사람의 멜로디</h2></div>
          <strong>{completedThemes.length} / {characterThemeBgms.length}</strong>
        </div>
        <p className="theme-bgm-note">엔딩을 본 캐릭터의 테마를 미리 듣습니다. 현재는 외부 음원 없이 캐릭터별 모티프를 합성해 재생합니다.</p>
        {completedThemes.length ? (
          <div className="theme-bgm-list">
            {completedThemes.map((theme) => {
              const character = characters.find((item) => item.id === theme.characterId)
              const isPlaying = activeThemeId === theme.characterId
              return (
                <article key={theme.characterId} className={`theme-bgm-card${isPlaying ? ' is-playing' : ''}`}>
                  <CharacterPortrait characterId={theme.characterId} name={character?.name ?? 'UNKNOWN MUSE'} symbol={character?.symbol ?? 'bookmark'} expression="main" className="theme-bgm-portrait" alt={`${character?.name ?? '캐릭터'} 테마 portrait`} />
                  <div><span>{theme.title} · {theme.bpm} BPM</span><strong>{character?.name ?? 'UNKNOWN MUSE'}</strong><small>{theme.mood}</small></div>
                  <button type="button" onClick={() => toggleTheme(theme.characterId)} disabled={!soundEnabled}>{isPlaying ? 'STOP' : 'PLAY'}</button>
                </article>
              )
            })}
          </div>
        ) : <div className="theme-bgm-empty"><span>LOCKED TRACKS</span><p>캐릭터 엔딩을 완성하면 테마가 하나씩 열립니다.</p></div>}
      </section>

      <section className="achievement-section">
        <div className="diary-section-title"><p className="eyebrow">ACHIEVEMENTS</p><h2>작은 기록들</h2></div>
        <div className="achievement-list">
          {achievements.map((achievement) => {
            const concealed = achievement.hidden && !achievement.unlocked
            return (
              <article key={achievement.id} className={`achievement-card${achievement.unlocked ? ' is-unlocked' : ''}`}>
                <span className="achievement-stamp">{achievement.unlocked ? '✓' : '?'}</span>
                <div>
                  <strong>{concealed ? '숨겨진 기록' : achievement.title}</strong>
                  <p>{concealed ? '아직 조건을 알 수 없다.' : achievement.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {seasonalRecords.length > 0 && (
        <section className="seasonal-record-section">
          <div className="diary-section-title"><p className="eyebrow">SEASONAL MEMORIES</p><h2>계절의 기억</h2></div>
          <div className="seasonal-record-list">
            {seasonalRecords.map((record) => {
              const companion = characters.find((character) => character.id === record.companionId)
              const season = record.season ?? (record.eventId === 'summer-fireworks-night' ? 'SUMMER' : 'SPRING')
              const seasonMark = season === 'SUMMER' ? '✦' : season === 'AUTUMN' ? '❧' : season === 'WINTER' ? '❄' : '✿'
              return (
                <article key={record.eventId} className={`seasonal-record-card season-${season.toLowerCase()}`}>
                  <span className="seasonal-record-mark">{seasonMark}</span>
                  <div><small>DAY {String(record.day).padStart(2, '0')} · {season}</small><strong>{record.title} · {companion?.name ?? 'UNKNOWN MUSE'}</strong><p>{record.souvenirNote}</p></div>
                  <em>{record.souvenir}</em>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {completedAfterEndingDates.length > 0 && (
        <section className="text-memory-section" aria-label="텍스트 기억 보관함">
          <div className="diary-section-title"><p className="eyebrow">TEXT MEMORY ARCHIVE</p><h2>엔딩 뒤에 남은 장면</h2></div>
          <p className="text-memory-note">새 일러스트 대신, 다시 꺼내 읽을 수 있는 짧은 후일담으로 보관됩니다.</p>
          <div className="text-memory-list">
            {completedAfterEndingDates.map((scenario) => {
              const character = characters.find((item) => item.id === scenario.characterId)
              return <article key={scenario.characterId} className="text-memory-card"><span>{character?.symbol ?? '✦'}</span><div><small>{character?.name ?? 'UNKNOWN MUSE'} · {scenario.placeName}</small><strong>{scenario.memoryTitle}</strong><p>{scenario.memoryLine}</p></div></article>
            })}
          </div>
        </section>
      )}

      <section className="recent-record-section">
        <div className="diary-section-title"><p className="eyebrow">RECENT PAGES</p><h2>최근의 만남</h2></div>
        {recentMeetings.length ? <div className="recent-record-list">{recentMeetings.map(([characterId, meeting]) => {
          const character = characters.find((item) => item.id === characterId)
          return <article key={characterId}><span>DAY {String(meeting.day).padStart(2, '0')}</span><div><strong>{character?.name ?? 'UNKNOWN MUSE'}</strong><p>{meeting.title}</p></div><small>{getPlace(meeting.placeId)?.name ?? 'UNKNOWN PLACE'}</small></article>
        })}</div> : <div className="recent-record-empty"><span>BLANK PAGE</span><p>첫 번째 만남이 이곳에 기록됩니다.</p></div>}
      </section>
      <BottomNav active="records" onNavigate={onNavigate} />
    </div>
  )
}
