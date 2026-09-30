export interface CharacterThemeBgm {
  characterId: string
  title: string
  mood: string
  bpm: number
  waveform: OscillatorType
  notes: number[]
}

// 외부 음원 없이 Web Audio로 반복 재생하는 짧은 캐릭터 테마 모티프입니다.
// 나중에 실제 음원을 붙일 때도 이 목록을 교체 지점으로 사용할 수 있습니다.
export const characterThemeBgms: CharacterThemeBgm[] = [
  { characterId: 'char_001', title: 'Between Pages', mood: '조용한 책장과 늦은 오후', bpm: 72, waveform: 'sine', notes: [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23] },
  { characterId: 'char_002', title: 'Open Schedule', mood: '정돈된 리듬 속의 작은 변수', bpm: 92, waveform: 'triangle', notes: [293.66, 369.99, 440, 554.37, 440, 369.99, 329.63, 293.66] },
  { characterId: 'char_003', title: 'Last Train Home', mood: '막차 전의 따뜻한 불빛', bpm: 78, waveform: 'sine', notes: [220, 261.63, 293.66, 349.23, 293.66, 261.63, 246.94, 220] },
  { characterId: 'char_004', title: 'Soft Recipe', mood: '달콤함보다 오래 남는 온기', bpm: 84, waveform: 'triangle', notes: [329.63, 392, 493.88, 523.25, 493.88, 392, 349.23, 329.63] },
  { characterId: 'char_005', title: 'Window Plant', mood: '말없이 곁을 지키는 밤', bpm: 66, waveform: 'sine', notes: [196, 246.94, 293.66, 246.94, 220, 277.18, 329.63, 277.18] },
  { characterId: 'char_006', title: 'Tide Between Us', mood: '물결처럼 천천히 가까워지는 마음', bpm: 74, waveform: 'sine', notes: [246.94, 293.66, 369.99, 440, 369.99, 329.63, 293.66, 246.94] },
  { characterId: 'char_007', title: 'After School', mood: '서툴지만 먼저 다가오는 오후', bpm: 108, waveform: 'triangle', notes: [392, 493.88, 587.33, 659.25, 587.33, 493.88, 440, 392] },
  { characterId: 'char_008', title: 'First Sketch', mood: '아직 비어 있는 종이 위의 빛', bpm: 88, waveform: 'sine', notes: [349.23, 440, 523.25, 659.25, 523.25, 440, 493.88, 523.25] },
  { characterId: 'char_009', title: 'Tea Before Answer', mood: '대답보다 먼저 식어가는 차', bpm: 70, waveform: 'sine', notes: [261.63, 311.13, 369.99, 415.3, 369.99, 311.13, 293.66, 261.63] },
  { characterId: 'char_010', title: 'Two Puddings', mood: '단단한 마음 안쪽의 다정함', bpm: 82, waveform: 'triangle', notes: [220, 277.18, 329.63, 415.3, 329.63, 277.18, 246.94, 220] },
  { characterId: 'char_011', title: 'No Applause', mood: '박수 없이도 이어지는 장면', bpm: 96, waveform: 'sine', notes: [293.66, 349.23, 440, 523.25, 440, 349.23, 392, 349.23] },
  { characterId: 'char_012', title: 'Same Hour', mood: '멈추지 않고 함께 걷는 시간', bpm: 76, waveform: 'triangle', notes: [246.94, 329.63, 392, 493.88, 392, 329.63, 293.66, 246.94] },
]

export function getCharacterThemeBgm(characterId: string) {
  return characterThemeBgms.find((theme) => theme.characterId === characterId) ?? null
}
