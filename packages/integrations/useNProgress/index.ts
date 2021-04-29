import nprogress, { NProgressOptions } from 'nprogress'
import { MaybeRef, tryOnUnmounted, isNumber } from '@vueuse/shared'
import { ref, isRef, watchEffect, computed } from 'vue-demi'

/**
 * Reactive progress bar.
 *
 * @see https://vueuse.org/useNProgress
 * @param currentProgress
 * @param options
 */
export function useNProgress(
  currentProgress: MaybeRef<number | null | undefined> = null,
  options?: NProgressOptions | undefined,
) {
  const progress = isRef(currentProgress)
    ? currentProgress
    : ref<number|null>(currentProgress)
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
    if (isNumber(progress.value))
      setProgress.call(nprogress, progress.value)
  })

  tryOnUnmounted(nprogress.remove)

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
