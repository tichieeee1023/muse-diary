import type { PropsWithChildren } from 'react'
import { useGameStore } from '../store/useGameStore'

export function GameShell({ children }: PropsWithChildren) {
  const settings = useGameStore((state) => state.settings)

  return (
    <main className="app-stage">
      <section
        className="game-shell"
        aria-label="게임 화면"
        data-font={settings.fontFamily}
        data-text-size={settings.textSize}
        data-text-speed={settings.textSpeed}
      >
        {children}
      </section>
    </main>
  )
}
