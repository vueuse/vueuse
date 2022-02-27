// Like `until` but works off of any assertion, not application code.
export const retry = (assertion: Function, { interval = 1, timeout = 100 } = {}) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()

    const tryAgain = () => {
      setTimeout(() => {
        try {
          resolve(assertion())
        }
        catch (err) {
          Date.now() - startTime > timeout ? reject(err) : tryAgain()
        }
      }, interval)
      try {
        // If useFakeTimers hasn't been called, this will throw
        vitest.advanceTimersByTime(interval)
      }
      catch (e) { /* Expected to throw */ }
    }

    tryAgain()
  })
}
