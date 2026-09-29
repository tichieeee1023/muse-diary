function getJongseongIndex(word: string) {
  const last = word.trim().at(-1)
  if (!last) return -1
  const code = last.charCodeAt(0)
  if (code < 0xac00 || code > 0xd7a3) return -1
  return (code - 0xac00) % 28
}

export function hasBatchim(word: string) {
  return getJongseongIndex(word) > 0
}

function pickParticle(word: string, withBatchim: string, withoutBatchim: string) {
  const jong = getJongseongIndex(word)
  return jong > 0 ? withBatchim : withoutBatchim
}

function pickEuroRo(word: string) {
  const jong = getJongseongIndex(word)
  return jong === 0 || jong === 8 ? '로' : '으로'
}

export function withJosa(word: string, pair: '은/는' | '이/가' | '을/를' | '과/와' | '이랑/랑' | '아/야' | '으로/로') {
  if (pair === '으로/로') return `${word}${pickEuroRo(word)}`
  const [withBatchim, withoutBatchim] = pair.split('/')
  return `${word}${pickParticle(word, withBatchim, withoutBatchim)}`
}

export function formatGameText(text: string, playerName: string) {
  // New explicit placeholders. Prefer these in newly-authored story data.
  let result = text
    .replaceAll('{name}{이랑랑}', withJosa(playerName, '이랑/랑'))
    .replaceAll('{name}{은는}', withJosa(playerName, '은/는'))
    .replaceAll('{name}{이가}', withJosa(playerName, '이/가'))
    .replaceAll('{name}{을를}', withJosa(playerName, '을/를'))
    .replaceAll('{name}{과와}', withJosa(playerName, '과/와'))
    .replaceAll('{name}{아야}', withJosa(playerName, '아/야'))
    .replaceAll('{name}{으로로}', withJosa(playerName, '으로/로'))
    // Tolerate older one-sided brace placeholders that leaked into some scripts.
    .replaceAll('{name}{이}', withJosa(playerName, '이/가'))
    .replaceAll('{name}{가}', withJosa(playerName, '이/가'))
    .replaceAll('{name}{은}', withJosa(playerName, '은/는'))
    .replaceAll('{name}{는}', withJosa(playerName, '은/는'))
    .replaceAll('{name}{을}', withJosa(playerName, '을/를'))
    .replaceAll('{name}{를}', withJosa(playerName, '을/를'))
    .replaceAll('{name}{과}', withJosa(playerName, '과/와'))
    .replaceAll('{name}{와}', withJosa(playerName, '과/와'))
    // These particles do not change with batchim.
    .replaceAll('{name}{의}', `${playerName}의`)
    .replaceAll('{name}{도}', `${playerName}도`)
    .replaceAll('{name}{에게}', `${playerName}에게`)
    .replaceAll('{name}{보다}', `${playerName}보다`)

  // Backward compatibility for older scripts that wrote a literal Korean particle
  // directly after {name}. Long forms must run first to avoid partial matches.
  const legacy: Array<[string, '은/는' | '이/가' | '을/를' | '과/와' | '이랑/랑' | '아/야']> = [
    ['{name}이랑', '이랑/랑'],
    ['{name}랑', '이랑/랑'],
    ['{name}은', '은/는'],
    ['{name}는', '은/는'],
    ['{name}이', '이/가'],
    ['{name}가', '이/가'],
    ['{name}을', '을/를'],
    ['{name}를', '을/를'],
    ['{name}과', '과/와'],
    ['{name}와', '과/와'],
    ['{name}아', '아/야'],
    ['{name}야', '아/야'],
  ]
  for (const [token, pair] of legacy) result = result.replaceAll(token, withJosa(playerName, pair))

  return result.replaceAll('{name}', playerName)
}
