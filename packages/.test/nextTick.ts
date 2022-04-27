export const nextTwoTick = () => new Promise<void>((resolve) => {
  setTimeout(() => {
    setTimeout(resolve)
  })
})
