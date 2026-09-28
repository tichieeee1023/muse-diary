export type UiSound = 'tap' | 'page' | 'new' | 'heart'

let audioContext: AudioContext | null = null

function getContext() {
  if (typeof window === 'undefined' || !('AudioContext' in window || 'webkitAudioContext' in window)) return null
  const AudioContextClass = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextClass) return null
  audioContext ??= new AudioContextClass()
  return audioContext
}

const presets: Record<UiSound, { frequency: number; duration: number; gain: number }> = {
  tap: { frequency: 320, duration: 0.045, gain: 0.025 },
  page: { frequency: 240, duration: 0.07, gain: 0.02 },
  new: { frequency: 620, duration: 0.12, gain: 0.035 },
  heart: { frequency: 480, duration: 0.09, gain: 0.03 },
}

export function playUiSound(kind: UiSound, enabled = true) {
  if (!enabled) return
  try {
    const context = getContext()
    if (!context) return
    const preset = presets[kind]
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()
    const now = context.currentTime

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(preset.frequency, now)
    gainNode.gain.setValueAtTime(preset.gain, now)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + preset.duration)
    oscillator.connect(gainNode)
    gainNode.connect(context.destination)
    oscillator.start(now)
    oscillator.stop(now + preset.duration)
  } catch {
    // 사운드 재생 실패는 게임 진행에 영향을 주지 않습니다.
  }
}
