# 배경 에셋 통합 규칙 v2

이번 통합에서는 추가 제작된 59장의 배경을 단순 보관하지 않고 실제 플레이 문맥에 연결했다.

## 적용 원칙

- **장소 반복감 감소:** 같은 장소라도 세부 동선(`routeId`)에 따라 다른 배경을 사용한다.
- **시간/날씨 정합성:** 밤, 비, 흐림처럼 전용 이미지가 있는 경우 우선한다.
- **캐릭터 전용 공간:** 오세현 작업실, 차이겸 상담실, 유리안 공연 무대는 중요한 개인 이벤트에서만 사용한다.
- **계절 대형 이벤트:** 봄/여름/가을/겨울은 이벤트 진행 단계에 맞춰 2~4장의 전용 배경이 전환된다.
- **안전한 fallback:** 세부 이미지가 없으면 기존 낮/밤/main 이미지로 자동 복귀한다.

## 신규 연결 예시

| 장소/이벤트 | 조건 | 배경 |
|---|---|---|
| 강변 공원 | 밤 + 벤치 동선 | `riverside/bench-night.webp` |
| 지하철 | 밤 + 비 + 지하상가 출구 | `subway/night-rain.webp` |
| 편의점 | 창가 테이블/외부 휴식 | `convenience/outdoor-day/night.webp` |
| 카페 거리 | 낮 + 골목 산책 | `cafe/street-day-01/02.webp` |
| 아쿠아리움 | 수중 터널 | `aquarium/tunnel.webp` |
| 오세현 | 미술관 AFFINITY | `museum/secret-art-studio-sehyun.webp` |
| 차이겸 | 오래된 상가거리 AFFINITY | `old-street/consultation-office-igyeom.webp` |
| 유리안 | 쇼핑몰 FIRST/AFFINITY | `mall/event-stage-*.webp` |
| 봄 SPECIAL DAY | 도입 → 후반 | 벚꽃길 01 → 02 |
| 여름 SPECIAL DAY | 도입 → 불꽃 | 강변 축제 → 불꽃놀이 |
| 가을 SPECIAL DAY | 도입 → 둘만의 산책 | 단풍길 01 → 02 |
| 겨울 SPECIAL DAY | 외관 → 라운지 → 실내 | 산장 01 → 02 → 03 |

## 파일명 정리

원본 압축에 있던 한글/escape 표기와 대소문자 혼합 파일은 프로젝트 안에서 ASCII kebab-case로 정규화했다. 코드에서는 정규화된 이름만 사용한다.

## STEP 6E 추가
- `old-street/clock-room-ihyeon.webp` — 진이현의 시계 수리 작업실. 오래된 상가거리 FIRST/AFFINITY에서 우선 사용.
