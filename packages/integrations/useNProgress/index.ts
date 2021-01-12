import nprogress, { NProgressOptions } from 'nprogress'
import { MaybeRef, tryOnUnmounted, isNumber, isBoolean } from '@vueuse/shared'
import { ref, isRef, watchEffect } from 'vue-demi'

/**
 * Reactive progress bar.
 *
 * @see   {@link https://vueuse.js.org/useNProgress}
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
  const isLoading = ref<boolean|null>(null)

  if (options)
    nprogress.configure(options)

  const setProgress = nprogress.set
  nprogress.set = (n: number) => {
    progress.value = n
    isLoading.value = n < 1
    return setProgress.call(nprogress, n)
  }

  watchEffect(() => {
    if (isBoolean(isLoading.value)) {
      isLoading.value && !progress.value
        ? nprogress.start()
        : nprogress.done()
    }

    if (isNumber(progress.value)) {
      isLoading.value = progress.value < 1
      setProgress.call(nprogress, progress.value)
    }
  })

  tryOnUnmounted(nprogress.remove)

  return {
    isLoading,
    progress,
    start: () => {
      progress.value = null
      isLoading.value = true
    },
    done: () => {
      progress.value = null
      isLoading.value = false
    },
    remove: () => {
      progress.value = null
      isLoading.value = null

      nprogress.remove()
    },
  }
}
