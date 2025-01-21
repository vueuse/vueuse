import type { Awaitable, MaybeRefOrGetter, Pausable, UseTimeoutFnOptions } from '@vueuse/shared'
import { isClient, tryOnScopeDispose, useTimeoutFn } from '@vueuse/shared'
import { ref } from 'vue'

export function useTimeoutPoll(
  fn: () => Awaitable<void>,
  interval: MaybeRefOrGetter<number>,
  options: UseTimeoutFnOptions = {},
): Pausable {
  const {
    immediate = true,
  } = options

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

  if (immediate && isClient)
    resume()

  tryOnScopeDispose(pause)

  return {
    isActive,
    pause,
    resume,
  }
}
