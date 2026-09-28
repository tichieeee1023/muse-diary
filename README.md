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

## STEP 14 C1 — 서도윤 루트 재작성
- 설정집 기준으로 서도윤 1인만 재작성
- 첫 만남 1개, casual 8개, 호감도 메인 이벤트 5개
- 핵심 축: 기억 / 남겨진 흔적 / 조용한 다정함 / 은근한 질투 / 상실 이후 다시 관계를 선택하는 변화
- 첫 만남에서 주인공에게 호감 표시 없음
- 갭모에: 무던해 보이지만 은근히 삐짐, 자신이 기억되는 상황에 약함
- 현실계 캐릭터답게 초능력 없음. 대신 기록과 자료를 통해 비일상의 흔적을 가장 먼저 인지


## STEP 14 C3 — 문해준 루트 재작성
- 설정집 기준으로 문해준 1인만 재작성
- 첫 만남 1개, casual 8개, 호감도 메인 이벤트 5개
- 핵심 축: 책임 / 귀가 / 기다림 / 보호 / 존재하지 않는 막차 승객
- 첫 만남은 철저히 업무적이며 연애적 호감 없음
- 갭모에: 단호한 보호자이지만 길고양이에게 유난히 약함
- 후반 변화: 보호해야 할 사람 → 함께 판단하고 같이 돌아갈 사람

## STEP 14 C5 — 이로운 루트 재작성
- 설정집 기준으로 이로운 1인만 재작성
- 첫 만남 1개, casual 8개, 호감도 메인 이벤트 5개
- 핵심 축: 감정의 맛 / 누구에게나 능숙한 친절 / 자기 감정에는 둔함 / 꿈의 잔향 / 과거의 죄책감
- 첫 만남의 친절은 연애적 호감이 아니라 원래 누구에게나 능숙한 서비스 태도
- 갭모에: 달콤한 파티시에인데 단 음식을 싫어하고 매운 국물 요리를 좋아함
- 비일상은 그림자의 미세한 지연 → 꿈의 변화 → 정체와 과거 순서로 단계적으로 공개
- 후반 변화: 타인의 기분을 맞히는 사람 → 자신의 취향과 감정을 먼저 말하는 사람


## STEP 14 Story Overhaul — 12 Routes Complete

- 12 existing characters only; no new characters added.
- Each route now uses: 1 first encounter + 8 casual encounters + 5 affinity story events.
- Affinity thresholds: 20 / 40 / 60 / 80 / 100.
- Casual encounters build familiarity and gap-moe before major story beats unlock.
- Only Jin Ihyeon starts with a special emotional reaction to the heroine.
- All other characters begin from neutral, guarded, professional, curious, or generally friendly positions rather than immediate romantic interest.
- Character writing follows the current 12-character setting bible: surface personality, gap-moe, private weakness, hidden past, supernatural reveal order, and late-route behavioral change.
- Character portraits use MAIN / SMILE / TROUBLED / HMM; ending full CG and MUSE DOLL assets remain connected.
- Readability/font settings and visual presentation from STEP 14 checkpoint B are retained.

### Route count

12 characters × (1 first + 8 casual + 5 affinity) = 168 encounter episodes.


## STEP 15 - Small Polish Pack

- 호감도 이벤트 조건 충족 시 홈/도감에 `NEW EVENT` 표시
- 캐릭터 상세에 마지막 만남 요약
- 4표정 + 엔딩 CG + MUSE DOLL 통합 일러스트 갤러리/확대 보기
- 첫 만남/호감도 중요 이벤트 전용 타이틀 카드
- 캐릭터별 테마 문구와 재회 랜덤 한마디
- 공략 완료 캐릭터의 작업실 짧은 방문(행동력 소모 없음)
- 도감 필터(현실/비일상/희귀도/완료)
- 설정의 텍스트 표시 속도(즉시/보통/천천히)
- 공략 완료 캐릭터 이름 옆 MUSE DOLL 아이콘
- 표정 해금 시스템은 요청에 따라 추가하지 않음

## STEP 15.1 hotfix
- `src/data/characters.json` and `src/data/characters/index.ts` can both match an extensionless `../data/characters` import in Vite resolution.
- Route helper imports now explicitly target `../data/characters/index` in `LocationPage`, `CharacterDiaryPage`, `CharacterPortrait`, and `storyEngine`.
- `encounterEngine` intentionally continues to import `characters.json` directly.
- Added an empty data-URI favicon declaration to prevent the harmless `/favicon.ico` 404 warning.
- No `share-modal.js` or `share-modal` DOM hook exists in this project snapshot; a related console error is therefore external/stale-page code rather than this Muse Diary source tree.


## STEP 16 — 장소/일상 조우 확장
- 독립서점, 편의점, 루프탑, 야시장, 아쿠아리움 장소 구조 추가
- 밤 도서관 지원
- 기존 12인 전원에게 새 장소 전용 casual 2개씩 추가 (총 24개)
- 새 장소 casual은 해당 장소에서 우선 재생
- 편의점/루프탑/야시장/아쿠아리움은 관련 캐릭터를 발견하면 해금
- 장소 카드에 NEW EVENT / 낯선 기척 / 익숙한 기척 표시
- 다음 날 이동을 브라우저 경고 대신 게임 내 모달 + 오늘 만난 사람 요약 + D+1 전환으로 변경

### 새 배경 예상 경로
- `/assets/backgrounds/bookstore/day.webp`, `night.webp`, `backroom.webp`
- `/assets/backgrounds/convenience/main.webp`
- `/assets/backgrounds/rooftop/day.webp`, `night.webp`
- `/assets/backgrounds/night-market/night.webp`
- `/assets/backgrounds/aquarium/main.webp`
- `/assets/backgrounds/library/night.webp`

## STEP 17 — City Map Hub
- 외출 장소를 카드 목록뿐 아니라 가상의 도시 지도에서 선택할 수 있습니다.
- 오늘의 외출 후보는 밝은 핀으로, 잠긴/오늘 선택되지 않은 장소는 흐린 핀으로 표시됩니다.
- 장소 핀을 누르면 장소 설명, 기척 힌트, 방문 가능 여부를 확인한 뒤 입장합니다.
- 지도/목록 보기를 전환할 수 있어 모바일 접근성을 유지합니다.
- 날씨에 따라 지도 분위기가 미세하게 달라집니다.

## STEP 18 — Interaction / UIUX polish
- 선택지 hover / focus / press 상태 강화
- 선택지 번호 칩과 좌측 강조선으로 선택 가능성 가시화
- 메인/보조 버튼 hover·press 피드백
- 장소 카드 / 세부 동선 카드 hover·press 및 아이콘/화살표 반응
- 지도 핀 hover·press 피드백
- 도감 필터 / 지도·목록 탭 / 하단 내비게이션 상태 강화
- 갤러리 썸네일 상호작용 피드백
- 키보드 focus-visible 및 reduced-motion 대응


## STEP 19 — Final asset merge
- 추가 배경 9종 실제 에셋 병합: 독립서점(낮/밤/백룸), 편의점, 루프탑(낮/밤), 야시장, 아쿠아리움, 밤 도서관
- SD 12인 실제 에셋 병합 및 마이룸/도감/NEW·COMPLETE 연출에 연결
- 최초 이름 입력 예시를 `은방울`로 변경
