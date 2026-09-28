import { useState } from 'react'
import { GameShell } from './components/GameShell'
import type { MainSection } from './components/BottomNav'
import { CharacterDiaryPage } from './pages/CharacterDiaryPage'
import { AchievementToast } from './components/AchievementToast'
import { HomePage } from './pages/HomePage'
import { LocationPage } from './pages/LocationPage'
import { NameSetupPage } from './pages/NameSetupPage'
import { RecordsPage } from './pages/RecordsPage'
import { SettingsPage } from './pages/SettingsPage'
import { TitlePage } from './pages/TitlePage'
import { useGameStore } from './store/useGameStore'

export default function App() {
  const player = useGameStore((state) => state.player)
  const activePlaceId = useGameStore((state) => state.activePlaceId)
  const [section, setSection] = useState<MainSection>('outing')
  const [showTitle, setShowTitle] = useState(true)

  const navigate = (next: MainSection) => setSection(next)

  let content
  if (showTitle) content = <TitlePage onEnter={() => setShowTitle(false)} />
  else if (!player) content = <NameSetupPage />
  else if (activePlaceId) content = <LocationPage />
  else if (section === 'characters') content = <CharacterDiaryPage onNavigate={navigate} />
  else if (section === 'records') content = <RecordsPage onNavigate={navigate} />
  else if (section === 'settings') content = <SettingsPage onNavigate={navigate} />
  else content = <HomePage onNavigate={navigate} />

  return <GameShell>{content}<AchievementToast /></GameShell>
}
