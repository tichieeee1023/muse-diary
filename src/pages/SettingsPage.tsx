import { useMemo } from 'react'
import { BottomNav, type MainSection } from '../components/BottomNav'
import { getAllCharacters } from '../engine/encounterEngine'
import { playUiSound } from '../engine/soundEngine'
import { useGameStore } from '../store/useGameStore'
import type { FontFamilySetting, TextSizeSetting, TextSpeedSetting } from '../types/game'

interface SettingsPageProps { onNavigate: (section: MainSection) => void }

const fontOptions: { id: FontFamilySetting; label: string; note: string; sample: string }[] = [
  { id: 'clear', label: '또렷한 고딕', note: '본문 읽기에 가장 선명한 기본값', sample: '오늘도 누군가를 만나러 나가볼까.' },
  { id: 'pretendard', label: '프리텐다드 계열', note: '단정하고 현대적인 UI 느낌', sample: '오늘도 누군가를 만나러 나가볼까.' },
  { id: 'system', label: '기기 기본 고딕', note: '내 기기에서 가장 안정적으로 표시', sample: '오늘도 누군가를 만나러 나가볼까.' },
]

const speedOptions: { id: TextSpeedSetting; label: string; note: string }[] = [
  { id: 'instant', label: '즉시', note: '애니메이션 없이 바로 표시' },
  { id: 'normal', label: '보통', note: '짧고 자연스럽게 나타남' },
  { id: 'slow', label: '천천히', note: '장면의 호흡을 길게' },
]

const sizeOptions: { id: TextSizeSetting; label: string; note: string }[] = [
  { id: 'normal', label: '보통', note: '공간을 조금 더 넉넉하게 봅니다.' },
  { id: 'medium', label: '중간', note: '기본값 · 읽기 편하게 한 단계 크게' },
  { id: 'large', label: '크게', note: '스토리 본문과 선택지를 확실히 크게' },
]

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const player = useGameStore((state) => state.player)
  const progress = useGameStore((state) => state.progress)
  const collection = useGameStore((state) => state.collection)
  const settings = useGameStore((state) => state.settings)
  const toggleSound = useGameStore((state) => state.toggleSound)
  const setFontFamily = useGameStore((state) => state.setFontFamily)
  const setTextSize = useGameStore((state) => state.setTextSize)
  const setTextSpeed = useGameStore((state) => state.setTextSpeed)
  const nextDay = useGameStore((state) => state.nextDay)
  const resetCollectionOnly = useGameStore((state) => state.resetCollectionOnly)
  const restartGame = useGameStore((state) => state.restartGame)
  const resetCharacter = useGameStore((state) => state.resetCharacter)
  const characterMap = useMemo(() => new Map(getAllCharacters().map((character) => [character.id, character])), [])

  return (
    <div className="page settings-page">
      <header className="diary-page-header"><div><p className="eyebrow">SETTINGS</p><h1>설정</h1></div></header>

      <section className="settings-group reading-settings-group">
        <div className="setting-copy">
          <span>READING</span>
          <strong>읽기 설정</strong>
          <p>텍스트가 주인공인 게임이라, 눈에 편한 조합으로 바로 바꿀 수 있게 했습니다.</p>
        </div>

        <div className="setting-subgroup">
          <div className="setting-subhead"><strong>폰트</strong><small>변경 즉시 전체 화면에 적용됩니다.</small></div>
          <div className="font-option-list" role="radiogroup" aria-label="폰트 선택">
            {fontOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`reading-option font-option font-option-${option.id}${settings.fontFamily === option.id ? ' is-selected' : ''}`}
                onClick={() => setFontFamily(option.id)}
                role="radio"
                aria-checked={settings.fontFamily === option.id}
              >
                <span className="reading-option-copy"><strong>{option.label}</strong><small>{option.note}</small></span>
                <em>{option.sample}</em>
              </button>
            ))}
          </div>
        </div>

        <div className="setting-subgroup">
          <div className="setting-subhead"><strong>글씨 크기</strong><small>스토리 본문·대사·선택지를 함께 키웁니다.</small></div>
          <div className="size-option-grid" role="radiogroup" aria-label="글씨 크기 선택">
            {sizeOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`reading-option size-option size-option-${option.id}${settings.textSize === option.id ? ' is-selected' : ''}`}
                onClick={() => setTextSize(option.id)}
                role="radio"
                aria-checked={settings.textSize === option.id}
              >
                <strong>{option.label}</strong>
                <small>{option.note}</small>
              </button>
            ))}
          </div>

        <div className="setting-subgroup">
          <div className="setting-subhead"><strong>텍스트 표시 속도</strong><small>스토리 문장이 나타나는 호흡을 조절합니다.</small></div>
          <div className="size-option-grid" role="radiogroup" aria-label="텍스트 표시 속도">
            {speedOptions.map((option) => (
              <button key={option.id} type="button" className={`reading-option size-option${settings.textSpeed === option.id ? ' is-selected' : ''}`} onClick={() => setTextSpeed(option.id)} role="radio" aria-checked={settings.textSpeed === option.id}>
                <strong>{option.label}</strong><small>{option.note}</small>
              </button>
            ))}
          </div>
        </div>
          <div className="reading-preview" aria-label="읽기 설정 미리보기">
            <span>미리보기</span>
            <p>그는 잠깐 시선을 내렸다가 다시 이쪽을 바라봤다.</p>
            <strong>“오늘은 조금 늦었네요.”</strong>
          </div>
        </div>
      </section>

      <section className="settings-group">
        <div className="setting-row">
          <div><strong>효과음</strong><p>선택지, 페이지, NEW 발견, 호감도 반응에 짧은 효과음을 사용합니다.</p></div>
          <button type="button" className={`toggle-button${settings.soundEnabled ? ' is-on' : ''}`} onClick={() => { toggleSound(); playUiSound('tap', !settings.soundEnabled) }} aria-pressed={settings.soundEnabled}>{settings.soundEnabled ? 'ON' : 'OFF'}</button>
        </div>
      </section>

      <section className="settings-group">
        <div className="setting-copy"><span>DAY CONTROL</span><strong>오늘을 건너뛰기</strong><p>현재 남은 외출 횟수와 오늘의 장소를 포기하고 다음 날로 넘어갑니다. 자주 사용하면 콘텐츠를 빠르게 소모할 수 있어요.</p></div>
        <button type="button" className="secondary-button full-button" onClick={() => { if (window.confirm('오늘을 건너뛰면 아직 만나지 못한 조우가 사라집니다. 다음 날로 넘어갈까요?')) nextDay() }}>DAY {progress.day + 1}로 넘기기</button>
      </section>

      <section className="settings-group danger-zone">
        <div className="setting-copy"><span>RESET ROUTES</span><strong>공략 기록만 초기화</strong><p>현재 DAY와 해금된 장소는 유지하고, 인물 발견·호감도·비설·엔딩·계절 동행 기록만 지웁니다.</p></div>
        <button type="button" className="danger-button full-button" onClick={() => { if (window.confirm('공략 기록만 초기화할까요? 현재 DAY와 장소 해금은 그대로 유지됩니다.')) resetCollectionOnly() }}>공략 기록만 지우기</button>
      </section>

      <section className="settings-group danger-zone new-game-reset-zone">
        <div className="setting-copy"><span>NEW GAME RESET</span><strong>처음부터 다시 시작</strong><p>DAY 1, 장소 해금, 방문 기록, 계절 이벤트, 인물 발견·호감도·엔딩을 모두 초기 상태로 되돌립니다. {player?.name ? `${player.name}의 이름` : '플레이어 이름'}과 읽기·효과음 설정은 유지됩니다.</p></div>
        <button type="button" className="danger-button full-button" onClick={() => { if (window.confirm('게임 진행을 DAY 1부터 완전히 다시 시작할까요? 이름과 설정만 남고 모든 진행 기록이 지워집니다. 이 작업은 되돌릴 수 없습니다.')) { restartGame(); onNavigate('outing') } }}>DAY 1부터 새로 시작</button>
      </section>

      {collection.discoveredCharacterIds.length > 0 && (
        <section className="settings-group">
          <div className="setting-copy"><span>CHARACTER RESET</span><strong>한 사람의 기록 지우기</strong><p>선택한 캐릭터는 다시 미발견 상태가 됩니다.</p></div>
          <div className="character-reset-list">
            {collection.discoveredCharacterIds.map((id) => {
              const character = characterMap.get(id)
              if (!character) return null
              return <button key={id} type="button" onClick={() => { if (window.confirm(`${character.name}의 발견·호감도·엔딩 기록을 모두 지울까요?`)) resetCharacter(id) }}><span>{character.name}</span><small>{character.rarity} · 기록 초기화</small></button>
            })}
          </div>
        </section>
      )}

      <BottomNav active="settings" onNavigate={onNavigate} />
    </div>
  )
}
