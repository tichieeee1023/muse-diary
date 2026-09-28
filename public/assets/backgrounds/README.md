# Background assets

STEP 11에서 실제 게임에 연결된 16:9 배경 에셋입니다.

- `studio/day.webp`, `studio/night.webp`: 작업실 HOME
- `ending/main.webp`: 개인 엔딩 / SECRET STORY 공용
- `subway/day.webp`, `subway/night.webp`
- `library/day.webp`, `library/history.webp`, `library/rain.webp`
- `cafe/day.webp`, `cafe/night.webp`, `cafe/rain.webp`
- `mall/day.webp`, `mall/exhibition.webp`
- `riverside/day.webp`, `riverside/cloudy.webp`, `riverside/night.webp`
- `museum/day.webp`, `museum/exhibition.webp`
- `old-street/day.webp`, `old-street/night.webp`, `old-street/night-rain.webp`
- `bar/day.webp`, `bar/main.webp`, `bar/seating.webp`

`SceneBanner`는 장소, 세부 동선, 날씨, 낮/밤 순서로 가장 적합한 이미지를 자동 선택하고 없는 경우 다음 후보로 fallback 합니다.
