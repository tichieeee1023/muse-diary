export type UiSound = 'tap' | 'page' | 'new' | 'heart' | 'rarity-r' | 'rarity-sr' | 'rarity-ssr'

let audioContext: AudioContext | null = null

function getContext() {
  if (typeof window === 'undefined' || !('AudioContext' in window || 'webkitAudioContext' in window)) return null
  const AudioContextClass = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextClass) return null
  audioContext ??= new AudioContextClass()
  return audioContext
}

export function unlockAudioContext() {
  try {
    const context = getContext()
    if (context?.state === 'suspended') void context.resume()
  } catch {
    // 브라우저가 Web Audio를 막아도 게임 진행에는 영향을 주지 않습니다.
  }
}

function isSilentTextCharacter(character: string) {
  return /\s/.test(character) || /[.,!?…·~—–―'"“”‘’()[\]{}:;]/.test(character)
}

/**
 * 짧은 레트로 비주얼노벨식 대사 블립. 외부 음원 파일을 사용하지 않고
 * Web Audio API oscillator만으로 생성합니다.
 */
export function playTextBlip(character: string, enabled = true, index = 0) {
  if (!enabled || !character || isSilentTextCharacter(character)) return

  try {
    const context = getContext()
    if (!context) return
    if (context.state === 'suspended') void context.resume()

    const oscillator = context.createOscillator()
    const gainNode = context.createGain()
    const filter = context.createBiquadFilter()
    const now = context.currentTime
    const code = character.codePointAt(0) ?? 0
    const variation = ((code + index) % 5) * 18
    const startFrequency = 640 + variation
    const duration = 0.032

    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(startFrequency, now)
    oscillator.frequency.exponentialRampToValueAtTime(startFrequency * 1.18, now + duration)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1900, now)
    filter.Q.setValueAtTime(0.7, now)

    gainNode.gain.setValueAtTime(0.0001, now)
    gainNode.gain.exponentialRampToValueAtTime(0.012, now + 0.004)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(context.destination)
    oscillator.start(now)
    oscillator.stop(now + duration + 0.008)
  } catch {
    // 사운드 재생 실패는 게임 진행에 영향을 주지 않습니다.
  }
}

const presets: Record<UiSound, { frequency: number; duration: number; gain: number }> = {
  tap: { frequency: 320, duration: 0.045, gain: 0.025 },
  page: { frequency: 240, duration: 0.07, gain: 0.02 },
  new: { frequency: 620, duration: 0.12, gain: 0.035 },
  heart: { frequency: 480, duration: 0.09, gain: 0.03 },
  'rarity-r': { frequency: 410, duration: 0.11, gain: 0.028 },
  'rarity-sr': { frequency: 520, duration: 0.17, gain: 0.032 },
  'rarity-ssr': { frequency: 660, duration: 0.25, gain: 0.04 },
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

    oscillator.type = kind === 'rarity-ssr' ? 'triangle' : 'sine'
    oscillator.frequency.setValueAtTime(preset.frequency, now)
    if (kind === 'rarity-sr') oscillator.frequency.exponentialRampToValueAtTime(preset.frequency * 1.35, now + preset.duration)
    if (kind === 'rarity-ssr') oscillator.frequency.exponentialRampToValueAtTime(preset.frequency * 1.52, now + preset.duration)
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
