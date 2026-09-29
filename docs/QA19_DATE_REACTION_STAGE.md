# QA19 — DATE REACTION STAGE

데이트 연출을 배경이 아니라 캐릭터 반응에 집중시킨 버전.

- DATE MOOD 하트 CSS heartbeat / loss animation
- REC 프레임 위 캐릭터 reaction pop sequence (!, !?, …, ♡, 💦, ///, ✦ 등)
- 캐릭터별 pop 성격 차이
- 실제 대사는 REC 프레임 내부 말풍선으로 표시
- 특정 성공 / 약점 / 실패에서는 속마음 버블 표시
- inner thought는 DATE MEMORY에도 저장
- 표정은 하트 단계에 따라 main → smile/캐릭터별 표정 → troubled → shy → love 계열로 진행
- +2 반응에서는 중간 표정을 건너뛰지 않고 순차 전환
- 약점은 더 이상 즉시 SHY 버튼이 아님
- positive / weak / negative / neutral별 미세 캐릭터 CSS motion
- 역스킨십 발생 시 REC stage에도 별도 미세 zoom
- prefers-reduced-motion 대응
