import { vi } from 'vitest'

// Like `until` but works off of any assertion, not application code.
export function retry(assertion: Function, { interval = 1, timeout = 100 } = {}) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()

    const tryAgain = () => {
      setTimeout(() => {
        try {
          resolve(assertion())
        }
        catch (err) {
          if (Date.now() - startTime > timeout)
            reject(err)
          else
            tryAgain()
        }
      }, interval)
      try {
        // If useFakeTimers hasn't been called, this will throw
        vi.advanceTimersByTime(interval)
      }
      catch { /* Expected to throw */ }
    }

    tryAgain()
  })
}
