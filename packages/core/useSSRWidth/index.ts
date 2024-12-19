let SSRWidth: number | undefined

export function useSSRWidth() {
  return SSRWidth
}

export function setSSRWidth(width: typeof SSRWidth) {
  SSRWidth = width
}
