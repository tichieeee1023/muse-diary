# QA7 — DATE DIARY MVP

## Added assets
New `shy.webp` portraits were connected for:
- 백시온 (char_006)
- 김휘람 (char_007)
- 오세현 (char_008)
- 차이겸 (char_009)
- 권재하 (char_010)
- 유리안 (char_011)

All 12 characters now have a `shy` portrait route available to the date system.

## Date mode
A new `DATE DIARY` card appears on Home once at least one completed-first-meet character has affection 20+.

Flow:
1. Pick a date partner.
2. Pick a date spot.
3. Read a short place-specific intro.
4. Choose one skinship action.
5. See character-specific reaction and portrait expression.
6. At affection 60+ (or after route completion), see a return-touch line.

Date mode does not consume normal outing actions in this MVP.

## Date spots
- 작은 카페 (20+)
- 서점 (20+)
- 강변 산책 (40+)
- 수족관 (40+)
- 전시관 (40+)
- 늦은 밤거리 (40+)
- 밤의 축제 (60+)

Route-completed characters can revisit every date spot.

## Skinship design
Each date spot has three context-specific choices. The same touch type produces a different response for every character.
Each character also has one weakness reaction. When the selected action hits that weakness, the result is marked `예상 밖의 반응` and uses the shy-focused reaction.

## Files
- `src/pages/DatePage.tsx`
- `src/data/dateScenarios.ts`
- `src/pages/HomePage.tsx`
- `src/App.tsx`
- `src/styles/global.css`
- character `profile.json` files for the six new shy portraits
- `src/data/portraitExpressions.ts`
