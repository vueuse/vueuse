import { Ref, WatchOptions, watch } from 'vue-demi'
import { promiseTimeout } from '../utils'

interface WhenToMatchOptions {
  flush?: WatchOptions['flush']
  timeout?: number
}

export function when<T>(r: Ref<T>) {
  function toMatch(
    condition: (v: T) => boolean,
    { flush = 'post', timeout }: WhenToMatchOptions = {},
  ): Promise<void> {
    let stop: Function | null = null
    const watcher = new Promise<void>((resolve) => {
      stop = watch(r, (v) => {
        if (condition(v)) {
          stop?.()
          resolve()
        }
      }, {
        flush,
        immediate: true,
      })
    })

    const promises = [watcher]
    if (timeout) {
      promises.push(
        promiseTimeout(timeout)
          .finally(() => { stop?.() }),
      )
    }

    return Promise.any(promises)
  }

  function toBe(value: T, options?: WhenToMatchOptions) {
    return toMatch(v => v === value, options)
  }

  function toBeTruthy(options?: WhenToMatchOptions) {
    return toMatch(v => Boolean(v), options)
  }

  function toNotNull(options?: WhenToMatchOptions) {
    return toMatch(v => v != null, options)
  }

  return {
    toMatch,
    toBe,
    toBeTruthy,
    toNotNull,
  }
}
