import type { CharacterThemeBgm } from '../data/themeBgm'

export type UiSound =
  | 'tap'
  | 'select'
  | 'back'
  | 'close'
  | 'page'
  | 'map'
  | 'travel'
  | 'message'
  | 'new'
  | 'heart'
  | 'heartbeat'
  | 'heart-loss'
  | 'day'
  | 'unlock'
  | 'special'
  | 'complete'
  | 'rarity-r'
  | 'rarity-sr'
  | 'rarity-ssr'

let audioContext: AudioContext | null = null
let noiseBuffer: AudioBuffer | null = null
let themeTimer: number | null = null
let activeThemeId: string | null = null

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

function tone(
  context: AudioContext,
  frequency: number,
  duration: number,
  gain: number,
  offset = 0,
  type: OscillatorType = 'sine',
  endFrequency?: number,
) {
  const oscillator = context.createOscillator()
  const gainNode = context.createGain()
  const now = context.currentTime + offset

  oscillator.type = type
  oscillator.frequency.setValueAtTime(Math.max(20, frequency), now)
  if (endFrequency && endFrequency > 0) {
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration)
  }

  gainNode.gain.setValueAtTime(0.0001, now)
  gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), now + Math.min(0.008, duration * 0.2))
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration)

  oscillator.connect(gainNode)
  gainNode.connect(context.destination)
  oscillator.start(now)
  oscillator.stop(now + duration + 0.012)
}

function getNoiseBuffer(context: AudioContext) {
  if (noiseBuffer && noiseBuffer.sampleRate === context.sampleRate) return noiseBuffer
  const length = Math.max(1, Math.floor(context.sampleRate * 0.24))
  const buffer = context.createBuffer(1, length, context.sampleRate)
  const data = buffer.getChannelData(0)
  for (let index = 0; index < length; index += 1) {
    // 단순 백색 잡음을 짧은 종이/클릭 질감용으로만 사용합니다.
    data[index] = Math.random() * 2 - 1
  }
  noiseBuffer = buffer
  return buffer
}

function noiseBurst(
  context: AudioContext,
  duration: number,
  gain: number,
  filterType: BiquadFilterType,
  frequency: number,
  offset = 0,
) {
  const source = context.createBufferSource()
  const filter = context.createBiquadFilter()
  const gainNode = context.createGain()
  const now = context.currentTime + offset

  source.buffer = getNoiseBuffer(context)
  filter.type = filterType
  filter.frequency.setValueAtTime(frequency, now)
  filter.Q.setValueAtTime(0.75, now)
  gainNode.gain.setValueAtTime(0.0001, now)
  gainNode.gain.exponentialRampToValueAtTime(gain, now + 0.004)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration)

  source.connect(filter)
  filter.connect(gainNode)
  gainNode.connect(context.destination)
  source.start(now)
  source.stop(now + duration + 0.01)
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
    const variation = ((code + index) % 5) * 15
    const startFrequency = 610 + variation
    const duration = 0.03

    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(startFrequency, now)
    oscillator.frequency.exponentialRampToValueAtTime(startFrequency * 1.14, now + duration)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1750, now)
    filter.Q.setValueAtTime(0.65, now)

    gainNode.gain.setValueAtTime(0.0001, now)
    gainNode.gain.exponentialRampToValueAtTime(0.009, now + 0.004)
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

/**
 * MUSE DIARY의 전 UI 효과음. 외부 파일 없이 Web Audio API로 합성합니다.
 * 짧은 UI 효과음과 캐릭터 테마 멜로디를 분리해 장면의 리듬을 만듭니다.
 */
export function playUiSound(kind: UiSound, enabled = true) {
  if (!enabled) return

  try {
    const context = getContext()
    if (!context) return
    if (context.state === 'suspended') void context.resume()

    switch (kind) {
      case 'tap':
        tone(context, 390, 0.036, 0.016, 0, 'triangle', 315)
        noiseBurst(context, 0.018, 0.007, 'highpass', 2100)
        break

      case 'select':
        tone(context, 470, 0.05, 0.014, 0, 'triangle', 540)
        tone(context, 705, 0.055, 0.009, 0.045, 'sine')
        break

      case 'back':
        tone(context, 410, 0.075, 0.012, 0, 'triangle', 295)
        noiseBurst(context, 0.025, 0.004, 'highpass', 1600)
        break

      case 'close':
        tone(context, 330, 0.09, 0.012, 0, 'sine', 235)
        break

      case 'map':
        tone(context, 560, 0.045, 0.018, 0, 'triangle', 435)
        tone(context, 840, 0.022, 0.006, 0.012, 'sine')
        break

      case 'page':
        noiseBurst(context, 0.095, 0.011, 'bandpass', 1150)
        tone(context, 245, 0.075, 0.009, 0.018, 'sine', 190)
        break

      case 'travel':
        tone(context, 260, 0.09, 0.014, 0, 'triangle', 300)
        tone(context, 390, 0.1, 0.016, 0.055, 'sine', 455)
        noiseBurst(context, 0.055, 0.004, 'highpass', 1700, 0.01)
        break

      case 'message':
        tone(context, 660, 0.07, 0.014, 0, 'sine')
        tone(context, 880, 0.09, 0.013, 0.075, 'sine')
        break

      case 'heart':
        tone(context, 520, 0.08, 0.017, 0, 'sine', 565)
        tone(context, 660, 0.11, 0.018, 0.07, 'triangle', 710)
        break

      case 'heartbeat':
        tone(context, 118, 0.075, 0.024, 0, 'sine', 104)
        tone(context, 94, 0.09, 0.018, 0.105, 'sine', 82)
        break

      case 'heart-loss':
        tone(context, 250, 0.11, 0.012, 0, 'triangle', 170)
        noiseBurst(context, 0.04, 0.004, 'bandpass', 420)
        break

      case 'new':
        tone(context, 610, 0.09, 0.016, 0, 'sine')
        tone(context, 760, 0.1, 0.017, 0.07, 'sine')
        tone(context, 980, 0.14, 0.014, 0.14, 'triangle')
        break

      case 'day':
        noiseBurst(context, 0.12, 0.009, 'bandpass', 1050)
        tone(context, 285, 0.11, 0.012, 0.06, 'triangle', 335)
        tone(context, 430, 0.16, 0.016, 0.145, 'sine', 500)
        break

      case 'unlock':
        tone(context, 460, 0.08, 0.015, 0, 'triangle')
        tone(context, 620, 0.1, 0.017, 0.065, 'triangle')
        tone(context, 920, 0.16, 0.016, 0.135, 'sine')
        noiseBurst(context, 0.06, 0.004, 'highpass', 2600, 0.13)
        break

      case 'special':
        tone(context, 440, 0.12, 0.014, 0, 'sine')
        tone(context, 660, 0.14, 0.016, 0.085, 'triangle')
        tone(context, 880, 0.18, 0.014, 0.17, 'sine')
        tone(context, 1110, 0.2, 0.009, 0.245, 'sine')
        break

      case 'complete':
        tone(context, 392, 0.12, 0.015, 0, 'triangle')
        tone(context, 523, 0.14, 0.017, 0.075, 'triangle')
        tone(context, 659, 0.16, 0.018, 0.15, 'sine')
        tone(context, 784, 0.22, 0.016, 0.23, 'sine')
        noiseBurst(context, 0.075, 0.0045, 'highpass', 2900, 0.225)
        break

      case 'rarity-r':
        tone(context, 430, 0.11, 0.018, 0, 'triangle', 485)
        break

      case 'rarity-sr':
        tone(context, 520, 0.12, 0.018, 0, 'triangle', 620)
        tone(context, 780, 0.15, 0.017, 0.095, 'sine')
        break

      case 'rarity-ssr':
        tone(context, 560, 0.13, 0.018, 0, 'triangle', 690)
        tone(context, 760, 0.15, 0.018, 0.085, 'triangle', 930)
        tone(context, 1020, 0.18, 0.017, 0.17, 'sine')
        tone(context, 1320, 0.24, 0.011, 0.255, 'sine')
        noiseBurst(context, 0.09, 0.004, 'highpass', 3000, 0.24)
        break
    }
  } catch {
    // 사운드 재생 실패는 게임 진행에 영향을 주지 않습니다.
  }
}

export function stopThemeBgm() {
  if (themeTimer !== null && typeof window !== 'undefined') {
    window.clearInterval(themeTimer)
  }
  themeTimer = null
  activeThemeId = null
}

/**
 * 완성 루트에서 해금되는 짧은 캐릭터 테마를 반복 재생합니다.
 * 현재는 외부 음원 대신 캐릭터별 음계 모티프를 합성해 사용합니다.
 */
export function playThemeBgm(theme: CharacterThemeBgm, enabled = true) {
  if (!enabled) {
    stopThemeBgm()
    return
  }

  try {
    const context = getContext()
    if (!context || typeof window === 'undefined') return
    if (context.state === 'suspended') void context.resume()

    stopThemeBgm()
    activeThemeId = theme.characterId
    let noteIndex = 0
    const beatMs = 60000 / Math.max(40, theme.bpm)

    const playNote = () => {
      if (activeThemeId !== theme.characterId) return
      const frequency = theme.notes[noteIndex % theme.notes.length] ?? 440
      tone(context, frequency, (beatMs / 1000) * 0.72, 0.012, 0, theme.waveform)
      if (noteIndex % 4 === 0) {
        tone(context, frequency / 2, (beatMs / 1000) * 0.52, 0.004, 0, 'sine')
      }
      noteIndex += 1
    }

    playNote()
    themeTimer = window.setInterval(playNote, Math.max(180, beatMs))
  } catch {
    stopThemeBgm()
  }
}
