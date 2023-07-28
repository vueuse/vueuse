async function waitMicroPeriods(numPeriods = 1) {
  let periodCount = 0
  const periodIterator = {
    [Symbol.asyncIterator]: () => ({
      next: () => ({
        done: periodCount >= numPeriods,
        value: periodCount++,
      }),
    }),
  }
  for await (const period of periodIterator)
    Boolean(period)
}

export function nextTwoTick() {
  return waitMicroPeriods(2)
}
