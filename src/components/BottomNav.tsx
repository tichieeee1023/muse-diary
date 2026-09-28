export type MainSection = 'outing' | 'characters' | 'records' | 'settings'

interface BottomNavProps {
  active: MainSection
  onNavigate: (section: MainSection) => void
}

const items: Array<{ icon: string; label: string; section: MainSection }> = [
  { icon: '⌂', label: '외출', section: 'outing' },
  { icon: '♧', label: '인물', section: 'characters' },
  { icon: '▤', label: '기록', section: 'records' },
  { icon: '⚙', label: '설정', section: 'settings' },
]

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          className={`nav-item${active === item.section ? ' is-active' : ''}`}
          aria-current={active === item.section ? 'page' : undefined}
          onClick={() => onNavigate(item.section)}
        >
          <span className="nav-icon" aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
