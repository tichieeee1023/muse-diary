# Muse Diary — STEP 14 Readability + Visual Direction

이번 버전은 기존 `first / familiar / close` 반복 대화 구조를 폐기하고, **12명 각각을 하나의 공략 루트**로 다시 설계한 버전입니다.

## 핵심 변경

- 캐릭터 추가 중단: 최종 공략 대상은 현재 12명으로 고정
- 첫 만남부터 전원이 주인공에게 호감을 갖는 구조 폐기
  - 무관심 / 업무적 / 경계 / 비판적 / 관찰적 호기심 등 서로 다른 출발점
  - `진이현(char_012)`만 처음부터 설명되지 않는 특별한 감정이 있는 예외
- 캐릭터당 중요 호감도 이벤트 5개
  - 20 / 40 / 60 / 80 / 100
- 캐릭터별 casual 일상 이벤트 12~15개
  - 현재 총 162개
  - 장소·시간별 전용 이벤트를 우선하고, 최근 본 DAILY는 반복 우선순위에서 제외
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
│     └─ ... casual-12~15.json
└─ char_012/ ...
```

12명 기준:

- 첫 만남 12개
- 중요 공략 이벤트 60개
- 일상 이벤트 162개
- 총 234개 조우 에피소드

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


## V2 STEP 2A — DAILY MOMENT 1차 확장

- 기존 120개 DAILY에 **28개 신규 일상 이벤트** 추가 → 총 148개
- 빈 생활권 우선 보강: BAR / 오래된 상가거리 / 카페 / 지하철 / 아쿠아리움 등
- 김휘람 도서관은 낮·밤·저호감·중호감 전용 장면 4개 추가
- 김휘람 `폐관 방송 뒤`는 서사형 일회 이벤트로 변경 (`repeatable: false`)
- 신규 28개는 전부 일회성 DAILY로 설정해 반복 플레이 체감 완화
- 캐릭터별 `route.json`의 `casualEventCount`를 실제 파일 수와 동기화
- 다음 단계에서는 신규 해금 장소(루프탑/야시장/아쿠아리움/편의점) 전용 DAILY 밀도와 등장 가중치를 추가 조정


## V2 STEP 2B — 해금 장소 밀도 + 재등장 밸런스

- 신규 해금 장소 중심 DAILY **14개 추가** → 총 162개
- 해금 주체 캐릭터의 장소별 전용 DAILY를 최소 3개 수준으로 보강
  - 편의점: 문해준 / 김휘람
  - 루프탑: 한주원 / 강태겸 / 권재하 / 진이현
  - 야시장: 이로운 (유리안은 기존 풀이 충분해 유지)
  - 아쿠아리움: 오세현 (백시온은 기존 풀이 충분해 유지)
- 해당 해금 장소에서 핵심 캐릭터가 체감상 더 자주 보이도록 `spawnRules.weight` 상향
- SSR인 유리안 / 진이현은 기본 희귀도 가중치 때문에 묻히지 않도록 장소 전용 가중치를 별도 보정
- 편의점 / 루프탑 / 야시장 / 아쿠아리움은 해금 이후 일일 방문 후보에 약 30% 추가 가중치 적용
- 추가 DAILY 14개는 모두 일회성(`repeatable: false`)으로 설정

## V2 STEP 4-A — 봄 계절 대형 이벤트

- `DAY 7` 이후, 아직 봄 이벤트를 완료하지 않았고 첫 만남을 끝낸 캐릭터가 2명 이상이면 **SPECIAL DAY · 봄밤 개장**이 발생합니다.
- SPECIAL DAY에는 일반 외출 루프 대신 계절 이벤트가 우선됩니다.
- 플레이어가 동행 캐릭터를 직접 선택합니다. 최고 호감도 캐릭터가 자동 지정되지 않습니다.
- 공통 사건 + 캐릭터별 전용 파트 구조이며 12명 전원에게 별도 봄 데이트 장면과 선택지 3개가 있습니다.
- 호감도에 따라 캐릭터 전용 문구가 `early / close / deep` 3단계로 달라집니다.
- 선택지 보너스 + 계절 이벤트 기본 보상으로 약 `+13~15`의 호감도 상승을 기대할 수 있습니다(100 상한 적용).
- 완료 시 그날의 일반 외출은 종료되며, `기록 > 계절의 기억`에 **눌러 말린 벚꽃**과 동행 캐릭터별 기념 문구가 저장됩니다.
- 저장 키는 `muse-diary-save-v10`이며 v9 이하 저장 데이터를 자동 마이그레이션합니다.

이 구조는 이후 여름/가을/겨울 대형 이벤트가 같은 시스템을 재사용할 수 있도록 분리했습니다.

## V2 STEP 4-B — 여름 SPECIAL DAY · 불꽃놀이

- `DAY 14` 이후, 봄 SPECIAL DAY를 완료한 다음 날부터 여름 이벤트가 열립니다.
- 공통 사건 1개 + 12명 캐릭터별 짧은 전용 데이트 분기 구조입니다.
- 플레이어가 동행 캐릭터를 직접 선택합니다.
- 캐릭터별 전용 선택지 3개, 호감도 단계(초기/친밀/깊은 관계)에 따른 대사 변화가 있습니다.
- 봄보다 한 단계 적극적인 연애 연출을 사용합니다: 인파 속 손잡기, 가까운 거리, 귓가 대화, 불꽃보다 상대를 보는 장면 등.
- 기본 보상 `+13` + 선택지 `+2~3`으로 총 `+15~16` 호감도를 얻습니다.
- 이벤트 완료 시 그날 행동력이 0이 되고 `빛이 꺼진 야광 팔찌`가 계절 기억에 저장됩니다.
- 기존 봄 기록에도 `season` 메타데이터를 추가했으며 v10 저장 데이터는 v11로 자동 마이그레이션됩니다.

## V2 STEP 4-C — 가을 SPECIAL DAY · 늦가을 정원

- `DAY 21` 이후, 여름 SPECIAL DAY를 완료한 다음 날부터 가을 이벤트가 열립니다.
- 북적이는 축제 대신 **수변 정원 늦가을 특별 개방**을 배경으로 한 조용한 산책 데이트입니다.
- 공통 사건 + 12명 캐릭터별 전용 파트 구조를 유지하되, 가을에는 각 루트마다 다른 캐릭터가 아주 짧게 스쳐 지나가는 **CAMEO** 장면을 추가했습니다.
- 가을의 관계 톤은 첫 설렘이나 밀착보다 **이미 제법 익숙해진 두 사람의 생활형 연애**에 맞췄습니다. 팔짱, 음료 나눠 마시기, 낙엽 떼어주기, 일부러 먼 길로 돌아가기 같은 선택지가 중심입니다.
- 기본 보상 `+14` + 선택지 `+2~3`으로 총 `+16~17` 호감도를 얻습니다(100 상한 적용).
- 완료 시 `붉은 잎이 찍힌 정원 입장권`이 `기록 > 계절의 기억`에 저장됩니다.
- 저장 데이터 스키마는 여름 단계와 동일하여 save version은 v11을 유지합니다.

## V2 STEP 4-D — WINTER SPECIAL DAY · 눈이 머무는 산장

- 발생 조건: `DAY 28+`, 가을 SPECIAL DAY 완료 후 다음 날부터
- 장소: 한국식 산림 편백 휴양관 / 편백나무탕 / 족욕 / 벽난로 라운지 / 설경 산책길
- 구조: 공통 겨울 나들이 → 폭설로 마지막 셔틀 지연 → 선택한 캐릭터의 1:1 전용 장면 → 밤눈 속 마무리
- 동행자는 자동 지정하지 않고, 첫 만남을 완료한 캐릭터 중 플레이어가 직접 선택
- 캐릭터별 전용 선택지 3개, 호감도에 따라 `early / close / deep` 대사 변화
- 기본 호감도 보상 `+16` + 선택지 보상 `+2~3`
- 계절 기념품: `작은 눈꽃 나무 오너먼트`
- 김휘람은 편백탕 로맨스 대신 `야외 족욕 / 유자차 / 처마 밑 설경`으로 별도 구성
  - 핵심 테마: 과거에는 갖지 못했던 `내년 / 졸업 이후 / 성인이 된 미래`를 처음 기대하는 장면
  - 대표 대사 축: `제가 성인이 되면…… 그때 직접 물어볼게요.`
- 진이현은 기존 반존대 규칙 유지
  - 정중함은 현재의 주인공을 위한 거리두기, 툭 튀어나오는 반말은 오래된 친밀함의 습관으로 사용
- `Records > 계절의 기억`에 WINTER 기록과 기념품이 저장됨

### 계절 SPECIAL DAY 완성

- SPRING · DAY 7+ — 봄밤 개장 / 첫 설렘
- SUMMER · DAY 14+ — 여름 불꽃제 / 밀착
- AUTUMN · DAY 21+ — 늦가을 정원 / 익숙한 연애 + 카메오
- WINTER · DAY 28+ — 눈이 머무는 산장 / 한 해 최고 당도 + 다음 계절 약속

## V2 STEP 7-B1 — 텍스트 프롤로그 / 레트로 대사음
- 새 게임의 START 이후 `???` 텍스트 프롤로그가 재생됩니다. 저장된 게임의 CONTINUE에는 재생하지 않습니다.
- 대사는 글자 단위로 타이핑되며, 외부 음원 없이 Web Audio API oscillator로 짧은 레트로 블립음을 생성합니다.
- 모든 글자에 소리를 내지 않고 2글자 간격 + 문장부호 무음으로 처리해 피로감을 줄였습니다.
- 화면 탭: 현재 문장 즉시 표시 / 다음 문장 진행, `SKIP`: 프롤로그 건너뛰기.
- 기존 `효과음 ON/OFF` 설정을 그대로 따릅니다.

## V2 STEP 7-B1B — 새 게임 초기화 / 날짜 전환 정리

- 설정에 `처음부터 다시 시작`을 추가했습니다. 이름과 읽기·효과음 설정만 유지하고 DAY 1, 장소 해금, 방문 기록, 계절 이벤트, 인물/호감도/엔딩 진행을 모두 초기화합니다.
- 기존 초기화는 `공략 기록만 초기화`로 이름을 바꿔 DAY와 장소 해금을 유지하는 기능임을 명확히 했습니다.
- 계절 SPECIAL DAY는 첫 만남 완료 캐릭터가 최소 2명일 때만 열립니다.
- 날짜 전환의 `D + 1` 표기를 제거하고 `NEW DAY / DAY XX / 날씨`만 보여주도록 단순화했습니다.

## V2 STEP 7-D — MY ROOM
- 하단 내비게이션에 **마이룸** 추가
- 공략 완료 캐릭터가 DAY별로 최대 3명씩 SD 모습으로 작업실을 방문
- 방문 SD를 누르면 공략 완료 후 전용 작업실 대사/방문 묘사 표시
- 비설 감상 후 해금되는 12종 **MUSE DOLL**을 선반 형태로 수집, 탭하면 전체 도안/인형 이미지 확대
- 봄/여름/가을/겨울 SPECIAL DAY 기념품을 계절의 기념품 영역에 자동 보관
- 새 에셋 추가 없이 기존 작업실 배경, SD 12종, MUSE DOLL 이미지를 재활용
