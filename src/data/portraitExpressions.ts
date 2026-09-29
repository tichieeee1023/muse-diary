import type { PortraitExpression, StoryEpisodeKind } from '../types/game'

export interface PortraitContext {
  text?: string
  kind?: StoryEpisodeKind
  threshold?: number
}

type SeasonalPhase = 'branch' | 'choice-result' | 'complete'
type SeasonalTier = 'early' | 'close' | 'deep'

const archiveMap: Record<string, Array<[PortraitExpression, string]>> = {
  char_001: [['shy','SHY SMILE'],['sulking','SULKING']],
  char_002: [['sly','SLY'],['shy','SHY']],
  char_003: [['sad','SAD'],['shy','SHY']],
  char_004: [['angry','ANGRY'],['shy','SHY']],
  char_005: [['faintSmile','FAINT SMILE'],['sly','SLY'],['shy','SHY']],
  char_006: [['genuineSmile','GENUINE SMILE'],['dim','DISTANT'],['eyesClosedSmile','EYES CLOSED'],['shy','SHY']],
  char_007: [['confident','CONFIDENT'],['desolate','DISTANT'],['love','IN LOVE'],['shy','SHY']],
  char_008: [['glasses','GLASSES'],['love','IN LOVE'],['loveSmile','LOVE SMILE'],['shy','SHY']],
  char_009: [['thinking','THINKING'],['serious','SERIOUS'],['angry','ANGRY'],['sorrowful','SORROWFUL'],['shy','SHY']],
  char_010: [['busted','CAUGHT'],['love','IN LOVE'],['shy','SHY']],
  char_011: [['interested','INTERESTED'],['exhausted','EXHAUSTED'],['sad','SAD'],['desolate','DISTANT'],['love','IN LOVE'],['loveShy','LOVE · SHY'],['deepLove','DEEPLY IN LOVE'],['shy','SHY']],
  char_012: [['blank','BLANK'],['desolate','DISTANT'],['sad','SAD'],['sorrowful','SORROWFUL'],['eyesClosedSad','EYES CLOSED'],['tearful','TEARFUL'],['shy','SHY'],['love','IN LOVE']],
}

export function getExtraExpressionArchive(characterId: string) {
  return archiveMap[characterId] ?? []
}

const sadWords = /슬프|상실|죽|잃|사라|과거|두려|미안|아프|울|눈물|기억을 잃|떠나|못 돌아|처연|괴로/
const shyWords = /붉|부끄|당황|가까|손을 잡|좋아|사랑|보고 싶|입맞|고백|데이트|연인|남자친구/
const angryWords = /화가|분노|화났|위험|안 됩니다|하지 마|멈춰|단호|짜증/
const surpriseWords = /들켰|놀라|갑자기|예상하지|당황/
const teasingWords = /장난|놀리|능글|비꼬|흥미롭|재미있/

function highRomance(kind?: StoryEpisodeKind, threshold?: number) {
  return kind === 'story' && (threshold ?? 0) >= 80
}

export function enrichStoryPortrait(
  characterId: string,
  requested: PortraitExpression,
  context: PortraitContext = {},
): PortraitExpression {
  // 이미 세부 표정이 지정되어 있으면 그대로 존중한다.
  if (!['main','smile','troubled','hmm'].includes(requested)) return requested

  const text = context.text ?? ''
  const romantic = highRomance(context.kind, context.threshold)

  switch (characterId) {
    case 'char_001':
      if (requested === 'troubled' && /서운|질투|삐/.test(text)) return 'sulking'
      if (romantic && (requested === 'smile' || (requested === 'troubled' && shyWords.test(text)))) return 'shy'
      break
    case 'char_002':
      if (romantic && shyWords.test(text)) return 'shy'
      if (requested === 'smile' || teasingWords.test(text)) return 'sly'
      break
    case 'char_003':
      if (sadWords.test(text)) return 'sad'
      if (romantic && (requested === 'smile' || shyWords.test(text))) return 'shy'
      break
    case 'char_004':
      if (angryWords.test(text)) return 'angry'
      if (romantic && (requested === 'smile' || shyWords.test(text))) return 'shy'
      break
    case 'char_005':
      if (romantic && shyWords.test(text)) return 'shy'
      if (teasingWords.test(text)) return 'sly'
      if (requested === 'smile') return 'faintSmile'
      break
    case 'char_006':
      if (sadWords.test(text)) return 'dim'
      if (requested === 'smile' && /눈을 감|활짝|웃었|웃는다/.test(text)) return 'eyesClosedSmile'
      if (romantic && requested === 'smile') return 'genuineSmile'
      break
    case 'char_007':
      if (sadWords.test(text)) return 'desolate'
      if (romantic && (requested === 'smile' || shyWords.test(text))) return 'love'
      if (requested === 'hmm' && context.kind === 'story') return 'confident'
      break
    case 'char_008':
      if (romantic && (requested === 'smile' || shyWords.test(text))) return /웃/.test(text) ? 'loveSmile' : 'love'
      if (requested === 'hmm' && /그림|작품|전시|스케치|분석/.test(text)) return 'glasses'
      break
    case 'char_009':
      if (/화가|분노|화났|짜증/.test(text)) return 'angry'
      if (sadWords.test(text)) return 'sorrowful'
      if (requested === 'hmm' && context.kind === 'story' && ((context.threshold ?? 0) >= 60 || /봉인|문양|위험|감정|통제|괴물|흔들/.test(text))) return 'serious'
      if (requested === 'hmm') return 'thinking'
      break
    case 'char_010':
      if (surpriseWords.test(text) || (requested === 'troubled' && /들키|당황/.test(text))) return 'busted'
      if (romantic && (requested === 'smile' || shyWords.test(text))) return 'love'
      break
    case 'char_011':
      if (/눈물|울/.test(text)) return 'sad'
      if (sadWords.test(text)) return /지쳤|피곤|힘들/.test(text) ? 'exhausted' : 'desolate'
      if (romantic && shyWords.test(text)) return (context.threshold ?? 0) >= 100 ? 'deepLove' : 'loveShy'
      if (romantic && requested === 'smile') return 'love'
      if (requested === 'hmm') return 'interested'
      break
    case 'char_012':
      if (/눈을 감|눈 감|고개를 숙|고개 숙|감정을 억누|꾹 참/.test(text)) return 'eyesClosedSad'
      if (/눈물|울/.test(text)) return 'tearful'
      if (sadWords.test(text)) return /억누|참|괜찮/.test(text) ? 'sorrowful' : 'desolate'
      if (romantic && shyWords.test(text)) return 'shy'
      if (romantic && requested === 'smile') return 'love'
      if (requested === 'main' && /무표정|표정이 없|선을 긋/.test(text)) return 'blank'
      break
  }
  return requested
}

const seasonalMap: Record<string, { early?: PortraitExpression; close?: PortraitExpression; deep?: PortraitExpression; result?: PortraitExpression; complete?: PortraitExpression }> = {
  char_001: { close: 'shy', deep: 'shy', result: 'shy', complete: 'smile' },
  char_002: { early: 'sly', close: 'sly', deep: 'shy', result: 'shy', complete: 'smile' },
  char_003: { close: 'shy', deep: 'shy', result: 'shy', complete: 'smile' },
  char_004: { close: 'shy', deep: 'shy', result: 'shy', complete: 'smile' },
  char_005: { early: 'faintSmile', close: 'faintSmile', deep: 'shy', result: 'shy', complete: 'faintSmile' },
  char_006: { early: 'genuineSmile', close: 'genuineSmile', deep: 'eyesClosedSmile', result: 'genuineSmile', complete: 'eyesClosedSmile' },
  char_007: { early: 'confident', close: 'love', deep: 'love', result: 'love', complete: 'love' },
  char_008: { early: 'glasses', close: 'loveSmile', deep: 'love', result: 'loveSmile', complete: 'loveSmile' },
  char_009: { early: 'thinking', close: 'smile', deep: 'smile', result: 'smile', complete: 'smile' },
  char_010: { early: 'busted', close: 'love', deep: 'love', result: 'love', complete: 'love' },
  char_011: { early: 'interested', close: 'loveShy', deep: 'deepLove', result: 'deepLove', complete: 'love' },
  char_012: { early: 'shy', close: 'shy', deep: 'love', result: 'love', complete: 'love' },
}

export function getSeasonalPortraitExpression(characterId: string, tier: SeasonalTier, phase: SeasonalPhase): PortraitExpression {
  const set = seasonalMap[characterId]
  if (!set) return phase === 'branch' && tier === 'early' ? 'main' : 'smile'

  // 선택 직후 표정은 현재 호감도 단계보다 앞서가지 않는다.
  // 낮은 호감도에서 최종 연애 표정이 튀어나오면 관계 진척과 얼굴의 감정 강도가 어긋난다.
  if (phase === 'choice-result') {
    if (tier === 'early') return set.early ?? 'smile'
    if (tier === 'close') return set.close ?? set.early ?? 'smile'
    return set.result ?? set.deep ?? 'smile'
  }

  if (phase === 'complete') return set.complete ?? set.deep ?? 'smile'
  return set[tier] ?? (tier === 'early' ? 'main' : 'smile')
}
