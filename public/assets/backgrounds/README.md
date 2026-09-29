# MUSE DIARY Background Assets

배경 에셋은 **장소 / 세부 동선 / 시간 / 날씨 / 특정 캐릭터 공간 / 계절 이벤트** 기준으로 정리합니다.
코드의 단일 매핑 진입점은 `src/data/backgroundAssets.ts`입니다.

## 기본 장소

- `studio/` — HOME 작업실 (`day`, `night`)
- `subway/` — 지하철 (`day`, `main`, `night`, `night-rain`)
- `library/` — 시립 도서관 (`day`, `night`, `rain`, `history`)
- `bookstore/` — 독립서점 (`day`, `night`, `backroom`)
- `cafe/` — 카페 거리 (`day`, `night`, `rain`, `street-day-01`, `street-day-02`)
- `convenience/` — 편의점 (`main`, `outdoor-day`, `outdoor-night`)
- `mall/` — 대형 쇼핑몰 (`day`, `exhibition`, `exhibition2`)
- `riverside/` — 강변 공원 (`day`, `main`, `cloudy`, `night`, `bench-night`)
- `museum/` — 미술관 (`day`, `main`, `exhibition`, `exhibition2`)
- `aquarium/` — 아쿠아리움 (`main`, `tunnel`)
- `rooftop/` — 루프탑 (`day`, `night`)
- `old-street/` — 오래된 상가거리 (`day`, `night`, `night-rain`)
- `night-market/` — 야시장 (`night`)
- `bar/` — BAR (`day`, `main`, `seating`)
- `ending/` — 엔딩/비설 fallback (`main`)

## 캐릭터 전용 공간

- `museum/secret-art-studio-sehyun.webp` — 오세현 중요 이벤트용 작업실
- `old-street/consultation-office-igyeom.webp` — 차이겸 중요 이벤트용 상담실
- `mall/event-stage-yurian.webp` — 유리안 첫 만남 무대
- `mall/event-stage-star-yurian.webp` — 유리안 중요 이벤트 무대

전용 공간은 DAILY 전체에 강제하지 않고, **해당 캐릭터 + 해당 장소 + FIRST/AFFINITY** 조건에서만 우선 사용합니다.

## SPECIAL DAY

- 봄: `event/spring-night-bloom-01.webp`, `event/spring-night-bloom-02.webp`
- 여름: `event/summer-fireworks-01.webp`, `event/summer-fireworks-02.webp`
- 가을: `event/autumn-garden-01.webp`, `event/autumn-garden-02.webp`
- 겨울: `event/winter-lodge-01.webp`, `event/winter-lodge-02.webp`, `event/winter-lodge-03.webp`, `event/winter-hinoki-bath.webp`

SPECIAL DAY는 한 장을 계속 재사용하지 않고 **이벤트 진행 단계에 따라 장면 배경이 교체**됩니다.

## 선택 우선순위

`SceneBanner`는 다음 순서로 후보를 구성합니다.

1. 캐릭터 전용 중요 공간
2. 세부 동선 + 날씨/시간 전용 배경
3. 세부 동선 전용 배경
4. 장소의 날씨 배경
5. 장소의 낮/밤 배경
6. `main.webp`

없는 파일은 자동으로 다음 후보로 fallback 합니다.
