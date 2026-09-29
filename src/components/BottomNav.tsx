import { getAllCharacters } from '../engine/encounterEngine'
import { playUiSound } from '../engine/soundEngine'
import { isAffinityEventReady } from '../engine/storyEngine'
import { useGameStore } from '../store/useGameStore'

export type MainSection = 'outing' | 'characters' | 'room' | 'records' | 'settings'

interface BottomNavProps {
  active: MainSection
  onNavigate: (section: MainSection) => void
}

const items: Array<{ icon: string; label: string; section: MainSection }> = [
  { icon: '⌂', label: '외출', section: 'outing' },
  { icon: '♧', label: '인물', section: 'characters' },
  { icon: '▦', label: '마이룸', section: 'room' },
  { icon: '▤', label: '기록', section: 'records' },
  { icon: '⚙', label: '설정', section: 'settings' },
]

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  const collection = useGameStore((state) => state.collection)
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled)
  const hasCharacterUpdate = getAllCharacters().some((character) => collection.discoveredCharacterIds.includes(character.id) && isAffinityEventReady(character.id, collection))

  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          className={`nav-item${active === item.section ? ' is-active' : ''}`}
          aria-current={active === item.section ? 'page' : undefined}
          onClick={() => {
            if (active !== item.section) playUiSound('tap', soundEnabled)
            onNavigate(item.section)
          }}
        >
          <span className="nav-icon" aria-hidden="true">{item.icon}{item.section === 'characters' && hasCharacterUpdate && <i className="nav-update-dot" />}</span>
          <span>{item.label}</span>
          {item.section === 'characters' && hasCharacterUpdate && <span className="sr-only">새 호감도 이벤트가 있습니다</span>}
        </button>
      ))}
    </nav>
  )
}
