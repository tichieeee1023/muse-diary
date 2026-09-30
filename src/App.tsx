import { useState } from 'react'
import { GameShell } from './components/GameShell'
import type { MainSection } from './components/BottomNav'
import { CharacterDiaryPage } from './pages/CharacterDiaryPage'
import { DatePage } from './pages/DatePage'
import { AfterEndingDatePage } from './pages/AfterEndingDatePage'
import { AchievementToast } from './components/AchievementToast'
import { HomePage } from './pages/HomePage'
import { LocationPage } from './pages/LocationPage'
import { MyRoomPage } from './pages/MyRoomPage'
import { NameSetupPage } from './pages/NameSetupPage'
import { RecordsPage } from './pages/RecordsPage'
import { SettingsPage } from './pages/SettingsPage'
import { SpringEventPage } from './pages/SpringEventPage'
import { SummerEventPage } from './pages/SummerEventPage'
import { AutumnEventPage } from './pages/AutumnEventPage'
import { WinterEventPage } from './pages/WinterEventPage'
import { TitlePage } from './pages/TitlePage'
import { useGameStore } from './store/useGameStore'

export default function App() {
  const player = useGameStore((state) => state.player)
  const activePlaceId = useGameStore((state) => state.activePlaceId)
  const consumeDateSession = useGameStore((state) => state.consumeDateSession)
  const [section, setSection] = useState<MainSection>('outing')
  const [showTitle, setShowTitle] = useState(true)
  const [seasonalEventId, setSeasonalEventId] = useState<string | null>(null)
  const [showDate, setShowDate] = useState(false)
  const [showAfterEndingDate, setShowAfterEndingDate] = useState(false)

  const navigate = (next: MainSection) => setSection(next)

  let content
  if (showTitle) content = <TitlePage onEnter={() => setShowTitle(false)} />
  else if (!player) content = <NameSetupPage />
  else if (showAfterEndingDate) content = <AfterEndingDatePage onClose={() => setShowAfterEndingDate(false)} />
  else if (showDate) content = <DatePage onClose={() => setShowDate(false)} onStartDateSession={consumeDateSession} />
  else if (seasonalEventId === 'spring-night-bloom') content = <SpringEventPage onClose={() => setSeasonalEventId(null)} />
  else if (seasonalEventId === 'summer-fireworks-night') content = <SummerEventPage onClose={() => setSeasonalEventId(null)} />
  else if (seasonalEventId === 'autumn-late-garden') content = <AutumnEventPage onClose={() => setSeasonalEventId(null)} />
  else if (seasonalEventId === 'winter-hinoki-lodge') content = <WinterEventPage onClose={() => setSeasonalEventId(null)} />
  else if (activePlaceId) content = <LocationPage />
  else if (section === 'characters') content = <CharacterDiaryPage onNavigate={navigate} />
  else if (section === 'room') content = <MyRoomPage onNavigate={navigate} onStartDate={() => setShowDate(true)} onStartAfterEndingDate={() => setShowAfterEndingDate(true)} />
  else if (section === 'records') content = <RecordsPage onNavigate={navigate} />
  else if (section === 'settings') content = <SettingsPage onNavigate={navigate} />
  else content = <HomePage onNavigate={navigate} onStartSeasonalEvent={(eventId) => setSeasonalEventId(eventId)} />

  return <GameShell>{content}<AchievementToast /></GameShell>
}
