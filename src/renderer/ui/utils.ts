export const ms = (dur: number): string => {
  const fullSeconds = Math.floor(dur)
  const seconds = fullSeconds % 60
  const minutes = (fullSeconds - seconds) / 60
  const p1 = minutes < 10 ? '0' : ''
  const p2 = seconds < 10 ? '0' : ''

  return p1 + minutes + ':' + p2 + seconds
}
