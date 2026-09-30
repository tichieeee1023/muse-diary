export interface MuseLetter {
  id: string
  characterId: string
  title: string
  envelope: string
  body: string[]
  postscript: string
}

export const museLetters: MuseLetter[] = [
  {
    id: 'letter-char_001', characterId: 'char_001', title: '책갈피 사이에 남겨둔 말', envelope: 'BOOKMARK · 01',
    body: ['오늘은 책을 빌려주지 않고, 대신 책갈피만 두고 갑니다.', '당신이 어떤 페이지에서 오래 멈추는지 이제는 조금 알 것 같아요. 다음에 만났을 때는 그 이유를 물어봐도 될까요?'],
    postscript: '다음 장은 함께 읽고 싶습니다.',
  },
  {
    id: 'letter-char_002', characterId: 'char_002', title: '계획표의 빈칸 하나', envelope: 'SCHEDULE · 02',
    body: ['일정표를 다시 확인했는데, 비워둔 칸 하나가 아직 남아 있더군요.', '이상하게도 그 칸을 채울 방법은 생각하지 않았습니다. 당신이 원하는 날에, 당신이 정하면 될 것 같아서요.'],
    postscript: '이번 변수는 꽤 마음에 듭니다.',
  },
  {
    id: 'letter-char_003', characterId: 'char_003', title: '귀가 확인', envelope: 'LAST TRAIN · 03',
    body: ['오늘은 제가 먼저 연락하지 않으려고 했습니다. 그런데 막차 시간이 다가오니 역시 어렵더군요.', '당신이 무사히 돌아갔다는 답장을 받고 나서야 오늘 하루가 끝난 것 같았습니다.'],
    postscript: '다음에는 제가 데려다드리겠습니다.',
  },
  {
    id: 'letter-char_004', characterId: 'char_004', title: '같이 먹을 수 있는 맛', envelope: 'RECIPE · 04',
    body: ['새 메뉴를 만들다가 당신이 좋아할 만한 맛을 발견했어요.', '설명하려고 하면 자꾸 이상해져서, 그냥 다음에 직접 먹여드리려고 합니다. 그때는 맛있다고 말해줘요.'],
    postscript: '같이 먹으면 더 정확해질 테니까요.',
  },
  {
    id: 'letter-char_005', characterId: 'char_005', title: '창가의 화분', envelope: 'QUIET ROOM · 05',
    body: ['작업실 창가에 둔 화분이 잘 자라고 있었습니다. 당신이 돌본 흔적이 보이더군요.', '별것 아닌 일 같지만, 그런 것을 오래 지키는 당신이 조금 부러웠습니다.'],
    postscript: '다음에는 제가 물을 주고 가겠습니다.',
  },
  {
    id: 'letter-char_006', characterId: 'char_006', title: '육지에서 보낸 편지', envelope: 'TIDE · 06',
    body: ['오늘 물결은 잔잔했어요. 그래서인지 작업실에서 보낸 시간이 더 오래 남았습니다.', '강도 바다도 아닌 곳에서 당신을 만나는 일은 아직 조금 낯설지만, 싫지는 않아요.'],
    postscript: '다음에는 제가 먼저 찾아갈게요.',
  },
  {
    id: 'letter-char_007', characterId: 'char_007', title: '키오스크 없는 약속', envelope: 'AFTER SCHOOL · 07',
    body: ['오늘은 혼자서도 길을 잘 찾아왔습니다. 사실 몇 번 연습했어요.', '다음에는 제가 음료를 고를게요. 키오스크가 없어도 괜찮은 곳으로요.'],
    postscript: '그러니까 또 만나도 되는 거죠?',
  },
  {
    id: 'letter-char_008', characterId: 'char_008', title: '먼저 보여준 스케치', envelope: 'SKETCHBOOK · 08',
    body: ['완성되지 않은 그림을 먼저 보여주는 건 아직 어렵습니다.', '그런데 당신에게는 보여주고 싶었어요. 잘 그렸다는 말보다, 계속 보고 있어주겠다는 말이 더 좋을 것 같아서요.'],
    postscript: '다음 그림의 첫 장면은 이미 정해졌습니다.',
  },
  {
    id: 'letter-char_009', characterId: 'char_009', title: '판단을 미룬 오후', envelope: 'TEA ROOM · 09',
    body: ['당신 앞에서는 결론을 조금 늦게 내려도 괜찮다는 걸 배웠습니다.', '이름 붙이기 전에 곁에 있어도 되는 감정이 있다는 것도요.'],
    postscript: '오늘은 차가 식는 것도 몰랐습니다.',
  },
  {
    id: 'letter-char_010', characterId: 'char_010', title: '두 개의 푸딩', envelope: 'SAFE HOUSE · 10',
    body: ['푸딩은 두 개 샀습니다. 하나만 사면 당신이 또 괜찮다고 할 것 같아서요.', '괜찮다는 말 대신, 오늘은 맛있다고 말해도 됩니다. 제가 듣고 싶어서 하는 부탁입니다.'],
    postscript: '문단속은 제가 확인해둘게요.',
  },
  {
    id: 'letter-char_011', characterId: 'char_011', title: '아무것도 하지 않는 날', envelope: 'QUIET STAGE · 11',
    body: ['오늘은 공연도, 마술도, 박수도 없는 날이었습니다.', '그런데 이상하게 지루하지 않았어요. 당신 옆에서는 아무것도 하지 않는 것도 하나의 장면이 되나 봅니다.'],
    postscript: '다음 막은 천천히 올려도 괜찮겠죠.',
  },
  {
    id: 'letter-char_012', characterId: 'char_012', title: '같은 시간을 보내는 법', envelope: 'CLOCKWORK · 12',
    body: ['시계를 고칠 이유가 없는데도 한참 들여다봤습니다.', '시간을 맞추는 것보다, 같은 시간에 당신과 있는 일이 더 중요해졌다는 걸 뒤늦게 알았습니다.'],
    postscript: '이번에는 제가 먼저 기다리겠습니다.',
  },
]

export function getMuseLetter(letterId: string) {
  return museLetters.find((letter) => letter.id === letterId) ?? null
}
