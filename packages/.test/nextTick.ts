export function nextTwoTick() {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      setTimeout(resolve)
    })
  })
}
