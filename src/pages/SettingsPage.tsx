import { useMemo } from 'react'
import { BottomNav, type MainSection } from '../components/BottomNav'
import { getAllCharacters } from '../engine/encounterEngine'
import { playUiSound } from '../engine/soundEngine'
import { useGameStore } from '../store/useGameStore'
import type { FontFamilySetting, TextSizeSetting } from '../types/game'

interface SettingsPageProps { onNavigate: (section: MainSection) => void }

const fontOptions: { id: FontFamilySetting; label: string; note: string; sample: string }[] = [
  { id: 'clear', label: '또렷한 고딕', note: '본문 읽기에 가장 선명한 기본값', sample: '오늘도 누군가를 만나러 나가볼까.' },
  { id: 'pretendard', label: '프리텐다드 계열', note: '단정하고 현대적인 UI 느낌', sample: '오늘도 누군가를 만나러 나가볼까.' },
  { id: 'system', label: '기기 기본 고딕', note: '내 기기에서 가장 안정적으로 표시', sample: '오늘도 누군가를 만나러 나가볼까.' },
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
  const nextDay = useGameStore((state) => state.nextDay)
  const resetCollectionOnly = useGameStore((state) => state.resetCollectionOnly)
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
        <div className="setting-copy"><span>RESET</span><strong>수집 기록 전체 초기화</strong><p>{player?.name}의 이름과 현재 DAY, 장소 해금은 유지하고 인물 발견·호감도·비설·완료 기록만 지웁니다.</p></div>
        <button type="button" className="danger-button full-button" onClick={() => { if (window.confirm('인물 수집 기록을 전부 초기화할까요? 이 작업은 되돌릴 수 없습니다.')) resetCollectionOnly() }}>수집 기록 초기화</button>
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
