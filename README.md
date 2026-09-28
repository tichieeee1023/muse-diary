# Muse Diary — STEP 14 Readability + Visual Direction

이번 버전은 기존 `first / familiar / close` 반복 대화 구조를 폐기하고, **12명 각각을 하나의 공략 루트**로 다시 설계한 버전입니다.

## 핵심 변경

- 캐릭터 추가 중단: 최종 공략 대상은 현재 12명으로 고정
- 첫 만남부터 전원이 주인공에게 호감을 갖는 구조 폐기
  - 무관심 / 업무적 / 경계 / 비판적 / 관찰적 호기심 등 서로 다른 출발점
  - `진이현(char_012)`만 처음부터 설명되지 않는 특별한 감정이 있는 예외
- 캐릭터당 중요 호감도 이벤트 5개
  - 20 / 40 / 60 / 80 / 100
- 캐릭터당 casual 일상 이벤트 8개
  - 현재 총 96개
  - casual을 반복하며 호감도를 쌓아 다음 중요 이벤트를 해금
- 중요 이벤트는 조건에 도달한 뒤 **다음 조우 시 우선 재생**
- 선택지를 매 장면마다 강제하지 않음
  - 중요 이벤트: 핵심 선택 1회 중심
  - casual: 대부분 자동 진행, 일부만 선택
- 전 캐릭터 갭모에 설계
  - `profile.json`에 겉인상 / 갭 / 약점 / 후반 변화 / 말투 규칙 분리
- 대사 데이터를 캐릭터별 JSON으로 완전 분할

## 캐릭터 데이터 구조

```text
src/data/characters/
├─ index.ts
├─ char_001/
│  ├─ profile.json
│  ├─ route.json
│  ├─ first.json
│  ├─ story/
│  │  ├─ affinity-20.json
│  │  ├─ affinity-40.json
│  │  ├─ affinity-60.json
│  │  ├─ affinity-80.json
│  │  └─ affinity-100.json
│  └─ casual/
│     ├─ casual-01.json
│     └─ ... casual-08.json
└─ char_012/ ...
```

12명 기준:

- 첫 만남 12개
- 중요 공략 이벤트 60개
- 일상 이벤트 96개
- 총 168개 조우 에피소드

## 일러스트 구조

각 캐릭터 폴더:

```text
public/assets/characters/char_001/
├─ main.webp
├─ smile.webp
├─ troubled.webp
├─ hmm.webp
├─ ending-cg.webp
└─ ending-doll.webp
```

- `main / smile / troubled / hmm`: 일반 조우 표정 4종
- `ending-cg.webp`: 공략 완료 풀 일러스트
- `ending-doll.webp`: SECRET STORY 이후 해금되는 MUSE DOLL
- 실제 이미지가 아직 폴더에 없으면 게임에서는 심볼 플레이스홀더가 자동 표시됩니다.

## 공략 흐름

```text
첫 만남
↓
casual / 일상 만남
↓ 호감도 20
중요 이벤트 1
↓
casual
↓ 호감도 40
중요 이벤트 2
↓
...
↓ 호감도 100
중요 이벤트 5
↓
ENDING CG
↓
SECRET STORY
↓
MUSE DOLL
```

## UI 변경

- 장소 16:9 배경은 유지
- 인물 일러스트는 4:5 카드형 스테이지로 표시
- 이름 + 대사는 기존 비주얼노벨식 표기 유지
- 서술은 대사 사이에서 충분히 흐르고, 선택지는 필요한 순간에만 등장
- 다이어리에 `공략 이벤트 0/5` 진행도 추가
- 4표정 Visual Archive / Ending CG / Muse Doll 슬롯 추가

## 에셋 넣기

사용자가 준비한 이미지를 각 `public/assets/characters/char_XXX/` 폴더의 README에 적힌 파일명 그대로 넣으면 됩니다.

## 실행

```bash
npm install
npm run dev
```



## STEP 14A — 가독성 설정 (중간 저장 완료)

- 기본 본문을 여리여리한 서체에서 **굵기 있는 고딕 계열**로 변경
- 설정 > 읽기 설정 추가
  - 또렷한 고딕 / 프리텐다드 계열 / 기기 기본 고딕
  - 글씨 크기 보통 / 중간 / 크게
- 기본값은 `또렷한 고딕 + 중간`
- 본문·대사·선택지·보조문구가 함께 확대되며 작은 모바일에서도 다시 축소되지 않음
- 설정은 기존 localStorage 저장 데이터와 함께 유지


## STEP 14B — 일러스트 실제 연결 + 연출 (중간 저장 완료)

- `assets.zip`의 장소 배경과 12인 캐릭터 에셋을 `public/assets`에 실제 연결
- 12명 모두 `MAIN / SMILE / TROUBLED / HMM / ENDING CG / ENDING DOLL` 확인
- 오세현의 `troubled (2).webp` 파일명은 게임 경로에 맞게 `troubled.webp`로 정규화
- 캐릭터 표정 변경 시 가벼운 페이드/줌 전환
- 중요 호감도 이벤트는 일반 casual보다 강한 스테이지 연출
- SSR 중요 이벤트/첫 발견에 별도 광원·강조 연출
- 엔딩 풀 CG는 모바일 화면 폭을 넓게 쓰는 시네마틱 공개 연출
- 인물 도감 목록에도 실제 얼굴 썸네일 표시
- `prefers-reduced-motion` 환경에서는 애니메이션 자동 비활성화
