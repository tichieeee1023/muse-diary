# Portrait expression integration — STEP 6E

`characters.zip`의 추가 표정을 게임용 키로 정규화했다. 기본 4종(`main / smile / troubled / hmm`)은 그대로 유지하고, 추가 표정은 AFFINITY 후반과 계절 SPECIAL DAY에서 감정 문맥에 따라 사용한다.

## 캐릭터별 추가 키

| 캐릭터 | 추가 표정 |
|---|---|
| 서도윤 | `shy`, `sulking` |
| 한주원 | `sly`, `shy` |
| 문해준 | `sad`, `shy` |
| 이로운 | `angry`, `shy` |
| 강태겸 | `faintSmile`, `sly`, `shy` |
| 백시온 | `genuineSmile`, `dim`, `eyesClosedSmile` |
| 김휘람 | `confident`, `desolate`, `love` |
| 오세현 | `glasses`, `love`, `loveSmile` |
| 차이겸 | `thinking`, `serious`, `angry`, `sorrowful` |
| 권재하 | `busted`, `love` |
| 유리안 | `interested`, `exhausted`, `sad`, `desolate`, `love`, `loveShy`, `deepLove` |
| 진이현 | `blank`, `desolate`, `sad`, `sorrowful`, `eyesClosedSad`, `tearful`, `shy`, `love` |

유리안은 원본 추가 컷이 특히 많아 전부 같은 빈도로 사용하지 않는다. `interested → loveShy → deepLove`를 관계 심화용 주축으로 사용하고, `exhausted / sad / desolate`는 해당 감정 문맥에서만 제한적으로 사용한다.

## 사용 규칙

- FIRST / 일반 DAILY: 기본 4종 위주. 캐릭터성과 문장이 정확히 맞을 때만 추가 표정으로 자동 보강.
- AFFINITY 80/100: `shy`, `love`, `deepLove` 등 관계 심화 표정을 적극 사용.
- SPECIAL DAY: 관계 단계(`early / close / deep`)와 선택 결과에 따라 캐릭터별 전용 표정을 사용.
- 인물 기록: 기본 4종은 기존처럼 표시하고, 공략 완료 후 `ROUTE EXPRESSIONS`에 추가 표정을 공개.
- 특정 키가 없는 캐릭터는 자동으로 `main` 또는 기존 기본 표정으로 fallback한다.

## 진이현 전용 공간

사용자가 추가한 `clock_room.webp`는 `/assets/backgrounds/old-street/clock-room-ihyeon.webp`로 정리했다. 오래된 상가거리에서 진이현의 FIRST / AFFINITY 이벤트일 때 시계 수리 작업실 배경을 우선 사용한다.

## STEP 6E-2 추가

- 차이겸: `serious` / `sorrowful` 2종 추가. 봉인·위험을 정면으로 마주하는 장면과 감정을 억눌러 온 과거를 말하는 장면에 우선 사용한다.
- 진이현: 눈을 감고 감정을 억누르는 `eyesClosedSad` 1종 추가. 의상 연속성이 강한 일반 DAILY에는 남발하지 않고, 시간축/과거를 마주하는 고감정 AFFINITY 장면과 ROUTE EXPRESSIONS 아카이브에서 사용한다.
