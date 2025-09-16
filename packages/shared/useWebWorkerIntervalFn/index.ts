import type { MaybeRefOrGetter } from 'vue'
import type { Pausable } from '../utils'
import { ref as deepRef, isRef, shallowReadonly, shallowRef, toValue, watch } from 'vue'
import { tryOnScopeDispose } from '../tryOnScopeDispose'
import { isClient } from '../utils'

export interface useWebWorkerIntervalFnOptions {
  /**
   * Start the timer immediately
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Execute the callback immediately after calling `resume`
   *
   * @default false
   */
  immediateCallback?: boolean
}

export type useWebWorkerIntervalFnReturn = Pausable

export type WorkerStatus
  = | 'STARTED'
    | 'TICK'
    | 'ERROR'
    | 'ENDED'

export type WorkerMessage = [ WorkerStatus, MaybeRefOrGetter<number> ]

type PostMessage = typeof Worker.prototype['postMessage']

const intervalWorker = `
let timerId = null;
let interval = 0;
self.onmessage = function (e) {
const [ status, delay ] = e.data;
if (status === "STARTED") {
if (timerId) {
clearInterval(timerId);
};
const start = Date.now();
interval = delay;
let count = 0;
function tick() {
count++;
const expected = start + count * interval;
const drift = Date.now() - expected;
self.postMessage(['TICK']);
const nextDelay = Math.max(0, interval - drift);
timerId = setTimeout(tick, nextDelay);
}
timerId = setTimeout(tick, interval);
};
if (status === "ENDED") {
if (timerId) clearTimeout(timerId);
timerId = null;
};
};
self.onerror = function (e) {
throw e
};`

/**
 * Wrapper for `webworker-setInterval` with controls
 *
 * @param cb
 * @param interval
 * @param options
 */

export function useWebWorkerIntervalFn(cb: (status: WorkerStatus) => void, interval: MaybeRefOrGetter<number> = 1000, options: useWebWorkerIntervalFnOptions = {}): useWebWorkerIntervalFnReturn {
  const {
    immediate = true,
    immediateCallback = false,
  } = options

  const isActive = shallowRef(false)
  const worker = deepRef<(Worker & { _url?: string }) | undefined>()

  const post: PostMessage = (message: WorkerMessage) => {
    if (!worker.value)
      return

    worker.value.postMessage(message)
  }

  const initWorker = () => {
    const blobUrl = URL.createObjectURL(new Blob([intervalWorker], { type: 'text/javascript' }))
    const newWorker: Worker & { _url?: string } = new Worker(blobUrl)
    newWorker._url = blobUrl

    newWorker.onmessage = (ev: MessageEvent) => {
      const [status] = ev.data
      switch (status) {
        case 'TICK':
          cb('TICK')
          break
        case 'ERROR':
          pause()
          break
      }
    }

    newWorker.onerror = (ev: ErrorEvent) => {
      pause()
      throw ev
    }

    return newWorker
  }

  function clean() {
    if (worker.value && worker.value._url && window) {
      post(['ENDED'])
      worker.value.terminate()
      URL.revokeObjectURL(worker.value._url)
      worker.value = undefined
    }
  }

  function pause() {
    isActive.value = false
    clean()
  }

  function resume() {
    const intervalValue = toValue(interval)
    if (intervalValue <= 0) {
      return
    }
    isActive.value = true
    if (immediateCallback) {
      cb('TICK')
    }
    clean()
    if (isActive.value) {
      worker.value = initWorker()
      post(['STARTED', intervalValue])
    }
  }

  if (immediate && isClient) {
    resume()
  }

  if (isRef(interval) || typeof interval === 'function') {
    const stopWatch = watch(interval, () => {
      if (isActive.value && isClient)
        resume()
    })
    tryOnScopeDispose(stopWatch)
  }

  tryOnScopeDispose(pause)

  return {
    isActive: shallowReadonly(isActive),
    pause,
    resume,
  }
}
