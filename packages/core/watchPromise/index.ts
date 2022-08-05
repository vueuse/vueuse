import type { WatchOptions, WatchSource } from 'vue-demi'
import { computed, nextTick, ref, watch } from 'vue-demi'

export interface WatchPromiseOptions extends WatchOptions {
  /**
   * Max call queue size
   */
  max?: number
}

export function watchPromise<T>(
  source: WatchSource<T>,
  cb: (newV: T, oldV: T | undefined, cleanUpFn?: () => void) => Promise<any>,
  promiseOptions: WatchPromiseOptions = {}) {
  const tasks = ref<[ value: T, oldValie: T, onCleanup: () => void ][]>([])

  const active = ref(false)

  const current = computed(() => tasks.value.length + (active.value ? 1 : 0))

  const { max = null, ...watchOptions } = promiseOptions

  watch(source as WatchSource<T>, async (..._args) => {
    if (tasks.value.length + (active.value ? 1 : 0) === max)
      return

    tasks.value.push(_args as any)

    if (active.value)
      return

    await tick()
  }, watchOptions)

  async function tick() {
    if (active.value || !tasks.value.length)
      return

    active.value = true

    const context = tasks.value.shift()!

    await cb(...(context as [ value: T, oldValie: T, onCleanup: () => void ]))
    await nextTick()

    active.value = false
    await tick()
  }

  function cleanQueue() {
    tasks.value = []
  }

  return { current, cleanQueue }
}
