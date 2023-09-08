import { ref } from 'vue-demi'
import type { Awaitable, MaybeRefOrGetter, Pausable, UseTimeoutFnOptions } from '@vueuse/shared'
import { tryOnScopeDispose, useTimeoutFn } from '@vueuse/shared'

export function useTimeoutPoll(fn: () => Awaitable<void>, interval: MaybeRefOrGetter<number>, timeoutPollOptions?: UseTimeoutFnOptions): Pausable {
  const { start } = useTimeoutFn(loop, interval, { immediate: false })

  const isActive = ref(false)

  async function loop() {
    if (!isActive.value)
      return

    await fn()
    start()
  }

  function resume() {
    if (!isActive.value) {
      isActive.value = true
      loop()
    }
  }

  function pause() {
    isActive.value = false
  }

  if (timeoutPollOptions?.immediate)
    resume()

  tryOnScopeDispose(pause)

  return {
    isActive,
    pause,
    resume,
  }
}
