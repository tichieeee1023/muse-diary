function getJongseongIndex(word: string) {
  const last = word.trim().at(-1)
  if (!last) return -1
  const code = last.charCodeAt(0)
  if (code < 0xac00 || code > 0xd7a3) return -1
  return (code - 0xac00) % 28
}

function pickParticle(word: string, withBatchim: string, withoutBatchim: string) {
  const jong = getJongseongIndex(word)
  return jong > 0 ? withBatchim : withoutBatchim
}

function pickEuroRo(word: string) {
  const jong = getJongseongIndex(word)
  return jong === 0 || jong === 8 ? '로' : '으로'
}

export function formatGameText(text: string, playerName: string) {
  return text
    .replaceAll('{name}{은는}', `${playerName}${pickParticle(playerName, '은', '는')}`)
    .replaceAll('{name}{이가}', `${playerName}${pickParticle(playerName, '이', '가')}`)
    .replaceAll('{name}{을를}', `${playerName}${pickParticle(playerName, '을', '를')}`)
    .replaceAll('{name}{과와}', `${playerName}${pickParticle(playerName, '과', '와')}`)
    .replaceAll('{name}{으로로}', `${playerName}${pickEuroRo(playerName)}`)
    .replaceAll('{name}', playerName)
}
