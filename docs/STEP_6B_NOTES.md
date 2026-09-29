# V2 STEP 6-B — Ending CG text alignment

## Scope

- Updated only the 12 `endingTitle` / `endingParagraphs` presentation data in `src/data/endings.json`.
- `SECRET STORY` content from STEP 6-A is preserved.
- MUSE DOLL metadata is intentionally untouched; it is scheduled for STEP 6-C.

## What changed

All 12 actual `public/assets/characters/char_XXX/ending-cg.webp` files were visually reviewed and each ending epilogue was rewritten to match the scene shown in its CG and the current AFFINITY 100 route.

- char_001 서도윤 — warm closed bookstore / dated bookmark / future blank space
- char_002 한주원 — finished display / intentional empty space / unplanned future
- char_003 문해준 — late-night platform / embrace / going home together
- char_004 이로운 — after-hours patisserie / sharing cake / asking instead of reading emotions
- char_005 강태겸 — wet night alley after cleanup / staying close / `기억해도 됩니다`
- char_006 백시온 — sunset riverside / held hands / choosing a place to return to on land
- char_007 김휘람 — archive desk / old records / choosing the present self and future
- char_008 오세현 — quiet gallery / completed work / moving on to the next canvas
- char_009 차이겸 — rainy old street / visible flower seal / no longer hiding emotion
- char_010 권재하 — riverside fireworks / embrace / protection becoming mutual closeness
- char_011 유리안 — balloon-filled stage / real starlight / confession without a performance mask
- char_012 진이현 — clock workshop / synchronized clocks / stopped old watch / present-tense banmal

`char_012` ending title was also changed from `멈추지 않는 초침` to `같은 시간을 가리키는 밤`, because the route ending explicitly leaves his old wristwatch stopped while the other clocks finally align to the same present.

## Validation

- 12/12 ending records present
- Every ending has 5 epilogue paragraphs
- 12/12 referenced ending CG assets exist
- All JSON files parse successfully
