# STEP 6E — 표정/버스트 통합

- 사용자 제공 `characters.zip`에서 기본 4종과 추가 표정 38장을 통합.
- 공백/대문자/설명형 파일명을 ASCII kebab-case로 정규화.
- `PortraitExpression` 타입을 확장하고, 캐릭터별 profile의 visuals에 실제 에셋 경로를 연결.
- FIRST/DAILY는 기존 4종 위주로 유지하되 문맥이 정확할 때만 추가 표정으로 보강.
- AFFINITY 후반은 대사 문맥과 호감도 임계값에 따라 수줍음/슬픔/사랑 표정을 자동 선택.
- 봄/여름/가을/겨울 SPECIAL DAY는 early/close/deep 관계 단계에 따라 캐릭터별 표정을 교체.
- 인물 기록에서는 공략 완료 후 `ROUTE EXPRESSIONS` 갤러리가 추가로 열린다.
- 유리안의 추가 표정은 7장 모두 보존하되 같은 빈도로 남발하지 않고 상황별로 분리 사용.
- 진이현의 `clock_room.webp`를 시계 수리 작업실 전용 배경으로 추가.

검증:
- TS/TSX 40개 transpile syntax error 0
- JSON 260개 파싱 성공
- profile visual 경로 누락 0
- 추가 표정 38개 연결 (STEP 6E-2에서 3개 추가되어 누적 41개)
