export interface MyRoomPairLine { speakerId: string; text: string }
export type MyRoomPairVariant = MyRoomPairLine[]
const pairDialogue: Record<string, MyRoomPairVariant[]> = {
  'char_001|char_002': [
    [
      { speakerId: 'char_001', text: '책은 각도가 조금 틀어져도 읽는 데 문제없습니다.' },
      { speakerId: 'char_002', text: '그래서 제가 바로잡았습니다. 그리고 지금 그 말, 저한테 하는 거죠?' },
    ],
    [
      { speakerId: 'char_002', text: '작업실 배치가 전보다 나아졌군요.' },
      { speakerId: 'char_001', text: '제가 건드리지 말라고 했던 책까지 옮기신 것만 빼면요.' },
    ],
    [
      { speakerId: 'char_002', text: '책상 위 영수증, 왜 그대로 둡니까?' },
      { speakerId: 'char_001', text: '은하수 씨가 어제 쓴 겁니다.' },
      { speakerId: 'char_002', text: '…그럼 두죠. 저도 그런 건 못 버립니다.' },
    ],
  ],
  'char_001|char_003': [
    [
      { speakerId: 'char_003', text: '이 시간까지 책을 읽게 두는 편입니까?' },
      { speakerId: 'char_001', text: '읽다 졸면 제가 책을 치우겠습니다. 귀가는 문해준 씨가 맡으시고요.' },
    ],
    [
      { speakerId: 'char_001', text: '도착하면 연락하라는 말을 오늘도 하셨습니까?' },
      { speakerId: 'char_003', text: '했습니다. 서도윤 씨도 책 다 읽으면 자라고 말했겠죠.' },
    ],
    [
      { speakerId: 'char_003', text: '책 읽다가 막차 놓친 적 있습니까?' },
      { speakerId: 'char_001', text: '저는 없습니다. 은하수 씨는 두 번.' },
      { speakerId: 'char_003', text: '왜 그걸 정확히 기억합니까?' },
      { speakerId: 'char_001', text: '문해준 씨가 도착 시간을 기억하는 이유와 비슷하겠죠.' },
    ],
  ],
  'char_001|char_004': [
    [
      { speakerId: 'char_004', text: '책 읽을 때 먹기 좋은 디저트도 있어요.' },
      { speakerId: 'char_001', text: '부스러기 안 떨어지는 걸로 부탁합니다. …은하수 몫은 제가 고르죠.' },
    ],
    [
      { speakerId: 'char_001', text: '단 걸 싫어한다면서 왜 이렇게 많이 가져오셨습니까?' },
      { speakerId: 'char_004', text: '제가 먹으려고 온 건 아니니까요. 그건 서도윤 씨도 비슷하지 않아요?' },
    ],
    [
      { speakerId: 'char_004', text: '은하수 취향, 책으로는 어느 정도 알아요?' },
      { speakerId: 'char_001', text: '꽤 많이요. 이로운 씨는 맛으로 압니까?' },
      { speakerId: 'char_004', text: '네. 그러니까 서로 답은 말하지 맙시다.' },
    ],
  ],
  'char_001|char_005': [
    [
      { speakerId: 'char_005', text: '오래된 책에서 이상한 냄새가 나면 바로 부르십시오.' },
      { speakerId: 'char_001', text: '그 책은 백 년 넘게 버텼습니다. 강태겸 씨 장갑보다 오래됐을 겁니다.' },
    ],
    [
      { speakerId: 'char_001', text: '흔적을 지우는 분이 낡은 걸 이렇게 오래 보시네요.' },
      { speakerId: 'char_005', text: '남겨야 할 건 압니다. 당신도 그렇지 않습니까.' },
    ],
    [
      { speakerId: 'char_005', text: '이 책은 왜 테이프로까지 붙여놨습니까?' },
      { speakerId: 'char_001', text: '버릴 이유가 없어서요.' },
      { speakerId: 'char_005', text: '…그 말은 마음에 드는군요.' },
    ],
  ],
  'char_001|char_006': [
    [
      { speakerId: 'char_006', text: '책 물에 젖으면 큰일 나죠?' },
      { speakerId: 'char_001', text: '그 질문을 백시온 씨가 하니 불안하군요. 창가에서 두 걸음만 물러나 주세요.' },
    ],
    [
      { speakerId: 'char_001', text: '오늘은 물방울 안 떨어뜨리셨네요.' },
      { speakerId: 'char_006', text: '칭찬해줘요. 은하수 옆에 앉으려고 엄청 신경 썼거든요.' },
    ],
    [
      { speakerId: 'char_006', text: '은하수랑 강변에서 읽기 좋은 책 추천해줘요.' },
      { speakerId: 'char_001', text: '물에서 세 걸음 이상 떨어져 읽는 조건이면요.' },
      { speakerId: 'char_006', text: '두 걸음 반.' },
      { speakerId: 'char_001', text: '안 됩니다.' },
    ],
  ],
  'char_001|char_007': [
    [
      { speakerId: 'char_007', text: '이 책에 나온 옛말, 뜻이 좀 다른데요.' },
      { speakerId: 'char_001', text: '그럴 줄 알았습니다. 그래서 김휘람 씨 오면 물어보려고 빼뒀어요.' },
    ],
    [
      { speakerId: 'char_001', text: '시험공부는 했습니까?' },
      { speakerId: 'char_007', text: '왔자마자 그 얘기예요? …은하수도 똑같이 물어봤죠?' },
    ],
    [
      { speakerId: 'char_007', text: '저도 이제 책갈피 씁니다. 영수증 말고요.' },
      { speakerId: 'char_001', text: '좋은 습관입니다.' },
      { speakerId: 'char_007', text: '은하수가 준 거라서요.' },
      { speakerId: 'char_001', text: '…그건 먼저 말했어야죠.' },
    ],
  ],
  'char_001|char_008': [
    [
      { speakerId: 'char_008', text: '책 읽는 사람 얼굴은 그리기 좋거든요.' },
      { speakerId: 'char_001', text: '은하수 씨는 안 됩니다.' },
      { speakerId: 'char_008', text: '아직 아무 말도 안 했는데요?' },
    ],
    [
      { speakerId: 'char_001', text: '완성한 그림을 먼저 보여줬다고 들었습니다.' },
      { speakerId: 'char_008', text: '네. 서도윤 씨도 추천책 제일 먼저 빼두잖아요. 비슷하죠?' },
    ],
    [
      { speakerId: 'char_008', text: '서도윤 씨는 사람 얼굴보다 행동을 더 기억하죠?' },
      { speakerId: 'char_001', text: '오세현 씨는 얼굴부터 그리겠죠.' },
      { speakerId: 'char_008', text: '은하수는 둘 다 기억하고 싶던데요.' },
      { speakerId: 'char_001', text: '그건 동의합니다.' },
    ],
  ],
  'char_001|char_009': [
    [
      { speakerId: 'char_009', text: '조용한 공간을 좋아하시는군요.' },
      { speakerId: 'char_001', text: '네. 다만 오늘은 두 분 정도까지는 괜찮습니다.' },
    ],
    [
      { speakerId: 'char_001', text: '차 향이 책에 배겠습니다.' },
      { speakerId: 'char_009', text: '그럼 조금 멀리 두죠. 은하수 씨와는 가까이 있고 싶습니다만.' },
    ],
    [
      { speakerId: 'char_009', text: '기억하는 일이 때로는 짐이 되지 않습니까?' },
      { speakerId: 'char_001', text: '됩니다. 그래도 잊는 것보다는 낫습니다.' },
      { speakerId: 'char_009', text: '저도 요즘은 감정에 대해 비슷하게 생각합니다.' },
    ],
  ],
  'char_001|char_010': [
    [
      { speakerId: 'char_010', text: '출입구가 하나뿐이군요.' },
      { speakerId: 'char_001', text: '책방도 작업실도 도망갈 곳부터 보는군요.' },
      { speakerId: 'char_010', text: '습관입니다. 당신은 사람의 흔적부터 보고.' },
    ],
    [
      { speakerId: 'char_001', text: '푸딩 두 개라면서 왜 세 개입니까?' },
      { speakerId: 'char_010', text: '한 개는 은하수 씨 겁니다. 그건 세지 마십시오.' },
    ],
    [
      { speakerId: 'char_010', text: '책장 고정이 약합니다. 넘어질 수 있습니다.' },
      { speakerId: 'char_001', text: '지금 고치실 겁니까?' },
      { speakerId: 'char_010', text: '은하수 씨가 자주 앉는 자리 옆이라서요.' },
      { speakerId: 'char_001', text: '도구는 아래 서랍에 있습니다.' },
    ],
  ],
  'char_001|char_011': [
    [
      { speakerId: 'char_011', text: '책 사이에 별 스티커 하나 붙이면 안 돼요?' },
      { speakerId: 'char_001', text: '안 됩니다.' },
      { speakerId: 'char_011', text: '은하수 책에도요?' },
      { speakerId: 'char_001', text: '…그건 본인에게 물어보세요.' },
    ],
    [
      { speakerId: 'char_001', text: '오늘은 조용하군요.' },
      { speakerId: 'char_011', text: '무대 밖에서는 원래 이래요. 서도윤 씨도 좋아하는 사람 앞에서는 더 말 많아지잖아요.' },
    ],
    [
      { speakerId: 'char_011', text: '서점에서 마술하면 쫓겨나요?' },
      { speakerId: 'char_001', text: '책 안 태우면 생각해보겠습니다.' },
      { speakerId: 'char_011', text: '은하수한테만 작은 별 하나.' },
      { speakerId: 'char_001', text: '…그 정도면 허락하죠.' },
    ],
  ],
  'char_001|char_012': [
    [
      { speakerId: 'char_012', text: '이 책, 예전에도 본 것 같습니다.' },
      { speakerId: 'char_001', text: '처음 들어온 책입니다.' },
      { speakerId: 'char_012', text: '…그렇군요. 그럼 이번에는 처음 읽겠습니다.' },
    ],
    [
      { speakerId: 'char_001', text: '날짜를 적어두는 건 제 버릇입니다.' },
      { speakerId: 'char_012', text: '좋은 버릇이네요. 저는 가끔 날짜가 너무 많아서.' },
    ],
    [
      { speakerId: 'char_012', text: '날짜를 적어두면 그날이 덜 멀어집니까?' },
      { speakerId: 'char_001', text: '아뇨. 다만 다시 찾기 쉬워집니다.' },
      { speakerId: 'char_012', text: '그럼 오늘 날짜도 적어주세요. 이번에는 잊지 않게.' },
    ],
  ],
  'char_002|char_003': [
    [
      { speakerId: 'char_002', text: '문해준 씨는 모든 걸 시간표대로 움직이는군요.' },
      { speakerId: 'char_003', text: '한주원 씨는 모든 걸 배치대로 움직이고요. 은하수 씨만 둘 다 안 따르겠네요.' },
    ],
    [
      { speakerId: 'char_003', text: '귀가 동선은 제가 정하겠습니다.' },
      { speakerId: 'char_002', text: '그 전까지의 일정은 제가 잡죠.' },
    ],
    [
      { speakerId: 'char_002', text: '은하수 씨 약속 시간에 늦으면 어떻게 합니까?' },
      { speakerId: 'char_003', text: '기다립니다.' },
      { speakerId: 'char_002', text: '잔소리는요?' },
      { speakerId: 'char_003', text: '도착한 다음에 합니다.' },
      { speakerId: 'char_002', text: '합리적이군요. 저도 그렇게 하죠.' },
    ],
  ],
  'char_002|char_004': [
    [
      { speakerId: 'char_004', text: '예쁜 것과 맛있는 건 다르죠?' },
      { speakerId: 'char_002', text: '잘 만든 건 둘 다 잡습니다. 이로운 씨 디저트처럼요.' },
      { speakerId: 'char_004', text: '칭찬 맞죠? 은하수 앞이라 후하네.' },
    ],
    [
      { speakerId: 'char_002', text: '포장 디자인은 개선 여지가 있습니다.' },
      { speakerId: 'char_004', text: '맛에는 없고요?' },
      { speakerId: 'char_002', text: '…그건 인정하죠.' },
    ],
    [
      { speakerId: 'char_002', text: '이 디저트 색 조합은 의도한 겁니까?' },
      { speakerId: 'char_004', text: '먹기 전에 평가부터 해요?' },
      { speakerId: 'char_002', text: '은하수 씨가 사진 찍기 전에 봐두는 겁니다.' },
      { speakerId: 'char_004', text: '그럼 예쁘게 놓는 건 맡길게요. 먹이는 건 제가 하고.' },
    ],
  ],
  'char_002|char_005': [
    [
      { speakerId: 'char_002', text: '흔적을 없애는 직업이라. 제 일과 정반대군요.' },
      { speakerId: 'char_005', text: '당신은 남기고, 저는 지웁니다. 은하수 씨 관련은 둘 다 예외겠지만.' },
    ],
    [
      { speakerId: 'char_005', text: '저 소품은 왜 세 번이나 옮깁니까?' },
      { speakerId: 'char_002', text: '가장 좋은 자리를 찾는 중입니다. 사람도 마찬가지고.' },
    ],
    [
      { speakerId: 'char_005', text: '저 의자, 동선을 막습니다.' },
      { speakerId: 'char_002', text: '보기에는 가장 좋습니다.' },
      { speakerId: 'char_005', text: '은하수 씨가 발 걸리면 치웁니다.' },
      { speakerId: 'char_002', text: '…그 경우엔 저도 동의하죠.' },
    ],
  ],
  'char_002|char_006': [
    [
      { speakerId: 'char_006', text: '한주원 씨는 물가 가면 계획표도 젖겠네요.' },
      { speakerId: 'char_002', text: '방수 케이스라는 문명이 있습니다.' },
      { speakerId: 'char_006', text: '은하수는 제가 챙길게요.' },
      { speakerId: 'char_002', text: '그건 제가 방수 처리할 영역이 아니군요.' },
    ],
    [
      { speakerId: 'char_002', text: '즉흥적이라는 말을 칭찬으로 듣습니까?' },
      { speakerId: 'char_006', text: '네. 특히 은하수랑 놀 때는요.' },
    ],
    [
      { speakerId: 'char_006', text: '계획 없는 여행 해본 적 있어요?' },
      { speakerId: 'char_002', text: '없습니다.' },
      { speakerId: 'char_006', text: '은하수랑 가면 하게 될걸요.' },
      { speakerId: 'char_002', text: '그래서 일정표에 \'계획 없음\'을 넣어둘 생각입니다.' },
    ],
  ],
  'char_002|char_007': [
    [
      { speakerId: 'char_007', text: '이 셔츠 진짜 비싸 보여요.' },
      { speakerId: 'char_002', text: '첫 감상이 가격입니까?' },
      { speakerId: 'char_007', text: '은하수는 잘 어울린다고 했는데.' },
      { speakerId: 'char_002', text: '…그 말부터 하셨어야죠.' },
    ],
    [
      { speakerId: 'char_002', text: '김휘람 씨, 저 쿠션은 그 자리가 아닙니다.' },
      { speakerId: 'char_007', text: '은하수가 여기 두랬어요.' },
      { speakerId: 'char_002', text: '그럼 거기가 맞습니다.' },
    ],
    [
      { speakerId: 'char_007', text: '한주원 씨는 옷 고르는 데 오래 걸려요?' },
      { speakerId: 'char_002', text: '아뇨. 기준이 있으니까요.' },
      { speakerId: 'char_007', text: '은하수 옷은요?' },
      { speakerId: 'char_002', text: '…그건 선택지가 많아져서 조금 오래 걸립니다.' },
    ],
  ],
  'char_002|char_008': [
    [
      { speakerId: 'char_008', text: '한주원 씨는 그림 모델 하면 되게 까다로울 것 같아요.' },
      { speakerId: 'char_002', text: '결과가 좋다면 협조합니다.' },
      { speakerId: 'char_008', text: '은하수 옆에 세워도요?' },
      { speakerId: 'char_002', text: '구도는 제가 정하죠.' },
    ],
    [
      { speakerId: 'char_002', text: '미완성작을 왜 여기까지 가져왔습니까?' },
      { speakerId: 'char_008', text: '이제는 보여줄 사람이 있어서요. 한주원 씨도 실패한 시안 안 버리잖아요.' },
    ],
    [
      { speakerId: 'char_008', text: '완성한 작품에서 제일 먼저 보는 게 뭐예요?' },
      { speakerId: 'char_002', text: '틀어진 부분.' },
      { speakerId: 'char_008', text: '전 좋은 부분부터 보려고 연습 중이에요.' },
      { speakerId: 'char_002', text: '은하수 씨한테 배웠습니까?' },
      { speakerId: 'char_008', text: '네. 한주원 씨도 좀 배우세요.' },
    ],
  ],
  'char_002|char_009': [
    [
      { speakerId: 'char_009', text: '모든 변수를 통제하려 하면 피곤하지 않습니까?' },
      { speakerId: 'char_002', text: '상담 시작하실 겁니까?' },
      { speakerId: 'char_009', text: '아뇨. 은하수 씨 앞에서는 둘 다 실패한다는 얘기입니다.' },
    ],
    [
      { speakerId: 'char_002', text: '차이겸 씨는 감정을 너무 늦게 알아차리는군요.' },
      { speakerId: 'char_009', text: '한주원 씨는 너무 빨리 알아차리고 숨기시는군요.' },
    ],
    [
      { speakerId: 'char_009', text: '오늘은 소품을 세 번밖에 안 옮기셨군요.' },
      { speakerId: 'char_002', text: '관찰하셨습니까?' },
      { speakerId: 'char_009', text: '직업병입니다.' },
      { speakerId: 'char_002', text: '저도 은하수 씨 표정은 자주 봅니다. 서로 비슷하군요.' },
    ],
  ],
  'char_002|char_010': [
    [
      { speakerId: 'char_010', text: '출입 동선을 막는 가구입니다.' },
      { speakerId: 'char_002', text: '미관상 필요한 가구입니다.' },
      { speakerId: 'char_010', text: '위급 상황에는 치우겠습니다.' },
      { speakerId: 'char_002', text: '은하수 먼저 데리고 나가면 허락하죠.' },
    ],
    [
      { speakerId: 'char_002', text: '경호 대상과 데이트 상대는 구분합니까?' },
      { speakerId: 'char_010', text: '이제는 합니다. 당신도 고객과 좋아하는 사람을 구분하겠죠.' },
    ],
    [
      { speakerId: 'char_010', text: '저 테이블 모서리는 위험합니다.' },
      { speakerId: 'char_002', text: '둥근 걸로 교체하면 디자인이 무너집니다.' },
      { speakerId: 'char_010', text: '은하수 씨가 다치면요?' },
      { speakerId: 'char_002', text: '…내일 교체하죠.' },
    ],
  ],
  'char_002|char_011': [
    [
      { speakerId: 'char_011', text: '여기 별 하나 달면 예쁠 것 같은데.' },
      { speakerId: 'char_002', text: '안 됩니다.' },
      { speakerId: 'char_011', text: '은하수가 좋대도?' },
      { speakerId: 'char_002', text: '…검토는 하죠.' },
    ],
    [
      { speakerId: 'char_002', text: '무대는 과한데 이상하게 균형이 맞더군요.' },
      { speakerId: 'char_011', text: '칭찬 받았다. 은하수, 들었죠?' },
    ],
    [
      { speakerId: 'char_011', text: '한주원 씨 무대 연출하면 잘할 것 같은데.' },
      { speakerId: 'char_002', text: '유리안 씨가 제 지시를 따를 것 같진 않군요.' },
      { speakerId: 'char_011', text: '은하수가 부탁하면요?' },
      { speakerId: 'char_002', text: '그건 협상 조건이 다릅니다.' },
    ],
  ],
  'char_002|char_012': [
    [
      { speakerId: 'char_002', text: '시계 위치가 3밀리미터 틀어졌습니다.' },
      { speakerId: 'char_012', text: '시간은 맞습니다.' },
      { speakerId: 'char_002', text: '제가 말한 건 시간이 아닙니다.' },
      { speakerId: 'char_012', text: '저도요.' },
    ],
    [
      { speakerId: 'char_012', text: '빈칸을 남겨두는 게 익숙해지셨나 봅니다.' },
      { speakerId: 'char_002', text: '당신은 지나간 칸을 너무 오래 보는 편이고요.' },
    ],
    [
      { speakerId: 'char_012', text: '계획이 틀어져도 예전만큼 화내지 않으시네요.' },
      { speakerId: 'char_002', text: '누구 때문인지 아실 텐데요.' },
      { speakerId: 'char_012', text: '압니다. 저도 계획을 포기한 적이 있으니까.' },
    ],
  ],
  'char_003|char_004': [
    [
      { speakerId: 'char_004', text: '문해준 씨, 오늘도 귀가 체크해요?' },
      { speakerId: 'char_003', text: '합니다.' },
      { speakerId: 'char_004', text: '그럼 저는 야식 맡을게요. 은하수 굶기지 말고.' },
    ],
    [
      { speakerId: 'char_003', text: '단 걸 별로 안 좋아한다고 들었습니다.' },
      { speakerId: 'char_004', text: '맞아요. 그런데 은하수 주는 건 자꾸 만들게 되네요.' },
    ],
    [
      { speakerId: 'char_004', text: '오늘 은하수 늦게까지 작업한다는데요.' },
      { speakerId: 'char_003', text: '몇 시까지입니까?' },
      { speakerId: 'char_004', text: '벌써 표정 무서워졌어요.' },
      { speakerId: 'char_003', text: '…야식은 부탁하겠습니다.' },
    ],
  ],
  'char_003|char_005': [
    [
      { speakerId: 'char_003', text: '늦은 시간은 제가 데려다주겠습니다.' },
      { speakerId: 'char_005', text: '골목은 제가 먼저 확인하죠.' },
      { speakerId: 'char_003', text: '…역할 분담이면 괜찮습니다.' },
    ],
    [
      { speakerId: 'char_005', text: '당신은 도착을 확인하고.' },
      { speakerId: 'char_003', text: '강태겸 씨는 지나간 뒤를 확인하죠. 오늘은 둘 다 필요 없으면 좋겠습니다.' },
    ],
    [
      { speakerId: 'char_003', text: '위험한 골목이 있으면 미리 알려주십시오.' },
      { speakerId: 'char_005', text: '막차 위험하면 당신도 알려주고요.' },
      { speakerId: 'char_003', text: '은하수 씨 관련은 정보 공유하는 걸로 하죠.' },
      { speakerId: 'char_005', text: '그건 동의합니다.' },
    ],
  ],
  'char_003|char_006': [
    [
      { speakerId: 'char_006', text: '막차 놓치면 강 따라 데려다줄까요?' },
      { speakerId: 'char_003', text: '안 됩니다.' },
      { speakerId: 'char_006', text: '왜요?' },
      { speakerId: 'char_003', text: '은하수 씨가 감기 걸립니다.' },
    ],
    [
      { speakerId: 'char_003', text: '물가에서는 백시온 씨를 믿겠습니다.' },
      { speakerId: 'char_006', text: '육지에서는 문해준 씨 믿을게요. 은하수 옆자리는 반씩?' },
      { speakerId: 'char_003', text: '그건 별개입니다.' },
    ],
    [
      { speakerId: 'char_006', text: '전철보다 강이 빠를 때도 있어요.' },
      { speakerId: 'char_003', text: '안전 기준을 통과합니까?' },
      { speakerId: 'char_006', text: '제가 태우면요.' },
      { speakerId: 'char_003', text: '은하수 씨는 전철로 갑니다.' },
    ],
  ],
  'char_003|char_007': [
    [
      { speakerId: 'char_003', text: '학생이면 이 시간 전에 들어가야 합니다.' },
      { speakerId: 'char_007', text: '저 고3인데요.' },
      { speakerId: 'char_003', text: '그래서 더 그렇습니다.' },
      { speakerId: 'char_007', text: '은하수도 똑같은 말 했는데…' },
    ],
    [
      { speakerId: 'char_007', text: '기관사님은 길 안 잃죠?' },
      { speakerId: 'char_003', text: '선로 위에서는요.' },
      { speakerId: 'char_007', text: '전 키오스크 앞에서 잃어요.' },
    ],
    [
      { speakerId: 'char_007', text: '기관사면 진짜 시간 거의 안 틀려요?' },
      { speakerId: 'char_003', text: '업무 중에는 그렇습니다.' },
      { speakerId: 'char_007', text: '데이트도요?' },
      { speakerId: 'char_003', text: '…그쪽은 더 일찍 갑니다.' },
    ],
  ],
  'char_003|char_008': [
    [
      { speakerId: 'char_008', text: '열차 창밖 풍경 그려보고 싶어요.' },
      { speakerId: 'char_003', text: '운전 중에는 안 됩니다.' },
      { speakerId: 'char_008', text: '저 말고 은하수가요.' },
      { speakerId: 'char_003', text: '…그건 좋겠네요.' },
    ],
    [
      { speakerId: 'char_003', text: '완성한 그림이면 보여주십시오.' },
      { speakerId: 'char_008', text: '문해준 씨도 은근 직진이네요. 은하수한테만 그런 줄 알았는데.' },
    ],
    [
      { speakerId: 'char_008', text: '플랫폼 사람들 스케치하면 재밌겠다.' },
      { speakerId: 'char_003', text: '안전선 안쪽에서 하십시오.' },
      { speakerId: 'char_008', text: '은하수랑 같이 있어도요?' },
      { speakerId: 'char_003', text: '그럼 제가 더 자주 확인하겠습니다.' },
    ],
  ],
  'char_003|char_009': [
    [
      { speakerId: 'char_009', text: '기다리는 일을 잘하시는군요.' },
      { speakerId: 'char_003', text: '필요하면요.' },
      { speakerId: 'char_009', text: '저도 요즘은 기다리는 이유를 압니다.' },
    ],
    [
      { speakerId: 'char_003', text: '위험하면 바로 말하십시오.' },
      { speakerId: 'char_009', text: '그 말은 은하수 씨에게 하루에 몇 번 하십니까?' },
      { speakerId: 'char_003', text: '필요한 만큼 합니다.' },
    ],
    [
      { speakerId: 'char_009', text: '기다리는 것이 불안하지는 않습니까?' },
      { speakerId: 'char_003', text: '예전엔 그랬습니다.' },
      { speakerId: 'char_009', text: '지금은요?' },
      { speakerId: 'char_003', text: '올 사람이라는 걸 아니까요.' },
    ],
  ],
  'char_003|char_010': [
    [
      { speakerId: 'char_010', text: '귀가는 제가 맡겠습니다.' },
      { speakerId: 'char_003', text: '그건 제 말입니다.' },
      { speakerId: 'char_010', text: '그럼 둘이 같이 갑시다.' },
      { speakerId: 'char_003', text: '…그게 제일 안전하겠군요.' },
    ],
    [
      { speakerId: 'char_003', text: '보호와 통제는 다릅니다.' },
      { speakerId: 'char_010', text: '압니다. 어렵게 배웠습니다.' },
    ],
    [
      { speakerId: 'char_010', text: '귀가 동선은 제가 먼저 확인하겠습니다.' },
      { speakerId: 'char_003', text: '역 안은 제가 압니다.' },
      { speakerId: 'char_010', text: '그럼 역 밖은 제가 맡죠.' },
      { speakerId: 'char_003', text: '은하수 씨가 질색하겠군요.' },
    ],
  ],
  'char_003|char_011': [
    [
      { speakerId: 'char_011', text: '막차 타고 공연 끝나면 낭만 있지 않아요?' },
      { speakerId: 'char_003', text: '막차는 낭만이 아니라 마지막 운행입니다.' },
      { speakerId: 'char_011', text: '은하수랑 같이 타도요?' },
      { speakerId: 'char_003', text: '…그건 조금 다르겠군요.' },
    ],
    [
      { speakerId: 'char_003', text: '별 스티커를 운전실에 붙일 수는 없습니다.' },
      { speakerId: 'char_011', text: '아직 부탁도 안 했는데요?' },
    ],
    [
      { speakerId: 'char_011', text: '막차 안내방송 목소리 한번 해주세요.' },
      { speakerId: 'char_003', text: '싫습니다.' },
      { speakerId: 'char_011', text: '은하수가 듣고 싶대도?' },
      { speakerId: 'char_003', text: '…한 번만입니다.' },
    ],
  ],
  'char_003|char_012': [
    [
      { speakerId: 'char_012', text: '00시가 넘어가는 순간을 자주 보시겠군요.' },
      { speakerId: 'char_003', text: '매일 봅니다. 특별할 건 없습니다.' },
      { speakerId: 'char_012', text: '저한텐 꽤 특별합니다. 이제는.' },
    ],
    [
      { speakerId: 'char_003', text: '시간이 어긋나면 열차는 곤란합니다.' },
      { speakerId: 'char_012', text: '저도 그래서 고치려 했습니다. 너무 많이.' },
    ],
    [
      { speakerId: 'char_012', text: '시간을 지키는 일이 그렇게 중요합니까?' },
      { speakerId: 'char_003', text: '누군가 기다리면 더 중요합니다.' },
      { speakerId: 'char_012', text: '그 말은 제가 잘 압니다.' },
      { speakerId: 'char_003', text: '요즘은 덜 기다리시길 바랍니다.' },
    ],
  ],
  'char_004|char_005': [
    [
      { speakerId: 'char_004', text: '강태겸 씨는 무슨 맛 좋아해요?' },
      { speakerId: 'char_005', text: '매운 것.' },
      { speakerId: 'char_004', text: '오, 통하네. 은하수는 제가 물어봤어요.' },
      { speakerId: 'char_005', text: '저도 압니다.' },
    ],
    [
      { speakerId: 'char_005', text: '그 디저트에서 이상한 기운은 안 납니까?' },
      { speakerId: 'char_004', text: '오늘 건 그냥 케이크예요. 은하수 앞에서는 저도 평범하고 싶거든요.' },
    ],
    [
      { speakerId: 'char_004', text: '강태겸 씨는 스트레스 받을 때 뭐 먹어요?' },
      { speakerId: 'char_005', text: '아무거나.' },
      { speakerId: 'char_004', text: '그 대답 제일 싫어요. 은하수한테 물어봐야겠다.' },
      { speakerId: 'char_005', text: '…매운 걸로 해주십시오.' },
    ],
  ],
  'char_004|char_006': [
    [
      { speakerId: 'char_006', text: '물가에서 먹는 디저트 최고인데.' },
      { speakerId: 'char_004', text: '습기만 조심하면요.' },
      { speakerId: 'char_006', text: '은하수가 들면 안 젖어요.' },
      { speakerId: 'char_004', text: '그럼 제가 은하수 옆에서 들죠.' },
    ],
    [
      { speakerId: 'char_004', text: '감정이 흐르는 대로 사는 건 어때요?' },
      { speakerId: 'char_006', text: '편해요. 좋아하면 좋아한다고 하면 되잖아요.' },
      { speakerId: 'char_004', text: '…그게 생각보다 어렵더라고요.' },
    ],
    [
      { speakerId: 'char_006', text: '물 맛도 구분해요?' },
      { speakerId: 'char_004', text: '감정은 읽어도 물은 잘 모르죠.' },
      { speakerId: 'char_006', text: '그럼 은하수 기분은 누가 더 잘 맞히나 해볼까요?' },
      { speakerId: 'char_004', text: '그건 제가 조금 유리한데.' },
    ],
  ],
  'char_004|char_007': [
    [
      { speakerId: 'char_007', text: '이 디저트 진짜 안 달아요?' },
      { speakerId: 'char_004', text: '김휘람 씨 몫은 덜 달게 했어요.' },
      { speakerId: 'char_007', text: '은하수 몫은요?' },
      { speakerId: 'char_004', text: '그건 제가 제일 잘 알아요.' },
    ],
    [
      { speakerId: 'char_004', text: '요즘 유행어 하나 알려줘요.' },
      { speakerId: 'char_007', text: '저한테 배우면 큰일 나요. 저도 틀려요.' },
    ],
    [
      { speakerId: 'char_007', text: '매운 디저트는 없어요?' },
      { speakerId: 'char_004', text: '왜 다들 제가 단 것만 만든다고 생각하죠?' },
      { speakerId: 'char_007', text: '직업이 파티시에니까요.' },
      { speakerId: 'char_004', text: '은하수도 처음엔 그랬어요. 지금은 제 취향도 알지만.' },
    ],
  ],
  'char_004|char_008': [
    [
      { speakerId: 'char_008', text: '케이크 단면 진짜 그리기 좋아요.' },
      { speakerId: 'char_004', text: '먹기 전에만 끝내주세요.' },
      { speakerId: 'char_008', text: '은하수 얼굴도 같이 그리면요?' },
      { speakerId: 'char_004', text: '그건 오래 걸려도 기다릴게요.' },
    ],
    [
      { speakerId: 'char_004', text: '완성 무서워하는 거, 조금 알아요.' },
      { speakerId: 'char_008', text: '로운 씨는 감정 이름 붙이는 거 무서워하잖아요. 우리 비슷하네요.' },
    ],
    [
      { speakerId: 'char_008', text: '먹기 아까운 디저트 있잖아요. 그거 그림으로 남기고 싶어요.' },
      { speakerId: 'char_004', text: '그럼 은하수가 먹기 전에 빨리 그려요.' },
      { speakerId: 'char_008', text: '둘 다 은하수 행동 기준이네요.' },
      { speakerId: 'char_004', text: '그러게요. 좀 웃기다.' },
    ],
  ],
  'char_004|char_009': [
    [
      { speakerId: 'char_009', text: '감정을 맛으로 읽는다는 건 흥미롭군요.' },
      { speakerId: 'char_004', text: '차이겸 씨는 말로 읽잖아요.' },
      { speakerId: 'char_009', text: '자기 것은 둘 다 늦게 알았고요.' },
    ],
    [
      { speakerId: 'char_004', text: '오늘 은하수 기분은 제가 맞힐게요.' },
      { speakerId: 'char_009', text: '그럼 저는 묻겠습니다. 맞히는 것보다 듣는 편이 나을 때도 있으니.' },
    ],
    [
      { speakerId: 'char_009', text: '감정을 맛으로 느끼는 건 어떤 기분입니까?' },
      { speakerId: 'char_004', text: '차이겸 씨가 남의 마음 정리해주는 거랑 비슷할지도요.' },
      { speakerId: 'char_009', text: '그럼 자신의 것은 어렵고요?' },
      { speakerId: 'char_004', text: '…그것까지 비슷하네요.' },
    ],
  ],
  'char_004|char_010': [
    [
      { speakerId: 'char_010', text: '푸딩은 있습니까?' },
      { speakerId: 'char_004', text: '있죠. 두 개.' },
      { speakerId: 'char_010', text: '세 개로 하십시오.' },
      { speakerId: 'char_004', text: '은하수 몫 이미 포함인데요?' },
      { speakerId: 'char_010', text: '제 몫이 두 개입니다.' },
    ],
    [
      { speakerId: 'char_004', text: '권재하 씨는 취향 숨길 생각이 없네요.' },
      { speakerId: 'char_010', text: '좋아하는 건 좋아한다고 합니다. 이제는 사람도.' },
    ],
    [
      { speakerId: 'char_010', text: '이 상자는 확인해도 됩니까?' },
      { speakerId: 'char_004', text: '안 돼요. 은하수 깜짝 선물이에요.' },
      { speakerId: 'char_010', text: '위험물은 아닙니까?' },
      { speakerId: 'char_004', text: '설탕이 좀 위험하긴 하죠.' },
    ],
  ],
  'char_004|char_011': [
    [
      { speakerId: 'char_011', text: '사람 기분 좋게 만드는 직업끼리 만났네요.' },
      { speakerId: 'char_004', text: '우린 퇴근하면 조용해지는 것도 비슷하고요.' },
      { speakerId: 'char_011', text: '은하수 앞에서는 둘 다 좀 시끄럽지만.' },
    ],
    [
      { speakerId: 'char_004', text: '별 모양 마카롱 만들까요?' },
      { speakerId: 'char_011', text: '좋아요. 은하수한테 주는 건 제가 별 하나 더 얹을래요.' },
    ],
    [
      { speakerId: 'char_011', text: '관객 기분 맞히는 건 제가 더 잘해요.' },
      { speakerId: 'char_004', text: '전 맛까지 맞힐 수 있는데.' },
      { speakerId: 'char_011', text: '은하수 웃게 하는 건요?' },
      { speakerId: 'char_004', text: '…그건 공동 1등 합시다.' },
    ],
  ],
  'char_004|char_012': [
    [
      { speakerId: 'char_012', text: '어떤 맛은 기억보다 오래 남습니까?' },
      { speakerId: 'char_004', text: '사람마다 달라요. 진이현 씨는 아마 기다림 맛일 것 같은데.' },
      { speakerId: 'char_012', text: '…별로 달지는 않겠군요.' },
    ],
    [
      { speakerId: 'char_004', text: '은하수한테 처음 만들어준 맛 기억해요?' },
      { speakerId: 'char_012', text: '저는 처음이 너무 많아서. 이번 처음은 기억합니다.' },
    ],
    [
      { speakerId: 'char_012', text: '기억이 맛으로 남기도 합니까?' },
      { speakerId: 'char_004', text: '가끔은요. 그래서 무서웠던 적도 있고.' },
      { speakerId: 'char_012', text: '저는 기억이 없어져도 감정이 남았습니다.' },
      { speakerId: 'char_004', text: '그럼 은하수 관련은 둘 다 꽤 질긴 편이네요.' },
    ],
  ],
  'char_005|char_006': [
    [
      { speakerId: 'char_005', text: '물가에서 이상한 흔적을 보면 건드리지 마십시오.' },
      { speakerId: 'char_006', text: '제 영역이면 제가 먼저 알아요.' },
      { speakerId: 'char_005', text: '그럼 은하수 씨가 가까이 못 가게 해주세요.' },
      { speakerId: 'char_006', text: '그건 완전 동의.' },
    ],
    [
      { speakerId: 'char_006', text: '강태겸 씨 화분, 물 너무 적게 줘요.' },
      { speakerId: 'char_005', text: '종류마다 다릅니다.' },
      { speakerId: 'char_006', text: '저 물 전문가인데.' },
      { speakerId: 'char_005', text: '강 전문 아닙니까.' },
    ],
    [
      { speakerId: 'char_006', text: '강에 이상한 게 떠내려오면 부르면 돼요?' },
      { speakerId: 'char_005', text: '만지지 말고 부르십시오.' },
      { speakerId: 'char_006', text: '저 물에서 꽤 강한데.' },
      { speakerId: 'char_005', text: '그래도. 은하수 씨한테도 그렇게 말합니다.' },
    ],
  ],
  'char_005|char_007': [
    [
      { speakerId: 'char_007', text: '저 괴물 나오면 싸울 수 있어요.' },
      { speakerId: 'char_005', text: '학생은 뒤에 있으십시오.' },
      { speakerId: 'char_007', text: '옛날엔 제가 앞이었는데.' },
      { speakerId: 'char_005', text: '지금은 고3입니다.' },
    ],
    [
      { speakerId: 'char_005', text: '귀가 시간 지키십시오.' },
      { speakerId: 'char_007', text: '문해준 씨도 아니면서요.' },
      { speakerId: 'char_005', text: '그 사람 말이 맞으니까.' },
    ],
    [
      { speakerId: 'char_007', text: '그 장갑 진짜 멋있어요.' },
      { speakerId: 'char_005', text: '일할 때 쓰는 겁니다.' },
      { speakerId: 'char_007', text: '은하수는 맨손이 더 좋다던데.' },
      { speakerId: 'char_005', text: '…누가 그런 얘기를 했습니까?' },
    ],
  ],
  'char_005|char_008': [
    [
      { speakerId: 'char_008', text: '장갑 벗은 손 그려도 돼요?' },
      { speakerId: 'char_005', text: '왜요.' },
      { speakerId: 'char_008', text: '은하수가 그 장면 좋아할 것 같아서.' },
      { speakerId: 'char_005', text: '…본인한테 물어보십시오.' },
    ],
    [
      { speakerId: 'char_005', text: '완성 못 한 그림은 버리지 마십시오.' },
      { speakerId: 'char_008', text: '강태겸 씨가 그런 말 하니까 묘하게 설득력 있네요.' },
    ],
    [
      { speakerId: 'char_008', text: '흔적을 지우기 전에 그림으로 남기면 안 돼요?' },
      { speakerId: 'char_005', text: '위험하지 않은 것만.' },
      { speakerId: 'char_008', text: '은하수도 똑같이 말했어요. 남겨야 할 건 남기자고.' },
      { speakerId: 'char_005', text: '그래서 여기 있는 겁니다.' },
    ],
  ],
  'char_005|char_009': [
    [
      { speakerId: 'char_009', text: '흔적을 없애는 일은 마음에 남겠군요.' },
      { speakerId: 'char_005', text: '남습니다. 그래서 없앨 것과 남길 걸 구분합니다.' },
      { speakerId: 'char_009', text: '은하수 씨는 후자겠네요.' },
      { speakerId: 'char_005', text: '당연합니다.' },
    ],
    [
      { speakerId: 'char_005', text: '문양이 진해졌습니다.' },
      { speakerId: 'char_009', text: '괜찮습니다.' },
      { speakerId: 'char_005', text: '그 판단은 제가 하겠습니다. …은하수 앞에서는 특히.' },
    ],
    [
      { speakerId: 'char_009', text: '감정을 억누르는 것과 흔적을 지우는 건 조금 닮았습니다.' },
      { speakerId: 'char_005', text: '둘 다 너무 많이 하면 문제가 생기죠.' },
      { speakerId: 'char_009', text: '은하수 씨가 그걸 가르쳐줬군요.' },
      { speakerId: 'char_005', text: '아마 서로에게요.' },
    ],
  ],
  'char_005|char_010': [
    [
      { speakerId: 'char_010', text: '당신은 사건 뒤를 맡고, 저는 앞을 맡았었군요.' },
      { speakerId: 'char_005', text: '둘 다 좋은 직업은 아니었습니다.' },
      { speakerId: 'char_010', text: '그래도 지금은 지키고 싶은 사람이 같군요.' },
    ],
    [
      { speakerId: 'char_005', text: '조직 냄새는 안 납니다.' },
      { speakerId: 'char_010', text: '당신도 처리반 냄새는 덜 나는군요. 화분 때문인가.' },
    ],
    [
      { speakerId: 'char_010', text: '당신은 사건 뒤를 처리하고 저는 앞을 막습니다.' },
      { speakerId: 'char_005', text: '그래서 같이 있으면 할 일이 줄어들겠군요.' },
      { speakerId: 'char_010', text: '은하수 씨 곁에서는 그게 좋습니다.' },
      { speakerId: 'char_005', text: '동감입니다.' },
    ],
  ],
  'char_005|char_011': [
    [
      { speakerId: 'char_011', text: '장갑 안에 뭐 숨긴 마술 같은 건 없어요?' },
      { speakerId: 'char_005', text: '없습니다.' },
      { speakerId: 'char_011', text: '은하수한테만 보여주는 건?' },
      { speakerId: 'char_005', text: '…맨손 정도는.' },
    ],
    [
      { speakerId: 'char_005', text: '빛은 흔적을 남깁니다.' },
      { speakerId: 'char_011', text: '그럼 오늘은 조금만 쓸게요. 없어지기 싫은 흔적만.' },
    ],
    [
      { speakerId: 'char_011', text: '야간 청소 끝나고 공연 보러 온 적 있어요?' },
      { speakerId: 'char_005', text: '없습니다.' },
      { speakerId: 'char_011', text: '은하수랑 오면 자리 좋은 데 잡아줄게요.' },
      { speakerId: 'char_005', text: '…생각해보죠.' },
    ],
  ],
  'char_005|char_012': [
    [
      { speakerId: 'char_012', text: '지운 흔적도 어딘가에는 남습니까?' },
      { speakerId: 'char_005', text: '사람이 기억하면요.' },
      { speakerId: 'char_012', text: '그 대답, 마음에 드네요.' },
    ],
    [
      { speakerId: 'char_005', text: '시간을 되돌려도 흔적은 남았습니까?' },
      { speakerId: 'char_012', text: '저한테는요. 그래서 이제 안 돌리려고 합니다.' },
    ],
    [
      { speakerId: 'char_012', text: '사라진 흔적을 다시 찾고 싶었던 적 있습니까?' },
      { speakerId: 'char_005', text: '매일 있었습니다.' },
      { speakerId: 'char_012', text: '저도 비슷했습니다.' },
      { speakerId: 'char_005', text: '이제는 둘 다 지금 있는 걸 지키면 됩니다.' },
    ],
  ],
  'char_006|char_007': [
    [
      { speakerId: 'char_006', text: '수영 가르쳐줄까요?' },
      { speakerId: 'char_007', text: '저 옛날엔 강도 건넜습니다.' },
      { speakerId: 'char_006', text: '수영으로?' },
      { speakerId: 'char_007', text: '…그건 기억이 애매한데요.' },
    ],
    [
      { speakerId: 'char_007', text: '백시온 씨는 나이 안 먹는다는 게 어떤 기분이에요?' },
      { speakerId: 'char_006', text: '요즘은 내년이 궁금해졌어요. 김휘람 씨랑 비슷할지도.' },
    ],
    [
      { speakerId: 'char_007', text: '옛날에도 수영 같은 거 했을까요?' },
      { speakerId: 'char_006', text: '빠지면 헤엄쳤겠죠?' },
      { speakerId: 'char_007', text: '그건 수영이 아니라 생존 아닌가요.' },
      { speakerId: 'char_006', text: '은하수랑 있더니 현대인 다 됐네.' },
    ],
  ],
  'char_006|char_008': [
    [
      { speakerId: 'char_008', text: '물방울 정지한 것처럼 그려보고 싶어요.' },
      { speakerId: 'char_006', text: '그럼 제가 가만히 있어야 해요?' },
      { speakerId: 'char_008', text: '네.' },
      { speakerId: 'char_006', text: '은하수 옆이면 가능.' },
    ],
    [
      { speakerId: 'char_006', text: '그림 완성하면 물에 안 젖게 해줄게요.' },
      { speakerId: 'char_008', text: '그 능력부터 좀 자세히 설명해봐요.' },
    ],
    [
      { speakerId: 'char_008', text: '물 표면 반사 그리는 거 진짜 어려워요.' },
      { speakerId: 'char_006', text: '강에 와서 보면 되죠.' },
      { speakerId: 'char_008', text: '은하수도 데려가도 돼요?' },
      { speakerId: 'char_006', text: '그 질문은 왜 저한테 해요. …당연히 좋지만.' },
    ],
  ],
  'char_006|char_009': [
    [
      { speakerId: 'char_009', text: '흐르는 대로 사는 법을 배워야 할지도 모르겠습니다.' },
      { speakerId: 'char_006', text: '쉬워요. 좋아하면 가고, 보고 싶으면 보면 돼요.' },
      { speakerId: 'char_009', text: '…은하수 씨에게는 연습 중입니다.' },
    ],
    [
      { speakerId: 'char_006', text: '차이겸 씨는 비 오는 날 더 힘들죠?' },
      { speakerId: 'char_009', text: '그렇습니다.' },
      { speakerId: 'char_006', text: '그럼 제가 비 좀 달래볼까요?' },
    ],
    [
      { speakerId: 'char_009', text: '흐르는 대로 사는 건 두렵지 않습니까?' },
      { speakerId: 'char_006', text: '가끔은요. 그래도 멈춰 있는 게 더 무서워요.' },
      { speakerId: 'char_009', text: '저는 반대였는데, 요즘은 조금 이해합니다.' },
    ],
  ],
  'char_006|char_010': [
    [
      { speakerId: 'char_010', text: '물가에서는 당신이 앞서십시오.' },
      { speakerId: 'char_006', text: '육지에서는 권재하 씨가요?' },
      { speakerId: 'char_010', text: '은하수 씨가 원하는 사람이 앞섭니다.' },
      { speakerId: 'char_006', text: '오, 이제 진짜 잘 배웠네요.' },
    ],
    [
      { speakerId: 'char_006', text: '푸딩 물에 띄워 먹어본 적 있어요?' },
      { speakerId: 'char_010', text: '없고, 앞으로도 없습니다.' },
    ],
    [
      { speakerId: 'char_010', text: '물가에서는 제가 지키기 어렵습니다.' },
      { speakerId: 'char_006', text: '거긴 제가 지킬게요.' },
      { speakerId: 'char_010', text: '육지는 제가 맡겠습니다.' },
      { speakerId: 'char_006', text: '은하수 하나 지키려고 영역 분담까지 하네.' },
    ],
  ],
  'char_006|char_011': [
    [
      { speakerId: 'char_011', text: '물 위에 별빛 띄우면 엄청 예뻐요.' },
      { speakerId: 'char_006', text: '은하수 데려가서 해봐요.' },
      { speakerId: 'char_011', text: '둘이서요?' },
      { speakerId: 'char_006', text: '…셋도 되긴 하는데.' },
    ],
    [
      { speakerId: 'char_006', text: '진짜 마법이면 물속에서도 빛나요?' },
      { speakerId: 'char_011', text: '시험해볼까요?' },
      { speakerId: 'char_006', text: '은하수 보는 데서만.' },
    ],
    [
      { speakerId: 'char_011', text: '물 위에서 마술하면 멋있겠다.' },
      { speakerId: 'char_006', text: '빠뜨리지만 마요.' },
      { speakerId: 'char_011', text: '은하수가 보면 성공률 올라가요.' },
      { speakerId: 'char_006', text: '그건 저도 그래요.' },
    ],
  ],
  'char_006|char_012': [
    [
      { speakerId: 'char_012', text: '강물은 같은 곳을 두 번 지나지 않는다고 하죠.' },
      { speakerId: 'char_006', text: '근데 돌아오긴 해요. 비 되고, 강 되고.' },
      { speakerId: 'char_012', text: '…그 말이 예전의 저에게 필요했겠네요.' },
    ],
    [
      { speakerId: 'char_006', text: '시간도 물처럼 그냥 흐르게 두면 편해요.' },
      { speakerId: 'char_012', text: '이제는 그러려고 합니다. 옆에 붙잡을 사람이 있어서.' },
    ],
    [
      { speakerId: 'char_012', text: '물은 같은 자리로 돌아오지 않겠죠.' },
      { speakerId: 'char_006', text: '그래도 다시 만날 수는 있어요. 바다에서든 비에서든.' },
      { speakerId: 'char_012', text: '…좋은 방식이네요. 돌아가는 것보다.' },
    ],
  ],
  'char_007|char_008': [
    [
      { speakerId: 'char_008', text: '교복 입은 자세가 너무 반듯해서 모델 같아요.' },
      { speakerId: 'char_007', text: '그림은 괜찮은데 오래 앉아있는 건…' },
      { speakerId: 'char_008', text: '은하수 옆에 앉히면요?' },
      { speakerId: 'char_007', text: '얼마나 오래요?' },
    ],
    [
      { speakerId: 'char_007', text: '완성했다고 쓰는 거 멋있었어요.' },
      { speakerId: 'char_008', text: '졸업도 비슷하잖아요. 끝내고 다음 걸 시작하는 거.' },
    ],
    [
      { speakerId: 'char_008', text: '휘람아, 교복 포즈 한 번만.' },
      { speakerId: 'char_007', text: '싫어요. 은하수가 같이 서면 할게요.' },
      { speakerId: 'char_008', text: '조건이 갑자기 어려워졌네.' },
      { speakerId: 'char_007', text: '그럼 안 해도 됩니다.' },
    ],
  ],
  'char_007|char_009': [
    [
      { speakerId: 'char_009', text: '과거의 기억과 지금의 감정은 구분됩니까?' },
      { speakerId: 'char_007', text: '요즘은 좀요. 은하수를 좋아하는 건 확실히 지금의 저예요.' },
      { speakerId: 'char_009', text: '좋은 대답이군요.' },
    ],
    [
      { speakerId: 'char_007', text: '차이겸 씨도 옛날 말 잘 알아요?' },
      { speakerId: 'char_009', text: '조금은요.' },
      { speakerId: 'char_007', text: '그럼 제 유행어보다 옛말이 더 통하겠네요.' },
    ],
    [
      { speakerId: 'char_007', text: '상담사면 시험 스트레스도 해결해줘요?' },
      { speakerId: 'char_009', text: '조금은 도울 수 있습니다.' },
      { speakerId: 'char_007', text: '은하수 생각나서 집중 안 되는 것도요?' },
      { speakerId: 'char_009', text: '…그건 저도 해결법을 모릅니다.' },
    ],
  ],
  'char_007|char_010': [
    [
      { speakerId: 'char_010', text: '학생은 위험한 일에서 빠지십시오.' },
      { speakerId: 'char_007', text: '다들 똑같이 말해요.' },
      { speakerId: 'char_010', text: '다들 맞는 말을 하는 겁니다.' },
      { speakerId: 'char_007', text: '은하수도요?' },
      { speakerId: 'char_010', text: '특히 그분이요.' },
    ],
    [
      { speakerId: 'char_007', text: '저도 지키는 거 잘해요.' },
      { speakerId: 'char_010', text: '압니다. 그래서 이번엔 남으라고 하겠습니다. 살아서.' },
    ],
    [
      { speakerId: 'char_010', text: '귀가가 늦습니다. 학생이면 더 일찍 다니십시오.' },
      { speakerId: 'char_007', text: '은하수도 똑같이 말했어요.' },
      { speakerId: 'char_010', text: '그럼 들으십시오.' },
      { speakerId: 'char_007', text: '두 명한테 들으니까 더 억울한데요.' },
    ],
  ],
  'char_007|char_011': [
    [
      { speakerId: 'char_011', text: '토끼 모티프끼리네요.' },
      { speakerId: 'char_007', text: '제 건 화랑 토끼고 유리안 씨는 무대 토끼잖아요.' },
      { speakerId: 'char_011', text: '진이현까지 오면 토끼 회의인데.' },
      { speakerId: 'char_007', text: '그건 좀 보고 싶어요.' },
    ],
    [
      { speakerId: 'char_007', text: '별 스티커 하나 주세요.' },
      { speakerId: 'char_011', text: '은하수한테 줄 거죠?' },
      { speakerId: 'char_007', text: '…어떻게 알았어요?' },
    ],
    [
      { speakerId: 'char_011', text: '요즘 유행하는 거 하나만 가르쳐줘요.' },
      { speakerId: 'char_007', text: '저한테 배우면 타이밍 틀릴 수도 있어요.' },
      { speakerId: 'char_011', text: '그럼 은하수한테 같이 물어보죠.' },
      { speakerId: 'char_007', text: '그건 좀 창피한데… 같이면 괜찮아요.' },
    ],
  ],
  'char_007|char_012': [
    [
      { speakerId: 'char_007', text: '저는 과거가 너무 많이 남았고, 진이현 씨는 너무 많이 잃었네요.' },
      { speakerId: 'char_012', text: '그래서 둘 다 지금을 배우는 중인가 봅니다.' },
      { speakerId: 'char_007', text: '은하수랑 같이요.' },
    ],
    [
      { speakerId: 'char_012', text: '졸업식은 꼭 가겠습니다.' },
      { speakerId: 'char_007', text: '이번엔 늦지 마세요.' },
      { speakerId: 'char_012', text: '…그 약속은 꼭 지킬게.' },
    ],
    [
      { speakerId: 'char_007', text: '전 과거 기억이 너무 많은데, 진이현 씨는 잊는 게 무섭죠?' },
      { speakerId: 'char_012', text: '예전에는요.' },
      { speakerId: 'char_007', text: '지금은요?' },
      { speakerId: 'char_012', text: '오늘 새로 만들면 된다는 걸 배웠습니다.' },
    ],
  ],
  'char_008|char_009': [
    [
      { speakerId: 'char_008', text: '차이겸 씨 표정 진짜 미묘하게 바뀌는 거 알아요?' },
      { speakerId: 'char_009', text: '관찰하지 마십시오.' },
      { speakerId: 'char_008', text: '은하수 얘기할 때 제일 잘 보여요.' },
      { speakerId: 'char_009', text: '…그건 더 관찰하지 마십시오.' },
    ],
    [
      { speakerId: 'char_009', text: '완성하는 것이 여전히 두렵습니까?' },
      { speakerId: 'char_008', text: '네. 그래도 보여줄 사람이 생겨서 끝내요.' },
    ],
    [
      { speakerId: 'char_008', text: '차이겸 씨 표정 진짜 안 바뀌어요. 그리기 어려워요.' },
      { speakerId: 'char_009', text: '은하수 씨는 잘 알아보던데요.' },
      { speakerId: 'char_008', text: '그러니까요. 그게 좀 부러워요.' },
      { speakerId: 'char_009', text: '저는 오세현 씨가 먼저 보여주는 그림이 부럽습니다.' },
    ],
  ],
  'char_008|char_010': [
    [
      { speakerId: 'char_008', text: '흉터 그려도 돼요?' },
      { speakerId: 'char_010', text: '상관없습니다.' },
      { speakerId: 'char_008', text: '은하수도 같이 그려도요?' },
      { speakerId: 'char_010', text: '그건 본인 허락부터 받으십시오.' },
    ],
    [
      { speakerId: 'char_010', text: '관찰이 빠르군요.' },
      { speakerId: 'char_008', text: '권재하 씨는 움직임이 더 빨라요. 은하수 위험할 때 특히.' },
    ],
    [
      { speakerId: 'char_008', text: '권재하 씨 손 흉터, 그려도 돼요?' },
      { speakerId: 'char_010', text: '상관없습니다.' },
      { speakerId: 'char_008', text: '은하수한테 보여줄 건데요.' },
      { speakerId: 'char_010', text: '…조금 덜 무섭게 그려주십시오.' },
    ],
  ],
  'char_008|char_011': [
    [
      { speakerId: 'char_011', text: '무대 조명 아래서 그림 그리면 재밌겠다.' },
      { speakerId: 'char_008', text: '유리안 씨 가만히 있을 수 있어요?' },
      { speakerId: 'char_011', text: '은하수가 봐주면요.' },
      { speakerId: 'char_008', text: '그 조건은 저도 똑같은데.' },
    ],
    [
      { speakerId: 'char_008', text: '공연 끝난 얼굴이 더 그리고 싶어요.' },
      { speakerId: 'char_011', text: '…그건 은하수한테만 보여주는 얼굴인데.' },
    ],
    [
      { speakerId: 'char_011', text: '제 무대 스케치해줄래요?' },
      { speakerId: 'char_008', text: '좋죠. 대신 끝나고 평범한 유리안 씨도 그리고 싶어요.' },
      { speakerId: 'char_011', text: '그건 은하수한테 이미 들켰는데.' },
      { speakerId: 'char_008', text: '그럼 저도 늦게라도 볼래요.' },
    ],
  ],
  'char_008|char_012': [
    [
      { speakerId: 'char_008', text: '시계가 전부 다른 시간 가리키는 장면, 그리고 싶어요.' },
      { speakerId: 'char_012', text: '지금은 모두 같은 시간이면 좋겠습니다.' },
      { speakerId: 'char_008', text: '그럼 가운데 은하수 앉힐게요.' },
    ],
    [
      { speakerId: 'char_012', text: '완성하지 않으면 가능성이 남는다고 생각했습니까?' },
      { speakerId: 'char_008', text: '네. 진이현 씨는 되돌리면 가능성이 남는다고 생각했고요?' },
      { speakerId: 'char_012', text: '…비슷했네요.' },
    ],
    [
      { speakerId: 'char_008', text: '멈춘 시계 그리면 시간도 멈춘 느낌 날까요?' },
      { speakerId: 'char_012', text: '예전의 저는 그렇게 생각했을 겁니다.' },
      { speakerId: 'char_008', text: '지금은요?' },
      { speakerId: 'char_012', text: '움직이는 사람을 그리고 싶습니다. 은하수처럼.' },
    ],
  ],
  'char_009|char_010': [
    [
      { speakerId: 'char_010', text: '출구를 등지지 않는군요.' },
      { speakerId: 'char_009', text: '권재하 씨도 그렇습니다.' },
      { speakerId: 'char_010', text: '이유는 다르겠지만.' },
      { speakerId: 'char_009', text: '은하수 씨 옆에 앉을 때만은 비슷할지도요.' },
    ],
    [
      { speakerId: 'char_009', text: '보호하려는 마음과 통제는 가깝습니다.' },
      { speakerId: 'char_010', text: '압니다. 그래서 요즘은 먼저 묻습니다.' },
    ],
    [
      { speakerId: 'char_009', text: '경계하지 않아도 되는 공간에 익숙해지셨습니까?' },
      { speakerId: 'char_010', text: '조금은요. 당신은 감정 드러내는 데 익숙해졌습니까?' },
      { speakerId: 'char_009', text: '조금은요.' },
      { speakerId: 'char_010', text: '둘 다 은하수 씨 탓이군요.' },
    ],
  ],
  'char_009|char_011': [
    [
      { speakerId: 'char_011', text: '감정 분석해도 돼요?' },
      { speakerId: 'char_009', text: '제 직업을 거꾸로 사용하시는군요.' },
      { speakerId: 'char_011', text: '은하수 앞에서 얼굴 빨개지는 이유부터.' },
      { speakerId: 'char_009', text: '상담 종료하겠습니다.' },
    ],
    [
      { speakerId: 'char_009', text: '웃지 않아도 괜찮다는 말을 들으셨죠.' },
      { speakerId: 'char_011', text: '차이겸 씨도 침착하지 않아도 괜찮다고 들었잖아요. 우리 꽤 비슷해요.' },
    ],
    [
      { speakerId: 'char_011', text: '차이겸 씨도 별 스티커 붙여볼래요?' },
      { speakerId: 'char_009', text: '어디에 말입니까?' },
      { speakerId: 'char_011', text: '수첩에. 너무 점잖아서 하나쯤 필요해 보여요.' },
      { speakerId: 'char_009', text: '은하수 씨가 고른다면 생각해보겠습니다.' },
    ],
  ],
  'char_009|char_012': [
    [
      { speakerId: 'char_012', text: '감정을 억누르는 데 익숙하셨군요.' },
      { speakerId: 'char_009', text: '진이현 씨는 시간을 억누르는 데 익숙하셨고요.' },
      { speakerId: 'char_012', text: '둘 다 그만두는 중이네요.' },
    ],
    [
      { speakerId: 'char_009', text: '오늘은 현재에 계십니까?' },
      { speakerId: 'char_012', text: '네. 아주 확실하게. 은하수도 여기 있으니까.' },
    ],
    [
      { speakerId: 'char_012', text: '감정을 억누르는 데 익숙하셨죠.' },
      { speakerId: 'char_009', text: '진이현 씨는 시간을 되돌리는 데 익숙했고요.' },
      { speakerId: 'char_012', text: '둘 다 그만뒀군요.' },
      { speakerId: 'char_009', text: '네. 같은 이유로.' },
    ],
  ],
  'char_010|char_011': [
    [
      { speakerId: 'char_011', text: '권재하 씨 웃기는 거 도전해봐도 돼요?' },
      { speakerId: 'char_010', text: '굳이요?' },
      { speakerId: 'char_011', text: '은하수가 좋아할 것 같아서.' },
      { speakerId: 'char_010', text: '…한 번만 하십시오.' },
    ],
    [
      { speakerId: 'char_010', text: '빛을 너무 크게 쓰지 마십시오.' },
      { speakerId: 'char_011', text: '경호원 모드예요?' },
      { speakerId: 'char_010', text: '아뇨. 오늘은 데이트 방해 금지 모드입니다.' },
    ],
    [
      { speakerId: 'char_011', text: '권재하 씨, 무대 뒤 경호 한번 해볼래요?' },
      { speakerId: 'char_010', text: '필요하면 합니다.' },
      { speakerId: 'char_011', text: '은하수가 보러 오는 날.' },
      { speakerId: 'char_010', text: '그날은 객석 쪽도 확인하겠습니다.' },
    ],
  ],
  'char_010|char_012': [
    [
      { speakerId: 'char_010', text: '위험하면 시간을 돌릴 생각부터 합니까?' },
      { speakerId: 'char_012', text: '예전에는요.' },
      { speakerId: 'char_010', text: '지금은?' },
      { speakerId: 'char_012', text: '같이 버틸 생각부터 합니다.' },
    ],
    [
      { speakerId: 'char_012', text: '기다리는 동안 지키는 사람도 지칩니다.' },
      { speakerId: 'char_010', text: '그래서 이제는 지키기만 하지 않습니다. 같이 갑니다.' },
    ],
    [
      { speakerId: 'char_012', text: '지키기 위해 대신 선택한 적이 많습니까?' },
      { speakerId: 'char_010', text: '그랬습니다. 이제는 묻습니다.' },
      { speakerId: 'char_012', text: '저도 이제는 시간을 돌리기 전에 묻고 싶었을 겁니다.' },
      { speakerId: 'char_010', text: '지금 물을 수 있으니 됐습니다.' },
    ],
  ],
  'char_011|char_012': [
    [
      { speakerId: 'char_011', text: '시간 멈추는 마술은 제 레퍼토리에 없는데.' },
      { speakerId: 'char_012', text: '저도 이제 안 합니다.' },
      { speakerId: 'char_011', text: '좋네요. 은하수랑 있을 땐 시간이 가야 다음 데이트도 오니까.' },
    ],
    [
      { speakerId: 'char_012', text: '별은 오래전에 본 빛이라고 하죠.' },
      { speakerId: 'char_011', text: '그래도 지금 예쁘잖아요. 과거에서 왔다고 현재가 아닌 건 아니니까.' },
    ],
    [
      { speakerId: 'char_011', text: '오늘은 시계 안 멈춰요?' },
      { speakerId: 'char_012', text: '안 멈춥니다.' },
      { speakerId: 'char_011', text: '좋아요. 은하수랑 셋이 있으면 시간이 좀 빨리 가도 아깝긴 하지만.' },
      { speakerId: 'char_012', text: '그래도 다음이 오니까요.' },
    ],
  ],
}

export function getMyRoomSpecialPairDialogue(firstId: string, secondId: string, day: number): MyRoomPairVariant | null {
  const [a, b] = [firstId, secondId].sort()
  const variants = pairDialogue[`${a}|${b}`]
  if (!variants?.length) return null
  return variants[Math.max(0, day - 1) % variants.length] ?? variants[0]
}

export function getMyRoomPairMood(day: number) {
  const moods = [
    { label: 'A LITTLE JEALOUS', title: '말하지 않은 질투', note: '서로 아무렇지 않은 척하지만, 시선이 자꾸 같은 곳에 머문다.' },
    { label: 'SPECIAL COMBINATION', title: '둘만의 호흡', note: '당신이 없어도 통하는 말이 생겼다가, 결국 당신 이야기로 돌아온다.' },
    { label: 'SHARED SECRET', title: '작업실에 남은 비밀', note: '두 사람 모두 먼저 돌아갈 생각은 없어 보인다.' },
  ]
  return moods[Math.max(0, day - 1) % moods.length] ?? moods[0]
}
