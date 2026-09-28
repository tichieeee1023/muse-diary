import { useMemo, useState } from 'react'
import { BottomNav, type MainSection } from '../components/BottomNav'
import { HeartMeter, HeartRow } from '../components/HeartMeter'
import { CharacterIcon } from '../components/CharacterIcon'
import { CharacterPortrait } from '../components/CharacterPortrait'
import { CollectionArt } from '../components/CollectionArt'
import { getAllCharacters } from '../engine/encounterEngine'
import { getCharacterRouteProfile } from '../data/characters'
import { getStoryProgress } from '../engine/storyEngine'
import { getEndingContent } from '../engine/endingEngine'
import { formatGameText } from '../engine/textFormatter'
import {
  getRelationshipLabel,
  getUnlockedFactCount,
  hasReachedFirstCompletion,
  isFactUnlocked,
} from '../engine/diaryEngine'
import { useGameStore } from '../store/useGameStore'

interface CharacterDiaryPageProps {
  onNavigate: (section: MainSection) => void
}

const CURRENT_ROSTER = 12

export function CharacterDiaryPage({ onNavigate }: CharacterDiaryPageProps) {
  const collection = useGameStore((state) => state.collection)
  const player = useGameStore((state) => state.player)
  const markSecretRead = useGameStore((state) => state.markSecretRead)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [readingSecret, setReadingSecret] = useState(false)
  const characters = useMemo(() => getAllCharacters(), [])
  const discovered = new Set(collection.discoveredCharacterIds)
  const secondRunHints = hasReachedFirstCompletion(collection)
  const selected = selectedId ? characters.find((character) => character.id === selectedId) ?? null : null
  const completedCount = collection.completedCharacterIds.length
  const discoveredCount = collection.discoveredCharacterIds.length
  const unknownCount = Math.max(0, CURRENT_ROSTER - discoveredCount)

  if (selected) {
    const affection = collection.affectionByCharacterId[selected.id] ?? 0
    const encounters = collection.encounterCounts[selected.id] ?? 0
    const unlockedCount = getUnlockedFactCount(selected, collection)
    const isCompleted = collection.completedCharacterIds.includes(selected.id)
    const secretRead = collection.secretReadCharacterIds.includes(selected.id)
    const ending = getEndingContent(selected.id)
    const routeProfile = getCharacterRouteProfile(selected.id)
    const routeProgress = getStoryProgress(selected.id, collection)

    if (readingSecret && isCompleted && ending) {
      return (
        <div className="page secret-story-page">
          <header className="diary-detail-header">
            <button type="button" className="back-button" onClick={() => { markSecretRead(selected.id); setReadingSecret(false) }} aria-label="비설을 닫고 돌아가기">←</button>
            <div><p className="eyebrow">SECRET STORY</p><strong>{selected.name}</strong></div>
          </header>
          <figure className="ending-banner ending-banner-secret">
            <img src="/assets/backgrounds/ending/main.webp" alt="밤의 작업실 책상과 펼쳐진 스케치북" />
          </figure>
          <article className="secret-story-sheet">
            <p className="eyebrow">AFTER COMPLETION</p>
            <h1>{ending.secretTitle}</h1>
            <div className="ending-rule" />
            {ending.secretParagraphs.map((paragraph) => <p key={paragraph}>{formatGameText(paragraph, player?.name ?? '')}</p>)}
          </article>
          <button type="button" className="primary-button full-button" onClick={() => { markSecretRead(selected.id); setReadingSecret(false) }}>읽기를 마치고 다이어리로</button>
        </div>
      )
    }

    return (
      <div className="page diary-page diary-detail-page">
        <header className="diary-detail-header">
          <button type="button" className="back-button" onClick={() => setSelectedId(null)} aria-label="인물 기록으로 돌아가기">←</button>
          <div>
            <p className="eyebrow">MUSE FILE</p>
            <strong>{selected.rarity} · {getRelationshipLabel(affection)}</strong>
          </div>
        </header>

        <section className="diary-profile-sheet">
          <CharacterPortrait characterId={selected.id} name={selected.name} symbol={selected.symbol} expression={affection >= 80 ? 'smile' : affection >= 40 ? 'hmm' : 'main'} className="diary-main-portrait" />
          <div className="diary-profile-top">
            <div className="diary-profile-identity">
              <span className="character-mark character-mark-large"><CharacterIcon symbol={selected.symbol} size={30} /></span>
              <div>
                <span className={`rarity-badge rarity-badge-${selected.rarity.toLowerCase()}`}>{selected.rarity}</span>
                <h1>{selected.name}</h1>
                <p>{selected.ageLabel} · {selected.occupation}</p>
              </div>
            </div>
            <span className={`diary-stamp${isCompleted ? ' is-complete' : ''}`}>{isCompleted ? 'COMPLETE' : 'RECORDED'}</span>
          </div>

          <p className="diary-impression">{selected.firstImpression}</p>

          <div className="diary-heart-block">
            <div>
              <span>RELATIONSHIP</span>
              <strong>{getRelationshipLabel(affection)}</strong>
            </div>
            <HeartMeter value={affection} />
          </div>

          <dl className="diary-stats">
            <div><dt>조우</dt><dd>{encounters}회</dd></div>
            <div><dt>정보</dt><dd>{unlockedCount} / {selected.diaryFacts.length}</dd></div>
            <div><dt>호감도</dt><dd>{affection} / 100</dd></div>
            <div><dt>공략</dt><dd>{routeProgress.completed} / {routeProgress.total}</dd></div>
          </dl>
        </section>

        <section className="route-progress-card">
          <div>
            <span>ROUTE PROGRESS</span>
            <strong>{routeProgress.completed} / {routeProgress.total} 중요 이벤트</strong>
          </div>
          <div className="route-progress-track" aria-label={`공략 이벤트 ${routeProgress.completed} / ${routeProgress.total}`}>
            {Array.from({ length: routeProgress.total }, (_, index) => <i key={index} className={index < routeProgress.completed ? 'is-on' : ''} />)}
          </div>
          {!isCompleted && <p>자잘한 만남으로 호감도를 쌓으면 다음 중요 이벤트가 열립니다. 다음 기준: {routeProgress.nextThreshold}</p>}
        </section>

        <section className="diary-facts-section">
          <div className="diary-section-title">
            <p className="eyebrow">WHAT I KNOW</p>
            <h2>알게 된 것</h2>
          </div>
          <div className="diary-fact-list">
            {selected.diaryFacts.map((fact) => {
              const unlocked = isFactUnlocked(fact, selected.id, collection)
              return (
                <article key={fact.id} className={`diary-fact${unlocked ? ' is-unlocked' : ' is-locked'}`}>
                  <span>{unlocked ? fact.label : '???'}</span>
                  <p>{unlocked ? fact.value : '조금 더 만나보면 알 수 있을 것 같다.'}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="visual-archive-section">
          <div className="diary-section-title">
            <p className="eyebrow">VISUAL ARCHIVE</p>
            <h2>일러스트 기록</h2>
          </div>
          <div className="visual-archive-grid">
            <CharacterPortrait characterId={selected.id} name={selected.name} symbol={selected.symbol} expression="main" className="archive-portrait" />
            <CharacterPortrait characterId={selected.id} name={selected.name} symbol={selected.symbol} expression="smile" className="archive-portrait" />
            <CharacterPortrait characterId={selected.id} name={selected.name} symbol={selected.symbol} expression="troubled" className="archive-portrait" />
            <CharacterPortrait characterId={selected.id} name={selected.name} symbol={selected.symbol} expression="hmm" className="archive-portrait" />
          </div>
          <div className="ending-gallery-card">
            {isCompleted && routeProfile ? <CollectionArt src={routeProfile.visuals.endingCg} alt={`${selected.name} 엔딩 풀 일러스트`} label="ENDING CG" symbol={selected.symbol} className="ending-gallery-art" /> : <div className="gallery-locked"><strong>ENDING CG</strong><span>공략 완료 후 해금</span></div>}
          </div>
        </section>

        {isCompleted && ending && (
          <section className="secret-unlock-card">
            <span>SECRET STORY</span>
            <strong>{ending.secretTitle}</strong>
            <p>공략 완료 후에만 열리는, 그의 시점에서 이어지는 짧은 이야기.</p>
            <button type="button" className="secondary-button full-button" onClick={() => setReadingSecret(true)}>
              {secretRead ? '비설 다시 읽기' : '비설 읽기'}
            </button>
          </section>
        )}

        {secretRead && ending ? (
          <section className="muse-sketch-unlocked">
            <div className="sketch-sticker">MUSE</div>
            <span>MUSE DOLL · UNLOCKED</span>
            {routeProfile && <CollectionArt src={routeProfile.visuals.endingDoll} alt={`${selected.name}에게서 영감받은 엔딩 인형`} label="MUSE DOLL" symbol={selected.symbol} className="muse-doll-art" />}
            <strong>{ending.museSketchTitle}</strong>
            <p>{ending.museSketchNote}</p>
          </section>
        ) : (
          <section className="muse-sketch-locked">
            <span>MUSE SKETCH</span>
            <strong>{isCompleted ? '비설을 읽으면 완성되는 영감' : '아직 완성되지 않은 영감'}</strong>
            <p>{isCompleted ? '그의 숨겨진 이야기를 읽은 뒤 스케치가 완성됩니다.' : '그의 이야기를 끝까지 알게 되면 이 페이지에 새로운 기록이 남습니다.'}</p>
          </section>
        )}

        <BottomNav active="characters" onNavigate={onNavigate} />
      </div>
    )
  }

  return (
    <div className="page diary-page">
      <header className="diary-page-header">
        <div>
          <p className="eyebrow">WORK DIARY · MUSES</p>
          <h1>인물 기록</h1>
        </div>
        <div className="diary-counter">
          <strong>{collection.discoveredCharacterIds.length}</strong>
          <span>/ {CURRENT_ROSTER}</span>
        </div>
      </header>

      <section className="diary-intro-note">
        <p>작업을 위해 돌아다니며 만난 사람들. 이상하게 기억에 남는 얼굴부터 적어두었다.</p>
        <small>공략 가능한 인물 {CURRENT_ROSTER}명 · 이 12명의 이야기를 끝까지 완성하는 것이 목표</small>
        <div className="diary-summary" aria-label="수집 진행률">
          <span><b>{discoveredCount}</b> 발견</span>
          <span><b>{completedCount}</b> 완료</span>
          <span><b>{unknownCount}</b> 미발견</span>
        </div>
      </section>

      {secondRunHints && (
        <div className="second-run-note">
          <span>NEW NOTES</span>
          <strong>완성된 인연이 생겼다. 미발견 인물에 작은 단서가 보이기 시작한다.</strong>
        </div>
      )}

      <div className="diary-grid">
        {characters.map((character, index) => {
          const isDiscovered = discovered.has(character.id)
          const affection = collection.affectionByCharacterId[character.id] ?? 0
          const encounters = collection.encounterCounts[character.id] ?? 0

          if (!isDiscovered) {
            return (
              <article key={character.id} className="diary-card is-unknown">
                <div className="diary-card-index">{String(index + 1).padStart(2, '0')}</div>
                <div className="unknown-mark">?</div>
                <strong>???</strong>
                <p>{secondRunHints ? character.secondRunHint : '아직 만나지 못한 인물'}</p>
              </article>
            )
          }

          return (
            <button key={character.id} type="button" className="diary-card is-known" onClick={() => setSelectedId(character.id)}>
              <div className="diary-card-topline">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span className={`mini-rarity rarity-${character.rarity.toLowerCase()}`}>{character.rarity}</span>
              </div>
              <CharacterPortrait
                characterId={character.id}
                name={character.name}
                symbol={character.symbol}
                expression={affection >= 80 ? 'smile' : affection >= 55 ? 'troubled' : affection >= 30 ? 'hmm' : 'main'}
                className="diary-card-portrait"
              />
              <div className="diary-card-identity">
                <span className="character-mark"><CharacterIcon symbol={character.symbol} size={22} /></span>
                <div>
                  <strong>{character.name}</strong>
                  <p>{character.ageLabel} · {character.occupation}</p>
                </div>
              </div>
              <div className="diary-card-progress">
                <span className="relationship-chip">{getRelationshipLabel(affection)}</span>
                <HeartRow value={affection} compact />
              </div>
              <div className="diary-card-meta">
                <span>만남 기록</span>
                <span>{encounters}회</span>
              </div>
              {collection.completedCharacterIds.includes(character.id) && <span className="card-complete-sticker">COMPLETE</span>}
            </button>
          )
        })}
      </div>

      <BottomNav active="characters" onNavigate={onNavigate} />
    </div>
  )
}
