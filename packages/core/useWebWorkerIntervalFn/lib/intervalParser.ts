import type { WebWorkerIntervalStatus } from '@vueuse/core'
import type { TimerHandle } from '@vueuse/shared'

function intervalFn() {
  let timerId: TimerHandle
  let interval = 0

  onmessage = function (e: MessageEvent) {
    const [status, delay] = e.data as [WebWorkerIntervalStatus, number]
    if (status === 'STARTED') {
      if (timerId) {
        clearInterval(timerId)
      }

      const start = Date.now()
      interval = delay
      let count = 0

      function tick() {
        count++
        const expected = start + count * interval
        const drift = Date.now() - expected
        postMessage(['TICK'])
        const nextDelay = Math.max(0, interval - drift)
        timerId = setTimeout(tick, nextDelay)
      }

      timerId = setTimeout(tick, interval)
    }

    if (status === 'ENDED') {
      if (timerId)
        clearTimeout(timerId)
      timerId = undefined
    }
  }
}

export function createIntervalStr() {
  return `(${intervalFn.toString()})()`
}
