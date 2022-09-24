import type { NProgressOptions } from 'nprogress'
import nprogress from 'nprogress'
import type { MaybeComputedRef } from '@vueuse/shared'
import { isClient, isNumber, tryOnScopeDispose } from '@vueuse/shared'
import { computed, ref, watchEffect } from 'vue-demi'

export type UseNProgressOptions = Partial<NProgressOptions>

/**
 * Reactive progress bar.
 *
 * @see https://vueuse.org/useNProgress
 */
export function useNProgress(
  currentProgress: MaybeComputedRef<number | null | undefined> = null,
  options?: UseNProgressOptions,
) {
  const progress = ref(currentProgress)
  const isLoading = computed({
    set: load => load ? nprogress.start() : nprogress.done(),
    get: () => isNumber(progress.value) && progress.value < 1,
  })

  if (options)
    nprogress.configure(options)

  const setProgress = nprogress.set
  nprogress.set = (n: number) => {
    progress.value = n
    return setProgress.call(nprogress, n)
  }

  watchEffect(() => {
    if (isNumber(progress.value) && isClient)
      setProgress.call(nprogress, progress.value)
  })

  tryOnScopeDispose(nprogress.remove)

  return {
    isLoading,
    progress,
    start: nprogress.start,
    done: nprogress.done,
    remove: () => {
      progress.value = null
      nprogress.remove()
    },
  }
}

export type UseNProgressReturn = ReturnType<typeof useNProgress>
