# QA12 E — CHARACTER RESPONSE

이번 단계는 **캐릭터 반응만** 추가한다.

- 기존 `PLACE → SAY / DISTANCE / TOUCH → NEXT → 자연어 LOG` 구조 유지
- NEXT 시 캐릭터별 반응 대사 + 반응 서술 생성
- TOUCH가 있으면 캐릭터별 TOUCH 반응을 우선 사용
- TOUCH가 없으면 SAY 태도에 대한 캐릭터별 반응 사용
- 누적 DATE LOG는 이전 단계처럼 아코디언 안에 유지
- 방금 나온 캐릭터 반응만 `RESPONSE` 영역에서 즉시 확인 가능

아직 하지 않은 것:
- 데이트 하트 판정/변화
- 성공/실패 점수
- 약점 판정
- shy 등 표정 자동 변경
- 역스킨십
- 행동 상태 누적(손을 잡고 있는 상태 등)
